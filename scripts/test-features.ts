import { supabase } from '../lib/supabase'
import { Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Camera from 'expo-camera'
import * as DocumentPicker from 'expo-document-picker'
import * as Notifications from 'expo-notifications'

async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1)
    if (error) throw error
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

async function testImagePicker() {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      console.error('❌ Image picker permission not granted')
      return false
    }
    console.log('✅ Image picker permission granted')
    return true
  } catch (error) {
    console.error('❌ Image picker test failed:', error)
    return false
  }
}

async function testCamera() {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      console.error('❌ Camera permission not granted')
      return false
    }
    console.log('✅ Camera permission granted')
    return true
  } catch (error) {
    console.error('❌ Camera test failed:', error)
    return false
  }
}

async function testDocumentPicker() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true
    })
    console.log('✅ Document picker test successful')
    return true
  } catch (error) {
    console.error('❌ Document picker test failed:', error)
    return false
  }
}

async function testNotifications() {
  try {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') {
      console.error('❌ Notification permission not granted')
      return false
    }
    console.log('✅ Notification permission granted')
    return true
  } catch (error) {
    console.error('❌ Notification test failed:', error)
    return false
  }
}

async function runTests() {
  console.log('🧪 Starting feature tests...')
  console.log('Platform:', Platform.OS)
  
  const results = {
    database: await testDatabaseConnection(),
    imagePicker: await testImagePicker(),
    camera: await testCamera(),
    documentPicker: await testDocumentPicker(),
    notifications: await testNotifications()
  }

  const allPassed = Object.values(results).every(Boolean)
  console.log('\n📊 Test Results:')
  console.log(results)
  console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed')
}

runTests() 