"""
PrivacyFlash Pro is licensed under the MIT License
Copyright (c) 2019 David Baraka, Rafael Goldstein, Sarah Jin, Sebastian Zimmeck
"""


"""
package.py
================================================================================
package.py packages PrivacyFlash Pro into a Mac App
"""

import PyInstaller.__main__, plistlib, os, shutil

# Specs
name = 'PrivacyFlash Pro'
bundleIdentifier = 'org.privacytechlab.privacyflashpro'
version = '1.1.0'

# Clean build and dist directories
if os.path.exists("./build"): 
    shutil.rmtree('./build', ignore_errors=True) 
if os.path.exists("./dist"): 
    shutil.rmtree('./dist', ignore_errors=True) 

# Package to mac app
PyInstaller.__main__.run([
    'app.py',
    '--onefile',
    '--noconsole',
    '--clean',
    '--add-data=interface:interface',
    '--add-data=spec:spec',
    '--noconfirm',
    f'--osx-bundle-identifier={bundleIdentifier}',
    '--icon=./interface/img/icon.icns',
    f'--name={name}'
])

# Update plist version
path = f'./dist/{name}.app/Contents/Info.plist'
if os.path.exists(path):
    with open(path, "rb") as f:
        plist = plistlib.load(f)
    if not "CFBundleShortVersionString" in plist:
        print ("Error: Couldn't Update Version")
    else:
        plist["CFBundleShortVersionString"] = version
        with open(path, "wb") as f:
            plistlib.dump(plist, f)
else:
    print("Error: Couldn't Locate Info.plist")

# Compress mac app to zip file
path = f'./dist/{name}.app'
if not os.path.exists('./build/tmp'):
    os.mkdir('./build/tmp')
shutil.move(path, './build/tmp')
shutil.make_archive('./dist/privacyflash-pro', 'zip', root_dir = './build/tmp')

# Comment below to create a packaged unix executable of PrivacyFlash Pro for debugging
os.remove(f'./dist/{name}')