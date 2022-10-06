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
MAX_SPENT = 15

# with open("profile_template.txt", 'r', encoding='utf-8') as file:
#     profile_template = file.read()

def complete(prompt: str) -> str:
    global last_minute
    global spent
    """Sends a request to GPT-3's Davinci model to complete a text prompt."""
    now = datetime.datetime.now()
    now = (now.year, now.month, now.day, now.hour, now.minute)
    if now != last_minute:
        last_minute = now
        spent = 0
    spent += 1
    if spent > MAX_SPENT:
        return "GPT-3 LIMIT REACHED. PLEASE WAIT."

    if '[insert]' in prompt:
        context, suffix = prompt.split('[insert]')
        res = completion.create(engine="text-davinci-002", prompt=context,
            suffix=suffix, temperature=0.9)
    else:
        res = completion.create(engine="text-davinci-002", prompt=prompt,
            temperature = 0.9)

    return res['choices'][0]['text']

def build_profile(profile):
    """Fills profile data into a template for use by GPT-3.

    Parameters:
        profile - Dictionary with keys `name`, `age`, `gender`, and
                  `interests`.
    """
    # res = profile_template
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
    """Adds the user's latest text to the convo and responds with GPT-3.

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
    name = profile['name']
    prompt = build_profile(profile) + '\n\n' + prev_messages
    prompt += f'\n\n{name}:[insert]\n\nUSER:'
    api_message = complete(prompt)
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
    
    input_messages = ""
    for index, msg in enumerate(array_msgs):
        if index % 2 == 0:
            input_messages = input_messages + "USER:\n\n"
            input_messages = input_messages + msg + "\n\n"
        else:
            input_messages = input_messages + "Jayce:\n\n"
            input_messages = input_messages + msg + "\n\n"


    profile = {
        'name': "Jayce",
        'age': '24',
        'gender': "male",
        'interests': "Metal, sushi, astrology, space, music"
    }
    prev_messages = """USER:

    I think your city is pretty but you're even prettier ;)

    JAYCE:

    heh witty. i think im pretty too

    USER:

    """ + string_to_append

    # print(respond(profile, prev_messages)
    # to_return = respond(profile, prev_messages)
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
    