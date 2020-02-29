"""
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 Rafael Goldstein, David Baraka, Sarah Jin, Sebastian Zimmeck
"""


"""
privacy_practices.py
================================================================================
privacy_practices.py loads data from the app project to be analyzed.
"""


import os
from os import path
import yaml
from constants import Practices

 
def retrieve_privacy_practice_data():
    """
    Retrieves from privacy_practices.yaml values of plist, entitlement, framework
    imports, and method/function declarations and casts privacy practice strings
    to enums.

    :return: A dictionary with privacy practices enums as keys, and dictionaries
    of information needed to identify whether the privacy practices are called
    in an iOS project as values.
    The values dictionary has two keys, one for `SWIFT` and another for `OBJECTIVE-C`.
    These keys also has values that are dictionaries corresponding to the
    programming language.  In the values dictionary, for each privacy practice,
    there is the "PLIST" key which stores a list of keys that can be found in
    Info.plist of the app's code that are related to the privacy practice. There
    is the "ENTITLEMENT" key which stores a list of keys that can be found in the
    <app_name>.entitlements files of the app's project. Similarly, there are
    also "FRAMEWORK" and "CLASS" keys, and their arrays contain the framework
    imports and class instances related to the privacy practices, respectively.
    There is a "AUTHORIZATION_METHOD" key, which contains a dictionary of one
    or more keys corresponding to function names related to the privacy
    practice. These function name keys may contain an empty list or an array
    specifying parameter(s) for unique Objective-C and Swift APIs. Lastly,
    similar to the "AUTHORIZATION_METHOD", there is an "ADDITIONAL_EVIDENCE"
    key, which contains a dictionary of one or more keys corresponding to
    function names related to the privacy practice. These function name keys
    may contain an empty list or an array specifying parameter(s) for unique
    Objective-C and Swift APIs as evidence for a privacy practice.
    """
    pp = path.join(path.dirname(
        path.realpath(__file__)), 'spec/privacy_practices.yaml')
    with open(pp, 'r') as evidence:
        privacy_practices = yaml.safe_load(evidence)

    practices_data = {}

    for practice in Practices:

        practice_string = str(practice)
        practice_data = {}

        for language in ["SWIFT", "OBJECTIVE-C"]:
            practice_data[language] = {}
            practice_data[language]["PLIST"] = \
                privacy_practices["PLIST"][practice_string]
            practice_data[language]["ENTITLEMENT"] = \
                privacy_practices["ENTITLEMENT"][practice_string]
            practice_data[language]["FRAMEWORK"] = \
                privacy_practices["FRAMEWORK"][language][practice_string]
            practice_data[language]["CLASS"] = \
                privacy_practices["CLASS"][language][practice_string]
            practice_data[language]["AUTHORIZATION_METHOD"] = \
                privacy_practices["AUTHORIZATION_METHOD"][language][practice_string]
            practice_data[language]["ADDITIONAL_EVIDENCE"] = \
                privacy_practices["ADDITIONAL_EVIDENCE"][language][practice_string]

        practices_data[practice] = practice_data

    return practices_data


def search_root_dir(directory):
    """
    Looks for other frameworks outside the .pbxproj file. These frameworks
    could be stored anywhere throughout the root directory, so for now,
    load_data is just worried about passing through all potential
    frameworks (all directories)

    :param directory: the directory of where the iOS project is stored
    :return other_files: list of all files in root directory
    """
    other_files = []

    for root, dirs, files in os.walk(directory):
        for f in files:
            # if the files are third parties, we don't need them
            if "Pods" in root or "Carthage" in root:
                pass
            else:
                other_files.append(os.path.join(root, f))

    return other_files


def get_pod_loc(directory):
    """
    Based on the third parties listed from the podfile,
    looks for the location of those frameworks stored somewhere
    in the root directory

    :param directory:  directory where iOS project is stored
    :return finalized: list of the locations of the cocoa pod sdks in the project
    """
    frameworks = []

    for root, dirs, files in os.walk(directory + "Pods"):
        if 'Target Support Files' in dirs:
            dirs.remove('Target Support Files')
        if 'Pods.xcodeproj' in dirs:
            dirs.remove('Pods.xcodeproj')
        if 'Local Podspecs' in dirs:
            dirs.remove('Local Podspecs')
        if 'Headers' in dirs:
            dirs.remove('Headers')
        frameworks = dirs
        break

    finalized = []
    for i in frameworks:
        finalized.append(directory + "Pods/" + i)

    return finalized


def get_cart_loc(directory):
    """
    Based on the third parties listed from the cartfile,
    looks for the location of those frameworks stored somewhere
    in the root directory

    :param directory: directory where iOS project is stored
    :return finalized: list of the locations of the Carthage sdks in the project
    """
    frameworks = []

    for root, dirs, files in os.walk(directory + "Carthage/Checkouts"):
        frameworks = dirs
        break

    finalized = []
    for i in frameworks:
        finalized.append(directory + "Carthage/Checkouts/" + i)

    return finalized


def grab_third_party_files(sdks):
    """
    Given a list of all the locations of all the third party sdks, return
    dictionary containing all the files to the SDK project

    :param sdks: list of the locations of all the sdks in the project
    :return sdk_files: dictionary containing each sdk as the key and all of the Files
    corresponding to each sdk as items for each key
    """
    sdk_files = {}
    for project in sdks:
        f = []
        for (dirpath, dirnames, filenames) in os.walk(project):
            for file in filenames:
                f.append(os.path.join(dirpath, file))
        project_name = project.rsplit('/', 1)[-1]
        sdk_files[project] = f

    return sdk_files


def load_third_df():
    """
    Find ad networks dataframe and parse into a dictionary to be read
    :return final_ads: dictionary of every SDK along with their type
    """
    pp = path.join(path.dirname(
        path.realpath(__file__)), 'spec/third_parties.yaml')
    with open(pp, 'r') as evidence:
        df = yaml.safe_load(evidence)

    return df


def locate_entitlements_file(app_dir):
    """
    Looks for entitlements file in directory
    :param app_dir: - root directory
    :return e: location of entitlements file
    """
    e = ""
    for root, dirs, files in os.walk(app_dir):
        for f in files:
            if f.endswith(".entitlements"):
                path1 = os.path.join(root, f)
                e = path1
                break
    return e


def load_data(root_dir):
    """
    Gets all necessary data from the iOS project.

    This method gets every useful information from the iOS project by integrating
    and using all methods in privacy_practices.py.

    :param root_dir: the directory of the location of the stored iOS project
    :return first_party_info, first_party_files, sdk_files, third_party_info, entitlements:
    first_party_info: the dictionary to find first party function calls
    third_party_info: the dictionary to find third party function calls.
    frameworks and other_files: potential frameworks and .swift files to analyze.
    """

    first_party_info = retrieve_privacy_practice_data()

    third_party_info = load_third_df()

    first_party_files = search_root_dir(root_dir)

    sdks = []

    sdks += get_pod_loc(root_dir)
    sdks += get_cart_loc(root_dir)

    # from the SDKs we have found, identify their file names
    sdk_files = grab_third_party_files(sdks)

    entitlements = locate_entitlements_file(root_dir)

    return first_party_info, first_party_files, sdk_files, third_party_info, entitlements
