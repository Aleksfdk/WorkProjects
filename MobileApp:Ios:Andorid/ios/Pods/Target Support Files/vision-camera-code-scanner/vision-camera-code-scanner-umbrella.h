#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "VisionCameraCodeScanner-Bridging-Header.h"

FOUNDATION_EXPORT double vision_camera_code_scannerVersionNumber;
FOUNDATION_EXPORT const unsigned char vision_camera_code_scannerVersionString[];

