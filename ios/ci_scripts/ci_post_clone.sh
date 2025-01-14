#!/bin/sh

# Prevent Homebrew cleanup during installation
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE

# Install necessary tools
brew install cocoapods node@20 yarn
brew link node@20
export PATH="/usr/local/opt/node@20/bin:$PATH"

# Install patch-package
npm install --save-dev patch-package postinstall-postinstall || { echo "Failed to install patch-package. Exiting..."; exit 1; }

# Modify boost.podspec for checksum issue
BOOST_PODSPEC_PATH="./node_modules/react-native/third-party-podspecs/boost.podspec"
if [ -f "$BOOST_PODSPEC_PATH" ]; then
  sed -i '' 's|https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2|https://sourceforge.net/projects/boost/files/boost/1.76.0/boost_1_76_0.tar.bz2|' "$BOOST_PODSPEC_PATH"
  sed -i '' 's|d5fcae8e7dfb1d8a40a79b037c19d31e78e2d6ad50b8b0e0a24534c5b2dc0c89|f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41|' "$BOOST_PODSPEC_PATH"
else
  echo "Boost podspec not found. Exiting..."
  exit 1
fi

# Create a patch for Boost podspec
npx patch-package react-native || { echo "Failed to create patch. Exiting..."; exit 1; }

# Apply the patch after every install
cat <<EOT >> package.json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
EOT

# Clean and install dependencies
rm -rf node_modules ios/Pods ios/Podfile.lock package-lock.json
yarn || { echo "Yarn install failed. Exiting..."; exit 1; }
pod install || { echo "Pod install failed. Exiting..."; exit 1; }

echo "Setup complete!"
