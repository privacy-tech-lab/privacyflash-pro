#import "AdColonyUserMetadata.h"
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 AdColonyOptions is a superclass for all types of AdColonyOptions. 
 Note that AdColonyOptions classes should never be instantiated directly.
 Instead, create one of the subclasses and set options on it using its properties as well as the string-based constants defined in its header file.
 */
@interface AdColonyOptions : NSObject

/** @name Properties */

/**
 @abstract Represents an AdColonyUserMetadata object.
 @discussion Configure and set this property to improve ad targeting.
 @see AdColonyUserMetadata
 */
@property (nonatomic, strong, nullable) AdColonyUserMetadata *userMetadata;

/** @name Setting Options */

/**
 @abstract Sets a supported option.
 @discussion Use this method to set a string-based option with an arbitrary, string-based value.
 @param option An NSString representing the option.
 @param value An NSString used to configure the option. Strings must be 128 characters or less.
 @return A BOOL indicating whether or not the option was set successfully.
 @see AdColonyAppOptions
 @see AdColonyAdOptions
 */
- (BOOL)setOption:(NSString *)option withStringValue:(NSString *)value;

/**
 @abstract Sets a supported option.
 @discussion Use this method to set a string-based option with an arbitrary, numerial value.
 @param option An NSString representing the option. Strings must be 128 characters or less.
 @param value An NSNumber used to configure the option.
 @return A BOOL indicating whether or not the option was set successfully.
 @see AdColonyAppOptions
 @see AdColonyAdOptions
 */
- (BOOL)setOption:(NSString *)option withNumericValue:(NSNumber *)value;


/** @name Option Retrieval */

/**
 @abstract Returns the string-based option associated with the given key.
 @discussion Call this method to obtain the string-based value associated with the given string-based key.
 @param key A string-based option key.
 @return The string-based value associated with the given key. Returns `nil` if the option has not been set.
 @see AdColonyAppOptions
 @see AdColonyAdOptions
 */
- (nullable NSString *)getStringOptionWithKey:(NSString *)key;

/**
 @abstract Returns the numerical option associated with the given key.
 @discussion Call this method to obtain the numerical value associated with the given string-based key.
 @param key A string-based option key.
 @return The option value associated with the given key. Returns `nil` if the option has not been set.
 @see AdColonyAppOptions
 @see AdColonyAdOptions
 */
- (nullable NSNumber *)getNumericOptionWithKey:(NSString *)key;
@end

NS_ASSUME_NONNULL_END
