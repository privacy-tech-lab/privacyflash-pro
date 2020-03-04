"""
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 Rafael Goldstein, David Baraka, Sarah Jin, Sebastian Zimmeck
"""


"""
constants.py
================================================================================
constants.py is used internally to identify a privacy practice by an index value.
"""


from enum import IntEnum


class Used(IntEnum):
    """
    The Used class represents whether a practice (see below the Practices class)
    is used in an app.
    For the requirements according to which a privacy practice is declared to be
    USED, see the explanation in the third_parties.yaml file.
    """
    UNUSED = 0
    USED = 1


class Practices(IntEnum):
    """
    The Practice class represents the potential privacy practices that
    could be contained in an app, both in first party and third party code.
    """
    LOCATION = 0
    CONTACTS = 1
    CALENDAR = 2
    PHOTOS = 3
    MICROPHONE = 4
    CAMERA = 5
    HEALTH = 6
    BLUETOOTH = 7
    REMINDERS = 8
    MUSIC = 9
    HOMEKIT = 10
    SPEECH = 11
    MOTION = 12
    FACEBOOK = 13
    PURCHASES = 14
    IDFA = 15
    GOOGLE = 16

    def __str__(self):
        return self.name


class Classification(IntEnum):
    """
    The generator needs to detect multiple resources in an app's code
    to classify a privacy practice to be used. See the comment to the
    Used class.
    """
    FRAMEWORK = 0
    CLASS = 1
    METHOD = 2
    AUTHORIZATION = 3
    PLIST = 4
    THIRDPARTY = 5
    FIRSTPARTY = 6
    FRAMEWORK_THIRD = 7
    CLASS_THIRD = 8
    METHOD_THIRD = 9
    AUTHORIZATION_THIRD = 10
    ENTITLEMENT = 11
    THIRDPARTY_AUTH = 12
    THIRDPARTY_NOAUTH = 13

    def __str__(self):
        return self.name
