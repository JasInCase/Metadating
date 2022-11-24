"""Prepare data for fine-tuning a GPT-3 model."""
import os
import html
import json
import argparse
import random
import re
from tqdm import tqdm

from langdetect import detect, DetectorFactory, lang_detect_exception
from transformers import GPT2TokenizerFast, logging

from template import build_profile, example_messages

DetectorFactory.seed = 42
logging.set_verbosity_error()

tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")


parser = argparse.ArgumentParser(
    description="Prepare data for fine-tuning a GPT-3 model.")
parser.add_argument('--input_file', '-i', required=True,
                    help=".json file to read from.")
parser.add_argument('--output_file', '-o', required=False,
                    help=".jsonl file to write to. If not provided, defaults \
                        to `train.jsonl` in same dir as input_file.")
parser.add_argument('-n', default=5, required=False, type=int,
                    help="Maximum number of messages to present to GPT-3 as \
                        examples. Integer value, 0 < n < 20.")
parser.add_argument('--max_tokens', '-t', default=16, required=False,
                    type=int, help="Maximum number of tokens allowed in a \
                        single message.")
parser.add_argument('--quiet', '-q', action="store_true",
                    help="Don't log info or show progress bars.")
parser.add_argument('--group_threshold', '-gt', default=100,
                    help="For every GT messages, make 1 more group of \
                        examples. e.g. GT=100 -> user with 205 messages gets \
                        3 groups.")

PHONE_REGEX = re.compile(r"\+?1?\(?\d{3}\)?\s*-?\s*\d{3}\s*-?\s*\d{4}")
GIF_REGEX = re.compile(r"https:\/\/media(\.tenor|\d\.giphy)\.com")
SELECT = {}


def select_func(name):
    """Save the decorated function as an option for message selection."""
    def dec(func):
        desc = func.__doc__

        def func_wrap(msgs, count, ngroups=1):
            if len(msgs) < count:
                return [msgs]
            for msgs in func(msgs, count, ngroups):
                yield example_messages(msgs)
        SELECT[name] = (func_wrap, desc)
        return func_wrap
    return dec


def selection_help():
    """Create a help string that displays all of the selection options."""
    res = "Selection method"
    for name, (_, desc) in SELECT.items():
        res += f" | {name}, {desc}"
    return res


@select_func('first')
def first_n(msgs, count, ngroups=1):
    """Take the first N messages."""
    for i in range(ngroups):
        yield msgs[i:i+count]


@select_func('random')
def random_n(msgs, count, ngroups=1):
    """Choose N random messages."""
    if count > len(msgs):
        return [msgs]
    for _ in range(ngroups):
        yield random.sample(msgs, count)


@select_func('r_uniq')
def random_u(msgs, count, ngroups=1):
    """Choose N random unique messages."""
    msgs = list(set(msgs))
    for _ in range(ngroups):
        if count > len(msgs):
            yield msgs
            break
        group = random.sample(msgs, count)
        msgs = list(set(msgs) - set(group))
        yield group


@select_func('greed')
def max_unique_tok(msgs, count, ngroups=1):
    """Greedily maximize unique tokens."""
    msgs = list(set(msgs))
    res = []
    sets = [set(tokenizer(m)['input_ids']) for m in msgs]
    for _ in range(count * ngroups):
        i, toks_0 = max(enumerate(sets), key=lambda x: len(x[1]))
        res.append(msgs[i])
        del msgs[i]
        del sets[i]
        for toks in sets:
            toks -= toks_0
    for i in range(ngroups):
        yield res[i::ngroups]


def build_line(user, select, count, group_threshold):
    """Create a JSONL line for a user, with a prompt and completion.

    Parameters:
        user - Dict type with parameters "name", "age", "messages", etc.
        select - Function for picking n messages from the list.
        count - Number of messages to present to GPT-3.
        group_threshold - For every GT messages, make 1 more group of examples.
    """
    # messages = select(user['messages'], count)
    messages = user['messages']

    # for every gt messages, we want one additional group of example messages
    ngroups = 1 + len(messages) // group_threshold
    for msgs in select(messages, count, ngroups=ngroups):
        line = '{"prompt": "' + build_profile(user, False) + \
                '", "completion": "' + msgs + '\n\n###"}'
        line = line.replace('\n', '\\\\n') + '\n'
        yield line


def unescape(text: str):
    """Unescape html to get the original text."""
    text = html.unescape(text)
    return text


def valid_messages(msgs: list, max_tokens: int):
    """Yield all valid messages in the list provided, unescaping HTML."""
    for msg in set(msgs):
        msg = unescape(msg)
        if any((
            "\"" in msg,
            "\\" in msg,
            len(msg) < 4,
            len(msg) >= 4096,
            GIF_REGEX.search(msg) is not None,
            PHONE_REGEX.search(msg) is not None,
            len(tokenizer(msg)['input_ids']) >= max_tokens
        )):
            continue
        try:
            if detect(msg) != 'en':
                continue
        except lang_detect_exception.LangDetectException:
            pass
        yield msg


def validate_args(arg):
    """Ensure that all requirements for arguments are met."""
    assert arg.input_file.split('.')[-1] == 'json'
    assert os.path.exists(arg.input_file)

    if arg.output_file:
        assert arg.output_file.split('.')[-1] == 'jsonl'
        assert os.path.exists(os.path.dirname(arg.output_file))
    else:
        arg.output_file = os.path.join(os.path.dirname(arg.input_file),
                                       "train.jsonl")
        assert arg.output_file != arg.input_file

    # args.n = int(args.n)
    assert arg.n > 0
    assert arg.n < 20

    return arg


def main(args):
    """Prepare data for fine-tuning a GPT-3 model."""
    args = validate_args(args)

    with open(args.input_file, 'r', encoding='utf-8') as file:
        data = json.load(file)

    select = SELECT[args.select][0]

    train = ""
    for user in tqdm(data[:], disable=args.quiet):
        user["messages"] = list(
            valid_messages(user["messages"], args.max_tokens)
        )
        for line in build_line(user, select, args.n, args.group_threshold):
            train += line

    with open(args.output_file, 'w', encoding='utf-8') as file:
        file.write(train)


if __name__ == "__main__":
    parser.add_argument('--select', '-s', choices=list(SELECT.keys()),
                        required=True, help=selection_help())
    arguments = parser.parse_args()
    main(arguments)
