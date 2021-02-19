"""
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 Rafael Goldstein, David Baraka, Sarah Jin, Sebastian Zimmeck
"""


"""
app.py
================================================================================
app.py is the entry point to PrivacyFlash Pro.
"""


import os, webview, shelve, sys

from src.analysis import analyze_data
from src.privacy_practices import load_data
from src.configure_data import configure_data
from pathlib import Path

isPackaged = getattr(sys, 'frozen', False)
directory = str(Path.home())
path = os.path.join(str(Path.home()), 'Library/Application Support/PrivacyFlash Pro') 
database = os.path.join(path, 'shelf')
showBootLogo = True

try:
    Path(path).mkdir(parents=True, exist_ok=True)
except:
    print('Error: Could not create directory')

class Api():
    def __init__(self, window):
        self.window = window

    def main(self, d):
        (first_party_info, other_files, sdks, third_party_info, e) = \
            load_data(d)
        self.window.evaluate_js("$('#process').html('Analyzing Data...')")
        (practices_results, _, thirdParty_results) = \
            analyze_data(first_party_info, other_files, sdks, third_party_info, e)
        self.window.evaluate_js("$('#process').html('Preparing Privacy Policy...')")
        (practices, sdks, thirdPartyAnalysis) = \
            configure_data(practices_results, thirdParty_results)
        return [practices, sdks, thirdPartyAnalysis]

    def validate(self, d):
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
    
    def showFolderDialog(self):
        """
        Creates a folder dialog to select an ios swift project
        """
        global directory
        result = self.window.create_file_dialog(dialog_type=webview.FOLDER_DIALOG, directory=directory)
        if result != None:
            directory = result[0]
            result = result[0]
        else:
            result = ""
        return result

    def saveFileDialog(self, filename, data):
        """
        Creates a save file dialog
        """
        directory = str(Path.home()) + '/Downloads'
        if filename == None:
            filename = 'Privacy Policy.html'
        elif not filename.endswith('.html'):
            filename += '.html'

        result = self.window.create_file_dialog(dialog_type=webview.SAVE_DIALOG, directory=directory, save_filename=filename)

        if result != None:
            with open(result, 'w') as f:
                 f.write(data)
            return True
        return False

    def updateDisclaimer(self):
        try:
            try:
                db = shelve.open(database)
            except Exception as e:
                path = database + '.db' 
                if os.path.exists(path):
                    os.remove(path)
                db = shelve.open(database)
            try:
                db['disclaimer'] = True
            finally:
                db.close()
            db = shelve.open(database)
            db.close()
        except Exception as e:
            print('Error: Unable to save user choice')

    def readDisclaimer(self):
        try:
            try:
                db = shelve.open(database)
            except Exception as e:
                path = database + '.db' 
                if os.path.exists(path):
                    os.remove(path)
                db = shelve.open(database)
            try:
                if 'disclaimer' in db:
                    value = db['disclaimer']
                else:
                    db['disclaimer'] = False
                    value = False
            finally:
                db.close()
            return value
        except Exception as e:
            print('Error: Unable to access database')
            return False
    
    def showBootLogo(self):
        global showBootLogo
        if showBootLogo:
            showBootLogo = False
            return True
        return showBootLogo


def app():
    global isPackaged
    window = webview.create_window('PrivacyFlash Pro', url='./interface/index.html', background_color='#f8f9fa', width=1366, height=768, text_select=True)
    window._js_api = Api(window)
    webview.start(http_server=True, debug=False if isPackaged else True)

app()