/**
 Enum representing AdColony ad request error codes
 */
typedef NS_ENUM(NSUInteger, AdColonyRequestError) {
    
    /** An invalid app id or zone id was specified by the developer or an invalid configuration was received from the server (unlikely). */
    AdColonyRequestErrorInvalidRequest = 0,
    
    /** The ad was skipped due to the skip interval setting on the control panel. */
    AdColonyRequestErrorSkippedRequest,
    
    /** The current zone has no ad fill. */
    AdColonyRequestErrorNoFillForRequest,
    
    /** Either AdColony has not been configured, is still in the process of configuring, is still downloading assets, or is already showing an ad. */
    AdColonyRequestErrorUnready
};

/**
 Enum representing in-app purchase (IAP) engagement types
 */
typedef NS_ENUM(NSUInteger, AdColonyIAPEngagement) {
    
    /** IAP was enabled for the ad, and the user engaged via a dynamic end card (DEC). */
    AdColonyIAPEngagementEndCard = 0,
    
    /** IAP was enabled for the ad, and the user engaged via an in-vdeo engagement (Overlay). */
    AdColonyIAPEngagementOverlay
};

/**
 Enum representing supported ad orientations
 */
typedef NS_ENUM(NSInteger, AdColonyOrientation) {
    
    /** Portrait and upside down */
    AdColonyOrientationPortrait = 0,
    
    /** Landscape left and landscape right */
    AdColonyOrientationLandscape,
    
    /** All orientations supported */
    AdColonyOrientationAll
};

/**
 Enum representing zone types
 */
typedef NS_ENUM(NSUInteger, AdColonyZoneType) {
    
    /** Interstitial zone type */
    AdColonyZoneTypeInterstitial = 0,
    
    /** Native zone type */
    AdColonyZoneTypeNative
};
