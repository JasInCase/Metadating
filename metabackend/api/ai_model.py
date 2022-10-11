"""Sends requests to openai to complete text."""
import openai
import datetime
import metabackend
import flask
from flask import request

# OC DO NOT STEAL:
openai.api_key = "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"
completion = openai.Completion

last_minute = None
spent = 0
MAX_SPENT = 60

def complete(prompt: str) -> str:
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

    # if '[insert]' in prompt:
    #     delimited_str = prompt.split('[insert]')
    #     # context, suffix = prompt.split('[insert]')
    #     context = delimited_str[0]
    #     suffix = "\n\n"
    #     res = completion.create(engine="text-davinci-002", prompt=context,
    #         suffix=suffix, temperature=0.9)
    # else:
    stop = ["\n\nUSER:", ")"]
    res = completion.create(engine="text-davinci-002", prompt=prompt,
          temperature = 0.9, max_tokens=48, suffix="\n\nUSER:", n=1,
          stop=stop)
    # print("API Call Result:\n", res)
    # print(res['choices'][0]['text'])
    return res['choices'][0]['text']


# def complete_fully(prompt: str) -> str:
#     """Send requests to GPT-3 until two newline characters are found.
    
#     To prevent infinite loops, only up to five requests are sent.
#     """
#     completion = complete(prompt)
#     print("First complete call:[", completion, "]")
#     for i in range(5):
#         if completion.count('\n\n') > 1:
#             print("Done with completion.")
#             break
#         completion += complete(prompt + completion)
#         print(i + 1, "th complete call:[", completion, "]")
#     completion = '\n\n' + completion.split('\n\n')[1]
#     print("returning completion?[", completion, "]")
    # return completion


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


def build_profile(profile):
    """Fill profile data into a template for use by GPT-3.

    Parameters:
        profile - Dictionary with keys `name`, `age`, `gender`, and
                  `interests`.
    """
    res = """Example Tinder conversation

    $name$'s profile:
    Age: $age$
    Gender: $gender$
    Interests: $interests$
    Traits: Non-apologetic, creative, inquisitive, enthusiastic, flirty
    """
    for key in ('name', 'age', 'gender', 'interests'):
        res = res.replace(f'${key}$', profile[key])
    return res


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
    name = profile['name'].upper()
    prompt = build_profile(profile) + '\n\n' + prev_messages
    # prompt += f'\n\n{name}:[insert]\n\nUSER:'
    api_message = complete_fully(prompt)
    return api_message

# @metabackend.app.route('/api/v1/getmsg', methods=['POST'])
# def respond_to_message_frontend():

#     data = request.get_json()
#     string_to_append = data["userMessage"]

#     profile = {
#         'name': "Jayce",
#         'age': '24',
#         'gender': "male",
#         'interests': "Metal, sushi, astrology, space, music"
#     }
#     prev_messages = """USER:

#     I think your city is pretty but you're even prettier ;)

#     JAYCE:

#     heh witty. i think im pretty too

#     USER:

#     """ + string_to_append

#     # print(respond(profile, prev_messages)
#     to_return = respond(profile, prev_messages)
#     context = {
#         'apiMessage': to_return
#     }
#     return flask.jsonify(**context)




@metabackend.app.route('/api/v1/getmsg', methods=['POST'])
def respond_to_message_frontend():

    data = request.get_json()
    string_to_append = data["userMessage"]
    array_msgs = data["msgs"]
    
    profile = {
        'name': "Jayce",
        'age': '24',
        'gender': "female",
        'interests': "Metal, sushi, astrology, space, music"
    }


    input_messages = ""
    for index, msg in enumerate(array_msgs):
        if index % 2 == 0:
            input_messages = input_messages + "USER:\n\n"
            input_messages = input_messages + msg + "\n\n"
        else:
            input_messages = input_messages + profile["name"] + ":"
            input_messages = input_messages + msg + "\n\n"
    input_messages = input_messages + profile["name"] + ": "

    to_return = respond(profile, input_messages)
    context = {
        'apiMessage': to_return
    }
    return flask.jsonify(**context)





# if __name__ == "__main__":
#     profile = {
#         'name': "Jayce",
#         'age': '24',
#         'gender': "male",
#         'interests': "Metal, sushi, astrology, space, music"
#     }
#     prev_messages = """USER:

#     I think your city is pretty but you're even prettier ;)

#     JAYCE:

#     heh witty. i think im pretty too

#     USER:

#     what kinda music do you like?"""

#     print(respond(profile, prev_messages))
    