"""
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 Rafael Goldstein, David Baraka, Sarah Jin, Sebastian Zimmeck
"""


"""
analysis.py
================================================================================
analysis.py contains the module for analyzing the project; looks for instances
    of privacy practice usages.
"""


import codecs
import re
import os
from six import iteritems

from .evidence import Evidence
from .constants import Used, Practices, Classification


def constructor_search(evidence, prac, first_party):
    """
    Given evidence check to see if any of the evidence is a constructor

    :param evidence: evidence
    :param prac: prac
    :param first_party: first party
    :return:
    """
    if first_party:
        for i in evidence:
            if i.classification == Classification.CLASS and i.practice == prac:
                return True
        return False
    else:
        for i in evidence:
            if i.classification == Classification.CLASS_THIRD and i.practice == prac:
                return True
        return False


def authorize_search(evidence, prac, first_party):
    """
    Given evidence check to see if any of the evidence is an authorization method

    :param evidence: evidence
    :param prac: prac
    :param first_party: first party
    :return:
    """
    if first_party:
        for i in evidence:
            if (i.classification == Classification.AUTHORIZATION and i.practice == prac):
                return True
        return False
    else:
        for i in evidence:
            if i.classification == Classification.AUTHORIZATION_THIRD and i.practice == prac:
                return True
        return False

def plist_search(evidence, p):
    """
    Given evidence check to see if any of the evidence the corresponding plist

    :param evidence: first party evidence
    :param p: practice
    :return:
    """
    for i in evidence:
        if i.classification == Classification.PLIST and i.practice == p:
            return True
    return False

def thirdp_search(third_party_analysis, p, project):
    """
    Given evidence check to see if any of the evidence contains third party usage

    :param third_party_analysis: third party analysis evidence
    :param p: practice
    :param project: sdk project being analyzed
    :return:
    """
    for i in third_party_analysis:
        if i.classification == Classification.THIRDPARTY and i.practice == p and i.file_name == project:
            return True
    return False

def thirdp_noauth_search(third_party_analysis, p, project):
    """
    Given evidence check to see if any of the evidence contains no authorization

    :param third_party_analysis: third party analysis evidence
    :param p: practice
    :param project: sdk project being analyzed
    :return:
    """
    for i in third_party_analysis:
        if i.classification == Classification.THIRDPARTY_NOAUTH and i.practice == p and i.file_name == project:
            return True
    return False

def third_party_auth_search(temp_evidence, practice):
    """
    Given evidence check to see if any of the evidence contains third party
    authorization

    :param evidence: evidence
    :param practice: practice
    :return:
    """
    for i in temp_evidence:
        if (i.classification == Classification.THIRDPARTY_AUTH or i.classification == Classification.THIRDPARTY) and i.practice == practice:
            return True
    return False

def method_search(evidence, prac, first_party):
    """
    Given evidence check to see if any of the evidence is a method

    :param evidence: evidence
    :param prac: prac
    :param first_party: first party
    :return:
    """
    if first_party:
        for i in evidence:
            if (i.classification == Classification.METHOD and i.practice == prac):
                return True
        return False
    else:
        for i in evidence:
            if i.classification == Classification.METHOD_THIRD and i.practice == prac:
                return True
        return False


def import_search(evidence, prac, first_party):
    """
    Given evidence check to see if any of the evidence is an import

    :param evidence: evidence
    :param prac: prac
    :param first_party: first party
    :return:
    """
    if first_party:
        for i in evidence:
            if i.classification == Classification.FRAMEWORK and i.practice == prac:
                return True
        return False
    else:
        for i in evidence:
            if i.classification == Classification.FRAMEWORK_THIRD and i.practice == prac:
                return True
        return False


def strip_quotations(source_code):
    """
    Strips quotations from code to prevent false positives due to keywords
    inside strings.

    First the function matches groups of quotations by looking for text within
    quotations (not escaped quotations). Then it replaces every group with an
    empty string.

    :param source_code: the string that contains source code
    :return: same source code as source_code but without any quoted strings
    """

    # based on regex from
    # http://stackoverflow.com/questions/171480/regex-grabbing-values-between-quotation-marks
    quotation_regex = "([\"'])(?:(?=(\\\\?))\\2.)*?\\1"
    return re.sub(quotation_regex, "", source_code)


def strip_comments(source_code):
    """
    Strips comments from source code to increase analysis accuracy.

    The function is similar to strip_quotations. It removes all comments
    from the source_code. It is also used to prevent false positives.
    It uses a regex to match and remove line comments and then block comments.

    :param source_code: the string that contains source code
    :return: same source code as source but without any comments
    """
    line_comment_regex = "\\/\\/.*\\n"
    block_comment_regex = "\\/\\*(.|[\\r\\n])*?\\*\\/"
    line_comments_removed = re.sub(line_comment_regex, "\n", source_code)
    all_comments_removed = re.sub(block_comment_regex, "\n", line_comments_removed)
    return all_comments_removed


def analyze_entitlement_line(first_party_info, num, text, file_name):
    """
    Given an entitlement file line, checks to see if any practices are used

    :param first_party_info: the dictionary of what first party code to look
            for for every privacy practice
    :param num: line number of file
    :param text: text of line
    :param file_name: file name
    :return: updated evidence
    """
    evidence = []  # the list of privacy practice usages found on this line
    for (practice, practice_info) in iteritems(first_party_info):
        for key in practice_info["SWIFT"]["ENTITLEMENT"]:
            if "<key>" + key + "</key>" in text:
                evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.ENTITLEMENT))

    return evidence


def analyze_objc_line(file_line, first_party_info, file_name, first_party):
    """
    Looks for first-party function calls and import statements

    The function takes a line of Swift source code (quotes and comments removed)
    to find import statements and function calls that indicate a use of privacy
    practice with functions provided by the iOS API.

    :param file_line: line of the Swift source code
    :param first_party_info: the dictionary of what first party code to look
            for for every privacy practice
    :param line_num: the line number that is being analyze_data
    :param file_name: the name of the file that the line is in
    :param first_party: Boolean whether we're analyzing a first party file or not
    :return a list of Evidence objects with all the privacy practices used
             in the line.
    """
    evidence = []  # the list of privacy practice usages found on this line
    for (practice, practice_info) in iteritems(first_party_info):
        for constructor in practice_info["OBJECTIVE-C"]["CLASS"]:
            if constructor in file_line:  # Found a constructor function
                if first_party:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.CLASS))
                else:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.CLASS_THIRD))
        for function in practice_info["OBJECTIVE-C"]["AUTHORIZATION_METHOD"]:
            if function in file_line:
                if practice_info["OBJECTIVE-C"]["AUTHORIZATION_METHOD"][function] == []:
                    if first_party:
                        evidence.append(
                            Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION))
                    else:
                        evidence.append(
                            Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION_THIRD))
                else:
                    for parameter in practice_info["OBJECTIVE-C"]["AUTHORIZATION_METHOD"][function]:
                        if parameter in file_line:
                            if first_party:
                                evidence.append(
                                    Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION))
                            else:
                                evidence.append(
                                    Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION_THIRD))
        for import_name in practice_info["OBJECTIVE-C"]["FRAMEWORK"]:
            if import_name in file_line:
                if first_party:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.FRAMEWORK))
                else:
                    evidence.append(
                        Evidence(file_name, practice, Used.UNUSED, Classification.FRAMEWORK_THIRD))
        for method in practice_info["OBJECTIVE-C"]["ADDITIONAL_EVIDENCE"]:
            if method in file_line:
                if first_party:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.METHOD))
                else:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.METHOD_THIRD))

    return evidence


def analyze_swift_line(file_line, first_party_info, file_name, first_party):
    """
    Looks for first-party function calls and import statements

    The function takes a line of Swift source code (quotes and comments removed)
    to find import statements and function calls which indicate a use of
    privacy practice with functions provided by the iOS API.

    :param file_line: line of Swift source code
    :param first_party_info: the dictionary of what first party code to look
            for for every privacy practice
    :param line_num: the line number that is being analyze_data
    :param file_name: the name of the file that the line is in
    :param first_party: Boolean whether we're analyzing a first party file or not
    :return evidence: Evidence objects list with all privacy practices used in a line

    """
    evidence = []  # List of privacy practice usages found on this line

    for (practice, practice_info) in iteritems(first_party_info):
        for constructor in practice_info["SWIFT"]["CLASS"]:
            if constructor in file_line:  # Found a constructor function
                if first_party:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.CLASS))
                else:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.CLASS_THIRD))
        for function in practice_info["SWIFT"]["AUTHORIZATION_METHOD"]:
            if function in file_line:
                if practice_info["SWIFT"]["AUTHORIZATION_METHOD"][function] == []:
                    if first_party:
                        evidence.append(
                            Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION))
                    else:
                        evidence.append(
                            Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION_THIRD))
                else:
                    for parameter in practice_info["SWIFT"]["AUTHORIZATION_METHOD"][function]:
                        if parameter in file_line:
                            if first_party:
                                evidence.append(
                                    Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION))
                            else:
                                evidence.append(
                                    Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION_THIRD))
        for evidence_item in practice_info["SWIFT"]["ADDITIONAL_EVIDENCE"]:
            if evidence_item in file_line:
                if practice_info["SWIFT"]["ADDITIONAL_EVIDENCE"][evidence_item] == []:
                    if first_party:
                        evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.METHOD))
                    else:
                        evidence.append(
                            Evidence(file_name, practice, Used.UNUSED, Classification.METHOD_THIRD))
                else:
                    for parameter in practice_info["SWIFT"]["ADDITIONAL_EVIDENCE"][evidence_item]:
                        if parameter in file_line:
                            if first_party:
                                evidence.append(
                                    Evidence(file_name, practice, Used.UNUSED, Classification.METHOD))
                            else:
                                evidence.append(
                                    Evidence(file_name, practice, Used.UNUSED, Classification.METHOD_THIRD))
        for import_name in practice_info["SWIFT"]["FRAMEWORK"]:
            if "import" in file_line and import_name in file_line:
                if first_party:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.FRAMEWORK))
                else:
                    evidence.append(
                        Evidence(file_name, practice, Used.UNUSED, Classification.FRAMEWORK_THIRD))

    return evidence


def analyze_bin_file(first_party_info, text, file_name):
    """
    Takes a binary file and looks for keywords in the text

    :param first_party_info: the dictionary of what first party code to look
            for for every privacy practice
    :param text: text to look through
    :param file_name: name of binary file
    :return evidence: list with evidence
    """
    evidence = []  # the list of privacy practice usages found on this line
    for (practice, practice_info) in iteritems(first_party_info):
        for constructor in practice_info["OBJECTIVE-C"]["CLASS"]:
            if constructor in text:  # Found a constructor function
                evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.CLASS_THIRD))
        for function in practice_info["OBJECTIVE-C"]["AUTHORIZATION_METHOD"]:
            if function in text:
                if practice_info["OBJECTIVE-C"]["AUTHORIZATION_METHOD"][function] == []:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION_THIRD))
                else:
                    for parameter in practice_info["OBJECTIVE-C"]["AUTHORIZATION_METHOD"][function]:
                        if parameter in text:
                            evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.AUTHORIZATION_THIRD))
        for import_name in practice_info["OBJECTIVE-C"]["FRAMEWORK"]:
            if import_name in text:
                evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.FRAMEWORK_THIRD))
        for method in practice_info["OBJECTIVE-C"]["ADDITIONAL_EVIDENCE"]:
            if method in text:
                evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.METHOD_THIRD))

    return evidence


def check_plist(plist_directory, plist_content, first_party_info):
    """
    Checks an app's plist for used privacy practices.

    An app must specify a permission in its plist file to use it.
    This function searches for permission keys.

    :param plist_directory: the directory of the plist file
    :param plist_content: text content of the plist
    :param first_party_info: the dictionary of what first party code to look
            for for every privacy practice
    :return evidence: Evidence objects list with all privacy practices
            found in a plist file
    """
    specification_regex = re.compile(r"\s<string>(.*)<\/string>")

    evidence = []
    plist_lines = plist_content.splitlines()
    for i in range(len(plist_lines)):
        line = plist_lines[i]
        for (practice, data) in iteritems(first_party_info):
            for plist_key in data["SWIFT"]["PLIST"]:
                if "<key>" + plist_key + "</key>" in line:
                    next_line = plist_lines[i + 1]
                    matches = specification_regex.search(next_line)
                    # Assuming UTF-8 encoding for the .plist file
                    specification = matches.group(1)
                    evidence.append(Evidence(plist_directory, practice,
                                             Used.UNUSED, Classification.PLIST, reason=specification))
    return evidence


def order_by_practice(evidence, first_party_info):
    """
    Determines whether each privacy practice is used by looking at the
    evidence list

    :param evidence: the list of Evidence objects that records
             every instance of privacy practice usage in the app
    :param first_party_info: the dictionary of what first party code to look
            for for every privacy practice
    :return ordered_evidence: A dictionary of dictionaries. The outer dictionary contains
            Practices objects as the keys, and inner dictionaries as the values.
            The inner dictionaries have these keys and values:
            * "used": A Used object showing whether the practice is used
            * "classifications": A list of Classification objects
            * "evidence": A list of Evidence objects
    """
    ordered_evidence = {}
    for practice in list(first_party_info.keys()):
        practice_evidence = {}
        practice_classifications = []
        practice_evidence["used"] = Used.UNUSED
        practice_evidence["evidence"] = []
        for evidence_item in evidence:
            if evidence_item.practice == practice:
                if practice_evidence["used"] == Used.UNUSED:
                    practice_evidence["used"] = evidence_item.used
                if evidence_item not in practice_evidence["evidence"]:
                        practice_evidence["evidence"].append(evidence_item)
                if (evidence_item.classification not in practice_classifications
                        and evidence_item.classification is not None):
                    practice_classifications.append(evidence_item.classification)
        practice_evidence["classifications"] = practice_classifications
        ordered_evidence[practice] = practice_evidence

    return ordered_evidence


def analyze_file(first_party_info, code,
                 file_name, first_party):
    """
    Checks whether a privacy practice occurs in a Swift or Objective-C file.

    :param first_party_info: the dictionary of what first party code to look
            for for every privacy practice
    :param code: code of a Swift or Objective-C file
    :param file_name: name of a Swift or Objective-C file
    :param first_party: Boolean indicating whether the file is a first party file
    :return evidence: a list of evidence found in the Swift or Objective-C file
    """
    evidence = []
    clean_file = strip_comments(strip_quotations(code))
    file_lines = clean_file.splitlines()

    for line in file_lines:
        line_num = file_lines.index(line) + 1
        # analyze a Swift line
        if file_name.endswith(".swift"):
            if first_party:
                new_evidence = analyze_swift_line(line, first_party_info, file_name, True)

            else:
                new_evidence = analyze_swift_line(line, first_party_info, file_name, False)
        # analyze an Objective-C line
        else:
            if first_party:
                new_evidence = analyze_objc_line(line, first_party_info, file_name, True)
            else:
                new_evidence = analyze_objc_line(line, first_party_info, file_name, False)

        evidence += new_evidence

    return evidence


def analyze_third_parties(sdk_files, first_party_info):
    """
    Given a dictionary of each SDK along with its source code, analyze
    each project for any privacy sensitive information it may take

    :param sdk_files: dictionary of each sdk along with its source code
    :param first_party_info: dictionary regarding what first party code to look for
    :return evidence_full: analysis of each third party project
    """
    evidence_full = []
    for project in sdk_files:
        evidence = []
        files = []
        for i in sdk_files[project]:
            if not i.endswith(".jpeg") or not i.endswith(".png"):
                files.append(i)
        for f in files:
            if f.endswith(".swift"):  # analyzing a Swift file
                with open(f, "r", encoding="utf-8") as fp:
                    swift_text = fp.read()
                evidence = evidence + analyze_file(first_party_info,
                                                   swift_text, f, False)
            elif f.endswith(".h") or f.endswith(".m"):
                with open(f, "r", encoding="utf-8") as fp:
                    objc_text = fp.read()
                    evidence = evidence + analyze_file(first_party_info,
                                                       objc_text, f, False)
            # binaries
            elif "." not in os.path.basename(os.path.normpath(f)):
                with codecs.open(f, 'r', encoding='utf-8', errors='ignore') as fp:
                    binary = fp.read()
                    evidence = evidence + analyze_bin_file(first_party_info,
                                                           binary, project)

        # for all files check to see if evidence has used all Classifications
        evidence = classify_third_parties(evidence, project)
        evidence_full = evidence_full + evidence

    return evidence_full

def finalize_third_parties(evidence, third_party_analysis, sdks):
    """
    Given evidence and list of sdks, goes through all projects and sees which
    are fully using a practice based on first party plist and authorization
    information
    :param evidence: evidence list of first party analysis
    :param third_party_analysis: evidence list of third party analysis
    :param sdks: sdks
    :return third_party_analysis: rewritten evidence to be used if and only if
    there is third party evidence PLUS plist evidence
    """
    # get all practices in one list
    practices_present = []
    for i in third_party_analysis:
        practices_present.append(i.practice)
    practices_present = list(dict.fromkeys(practices_present))

    for project in sdks:
        for p in practices_present:
            # first we need plist
            if plist_search(evidence, p):
                # if we have a framework, class, plist, and authorization method in the third party then its used
                if thirdp_search(third_party_analysis, p, project):
                    third_party_analysis.append(Evidence(project, p, Used.USED, Classification.THIRDPARTY))
                # if we have everything but authorization and authorization is in first party then its also used
                elif thirdp_noauth_search(third_party_analysis, p, project) and authorize_search(evidence, p, True):
                    third_party_analysis.append(Evidence(project, p, Used.USED, Classification.THIRDPARTY))


    return third_party_analysis


def classify_third_parties(evidence, project):
    """
    Given evidence list and third party project see what practices are being used
    by different sdks

    :param evidence: evidence list of first party analysis
    :param project: sdk project being analyzed
    :return evidence: list of third party projects using different varying
    degrees of usage
    """
    practices_present = []
    for i in evidence:
        practices_present.append(i.practice)
    practices_present = list(dict.fromkeys(practices_present))

    for practice in practices_present:
        # general third party usage

        if import_search(evidence, practice, False) and constructor_search(evidence, practice, False):
            if authorize_search(evidence, practice, False):
                # if all types are present then we know its being used
                evidence.append(Evidence(project, practice, Used.UNUSED, Classification.THIRDPARTY))
            else:
                # just missing authorization means there needs to be authorization in first party
                evidence.append(Evidence(project, practice, Used.UNUSED, Classification.THIRDPARTY_NOAUTH))

        # if just authorization is present but nothing else we need to flag that as well
        elif authorize_search(evidence, practice, False):
            evidence.append(Evidence(project, practice, Used.UNUSED, Classification.THIRDPARTY_AUTH))

    return evidence


def check_classifications(evidence, third_party_analysis, first_party, file_name):
    """
    Given list of evidence, if there is a FRAMEWORK, a METHOD, and a CLASS,
    then we know the first or third party is accessing the privacy sensitive
    info (just missing plist which will be checked later)

    :param evidence: list of evidence
    :param first_party: Boolean that is true if the file being analyzed is first party
    :param file_name: name of file to append evidence
    :return evidence: list with evidence
    """
    temp_evidence = evidence + third_party_analysis
    practices_present = []
    for i in temp_evidence:
        practices_present.append(i.practice)
    practices_present = list(dict.fromkeys(practices_present))

    for practice in practices_present:
        if first_party:
            # general all three things first party then we know first party is using it
            if import_search(temp_evidence, practice, True) and \
                    authorize_search(temp_evidence, practice, True) and \
                    constructor_search(temp_evidence, practice, True):
                    if practice != Practices.IDFA and practice != Practices.FACEBOOK and practice != Practices.GOOGLE:
                        evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.FIRSTPARTY))

            # now if authorization is in third party but there are functions in first party then first party is also being used
            elif import_search(temp_evidence, practice, True) and constructor_search(temp_evidence, practice, True) and third_party_auth_search(temp_evidence, practice):
                if practice != Practices.IDFA and practice != Practices.FACEBOOK and practice != Practices.GOOGLE:
                    evidence.append(Evidence(file_name, practice, Used.UNUSED, Classification.FIRSTPARTY))

            # This is to check IDFA, Facebook, and Google log in
            if import_search(temp_evidence, practice, True) and \
                    (method_search(temp_evidence, practice, False) or authorize_search(temp_evidence, practice, True)) and \
                    constructor_search(temp_evidence, practice, True):
                if practice == Practices.IDFA:
                    evidence.append(Evidence(file_name, practice, Used.USED, Classification.THIRDPARTY))
                elif practice == Practices.GOOGLE:
                    evidence.append(Evidence(file_name, practice, Used.USED, Classification.THIRDPARTY))
                elif practice == Practices.FACEBOOK:
                    evidence.append(Evidence(file_name, practice, Used.USED, Classification.THIRDPARTY))

    return evidence


def format_evidence(evidence):
    """
    Given evidence list, returns whether a practice is USED or UNUSED based on
    whether it has a constructor, instance, and import

    :param evidence: evidence of whether any calls are made
    :return evidence: evidence that has been USED if all 4 aspects are
    included: constructor, instance, import, plist
    """
    elist = {}

    for i in evidence:
        if i.classification == Classification.PLIST or i.classification == Classification.FIRSTPARTY or i.classification == Classification.ENTITLEMENT:
            if i.practice not in elist:
                elist[i.practice] = [i.classification]
            else:
                elist[i.practice] = elist[i.practice] + [i.classification]

    for i in elist:
        if i == Practices.HOMEKIT or i == Practices.HEALTH:
            if Classification.FIRSTPARTY in elist[i] and Classification.PLIST in elist[i] and Classification.ENTITLEMENT in elist[i]:
                evidence.append(Evidence(str(0), i, Used.USED, Classification.FIRSTPARTY))
        elif i == Practices.PURCHASES:
            if Classification.FIRSTPARTY in elist[i] and Classification.ENTITLEMENT in elist[i]:
                evidence.append(Evidence(str(0), i, Used.USED, Classification.FIRSTPARTY))
        elif Classification.FIRSTPARTY in elist[i] and Classification.PLIST in elist[i]:
            # add USED evidence as placeholder
            evidence.append(Evidence(str(0), i, Used.USED, Classification.FIRSTPARTY))

    return evidence


def format_third_party_evidence(third_party_analysis, evidence, sdks):
    """
    Given third party and first party evidence, if there is third party evidence
    plus the practice is in the plist, then we say that the third party is
    accessing that data

    :param third_party_analysis: evidence list of third party analysis
    :param evidence: evidence list of first party analysis
    :param sdks: sdks
    :return third_party_analysis: rewritten evidence to be used if and only if
    there is third party evidence PLUS plist evidence
    """

    plist = []
    # look through first party analysis to get plist info
    for i in evidence:
        if i.classification == Classification.PLIST:
            plist.append(i.practice)

    elist = {}

    # look through third party to get third party info
    for i in third_party_analysis:

        if i.classification == Classification.THIRDPARTY:
            if i.file_name not in elist:
                elist[i.file_name] = [i.practice]
            else:
                elist[i.file_name] = elist[i.file_name] + [i.practice]

    third_party_list = {}
    for i in elist:
        for j in elist[i]:
            if j in plist:
                if i not in third_party_list:
                    third_party_list[i] = [j]
                else:
                    if j not in third_party_list[i]:
                        third_party_list[i] = third_party_list[i] + [j]

    for i in sdks:
        if i not in list(third_party_list.keys()):
            third_party_list[i] = ["n/a"]
    return third_party_list


def check_database(third_party_info, third_party_evidence):
    """
    Given dictionary of third party SDKs returns type of SDK

    :param third_party_info: dictionary of SDK Classifications
    :param third_party_evidence: evidence list of sdks
    :return third_party_evidence: updated evidence list of SDKs
    """
    for i in third_party_evidence:
        cutdown = os.path.basename(os.path.normpath(i))
        if cutdown in list(third_party_info.keys()):
            classifications = [third_party_info[cutdown]]
        else:
            classifications = ["n/a"]
        if "n/a" not in third_party_evidence[i]:
            third_party_evidence[i] = third_party_evidence[i] + classifications
        else:
            third_party_evidence[i] = classifications
    return third_party_evidence


def add_entitlement(evidence, e, first_party_info):
    """
    Given entitlement list, opens file and checks for keywords

    :param: evidence - evidence list
    :param: e - entitlement file name to be read
    :param: first_party_info - keywords to search through
    :return: updated evidence
    """
    with open(e, "r", encoding="utf-8") as fp:
        text = fp.read()
        file_lines = text.splitlines()
        counter = 1
        for line in file_lines:
            evidence = evidence + analyze_entitlement_line(first_party_info, counter, line, e)
            counter += 1

    return evidence


def analyze_data(first_party_info, first_party_files, sdks, third_party_info, entitlements):
    """
    Given the data from the iOS project, looks for privacy practice usage.

    The function uses the load_data()'s output of the load_data module and
    looks for evidence of usages of privacy practice in files
    in the iOS project.

    :param first_party_info: the dictionary of what first party code to look
    for for every privacy practice
    :param first_party_files: a list of first_party files
    :param sdks: list of all third party sdks integrated into project along with their
    corresponding source code files
    :param third_party_info: third party info
    :param entitlements: entitlements
    :return sorted_evidence, filtered_unused, formatted_third_party:
    a tuple consisting of a dictionary that stores whether each practice is used, with a
    used enum, a list of pieces of code that shows where the practice
    is used, and a list of unused files and directories that the policy generator didn't look
    at.
    """
    # if there are third parties, analyze them
    if sdks != {}:
        third_party_analysis = analyze_third_parties(sdks, first_party_info)
    else:
        third_party_analysis = []

    evidence = []
    unused = []

    for f in first_party_files:
        # analyzing a Swift or Objective-C file
        if f.endswith(".swift") or f.endswith(".h") or f.endswith(".m"):
            with open(f, "r", encoding="utf-8") as fp:
                swift_text = fp.read()
            evidence = evidence + analyze_file(first_party_info,
                                               swift_text, f, True)
        elif f.endswith(".plist"):  # analyzing a plist file
            with codecs.open(f, 'r', encoding='utf-8', errors='ignore') as fp:
                plist_text = fp.read()
                plist_evidence = check_plist(f, plist_text, first_party_info)
                evidence = evidence + plist_evidence

        else:
            unused.append(f)

    evidence = check_classifications(evidence, third_party_analysis, True, "temp")
    third_party_analysis = finalize_third_parties(evidence, third_party_analysis, sdks)

    # if there is an entitlement list, analyze it
    if entitlements != "":
        evidence = add_entitlement(evidence, entitlements, first_party_info)

    formatted_evidence = format_evidence(evidence)
    formatted_third_party = format_third_party_evidence(third_party_analysis, evidence, sdks)
    formatted_third_party = check_database(third_party_info, formatted_third_party)
    sorted_evidence = order_by_practice(formatted_evidence, first_party_info)

    return sorted_evidence, unused, formatted_third_party
