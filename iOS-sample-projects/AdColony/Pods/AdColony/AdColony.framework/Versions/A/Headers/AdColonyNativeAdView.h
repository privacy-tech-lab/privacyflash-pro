#import "AdColonyTypes.h"
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 AdColonyNativeAdViews are used to display non-fullscreen AdColony ads in a fashion that matches the look-and-feel of your application;
 it contains the video and engagement components of the native ad and manages the display and playback of the video.
 Event handler block properties are provided so your app can react to ad-level events such as a open or close.
 The object also exposes additional information about the advertisement that is intended to be displayed alongside the video.
 The native ad may include an engagement button which is fully customizable by the publisher.
 Instances of this class should not be initialized directly; instead, use the AdColonyNativeAdView passed back the success handler in
 `[AdColony requestNativeAdViewInZone:size:options:viewController:success:failure:]`.
 */
@interface AdColonyNativeAdView : UIView

/** @name Zone */

/**
 @abstract Represents the unique zone identifier string from which the AdColonyNativeAdView was requested.
 @discussion AdColony zone IDs can be created at the [Control Panel](http://clients.adcolony.com).
 */
@property (nonatomic, readonly) NSString *zoneID;


/** @name Ad Lifecycle */

/**
 @abstract Indicates whether or not the AdColonyNativeAdView has begun displaying its video content in response to being displayed on screen.
 @discussion This property will be set to `YES` if the in-feed video has started playback.
 */
@property (nonatomic, readonly) BOOL started;

/**
 @abstract Indicates whether or not the AdColonyNativeAdView has finished displaying its video content in response to being displayed on screen.
 @discussion This property will be set to `YES` if the in-feed video has completed playback.
 */
@property (nonatomic, readonly) BOOL finished;

/**
 @abstract Indicates whether or not the AdColonyNativeAdView has been expanded to fullscreen mode.
 @discussion This property will be set to `YES` if the in-feed video has been expanded to fullscreen.
 */
@property (nonatomic, readonly) BOOL opened;


/** @name Creative Content and User Interface */

/**
 @abstract Represents the name of the advertiser for this ad. Approximately 25 characters.
 @discussion AdColony requires this to be displayed alongside the AdColonyNativeAdView.
 */
@property (nonatomic, readonly) NSString *advertiserName;

/**
 @abstract Represents the advertiser's icon for this ad (may be `nil`).
 @discussion Typically 200x200 pixels for Retina display at up to 100x100 screen points. Display of this image is optional.
 */
@property (nonatomic, readonly, nullable) UIImage *advertiserIcon;

/**
 @abstract Represents a short title for this ad.
 @discussion Approximately 25 characters. Display of this string is optional.
 */
@property (nonatomic, readonly) NSString *adTitle;

/**
 @abstract Represents a mid-length description of this ad.
 @discussion Up to approximately 90 characters. Display of this string is optional.
 */
@property (nonatomic, readonly) NSString *adDescription;

/**
 @abstract Represents the engagement button for this ad (may be `nil`). This is automatically displayed beneath the video component.
 @discussion Leverage this property to access the UIButton and customize anything about it except its title text and tap action.
 */
@property (nonatomic, strong, nullable) UIButton *engagementButton;


/** @name Audio */

/**
 @abstract Represents the volume level of the video component of the ad. Defaults to 0.05f.
 @discussion Leverage this property to set the volume of the native ad.
 */
@property (nonatomic) float volume;

/**
 @abstract Indicates whether or not the video component of the ad is muted. Defaults to NO.
 @discussion Defaults to `NO`. Leverage this property to determine if the native ad is muted or not.
 */
@property (nonatomic) BOOL muted;


/** @name IAP */

/**
 @abstract Represents the unique zone identifier string from which the AdColonyNativeAdView was requested.
 @discussion AdColony zone IDs can be created at the [Control Panel](http://clients.adcolony.com).
 */
@property (nonatomic, readonly) BOOL iapEnabled;


/** @name Event Handlers */

/**
 @abstract Notifies your app that a native ad has begun displaying its video content in response to being displayed on screen.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param start The block of code to be executed.
 */
- (void)setStart:(nullable void (^)(void))start;

/**
 @abstract Notifies your app that a native ad has finished displaying its video content in response to being displayed on screen.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param finish The block of code to be executed.
 */
- (void)setFinish:(nullable void (^)(void))finish;

/**
 @abstract Notifies your app that a native ad has been expanded to fullscreen mode.
 @discussion Within the handler, apps should implement app-specific code such as pausing app music if appropriate.
 Note that the associated code block will be dispatched on the main thread.
 @param open The block of code to be executed.
 */
- (void)setOpen:(nullable void (^)(void))open;

/**
 @abstract Notifies your app that a native ad finished displaying its video content.
 @discussion Within the handler, apps should implement app-specific code such as resuming app music if appropriate.
 Note that the associated code block will be dispatched on the main thread.
 @param close The block of code to be executed.
 */
- (void)setClose:(void (^)(void))close;

/**
 @abstract Sets the block of code to be executed when the ad triggers an IAP opportunity.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param iapOpportunity The block of code to be executed.
 */
- (void)setIapOpportunity:(nullable void (^)(NSString *iapProductID, AdColonyIAPEngagement engagement))iapOpportunity;

/**
 @abstract Notifies your app that a native ad was muted or unmuted by a user.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param mute The block of code to be executed.
 */
- (void)setMute:(void (^)(BOOL muted))mute;

/**
 @abstract Notifies your app that a user has engaged with the native ad via an in-video engagement mechanism.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param engagement The block of code to be executed.
 */
- (void)setEngagement:(void (^)(BOOL expanded))engagement;

/**
 @abstract Sets the block of code to be executed when an action causes the user to leave the application.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param leftApplication The block of code to be executed.
 */
- (void)setLeftApplication:(nullable void (^)(void))leftApplication;

/**
 @abstract Sets the block of code to be executed when the user taps on the ad, causing an action to be taken.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param click The block of code to be executed.
 */
- (void)setClick:(nullable void (^)(void))click;


/** @name Playback */

/**
 @abstract Pauses the video component of the native ad if it is currently playing.
 @discussion This should be used when the native ad goes off-screen temporarily: for example, when it is contained in a UITableViewCell that has been scrolled off-screen;
 or when the ad is contained in a UIViewController and that view controller has called the method `viewWillDisappear`.
 Note that any use of this method must be paired with a corresponding call to `resume`.
 */
- (void)pause;

/**
 @abstract Resumes the video component of the native ad if it has been paused.
 @discussion This should be used when a native ad that was off-screen temporarily has come back on-screen; 
 for example, when the ad is contained in a UIViewController and that view controller has called the method `viewWillAppear`.
 Note that this method must be used to undo a previous corresponding call to `pause`.
 */
- (void)resume;

/**
 @abstract Indicates that the AdColonyNativeAdView has been removed from the view hierarchy and should be destroyed.
 @discussion The AdColony SDK maintains internal resources when the ad is being displayed.
 When this method is called, all internal resources are destroyed and the associated memory is freed.
 */
- (void)destroy;
@end

NS_ASSUME_NONNULL_END
