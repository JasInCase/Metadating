"""Sends requests to openai to complete text."""
import openai
import datetime
import metabackend
import flask
from flask import request

from template import build_profile

# OC DO NOT STEAL:
openai.api_key = "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"
completion = openai.Completion

last_minute = None
spent = 0
MAX_SPENT = 60

def complete(prompt: str, engine="text-davinci-002", temperature=0.9) -> str:
    global last_minute
    global spent
    """Send a request to GPT-3's Davinci model to complete a text prompt."""
    now = datetime.datetime.now()
    now = (now.year, now.month, now.day, now.hour, now.minute)
    if now != last_minute:
        last_minute = now
        spent = 0
    spent += 1
    if spent > MAX_SPENT:
        return "GPT-3 LIMIT REACHED. PLEASE WAIT.\n\n"

    stop = ["\n\nUSER:"]
    res = completion.create(engine=engine, prompt=prompt,
          temperature=temperature, max_tokens=48, suffix="\n\nUSER:", n=1,
          stop=stop)
    # print("API Call Result:\n", res)
    # print()
    # print(prompt)
    # print(res['choices'][0]['text'])
    return res['choices'][0]['text']


def complete_fully(prompt: str) -> str:
    """Send requests to GPT-3 until two newline characters are found.
    
    To prevent infinite loops, only up to five requests are sent.
    """
    # print("Prompt to API:", prompt)
    to_return_string = ""
    completed_string = complete(prompt).strip()
    # for i in range(0,5):
    #     if not completed_string.endswith('\n'):
    #         print("Made second call to check length")
    #         completed_string = completed_string + complete(prompt + completed_string + "[insert]")
    #         print("Iteration", i + 1, " - Updated String:" + completed_string)
    #         if (completed_string.count('\n\n') >= 1):
    #             return completed_string.split('\n\n')[0]
    # for i in range(5):
    #     if completion.count('\n\n') > 1:
    #         print("Done with completion.")
    #         break
    #     completion += complete(prompt + completion)
    #     print(i + 1, "th complete call:[", completion, "]")
    # completion = '\n\n' + completion.split('\n\n')[1]
    to_return_string = completed_string
    # print("String returned:", to_return_string)
    return to_return_string


def respond(profile, prev_messages: str):
    """Add the user's latest text to the convo and responds with GPT-3.

    Parameters:
        profile - Dictionary with keys `name`, `age`, `gender`, and
                  `interests`.
        prev_messages - String with all previous messages.
    
    prev_messages should be formatted as follows:
    ---
    USER:

    <user message 1>

    <name of other participant>:

    <other participant message 1>

    USER:...
    ---
    """
    prompt = build_profile(profile) + '\n\n' + prev_messages
    api_message = complete_fully(prompt)
    return api_message

def ai_response(array_msgs, input_profile):
    name = input_profile["name"].upper()
    # print("Array messages: ", array_msgs)
    input_messages = ""
    for msg_object in array_msgs:
        if msg_object['is_user'] is True:
            input_messages = input_messages + "USER:\n\n"
            input_messages = input_messages + msg_object['text'] + "\n\n"
        else:
            input_messages = input_messages + name + ":\n\n"
            input_messages = input_messages + msg_object['text'] + "\n\n"
    input_messages = input_messages + name + ": "

    to_return = respond(input_profile, input_messages)
    return to_return
