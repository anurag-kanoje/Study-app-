import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

async function deploy() {
  console.log('🚀 Starting deployment process...')

  // 1. Run tests
  console.log('\n🧪 Running tests...')
  try {
    execSync('ts-node scripts/test-features.ts', { stdio: 'inherit' })
    console.log('✅ Tests completed successfully')
  } catch (error) {
    console.error('❌ Tests failed:', error)
    return false
  }

  // 2. Prepare for Expo deployment
  console.log('\n📦 Preparing for Expo deployment...')
  try {
    execSync('ts-node scripts/prepare-expo.ts', { stdio: 'inherit' })
    console.log('✅ Expo preparation completed successfully')
  } catch (error) {
    console.error('❌ Expo preparation failed:', error)
    return false
  }

  // 3. Build the app
  console.log('\n🏗️ Building the app...')
  try {
    execSync('npx expo prebuild', { stdio: 'inherit' })
    console.log('✅ Prebuild completed successfully')
  } catch (error) {
    console.error('❌ Prebuild failed:', error)
    return false
  }

  // 4. Create EAS build
  console.log('\n📱 Creating EAS build...')
  try {
    execSync('eas build --platform all', { stdio: 'inherit' })
    console.log('✅ EAS build completed successfully')
  } catch (error) {
    console.error('❌ EAS build failed:', error)
    return false
  }

  console.log('\n✨ Deployment process completed successfully!')
  console.log('\nNext steps:')
  console.log('1. Review the build artifacts in the EAS dashboard')
  console.log('2. Submit the app to the stores using "eas submit"')
  console.log('3. Monitor the submission status in the EAS dashboard')
  
  return true
}

deploy() 