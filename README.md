![PrivacyFlash Pro logo](./logo.svg)
<img src="./logo.svg">

# PrivacyFlash Pro

PrivacyFlash Pro analyzes the code of iOS Swift projects to generate a privacy policy. The goals of PrivacyFlash Pro are to:
- Assist app developers in understanding the privacy practices used by their apps and third party libraries
- Create a privacy policy covering those practices to notify users and help achieving privacy compliance
- Establish standardized privacy policies in the app ecosystem

PrivacyFlash Pro covers provisions of the California Consumer Privacy Act (CCPA), California Online Privacy Protection Act (CalOPPA), Children's Online Privacy Protection (COPPA), and General Data Protection Regulation (GDPR).

PrivacyFlash Pro was written by @davebaraka, @rgoldstein01, @sj-in, and @SebastianZimmeck as an academic project of the [privacy-tech-lab](https://privacy-tech-lab.github.io/) at [Wesleyan University](https://www.wesleyan.edu/).

## Installing and Running PrivacyFlash Pro

Download `privacyflash-pro.zip` and unzip it. Open the unzipped folder and then click the PrivacyFlash Pro icon. You will have to agree to open PrivacyFlash Pro in your macOS security settings. After a few seconds PrivacyFlash Pro should run in your default browser. Using PrivacyFlash Pro's directory navigation, navigate to your iOS Swift project directory (the directory that contains your `.xcodeproj` and other project directories and files), and click OK to start the analysis. Depending on the size of your codebase, the analysis results should be available within a minute. You will now be guided through a wizard. Once you have finalized the wizard questionnaire, you can export the privacy policy for your app.

You can test PrivacyFlash Pro on the projects in the [iOS-sample-projects](https://github.com/privacy-tech-lab/privacyflash-pro/tree/master/iOS-sample-projects). For example, you can analyze the AdColony sample project. Start PrivacyFlash Pro, navigate to the AdColony directory using PrivacyFlash Pro's directory navigation, and click OK to start the analysis. The analysis results should be available within a minute.

PrivacyFlash Pro analyzes iOS app source code in Swift and third party libraries in Swift and Objective-C. The library analysis works for uncompiled and compiled libraries. PrivacyFlash Pro does not analyze iOS app source code in Objective-C.

PrivacyFlash Pro (1.0.1) was tested to run on macOS Catalina (10.15.2) and Mojave (10.14.6). The following browsers (and versions) are supported: Google Chrome (79.0.3945.88 - 64-bit), Safari (13.0.4 - 14608.4.9.1.4), and Firefox (71.0 - 64-bit).

## Demo Video

[![Watch the Demo](https://privacy-tech-lab.github.io/images/PrivacyFlash_Pro_Movie.png)](https://privacy-tech-lab.github.io/images/PrivacyFlash_Pro_Movie.mp4)

## Get Involved

PrivacyFlash Pro is from the people for the people. Everyone can contribute. In particular, feel free to open a pull request to add additional privacy practices and third party libraries. If you have other ideas or feedback, let us know your thoughts or open an issue. We are looking forward to hear from you.

### Privacy Practice Analysis

The specification for the privacy practice analysis is contained in `spec/privacy_practices.yaml`. PrivacyFlash Pro flags a privacy practice in an app or a third party library if it identifies the use of a relevant API, i.e., all of the following are present for the app or a library:
- PLIST value (e.g., `NSLocationWhenInUseUsageDescription`)
- FRAMEWORK import (e.g., `CoreLocation`)
- CLASS instantiation (e.g., `CLLocationManager`)
- AUTHORIZATION METHOD call (e.g., `requestWhenInUseAuthorization`)

### Third Party Library Analysis

The specification for the third party library analysis is contained in `spec/third_parties.yaml`. PrivacyFlash Pro is using this specification for determining the purpose of a library. A library name is given by its name on [CocoaPods](https://cocoapods.org/). For example, `AdColony` has the purpose `Advertising`. PrivacyFlash Pro currently identifies the purposes of 300 libraries with the following purposes:
- `Authentication`
- `Advertising`
- `Analytics`
- `Developer Support`
- `Payment Processing`
- `Social Network Integration`

Note that even if a library is is not contained in `spec/third_parties.yaml`, PrivacyFlash Pro still analyzes its files contained in a project. However, you will have to enter the purpose of the library manually in the privacy policy you are generating.

## Files and Directories in this Repo

- `iOS-sample-projects`: Sample projects for PrivacyFlash Pro to analyze and test.
- `privacyflash-pro.zip`: The PrivacyFlash Pro app.
- `spec`: Third party and privacy practices specifications.
- `spec/third_parties.yaml`: Specification for ad networks and other third parties.
- `spec/privacy_practices.yaml`: Specification for detecting privacy practice usage.

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
