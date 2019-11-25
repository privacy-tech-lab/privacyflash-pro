#import "AdColonyTypes.h"
#import <Foundation/Foundation.h>

@class UIViewController;

NS_ASSUME_NONNULL_BEGIN

@interface AdColonyInterstitial : NSObject

/** @name Properties */

/**
 @abstract Represents the unique zone identifier string from which the interstitial was requested.
 @discussion AdColony zone IDs can be created at the [Control Panel](http://clients.adcolony.com).
 */
@property (nonatomic, readonly) NSString *zoneID;

/**
 @abstract Indicates whether or not the interstitial has been played or if it has met its expiration time.
 @discussion AdColony interstitials become expired as soon as the ad launches or just before they have met their expiration time.
 */
@property (nonatomic, readonly) BOOL expired;

/**
 @abstract Indicates whether or not the interstitial has audio enabled.
 @discussion Leverage this property to determine if the application's audio should be paused while the ad is playing.
 */
@property (nonatomic, readonly) BOOL audioEnabled;

/**
 @abstract Indicates whether or not the interstitial is configured to trigger IAPs.
 @discussion Leverage this property to determine if the interstitial is configured to trigger IAPs.
 */
@property (nonatomic, readonly) BOOL iapEnabled;


/** @name Ad Event Handlers */

/**
 @abstract Sets the block of code to be executed when the interstitial is displayed to the user.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param open The block of code to be executed.
 */
- (void)setOpen:(nullable void (^)(void))open;

/**
 @abstract Sets the block of code to be executed when the interstitial is removed from the view hierarchy.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param close The block of code to be executed.
 */
- (void)setClose:(nullable void (^)(void))close;

/**
 @abstract Sets the block of code to be executed when the interstitial begins playing audio.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param audioStart The block of code to be executed.
 */
- (void)setAudioStart:(nullable void (^)(void))audioStart;

/**
 @abstract Sets the block of code to be executed when the interstitial stops playing audio.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param audioStop The block of code to be executed.
 */
- (void)setAudioStop:(nullable void (^)(void))audioStop;

/**
 @abstract Sets the block of code to be executed 5 seconds before an interstitial expires and is no longer valid for playback.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param expire The block of code to be executed.
 */
- (void)setExpire:(nullable void (^)(void))expire;

/**
 @abstract Sets the block of code to be executed when an action causes the user to leave the application.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param leftApplication The block of code to be executed.
 */
- (void)setLeftApplication:(nullable void (^)(void))leftApplication;

/**
 @abstract Sets the block of code to be executed when the user taps on the interstitial ad, causing an action to be taken.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param click The block of code to be executed.
 */
- (void)setClick:(nullable void (^)(void))click;


/** @name Videos For Purchase (V4P) */

/**
 @abstract Sets the block of code to be executed when the ad triggers an IAP opportunity.
 @discussion Note that the associated code block will be dispatched on the main thread.
 @param iapOpportunity The block of code to be executed.
 */
- (void)setIapOpportunity:(nullable void (^)(NSString *iapProductID, AdColonyIAPEngagement engagement))iapOpportunity;


/** @name Ad Playback */

/**
 @abstract Triggers a fullscreen ad experience.
 @param viewController The view controller on which the interstitial will display itself.
 @return Whether the ad was able to start playback.
 */
- (BOOL)showWithPresentingViewController:(UIViewController *)viewController;

/**
 @abstract Cancels the interstitial and returns control back to the application.
 @discussion Call this method to cancel the interstitial.
 Note that canceling interstitials before they finish will diminish publisher revenue.
 */
- (void)cancel;
@end

NS_ASSUME_NONNULL_END
