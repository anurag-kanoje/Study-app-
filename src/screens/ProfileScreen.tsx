import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Text, TextInput, Button, Avatar, ActivityIndicator } from 'react-native-paper';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../lib/supabase';
import * as ImagePicker from 'expo-image-picker';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const data = await supabaseService.getProfile(user.id);
      setProfile(data);
      setUsername(data.username);
      setFullName(data.full_name);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !profile) return;

    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    setSaving(true);
    try {
      const updatedProfile = await supabaseService.updateProfile(user.id, {
        username,
        full_name: fullName,
      });
      setProfile(updatedProfile);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    if (!user) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setSaving(true);
        const file = result.assets[0];
        const fileExt = file.uri.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload image to Supabase Storage
        const { error: uploadError } = await supabaseService.supabase.storage
          .from('avatars')
          .upload(filePath, {
            uri: file.uri,
            type: `image/${fileExt}`,
            name: fileName,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabaseService.supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // Update profile with new avatar URL
        const updatedProfile = await supabaseService.updateProfile(user.id, {
          avatar_url: publicUrl,
        });
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update avatar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={100}
              label={profile?.username?.substring(0, 2).toUpperCase() || 'U'}
            />
          )}
          <Button
            mode="outlined"
            onPress={handlePickImage}
            style={styles.changeAvatarButton}
            loading={saving}
            disabled={saving}
          >
            Change Avatar
          </Button>
        </View>

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          disabled={saving}
        />

        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          disabled={saving}
        />

        <Button
          mode="contained"
          onPress={handleUpdateProfile}
          style={styles.button}
          loading={saving}
          disabled={saving}
        >
          Save Changes
        </Button>

        <Button
          mode="outlined"
          onPress={signOut}
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  changeAvatarButton: {
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
  },
  signOutButton: {
    marginTop: 24,
  },
}); 