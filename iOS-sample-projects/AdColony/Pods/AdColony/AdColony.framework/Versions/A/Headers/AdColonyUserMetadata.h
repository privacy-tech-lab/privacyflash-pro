#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Use the following pre-defined values to configure user metadata options.
 */

/** User is male */
FOUNDATION_EXPORT NSString *const ADCUserMale;

/** User is female */
FOUNDATION_EXPORT NSString *const ADCUserFemale;

/** User is single */
FOUNDATION_EXPORT NSString *const ADCUserSingle;

/** User is married */
FOUNDATION_EXPORT NSString *const ADCUserMarried;

/** User has a basic grade school education and has not attended high school */
FOUNDATION_EXPORT NSString *const ADCUserEducationGradeSchool;

/** User has completed at least some high school but has not received a diploma */
FOUNDATION_EXPORT NSString *const ADCUserEducationSomeHighSchool;

/** User has received a high school diploma but has not completed any college */
FOUNDATION_EXPORT NSString *const ADCUserEducationHighSchoolDiploma;

/** User has completed at least some college but doesn't have a college degree */
FOUNDATION_EXPORT NSString *const ADCUserEducationSomeCollege;

/** User has been awarded at least 1 associates degree, but doesn't have any higher level degrees */
FOUNDATION_EXPORT NSString *const ADCUserEducationAssociatesDegree;

/** User has been awarded at least 1 bachelors degree, but does not have a graduate level degree */
FOUNDATION_EXPORT NSString *const ADCUserEducationBachelorsDegree;

/** User has been awarded at least 1 masters or doctorate level degree */
FOUNDATION_EXPORT NSString *const ADCUserEducationGraduateDegree;


/**
 AdColonyUserMetadata objects are used to provide AdColony with per-user, non-personally-identifiable information for ad targeting purposes.
 Note that providing non-personally-identifiable information using this API will improve targeting and unlock improved earnings for your app.
 */
@interface AdColonyUserMetadata : NSObject

/** @name Pre-defined Aspects of User Metadata */

/**
 @abstract Configures the user's age.
 @discussion Set this property to configure the user's age.
 */
@property (nonatomic) NSInteger userAge;

/**
 @abstract Configures the user's interests.
 @discussion Set this property with an array of NSStrings to configure the user's interests.
 */
@property (nonatomic, strong, nullable) NSArray<NSString *> *userInterests;

/**
 @abstract Configures the user's gender.
 @discussion Set this property to configure the user's gender.
 Note that you should use one of the pre-defined constants below to configure this property.
 */
@property (nonatomic, strong, nullable) NSString *userGender;

/**
 @abstract Configures the user's latitude.
 @discussion Set this property to configure the user's latitude.
 */
@property (nonatomic, strong, nullable) NSNumber *userLatitude;

/**
 @abstract Configures the user's longitude.
 @discussion Set this property to configure the user's longitude.
 */
@property (nonatomic, strong, nullable) NSNumber *userLongitude;

/**
 @abstract Configures the user's zip code.
 @discussion Set this property to configure the user's zip code.
 */
@property (nonatomic, strong, nullable) NSString *userZipCode;

/**
 @abstract Configures the user's household income.
 @discussion Set this property to configure the user's household income.
 */
@property (nonatomic, strong, nullable) NSNumber *userHouseholdIncome;

/**
 @abstract Configures the user's marital status.
 @discussion Set this property to configure the user's marital status.
 Note that you should use one of the pre-defined constants below to configure this property.
 */
@property (nonatomic, strong, nullable) NSString *userMaritalStatus;

/**
 @abstract Configures the user's education level.
 @discussion Set this property to configure the user's education level.
 Note that you should use one of the pre-defined constants below to configure this property.
 */
@property (nonatomic, strong, nullable) NSString *userEducationLevel;


/** @name Setting Arbitrary Metadata */

/**
 @abstract Configures the AdColonyUserMetadata object with the given key/value pair.
 @discussion Use this method to send arbitrary user metadata.
 @param key A key to represent the metadata. Must be 128 chars or less.
 @param value An NSString used to configure the metadata. Must be 128 chars or less.
 @return Whether the option was set successfully.
 */
- (BOOL)setMetadataWithKey:(NSString *)key andStringValue:(NSString *)value;

/**
 @abstract Configures the AdColonyUserMetadata object with the given key/value pair.
 @discussion Call this method with one of the keys defined below and pass an NSNumber for the value.
 Use this method for configuring the user's age, household income, and location.
 @param key A key to represent the metadata.
 @param value An NSNumber used to configure the metadata option.
 @return Whether the option was set successfully.
 */
- (BOOL)setMetadataWithKey:(NSString *)key andNumericValue:(NSNumber *)value;

/**
 @abstract Configures the AdColonyUserMetadata object with the given key/value pair.
 @discussion Call this method with one of the keys defined below and pass an NSArray for the value.
 Currently, this method should only be used to configure a set of user interests.
 Note that the array must only contain NSStrings.
 @param key A key to represent the metadata.
 @param value An NSArray containing NSStrings used to configure the metadata option. Strings must be 128 chars or less.
 @return Whether the option was set successfully.
 */
- (BOOL)setMetadataWithKey:(NSString *)key andArrayValue:(NSArray<NSString *> *)value;


/** @name Metadata Retrieval */

/**
 @abstract Returns the string value associated with the given key in the metadata object.
 @discussion Call this method using the string-based key representing the metadata option to obtain the corresponding sring-based value.
 @param key The key representing the metadata.
 @return The value associated with the given key. Returns `nil` if the value has not been set.
 */
- (nullable NSString *)getStringMetadataWithKey:(NSString *)key;

/**
 @abstract Returns the numeric value associated with the given key in the metadata object.
 @discussion Call this method using the string-based key representing the metadata option to obtain the corresponding numerical value.
 @param key The key representing the metadata.
 @return The value associated with the given key. Returns `nil` if the value has not been set.
 */
- (nullable NSNumber *)getNumericMetadataWithKey:(NSString *)key;

/**
 @abstract Returns the array value associated with the given key in the metadata object.
 @discussion Call this method using the string-based key representing the metadata option to obtain the corresponding array value.
 Currently, this method should only be used to retrive a set of user interests.
 @param key The key representing the metadata.
 @return The value associated with the given key. Returns `nil` if the value has not been set.
 */
- (nullable NSArray *)getArrayMetadataWithKey:(NSString *)key;
@end

NS_ASSUME_NONNULL_END
