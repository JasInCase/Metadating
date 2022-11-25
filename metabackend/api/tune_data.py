"""Prepare data for fine-tuning a GPT-3 model."""
import os
import html
import json
import argparse
import random
import codecs
from tqdm import tqdm

json.dump()

from transformers import GPT2TokenizerFast

from template import build_line

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

SELECT = {}


def select_func(name):
    """Save the decorated function as an option for message selection."""
    def dec(func):
        desc = func.__doc__

        def func_wrap(msgs, count):
            if len(msgs) < count:
                return msgs
            return func(msgs, count)
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
def first_n(msgs, count):
    """Take the first N messages."""
    return msgs[:count]


@select_func('random')
def random_n(msgs, count):
    """Choose N random messages."""
    if count > len(msgs):
        return msgs
    return random.sample(msgs, count)


@select_func('r_uniq')
def random_u(msgs, count):
    """Choose N random unique messages."""
    msgs = list(set(msgs))
    return random_n(msgs, count)


@select_func('greed')
def max_unique_tok(msgs, count):
    """Greedily maximize unique tokens."""
    msgs = [msg for msg in msgs if plaintext(msg)]
    res = []
    sets = [set(tokenizer(m)['input_ids']) for m in msgs]
    for _ in range(count):
        i, toks_0 = max(enumerate(sets), key=lambda x: len(x[1]))
        res.append(msgs[i])
        del msgs[i]
        del sets[i]
        for toks in sets:
            toks -= toks_0
    return res


def unescape(text: str):
    """Unescape html and unicode markers to get the original text."""
    # text = text.encode('unicode-escape')
    # text = text.replace(b'\\\\u', b'\\u')
    # text = text.replace(b'\\\\U', b'\\U')
    # text = text.replace(b'\\\\x', b'\\x')
    # text = text.decode('unicode-escape')
    # so many stackoverflow posts :)
    # and it still doesn't work :)
    text = html.unescape(text)
    assert plaintext(text)
    text = codecs.decode(text, 'unicode_escape')
    return text


def plaintext(text: str):
    """Return true if the text contains only characters from a US keyboard."""
    valid = "1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./\
             !@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL: ZXCVBNM<>?"
    return all(char in valid for char in text)


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
    for user in tqdm(data, disable=args.quiet):
        msgs = []
        for msg in user["messages"]:
            if len(msg) < 4096 and plaintext(msg) and\
                len(tokenizer(msg)['input_ids']) < args.max_tokens:
                try:
                    msgs.append(unescape(msg.replace(r'&rsquo;', "'")))
                except Exception as e:
                    # print(e)
                    # print(msg)
                    pass
        # user["messages"] = [
        #     unescape(msg) for msg in user["messages"] if
        #     (len(msg) < 4096 and
        #      r'\x' not in msg and
        #      len(tokenizer(msg)['input_ids']) < args.max_tokens)
        # ]
        # user["messages"] = msgs
        train += build_line(user, select(msgs, args.n))

    with open(args.output_file, 'w', encoding='utf-8') as file:
        file.write(train)


if __name__ == "__main__":
    parser.add_argument('--select', '-s', choices=list(SELECT.keys()),
                        required=True, help=selection_help())
    arguments = parser.parse_args()
    main(arguments)
