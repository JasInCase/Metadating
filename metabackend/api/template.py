"""Insert data into GPT-3 friendly prompts."""

# PROFILE_TEMPLATE = """\
# Example Tinder conversation

# $name$'s profile:
# Age: $age$
# Gender: $gender$
# Interests: $interests$
# Traits: Non-apologetic, creative, inquisitive, enthusiastic, flirty"""

PROFILE_TEMPLATE = """\
$name$'s profile:
Age: $age$
Gender: $gender$
Interests: $interests$
Traits: Non-apologetic, creative, inquisitive, enthusiastic, flirty

Example Messages
###"""

PROFILE_NOINTEREST = """\
Age: $age$
Gender: $gender$
Hometown: $hometown$
Traits: Non-apologetic, creative, inquisitive, enthusiastic, flirty

Messages
###"""

def build_profile(profile, interests = True):
    """Fill profile data into a template for use by GPT-3.

    Parameters:
        profile - Dictionary with keys `name`, `age`, `gender`, and
                  `interests`.
    """
    if interests:
        res = PROFILE_TEMPLATE
        keys = ('name', 'age', 'gender', 'interests')
    else:
        res = PROFILE_NOINTEREST
        keys = ('age', 'gender', 'hometown')
        if 'hometown' not in profile:
            profile['hometown'] = f"{profile['city']}, {profile['country']}"
    for key in keys:
        if key not in profile:
            profile[key] = 'NA'
        res = res.replace(f'${key}$', profile[key])
    return res


def example_messages(msgs, delim="\n"):
    """Compile a list of message strings into a hyphenated list.
    
    Parameters:
        msgs - List of strings, each to go on its own line.

    Note: This is a very simple function. That is because it used to do more,
    but GPT-3 didn't like that as much. Keeping this to make a point: Go for
    simple prompts!
    """
    res = ""
    for msg in msgs:
        res += delim + msg
    return res


def build_line(user, messages):
    """Create a JSONL line for a user, with a prompt and completion.

    Parameters:
        user - Dict type with parameters "name", "age", "messages", etc.
        select - Function for picking n messages from the list.
        count - Number of messages to present to GPT-3.
    """
    res = '{"prompt": "' + build_profile(user, False) + \
          '", "completion": "' + example_messages(messages) + '"}'
    return res + '\n'
