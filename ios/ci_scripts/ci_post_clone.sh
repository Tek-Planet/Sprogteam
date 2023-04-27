#!/bin/sh

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods
# have to add node yourself
brew install node@16
# link it to the path
brew link node@16

brew install yarn
# make it excutable
# Install dependencies you manage with CocoaPods.
yarn
# fixes boolean issue 
sed -i '' '2232s/|/||/g' /Volumes/workspace/repository/node_modules/react-native/ReactCommon/yoga/yoga/Yoga.cpp
pod install
# remove accessibilyi
# /Users/tek/Documents/Projects/ReactNative/NativeProjects/EaziInvest/ios/Pods/Pods.xcodeproj/xcuserdata/tek.xcuserdatad
# rm -r /Volumes/workspace/repository/ios/Podszoj/xcuserdata/tek.xcuserdatad/React-Core-AccessibilityResources
# the sed command from RN cant find the file... so we have to run it ourselves
sed -i -e  $'s/ && (__IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_10_0)//' /Volumes/workspace/repository/ios/Pods/RCT-Folly/folly/portability/Time.h