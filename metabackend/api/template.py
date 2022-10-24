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
Traits: Non-apologetic, creative, inquisitive, enthusiastic, flirty"""

PROFILE_NOINTEREST = """\
Age: $age$
Gender: $gender$
Hometown: $city$, $country$
Traits: Non-apologetic, creative, inquisitive, enthusiastic, flirty"""

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
        keys = ('age', 'gender', 'city', 'country')
    for key in keys:
        if key not in profile:
            profile[key] = 'NA'
        res = res.replace(f'${key}$', profile[key])
    return res

def example_messages(msgs):
    """Compile a list of message strings into a hyphenated list.
    
    Parameters:
        msgs - List of strings, each to go on its own line.
    """
    res = "\n\nExample messages:"
    for msg in msgs:
        res += "\n - " + msg
    return res
