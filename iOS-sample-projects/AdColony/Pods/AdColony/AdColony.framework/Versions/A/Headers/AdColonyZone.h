#import "AdColonyTypes.h"
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 AdColonyZone objects aggregate informative data about an AdColony zone such as its unique identifier, its `ADCOLONY_ZONE_TYPE`, etc.
 AdColonyZones also provide a block-based handler for zone-level reward events.
 Note that you should never instantiate one of these objects directly. You only need to use them when they are passed to you.
 */
@interface AdColonyZone : NSObject

/** @name Zone */

/**
 @abstract Represents the given zone's unique string identifier.
 @discussion AdColony zone IDs can be created at the [Control Panel](http://clients.adcolony.com).
 */
@property (nonatomic, readonly) NSString *identifier;

/**
 @abstract Represents the zone type - interstitial, banner, or native.
 @discussion You can set the type for your zones at the [Control Panel](http://clients.adcolony.com).
 @see AdColonyZoneType
 */
@property (nonatomic, readonly) AdColonyZoneType type;

/**
 @abstract Indicates whether or not the zone is enabled.
 @discussion Sending invalid zone id strings to `configureWithAppID:zoneIDs:options:completion:` will cause this value to be `NO`.
 */
@property (nonatomic, readonly) BOOL enabled;


/** @name Rewards */

/**
 @abstract Indicates whether or not the zone is configured for rewards.
 @discussion You can configure rewards in your zones at the [Control Panel](http://clients.adcolony.com).
 Sending invalid zone id strings to `configureWithAppID:zoneIDs:options:completion:` will cause this value to be `NO`.
 */
@property (nonatomic, readonly) BOOL rewarded;

/**
 @abstract Represents the number of completed ad views required to receive a reward for the given zone.
 @discussion This value will be 0 if the given zone is not configured for rewards.
 */
@property (nonatomic, readonly) NSUInteger viewsPerReward;

/**
 @abstract Represents the number of ads that must be watched before a reward is given.
 @discussion This value will be 0 if the given zone is not configured for rewards.
 */
@property (nonatomic, readonly) NSUInteger viewsUntilReward;

/**
 @abstract Represents the reward amount for each completed rewarded ad view.
 @discussion This value will be 0 if the given zone is not configured for rewards.
 */
@property (nonatomic, readonly) NSUInteger rewardAmount;

/**
 @abstract Represents the singular form of the reward name based on the reward amount.
 @discussion This value will be an empty string if the given zone is not configured for rewards.
 */
@property (nonatomic, readonly) NSString *rewardName;


/** @name Handling Rewards */

/**
 @abstract Sets a block-based reward handler for your zone.
 @discussion Based on the success parameter, client-side reward implementations should consider incrementing the user's currency balance in this method.
 Server-side reward implementations, however, should consider the success parameter and then contact the game server to determine the current total balance for the virtual currency.
 Note that the associated block of code will be dispatched on the main thread.
 */
-(void)setReward:(nullable void (^)(BOOL success, NSString *name, int amount))reward;
@end

NS_ASSUME_NONNULL_END
