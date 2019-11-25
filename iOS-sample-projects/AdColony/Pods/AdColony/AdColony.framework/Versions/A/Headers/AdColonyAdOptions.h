#import "AdColonyOptions.h"
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 AdColonyAdOptions objects are used to set configurable aspects of an ad session, such as third-party network settings, user metadata, etc.
 Set the properties below to configure a pre-defined ad option. Note that you can also set arbitrary options using the AdColonyOptions API.
 */
@interface AdColonyAdOptions : AdColonyOptions

/** @name Properties */

/**
 @abstract Enables reward dialogs to be shown before an advertisement.
 @discussion These popups are disabled by default.
 Set this property with a corresponding value of `YES` to enable.
 */
@property (nonatomic) BOOL showPrePopup;

/**
 @abstract Enables reward dialogs to be shown after an advertisement.
 @discussion These popups are disabled by default.
 Set this property with a corresponding value of `YES` to enable.
 */
@property (nonatomic) BOOL showPostPopup;
@end

NS_ASSUME_NONNULL_END
