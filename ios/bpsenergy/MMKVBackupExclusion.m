#import "MMKVBackupExclusion.h"
#import <Foundation/Foundation.h>

@implementation MMKVBackupExclusion

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

+ (void)excludeMMKVFromBackup
{
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDirectory = [paths objectAtIndex:0];
  NSString *mmkvPath = [documentsDirectory stringByAppendingPathComponent:@"mmkv"];
  
  // Создаем директорию если её нет
  if (![[NSFileManager defaultManager] fileExistsAtPath:mmkvPath]) {
    [[NSFileManager defaultManager] createDirectoryAtPath:mmkvPath
                              withIntermediateDirectories:YES
                                               attributes:nil
                                                    error:nil];
  }
  
  // Исключаем всю директорию MMKV из iCloud бэкапов
  NSURL *mmkvURL = [NSURL fileURLWithPath:mmkvPath];
  NSError *error = nil;
  BOOL success = [mmkvURL setResourceValue:@YES
                                   forKey:NSURLIsExcludedFromBackupKey
                                    error:&error];
  
  if (success) {
    NSLog(@"MMKV: Successfully excluded from iCloud backup: %@", mmkvPath);
  } else {
    NSLog(@"MMKV: Failed to exclude from iCloud backup: %@", error.localizedDescription);
  }
}

RCT_EXPORT_METHOD(excludeFromBackup)
{
  [MMKVBackupExclusion excludeMMKVFromBackup];
}

@end 