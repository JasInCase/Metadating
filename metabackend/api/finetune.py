"""Prepare data for fine-tuning a GPT-3 model."""
import os
import html
import json
import argparse
import random

from template import build_profile, example_messages


parser = argparse.ArgumentParser(
    description = "Prepare data for fine-tuning a GPT-3 model.")
parser.add_argument('--input_file', '-i', required = True,
    help = ".json file to read from.")
parser.add_argument('--output_file', '-o', required = False,
    help = ".jsonl file to write to. If not provided, defaults to `train.jsonl` in same dir as input_file.")
parser.add_argument('-n', default = 5, required = False,
    help = "Maximum number of messages to present to GPT-3 as examples. Integer value, 0 < n < 20.")

SELECT = {}

def select_func(name, desc):
    def dec(func):
        SELECT[name] = (func, desc)
        return func
    return dec


def selection_help():
    res = "Selection method"
    for name, (_, desc) in SELECT.items():
        res += f" | {name}, {desc}"
    return res


@select_func('first', "First N messages.")
def first_n(msgs, n):
    return msgs[:n]


@select_func('random', "N random messages.")
def random_n(msgs, n):
    if n > len(msgs):
        return msgs
    return random.sample(msgs, n)


@select_func('r_uniq', "N random unique messages.")
def random_u(msgs, n):
    msgs = list(set(msgs))
    return random_n(msgs, n)


def build_line(user, select, n):
    """Create a JSONL line for a user, with a prompt and completion.
    
    Parameters:
        user - Dict type with parameters "name", "age", "messages", etc.
        select - Function for picking n messages from the list.
        n - Number of messages to present to GPT-3.
    """
    messages = select(user['messages'], n)
    res = '{"prompt": "' + build_profile(user, False) + \
          '", "completion": "' + example_messages(messages) + '"}'
    return res.encode('unicode_escape').decode('utf-8') + '\n'


def validate_args(args):
    """Ensure that all requirements for arguments are met."""
    assert args.input_file.split('.')[-1] == 'json'
    assert os.path.exists(args.input_file)

    if args.output_file:
        assert args.output_file.split('.')[-1] == 'jsonl'
        assert os.path.exists(os.path.dirname(args.output_file))
    else:
        args.output_file = os.path.join(os.path.dirname(args.input_file),
            "train.jsonl")
        assert args.output_file != args.input_file
    
    args.n = int(args.n)
    assert args.n > 0
    assert args.n < 20

    return args

def main(args):
    args = validate_args(args)
    
    with open(args.input_file, 'r', encoding='utf-8') as file:
        data = json.load(file)

    select = SELECT[args.select][0]
    
    train = ""
    for user in data:
        train += build_line(user, select, args.n)
    
    with open(args.output_file, 'w', encoding='utf-8') as file:
        file.write(train)


if __name__ == "__main__":
    parser.add_argument('--select', '-s', choices = list(SELECT.keys()),
        required = True, help = selection_help())
    args = parser.parse_args()
    main(args)
