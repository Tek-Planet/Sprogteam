#!/bin/sh

# Prevent Homebrew cleanup during installation
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE

# Install necessary tools
brew install cocoapods node@20 yarn
brew link node@20
export PATH="/usr/local/opt/node@20/bin:$PATH"

# Install project dependencies
yarn || { echo "Yarn install failed. Exiting..."; exit 1; }
pod install || { echo "Pod install failed. Exiting..."; exit 1; }

# Fix React Native Yoga Boolean Issue
RN_YOGA_PATH=$(find ./node_modules/react-native/ReactCommon/yoga -name "Yoga.cpp" | head -n 1)
if [ -f "$RN_YOGA_PATH" ]; then
  sed -i '' '2232s/|/||/g' "$RN_YOGA_PATH" || echo "Failed to apply sed fix for Yoga.cpp."
else
  echo "Yoga.cpp not found. Skipping sed command."
fi

echo "Setup complete!"
