<p align="center">
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro/releases"><img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/privacy-tech-lab/privacyflash-pro"></a>
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro/releases"><img alt="GitHub Release Date" src="https://img.shields.io/github/release-date/privacy-tech-lab/privacyflash-pro"></a>
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro/commits/main"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/privacy-tech-lab/privacyflash-pro"></a>
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/privacy-tech-lab/privacyflash-pro"></a>
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro/issues?q=is%3Aissue+is%3Aclosed"><img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed-raw/privacy-tech-lab/privacyflash-pro"></a>
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro/blob/main/LICENSE.md"><img alt="GitHub" src="https://img.shields.io/github/license/privacy-tech-lab/privacyflash-pro"></a>
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro/watchers"><img alt="GitHub watchers" src="https://img.shields.io/github/watchers/privacy-tech-lab/privacyflash-pro?style=social"></a>
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/privacy-tech-lab/privacyflash-pro?style=social"></a>
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro/network/members"><img alt="GitHub forks" src="https://img.shields.io/github/forks/privacy-tech-lab/privacyflash-pro?style=social"></a>
</p>
  
<br>

<p align="center">
  <a href="https://github.com/privacy-tech-lab/privacyflash-pro"><img src="./logo.svg" width="200px" height="200px" title="PrivacyFlash Pro logo"></a>
<p>

# PrivacyFlash Pro

To easily run PrivacyFlash Pro get the [latest packaged release](https://github.com/privacy-tech-lab/privacyflash-pro/releases).

Learn more about PrivacyFlash Pro in our [research paper](https://sebastianzimmeck.de/zimmeckEtAlPrivacyFlashPro2021.pdf).

PrivacyFlash Pro analyzes the code of iOS Swift apps and their libraries to generate privacy policies. With PrivacyFlash Pro we intend to help developers creating privacy policies for their apps and make the apps' privacy practices more transparent to users.

PrivacyFlash Pro covers provisions of the following laws:

- California Consumer Privacy Act (CCPA)
- California Online Privacy Protection Act (CalOPPA)
- Children's Online Privacy Protection (COPPA)
- General Data Protection Regulation (GDPR).

PrivacyFlash Pro is an academic research project. It was designed and developed by David Baraka (@davebaraka), Rafael Goldstein (@rgoldstein01), Sarah Jin (@sj-in), and Sebastian Zimmeck (@SebastianZimmeck) at the [privacy-tech-lab](https://privacytechlab.org/), [Wesleyan University](https://www.wesleyan.edu/). Kuba Alicki (@kalicki1) wrote the unit tests.

## Installing, Running, and Packaging PrivacyFlash Pro

You can install and run PrivacyFlash Pro from the packaged release or from the source files. You can also create a new packaged version of PrivacyFlash Pro.

### Installing from the Packaged Release

You will find the releases of PrivacyFlash Pro in the [releases section](https://github.com/privacy-tech-lab/privacyflash-pro/releases) (you may need to allow downloading the zip file in your browser settings, e.g., under Google Chrome's Downloads settings). Unzip the downloaded `privacyflash-pro.zip` and then click the PrivacyFlash Pro icon. You will have to agree to open PrivacyFlash Pro in your [macOS security settings](https://support.apple.com/en-us/HT202491). After a few seconds PrivacyFlash Pro should run in your default browser.

### Installing from the Source Files

1. Ensure that Python 3 is installed. PrivacyFlash Pro does not support Python 2. You can check in your terminal if you have Python 3 installed by running `python3`. You can get Python 3 on the official [Python website](https://www.python.org/downloads/).

2. Clone this repo by `cd`ing into the directory in which you want to store PrivacyFlash Pro and run `git clone git@github.com:privacy-tech-lab/privacyflash-pro.git`.

3. **Strongly Recommended**: Create and activate a [Python virtual environment](https://docs.python.org/3/library/venv.html#module-venv), `pfp-venv`, with `python3 -m venv pfp-venv`, and run it with `source pfp-venv/bin/activate` (assuming that you are using the default shell). Ensure that your virtual environment is outside of the `privacyflash-pro` directory to avoid git tracking.

4. `cd` into the `privacyflash-pro/policygenerator` directory. If you are using a Python virtual environment, run `pip3 install -r requirements.txt`. Otherwise, run `pip3 install --user -r requirements.txt`. If you get an error, run `pip3 install -r requirements.txt`. If you still get an error, run `sudo pip3 install -r requirements.txt`.

5. Run PrivacyFlash Pro with `python3 app.py`.

### Running

Using PrivacyFlash Pro's directory navigation, navigate to your iOS Swift project directory (the directory that contains your `.xcodeproj`), and click OK to start the analysis. Depending on the size of your codebase, the analysis results should be available within a minute. You will now be guided through a wizard. Once you have finalized the wizard questionnaire, you can export the privacy policy for your app.

You can test PrivacyFlash Pro on the projects in the [iOS-sample-projects](https://github.com/privacy-tech-lab/privacyflash-pro/tree/master/iOS-sample-projects). For example, you can analyze the AdColony sample project. Start PrivacyFlash Pro, in your browser navigate to the AdColony directory using PrivacyFlash Pro's directory navigation, and click OK to start the analysis. The analysis results should be available within a minute.

If your browser does not connect to the localhost, try disabling any antivirus software (e.g., [eset](https://www.eset.com/us/)) that you may be running.

PrivacyFlash Pro analyzes iOS app source code in Swift and its integrated third party libraries in Swift and Objective-C. The library analysis works for uncompiled and compiled libraries. PrivacyFlash Pro does not analyze iOS app source code in Objective-C.

### Packaging

You can also create a new packaged version of PrivacyFlash Pro. After successfully installing and running from [source]((https://github.com/privacy-tech-lab/privacyflash-pro#installing-from-the-source-files)), run `python3 package.py` within the `privacyflash-pro/policygenerator` directory. A zipped file containing a macOS distributable app will be generated in the `privacyflash-pro/policygenerator/dist` directory.

**Note**: If you are using a Python virtual environment, [as we recommend](https://github.com/privacy-tech-lab/privacyflash-pro#installing-from-the-source-files), run `python3 package.py` after activating the environment.

**Note**: If packaging for public distribution, remember to update the version number in `privacyflash-pro/policygenerator/interface/index.html` and `privacyflash-pro/policygenerator/package.py`. Also, please identify to your users that you packaged the version and that the version is not official.

If you experience errors packaging or running the packaged app, try updating the dependency `pyinstaller` by running `pip3 install pyinstaller -U` and then run the packaging script again.

## Demo Video

[![Watch the Demo](https://privacytechlab.org/static/images/PrivacyFlash_Pro_Movie.png)](https://privacytechlab.org/static/images/PrivacyFlash_Pro_Movie.mp4)

## Get Involved

PrivacyFlash Pro is from the people for the people. Everyone can contribute. In particular, feel free to open a pull request to add additional privacy practices and third party libraries. If you have other ideas or feedback, let us know. We are looking forward to hear from you!

### Privacy Practice Analysis

The specification for the privacy practice analysis is contained in `policygenerator/spec/privacy_practices.yaml`. PrivacyFlash Pro flags a privacy practice in an app or a library if it identifies the use of a relevant API, i.e., all of the following are present for the app or a library:

- PLIST value (e.g., `NSLocationWhenInUseUsageDescription`)
- FRAMEWORK import (e.g., `CoreLocation`)
- CLASS instantiation (e.g., `CLLocationManager`)
- AUTHORIZATION METHOD call (e.g., `requestWhenInUseAuthorization`)

For the analysis of the app code, the AUTHORIZATION METHOD can also be in a library as long as there is ADDITIONAL EVIDENCE (e.g., `startUpdatingLocation`) in the app code. Vice versa, for the analysis of a library, the AUTHORIZATION METHOD can also be in the app code as long as there is ADDITIONAL EVIDENCE (e.g., `startUpdatingLocation`) in the library.

Also, for some practices, for example, Health, an ENTITLEMENT (e.g., com.apple.developer.healthkit) is required. For more details see the [privacy_practices.yaml](https://github.com/privacy-tech-lab/privacyflash-pro/blob/master/policygenerator/spec/privacy_practices.yaml).

### Third Party Library Analysis

PrivacyFlash Pro identifies any library integrated in the analyzed app. The specification for the third party library analysis is contained in `policygenerator/spec/third_parties.yaml`. PrivacyFlash Pro is using this specification for determining the purpose of a library. A library name is given by its name on [CocoaPods](https://cocoapods.org/). For example, `AdColony` has the purpose `Advertising`. PrivacyFlash Pro currently identifies the purposes of 300 libraries using the following purpose categories:
- `Authentication`
- `Advertising`
- `Analytics`
- `Developer Support`
- `Payment Processing`
- `Social Network Integration`

Note that even if a library is is not contained in `policygenerator/spec/third_parties.yaml`, PrivacyFlash Pro still analyzes its files contained in a project. However, you will have to enter the purpose of the library manually in the privacy policy you are generating.

## Testing

Our unit tests for PrivacyFlash Pro have been built with the Python unittest framework. In order to run the built-in tests for PrivacyFlash Pro, use `python3 -m unittest` from within the root directory of your local copy of this repo.

## Files and Directories in this Repo

- The latest release of PrivacyFlash Pro is contained in the [releases section](https://github.com/privacy-tech-lab/privacyflash-pro/releases).
- `iOS-sample-projects`: Sample projects for PrivacyFlash Pro to analyze and test.
- `policygenerator/`: Contains the code of PrivacyFlash Pro.
- `policygenerator/app.py`: Main entry point for generating a privacy policy.
- `policygenerator/package.py`: Script to create a distributable package of PrivacyFlash Pro.
- `policygenerator/interface`: Contains all code related to the user interface for displaying the policy to the user.
- `policygenerator/spec`: Third party and privacy practices specifications.
- `policygenerator/spec/privacy_practices.yaml`: Contains the specification for detecting privacy practice usage.
- `policygenerator/spec/third_parties.yaml`: Contains the specification for ad networks and other third party libraries.
- `policygenerator/src/analysis.py`: The module for analyzing the project looks for instances of privacy practice usage.
- `policygenerator/src/configure_data.py`: Bridge between the Python code and the Javascript code for the UI; configures the results from the generator engine to proper json files/objects to be used for the UI.
- `policygenerator/src/constants.py`: The constants class is used internally to identify a privacy practice by an index value.
- `policygenerator/src/evidence.py`: The evidence class is used for keeping track of privacy practice usages in an app's files.
- `policygenerator/src/privacy_practices.py`: Loads data from the app project to be analyzed.
- `policygenerator/requirements.txt`: Dependencies of PrivacyFlash Pro.

## Third Party Libraries

PrivacyFlash Pro uses the following third party libraries. We thank the developers.

- [Animate.css](https://github.com/daneden/animate.css)
- [Bootstrap](https://getbootstrap.com)
- [Dark Mode Switch](https://github.com/coliff/dark-mode-switch)
- [pywebview](https://github.com/r0x0r/pywebview)
- [Google Fonts Quicksand](https://fonts.google.com/specimen/Quicksand)
- [jQuery](https://github.com/jquery/jquery)
- [PyYAML](https://github.com/yaml/pyyaml)
- [Six](https://github.com/benjaminp/six)
- [Smooth Scroll](https://github.com/iamdustan/smoothscroll)
- [smooth-scroll-into-view-if-needed](https://www.npmjs.com/package/smooth-scroll-into-view-if-needed)

<p align="center">
  <a href="https://www.privacytechlab.org/"><img src="https://github.com/privacy-tech-lab/privacyflash-pro/blob/main/plt_logo.png" width="200px" height="200px" title="privacy-tech-lab logo"></a>
<p>
