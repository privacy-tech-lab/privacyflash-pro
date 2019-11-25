#import "AdColonyTypes.h"
#import "AdColonyOptions.h"
#import <Foundation/Foundation.h>

@class AdColonyUserMetadata;

NS_ASSUME_NONNULL_BEGIN

/**
 AdColonyAppOptions objects are used to set configurable aspects of SDK state and behavior, such as a custom user identifier.
 The common usage scenario is to instantiate and configure one of these objects and then pass it to `configureWithAppID:zoneIDs:options:completion:`.
 Set the properties below to configure a pre-defined option. Note that you can also pass arbitrary options using the AdColonyOptions API.
 Also note that you can also reset the current options object the SDK is using by passing an updated object to `setAppOptions:`.
 @see AdColonyOptions
 @see [AdColony setAppOptions:]
 */
@interface AdColonyAppOptions : AdColonyOptions

/** @name Properties */

/**
 @abstract Disables AdColony logging.
 @discussion AdColony logging is enabled by default.
 Set this property before calling `configureWithAppID:zoneIDs:options:completion:` with a corresponding value of `YES` to disable AdColony logging.
 */
@property (nonatomic) BOOL disableLogging;

/**
 @abstract Sets a custom identifier for the current user.
 @discussion Set this property to configure a custom identifier for the current user.
 Corresponding value must be 128 characters or less.
 */
@property (nonatomic, strong, nullable) NSString *userID;

/**
 @abstract Sets the desired ad orientation.
 @discussion Set this property to configure the desired orientation for your ads.
 @see ADCOrientation
 */
@property (nonatomic) AdColonyOrientation adOrientation;
@end

NS_ASSUME_NONNULL_END
