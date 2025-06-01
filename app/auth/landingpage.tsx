// src/components/LandingPage.tsx

import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const LandingPage = () => {
  return (
    <>
      {/* Hide the header */}
      <Stack screenOptions={{ headerShown: false }} />

      {/* Landing Page Content */}
      <View style={styles.container}>
        {/* Optional: Add an Image or Icon */}
        <Image
          source={require('../../assets/icon.png')} // Replace with your logo path
          style={styles.logo}
          resizeMode="contain"
          className=' rounded-full'
        />

        <Text style={styles.title}>Welcome to ChatBoss</Text>
        <Text style={styles.description}>
          Connect with friends, chat securely, and enjoy seamless messaging.
        </Text>

        <TouchableOpacity
          onPress={() => router.replace('/auth/register')}
          style={styles.button}
          accessibilityLabel="Continue to Register"
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B21A8', // Purple background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff', // White text
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#E0E7FF', // Light purple text
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9333EA', // Darker purple
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // For Android shadow
  },
  buttonText: {
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 10,
  },
});
