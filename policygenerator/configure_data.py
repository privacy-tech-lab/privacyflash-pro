"""
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 Rafael Goldstein, David Baraka, Sarah Jin, Sebastian Zimmeck
"""


"""
configure_data.py
================================================================================
configure_data.py contains functions that prepares analyzed data results from
    analysis.py as json files for UI/Interface. The json files will appear
    in the directory interface/js/<filename>.json.js
"""


import json, os

def createPracticesJson(result):
    """
    Given a python dictionary containing the practices' results from the
        generator with custom python objects, extract the values of the python
        objects and convert the dictionary into a json-ready object to be
        converted to a proper json file.

    :param result: python dictionary containing results from generator
    :return json: json-ready object
    """
    json = {}
    for practice in result:
        json[str(practice)] = {}
        for value in result[practice]:
            if value == 'used':
                if result[practice][value] == 1:
                    json[str(practice)][value] = True
                else:
                    json[str(practice)][value] = False
            elif value == "classifications":
                json[str(practice)][value] = []
                for item in result[practice][value]:
                    (json[str(practice)][value]).append(str(item))
            else:
                used = False
                if (result[practice]['used'] == 1):
                    used = True
                json[str(practice)][value] =\
                    manageEvidence(result[practice][value], str(practice), used)
    return json

def createThirdPartyJson(result):
    """
    Given a python dictionary containing the third party results from the
        generator with custom python objects, extract the values of the python
        objects and convert the dictionary into json-ready object to be
        converted to a proper json file.

    :param result: python dictionary containing results from generator
    :return json: json-ready object
    """
    json = {"LOCATION": {}, "CONTACTS": {}, "CALENDAR": {}, "PHOTOS": {},
        "MICROPHONE": {}, "CAMERA": {}, "HEALTH": {}, "BLUETOOTH": {},
        "REMINDERS": {}, "MUSIC": {}, "HOMEKIT": {}, "SPEECH": {},
        "MOTION": {}, "FACEBOOK": {}, "PURCHASES": {}, "IDFA": {},
        "GOOGLE": {}}
    thirdPartyPractices = {}
    sdks = {}
    index = 0
    for sdk in result:
        purpose = result[sdk][-1]
        if purpose == "n/a":
            purpose = ""
        sdks[index] = {
            "NAME": str(sdk).rsplit('/', 1)[-1],
            "USED": True,
            "EVIDENCE": str(sdk),
            "PURPOSE": purpose
            }
        for value in result[sdk][:-1]:
            if str(value) not in thirdPartyPractices:
                thirdPartyPractices[str(value)] = {str(sdk)}
            else:
                thirdPartyPractices[str(value)].add(str(sdk))
            json[str(value)][index] =\
                {"PURPOSE": purpose, "USED": True}
        index += 1
    return (json, sdks, thirdPartyPractices)

def manageEvidence(evidenceLst, practice, usedFP):
    """
    Given a list of evidence objects, restructure the evidence such that plist
        data stays intact, and only the identified files with method and/or
        authorization method are used as evidence.
        The files are ranked by the number of classifications an individual file
        contains. So a file with "FRAMEWORK" and "CLASS" will have a higher rank
        then a file with just the "METHOD". The restructured evidence will also
        include line numbers where specific usages were detected

    :param1 evidenceLst: a list of evidence Objects
    :return evidenceDict: configured evidence list;
        {plist: [{<plist data>}, ...], usages: [{<file> <line number(s)>}, ...]}
    """
    evidenceDict = {"plist": [], "firstparty": []}
    fileDict = {}
    usageDescription = set()

    for item in evidenceLst:
        if str(item.classification) != "PLIST" and usedFP and str(item.file_name)[0] == "/":
            if item.file_name not in fileDict:
                fileDict[item.file_name] = {str(item.classification)}
            else:
                classifications = fileDict[item.file_name]
                classifications.add(str(item.classification))
                fileDict[item.file_name] = classifications
        elif (str(item.classification) == "PLIST"):
            plistLst = evidenceDict["plist"]
            plistDict = {
                "file_name": item.file_name,
                "usage_description": item.reason
            }
            plistLst.append(plistDict)
            evidenceDict["plist"] = plistLst
            if (item.reason != None):
                usageDescription.add((item.reason).strip())

    fileDict = sorted(fileDict.items(), key=lambda item : len(item[1]),
        reverse=True)
        
    for (file_name, instances) in fileDict:
        usagesLst = evidenceDict["firstparty"]
        usagesDict = {"file_name": file_name, "rank": len(instances)}
        usagesLst.append(usagesDict)
        evidenceDict["firstparty"] = usagesLst

    description = ""
    for d in usageDescription:
        description += d + " "
    evidenceDict["usageDescription"] = description.strip()

    return evidenceDict

def configure_data(practices, thirdParties):
    """
    Given a python dictionary containing the third party results from the
        generator with custom python objects, extract the values of the python
        objects and convert the dictionary into json to be used for the UI. The
        json files will appear in the directory interface/js/<filename>.json.js

    :param1 practices: python dictionary containing practices results
        from generator
    :param2 thirdParties: python dictionary containing third party results from
        generator
    :return None: This function is used for its effect, creating and exporting
        json files
    """
    # create json-ready objects
    (thirdParties_json, sdks, thirdPartyPractices) =\
        createThirdPartyJson(thirdParties)
    practices_json = createPracticesJson(practices)

    return (
        json.dumps(practices_json, sort_keys=True),
        json.dumps(sdks, sort_keys=True),
        json.dumps(thirdParties_json, sort_keys=True),
        )
