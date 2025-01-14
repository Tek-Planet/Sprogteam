# #!/bin/sh

# # Prevent Homebrew cleanup during installation
# export HOMEBREW_NO_INSTALL_CLEANUP=TRUE

# # Install necessary tools
# brew install cocoapods node@20 yarn
# brew link node@20
# export PATH="/usr/local/opt/node@20/bin:$PATH"

# # Install project dependencies
# yarn || { echo "Yarn install failed. Exiting..."; exit 1; }
# pod install || { echo "Pod install failed. Exiting..."; exit 1; }

# # Fix React Native Yoga Boolean Issue
# RN_YOGA_PATH=$(find ./node_modules/react-native/ReactCommon/yoga -name "Yoga.cpp" | head -n 1)
# if [ -f "$RN_YOGA_PATH" ]; then
#   sed -i '' '2232s/|/||/g' "$RN_YOGA_PATH" || echo "Failed to apply sed fix for Yoga.cpp."
# else
#   echo "Yoga.cpp not found. Skipping sed command."
# fi

# echo "Setup complete!"

# new patch


#!/bin/sh

# Prevent Homebrew cleanup during installation
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE

# Install necessary tools
brew install cocoapods node@20 yarn
brew link node@20
export PATH="/usr/local/opt/node@20/bin:$PATH"

# Install project dependencies
yarn || { echo "Yarn install failed. Exiting..."; exit 1; }

# Ensure patch-package is installed
npm install --save-dev patch-package postinstall-postinstall || { echo "Failed to install patch-package. Exiting..."; exit 1; }

# Apply the boost.podspec patch
PATCH_DIR="./patches"
PATCH_FILE="$PATCH_DIR/react-native+boost.patch"
BOOST_PODSPEC_PATH="./node_modules/react-native/third-party-podspecs/boost.podspec"

if [ ! -f "$PATCH_FILE" ]; then
  echo "Creating patch for boost.podspec..."

  if [ -f "$BOOST_PODSPEC_PATH" ]; then
    # Backup original boost.podspec
    cp "$BOOST_PODSPEC_PATH" "$BOOST_PODSPEC_PATH.bak"

    # Modify boost.podspec
    sed -i '' 's|https://boostorg.jfrog.io/artifactory/main/release/1.83.0/source/boost_1_83_0.tar.bz2|https://sourceforge.net/projects/boost/files/boost/1.83.0/boost_1_83_0.tar.bz2|g' "$BOOST_PODSPEC_PATH"
    sed -i '' 's|f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41|6478edfe2f3305127cffe8caf73ea0176c53769f4bf1585be237eb30798c3b8e|g' "$BOOST_PODSPEC_PATH"

    # Create a patch using patch-package
    npx patch-package react-native || { echo "Failed to create patch. Exiting..."; exit 1; }
  else
    echo "boost.podspec not found. Skipping patch creation."
  fi
else
  echo "Patch already exists. Skipping creation."
fi

# Run pod install
pod install || { echo "Pod install failed. Exiting..."; exit 1; }

# Fix React Native Yoga Boolean Issue
RN_YOGA_PATH=$(find ./node_modules/react-native/ReactCommon/yoga -name "Yoga.cpp" | head -n 1)
if [ -f "$RN_YOGA_PATH" ]; then
  sed -i '' '2232s/|/||/g' "$RN_YOGA_PATH" || echo "Failed to apply sed fix for Yoga.cpp."
else
  echo "Yoga.cpp not found. Skipping sed command."
fi

echo "Setup complete!"
