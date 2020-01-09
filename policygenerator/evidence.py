"""
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 Rafael Goldstein, David Baraka, Sarah Jin, Sebastian Zimmeck
"""


"""
evidence.py
================================================================================
evidence.py is used for keeping track of privacy practice usages in an app's
    files.
"""


from os import path


class Evidence:
    def __init__(self, file_name, practice, used, classification, reason=None):
        """
        Creates an evidence object that stores where in a file
        a privacy practice is used.

        In general, we store this information to give the developer
        a better idea of where in their code they are using
        privacy-related functionality.

        :param file_name: name of file
        :param practice: which privacy practice is being used
        :param classification: classification of privacy practice use
                (i.e., which Framework is being used)
        :param reason: from info.plist, the reason for using a privacy
                practice
        :return:
        """
        self.file_name = file_name
        self.practice = practice
        self.used = used
        self.classification = classification
        self.reason = reason

    def __eq__(self, other):
        try:
            return ((self.file_name == other.file_name or path.samefile(self.file_name,
                                                                        other.file_name)) and
                    self.classification == other.classification and
                    self.used == other.used and
                    self.reason == other.reason)
        except FileNotFoundError as e:
            return False

    def __ne__(self, other):
        return not (self.__eq__(other))

    def __str__(self):
        return " ".join([self.file_name, str(self.classification), str(self.used), str(self.practice)])
