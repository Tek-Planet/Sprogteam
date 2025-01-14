#!/bin/sh

# Prevent Homebrew cleanup during installation
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE

# Install necessary tools
brew install cocoapods node@20 yarn
brew link node@20
export PATH="/usr/local/opt/node@20/bin:$PATH"

# Install project dependencies
npm install --legacy-peer-deps || { echo "NPM install failed. Exiting..."; exit 1; }

# Apply Boost podspec fix
BOOST_PODSPEC_PATH="./node_modules/react-native/third-party-podspecs/boost.podspec"
if [ -f "$BOOST_PODSPEC_PATH" ]; then
  echo "Patching Boost podspec to fix checksum issue..."
  sed -i '' 's|https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2|https://sourceforge.net/projects/boost/files/boost/1.76.0/boost_1_76_0.tar.bz2|' "$BOOST_PODSPEC_PATH" || { echo "Failed to patch Boost URL. Exiting..."; exit 1; }
  sed -i '' 's|f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41|79e6d3f986444e5a80afbeccdaf2d1c1cf964baa8d766d20859d653a16c39848|' "$BOOST_PODSPEC_PATH" || { echo "Failed to patch Boost checksum. Exiting..."; exit 1; }
else
  echo "Boost podspec not found. Skipping patch."
fi

# Run CocoaPods installation
rm -rf Pods Podfile.lock
pod install || { echo "Pod install failed. Exiting..."; exit 1; }

# Final confirmation message
echo "Setup complete!"
