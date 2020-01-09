"""
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 Rafael Goldstein, David Baraka, Sarah Jin, Sebastian Zimmeck
"""


"""
app.py
================================================================================
app.py is the entry point to PrivacyFlash Pro.
"""


import os, eel

from analysis import analyze_data
from privacy_practices import load_data
from configure_data import configure_data

directory = os.environ['HOME']

@eel.expose
def getCWD():
    global directory
    return directory

@eel.expose
def updateCWD(path):
    global directory
    directory = path

@eel.expose
def getDirs(d):
    items = []
    for item in os.listdir(d):
        if not item.startswith('.') and os.path.isdir(directory + "/" + item):
            items.append(item)
    return sorted(items)

@eel.expose
def validate(d):
    """
    @desc returns true if the directory is a valid directory; otherwise false
    @params (d : string) the directory of where the iOS project is stored
    @return boolean
    """
    valid = False
    directory = os.fsencode(d)

    if d == "" or os.path.isdir(d) == False:
        return False

    for file in os.listdir(directory):
        filename = os.fsdecode(file)

        if filename.endswith(".xcodeproj"):
            valid = True

    return valid

@eel.expose
def main(d):
    (first_party_info, other_files, sdks, third_party_info, e) = \
        load_data(d)
    eel.analyzingData()
    (practices_results, _, thirdParty_results) = \
        analyze_data(first_party_info, other_files, sdks, third_party_info, e)
    eel.preparingPoicy()
    (practices, sdks, thirdPartyAnalysis) = \
        configure_data(practices_results, thirdParty_results)
    return [practices, sdks, thirdPartyAnalysis]


def app():
    eel.init('interface')
    options = {
        'mode': 'macosx' if os.name != "nt" else 'windows-default',
        'host': 'localhost',
        'port': 8080,
        'chromeFlags': ["--start-fullscreen"]
    }
    eel.start('index.html', options=options)

app()
