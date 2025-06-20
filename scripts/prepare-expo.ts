import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

async function prepareExpoDeployment() {
  console.log('🚀 Preparing app for Expo deployment...')

  // 1. Install required dependencies
  console.log('\n📦 Installing dependencies...')
  const dependencies = [
    'expo',
    'expo-status-bar',
    'expo-image-picker',
    'expo-camera',
    'expo-document-picker',
    'expo-notifications',
    'expo-file-system',
    'expo-sharing',
    'expo-secure-store',
    '@react-native-async-storage/async-storage',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-safe-area-context'
  ]

  try {
    execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' })
    console.log('✅ Dependencies installed successfully')
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error)
    return false
  }

  // 2. Update app.json with required configurations
  console.log('\n📝 Updating app.json...')
  try {
    const appJsonPath = path.join(process.cwd(), 'app.json')
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'))

    // Add required plugins
    appJson.expo.plugins = [
      ...appJson.expo.plugins,
      'expo-secure-store',
      'react-native-reanimated'
    ]

    // Add required permissions
    appJson.expo.ios = {
      ...appJson.expo.ios,
      infoPlist: {
        NSCameraUsageDescription: "Allow Study Buddy to access your camera to scan QR codes and take photos for notes.",
        NSPhotoLibraryUsageDescription: "Allow Study Buddy to access your photos to let you share them with your teachers and study groups.",
        NSMicrophoneUsageDescription: "Allow Study Buddy to access your microphone for voice notes.",
        NSDocumentsFolderUsageDescription: "Allow Study Buddy to access your documents for file sharing."
      }
    }

    appJson.expo.android = {
      ...appJson.expo.android,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "RECORD_AUDIO"
      ]
    }

    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2))
    console.log('✅ app.json updated successfully')
  } catch (error) {
    console.error('❌ Failed to update app.json:', error)
    return false
  }

  // 3. Create babel.config.js if it doesn't exist
  console.log('\n🔧 Setting up Babel configuration...')
  try {
    const babelConfig = `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};`

    fs.writeFileSync(path.join(process.cwd(), 'babel.config.js'), babelConfig)
    console.log('✅ Babel configuration created successfully')
  } catch (error) {
    console.error('❌ Failed to create babel.config.js:', error)
    return false
  }

  // 4. Create metro.config.js if it doesn't exist
  console.log('\n🚇 Setting up Metro configuration...')
  try {
    const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();`

    fs.writeFileSync(path.join(process.cwd(), 'metro.config.js'), metroConfig)
    console.log('✅ Metro configuration created successfully')
  } catch (error) {
    console.error('❌ Failed to create metro.config.js:', error)
    return false
  }

  console.log('\n✨ Expo deployment preparation completed successfully!')
  console.log('\nNext steps:')
  console.log('1. Run "npx expo start" to test the app locally')
  console.log('2. Run "eas build" to create a build for deployment')
  console.log('3. Run "eas submit" to submit the app to stores')
  
  return true
}

prepareExpoDeployment() 