<p align="center">
  <img src="./logo.svg" width="200px" height="200px" title="PrivacyFlash Pro logo">
<p>

Participate in our [user study](https://forms.gle/r8SHNYQJRqX5rSR47)!

# PrivacyFlash Pro

PrivacyFlash Pro analyzes the code of iOS Swift projects to generate a privacy policy. The goals of PrivacyFlash Pro are:
- Assisting app developers in understanding the privacy practices used by their apps and third party libraries
- Creating a privacy policy covering those practices to notify users and help developers achieving privacy compliance
- Establishing standardized privacy policies in the iOS app ecosystem

PrivacyFlash Pro covers provisions of the following laws:
- California Consumer Privacy Act (CCPA)
- California Online Privacy Protection Act (CalOPPA)
- Children's Online Privacy Protection (COPPA)
- General Data Protection Regulation (GDPR).

PrivacyFlash Pro was written by David Baraka (@davebaraka), Rafael Goldstein (@rgoldstein01), Sarah Jin (@sj-in), and Sebastian Zimmeck (@SebastianZimmeck) as an academic project of the [privacy-tech-lab](https://privacy-tech-lab.github.io/) at [Wesleyan University](https://www.wesleyan.edu/).

## Installing and Running PrivacyFlash Pro

You can install and run PrivacyFlash Pro from the packaged release or from the source files.

### Installing from the Packaged Release

You will find the releases of PrivacyFlash Pro in the [releases section](https://github.com/privacy-tech-lab/privacyflash-pro/releases). Download the latest one [**here**](https://github.com/privacy-tech-lab/privacyflash-pro/releases/download/v1.0.1/privacyflash-pro.zip) (you may need to allow downloading the zip file in your browser settings, e.g., under Google Chrome's Downloads settings). Unzip the file `privacyflash-pro.zip` and then click the PrivacyFlash Pro icon. You will have to agree to open PrivacyFlash Pro in your [macOS security settings](https://support.apple.com/en-us/HT202491). After a few seconds PrivacyFlash Pro should run in your default browser.

### Installing from the Source Files

1. Ensure that Python 3 is installed. PrivacyFlash Pro does not support Python 2. You can check in your terminal if you have Python 3 installed by running `python3`. You can get Python 3 on the official [Python website](https://www.python.org/downloads/).

2. Clone this repo by `cd`ing into the directory in which you want to store PrivacyFlash Pro and run `git clone git@github.com:privacy-tech-lab/privacyflash-pro.git`.

3. **Optional** Create and activate a [Python virtual environment](https://docs.python.org/3/library/venv.html#module-venv). Ensure that your Python virtual environment is outside of the `privacyflash-pro` directory to avoid git tracking.

4. `cd` into the `privacyflash-pro/policygenerator` directory. If you are using a Python virtual environment, run `pip3 install -r requirements.txt`. Otherwise, run `pip3 install --user -r requirements.txt`. If you continue to get errors, run `pip3 install -r requirements.txt`. If you still get errors, run `sudo pip3 install -r requirements.txt`.

5. Run PrivacyFlash Pro with `python3 app.py`.

### Running

Using PrivacyFlash Pro's directory navigation, navigate to your iOS Swift project directory (the directory that contains your `.xcodeproj`), and click OK to start the analysis. Depending on the size of your codebase, the analysis results should be available within a minute. You will now be guided through a wizard. Once you have finalized the wizard questionnaire, you can export the privacy policy for your app.

You can test PrivacyFlash Pro on the projects in the [iOS-sample-projects](https://github.com/privacy-tech-lab/privacyflash-pro/tree/master/iOS-sample-projects). For example, you can analyze the AdColony sample project. Start PrivacyFlash Pro, navigate to the AdColony directory using PrivacyFlash Pro's directory navigation, and click OK to start the analysis. The analysis results should be available within a minute.

PrivacyFlash Pro analyzes iOS app source code in Swift and third party libraries in Swift and Objective-C. The library analysis works for uncompiled and compiled libraries. PrivacyFlash Pro does not analyze iOS app source code in Objective-C.

PrivacyFlash Pro (1.0.1) was tested to run on macOS Catalina (10.15.2) and Mojave (10.14.6). The following browsers (and versions) are supported: Google Chrome (79.0.3945.88 - 64-bit), Safari (13.0.4 - 14608.4.9.1.4), and Firefox (71.0 - 64-bit).

## Demo Video

[![Watch the Demo](https://privacy-tech-lab.github.io/images/PrivacyFlash_Pro_Movie.png)](https://privacy-tech-lab.github.io/images/PrivacyFlash_Pro_Movie.mp4)

## Get Involved

PrivacyFlash Pro is from the people for the people. Everyone can contribute. In particular, feel free to open a pull request to add additional privacy practices and third party libraries. If you have other ideas or feedback, let us know your thoughts or open an issue. We are looking forward to hear from you.

### Privacy Practice Analysis

The specification for the privacy practice analysis is contained in `policygenerator/spec/privacy_practices.yaml`. PrivacyFlash Pro flags a privacy practice in an app or a third party library if it identifies the use of a relevant API, i.e., all of the following are present for the app or a library:
- PLIST value (e.g., `NSLocationWhenInUseUsageDescription`)
- FRAMEWORK import (e.g., `CoreLocation`)
- CLASS instantiation (e.g., `CLLocationManager`)
- AUTHORIZATION METHOD call (e.g., `requestWhenInUseAuthorization`)

For the analysis of the app code, the AUTHORIZATION METHOD can also be in a library as long as there is ADDITIONAL EVIDENCE (e.g., `startUpdatingLocation`) in the app code. Vice versa, for the analysis of a library, the AUTHORIZATION METHOD can also be in the app code as long as there is ADDITIONAL EVIDENCE (e.g., `startUpdatingLocation`) in the library.

Also, for some practices, for example, Health, an ENTITLEMENT (e.g., com.apple.developer.healthkit) is required. For more details see the [privacy_practices.yaml](https://github.com/privacy-tech-lab/privacyflash-pro/blob/master/policygenerator/spec/privacy_practices.yaml).

### Third Party Library Analysis

The specification for the third party library analysis is contained in `policygenerator/spec/third_parties.yaml`. PrivacyFlash Pro is using this specification for determining the purpose of a library. A library name is given by its name on [CocoaPods](https://cocoapods.org/). For example, `AdColony` has the purpose `Advertising`. PrivacyFlash Pro currently classifies 300 libraries using the following purposes:
- `Authentication`
- `Advertising`
- `Analytics`
- `Developer Support`
- `Payment Processing`
- `Social Network Integration`

Note that even if a library is is not contained in `policygenerator/spec/third_parties.yaml`, PrivacyFlash Pro still analyzes its files contained in a project. However, you will have to enter the purpose of the library manually in the privacy policy you are generating.

## Files and Directories in this Repo

- The latest release of PrivacyFlash Pro is contained in the [releases section](https://github.com/privacy-tech-lab/privacyflash-pro/releases).
- `iOS-sample-projects`: Sample projects for PrivacyFlash Pro to analyze and test.
- `policygenerator/`: Contains the code of PrivacyFlash Pro.
- `policygenerator/interface`: Contains all code related to the user interface for displaying the policy to the user.
- `policygenerator/spec`: Third party and privacy practices specifications.
- `policygenerator/spec/third_parties.yaml`: Contains the specification for ad networks and other third parties.
- `policygenerator/spec/privacy_practices.yaml`: Contains the specification for detecting privacy practice usage.
- `policygenerator/analysis.py`: The module for analyzing the project looks for instances of privacy practice usage.
- `policygenerator/app.py`: Main entry point for generating a privacy policy; parses the command line arguments.
- `policygenerator/configure_data.py`: Bridge between the Python code and the Javascript code for the UI; configures the results from the generator engine to proper json files/objects to be used for the UI.
- `policygenerator/constants.py`: The constants class used internally to identify a privacy practice by an index value.
- `policygenerator/evidence.py`: The evidence class is used for keeping track of privacy practice usages in an app's files.
- `policygenerator/privacy_practices.py`: Loads data from the app project to be analyzed.
- `policygenerator/requirements.txt`: Dependencies of PrivacyFlash Pro.

## Third Party Libraries

PrivacyFlash Pro uses the following third party libraries. We thank the developers.

- [Animate.css](https://github.com/daneden/animate.css)
- [Bootstrap](https://getbootstrap.com)
- [Dark Mode Switch](https://github.com/coliff/dark-mode-switch)
- [Eel](https://github.com/samuelhwilliams/Eel)
- [Google Fonts Quicksand](https://fonts.google.com/specimen/Quicksand)
- [jQuery](https://github.com/jquery/jquery)
- [PyYAML](https://github.com/yaml/pyyaml)
- [Six](https://github.com/benjaminp/six)
- [Smooth Scroll](https://github.com/iamdustan/smoothscroll)
- [smooth-scroll-into-view-if-needed](https://www.npmjs.com/package/smooth-scroll-into-view-if-needed)

<p align="center">
  <img src="https://github.com/privacy-tech-lab/privacy-tech-lab.github.io/blob/master/images/plt_logo.png" width="200px" height="200px" title="privacy-tech-lab logo">
<p>
