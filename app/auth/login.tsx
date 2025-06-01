
// src/components/LoginScreen.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { loginUser } from '~/redux/slices/authSlice'; // Thunk import
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/store';
import { LoginDataType } from '~/types/all_types';
import { USER_EMAIL_CHECK, USER_NAME_CHECK } from '~/utils/constraints';

const Login: React.FC = () => {
  // Form state variables
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Password visibility state
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  // Location state variables
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);

  // Floating label states
  const [emailOrUsernameFocused, setEmailOrUsernameFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  // Redux dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Access loading and error state from auth slice
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Floating label animation
  const animateLabel = useMemo(() => {
    return (focused: boolean, hasValue: boolean) => ({
      transform: [{ translateY: focused || hasValue ? -25 : 0 }],
      fontSize: focused || hasValue ? 12 : 16,
      color: focused ? '#3b82f6' : '#9ca3af',
    });
  }, []);

  // Request location permissions and fetch location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationErrorMsg('Permission to access location was denied');
          console.error('Location Permission Denied', 'Cannot fetch location without permission.');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        setLocationErrorMsg('Error fetching location');
        console.error('Location Error:', error);
      }
    })();
  }, []);

  // Handle Login button press
  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      console.error('Incomplete Form', 'Please fill out all fields.');
      return;
    }

    if (!location) {
      console.error('Location Error', 'Unable to fetch location. Please try again.');
      return;
    }

    // Email or username validation
    const isValidEmail = USER_EMAIL_CHECK.test(emailOrUsername);
    const isValidUsername = USER_NAME_CHECK.test(emailOrUsername);

    if (!isValidEmail && !isValidUsername) {
      console.error('Invalid Input', 'Please enter a valid email or username.');
      return;
    }

    // Log login details
    const loginData: LoginDataType = {
      emailOrUsername,
      password,
      location: {
        type: 'Point', // Required for GeoJSON
        coordinates: [location.coords.longitude, location.coords.latitude], // Correct order: [longitude, latitude]
      },
    };

    try {
      const res = await dispatch(loginUser(loginData)).unwrap();
      if (res.success) {
        router.replace('/main/home' as const);
        console.log(res.message || 'Logged in successfully');
        // console.log('here is token', res.token);
      }
    } catch (err: any) {
      if (error) {
        router.replace('/auth/login');
        console.error(error);
      } else {
        router.replace('/auth/login');
        console.error('Login Error:', err?.msg || err?.message || err);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust if necessary
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Welcome Back</Text>

          <View style={styles.formContainer}>
            {/* Email or Username Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#3b82f6" style={styles.icon} />
              <TextInput
                placeholder=" "
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                onFocus={() => setEmailOrUsernameFocused(true)}
                onBlur={() => setEmailOrUsernameFocused(emailOrUsername.length === 0)}
                style={styles.textInput}
                autoCapitalize="none"
              />
              <View pointerEvents="none">
                <Animated.Text
                  style={[styles.label, animateLabel(emailOrUsernameFocused, emailOrUsername.length > 0)]}
                >
                  Email or Username
                </Animated.Text>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#3b82f6" style={styles.icon} />
              <TextInput
                placeholder=" "
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(password.length === 0)}
                style={styles.textInput}
              />
              <View pointerEvents="none">
                <Animated.Text
                  style={[styles.label, animateLabel(passwordFocused, password.length > 0)]}
                >
                  Password
                </Animated.Text>
              </View>
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
                accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
              >
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#3b82f6"
                />
              </TouchableOpacity>
            </View>

            {/* Location Display */}
            <Text style={styles.locationLabel}>Your Location:</Text>
            <View style={styles.locationContainer}>
              {location ? (
                <>
                  <Text style={styles.locationText}>Latitude: {location.coords.latitude.toFixed(6)}</Text>
                  <Text style={styles.locationText}>Longitude: {location.coords.longitude.toFixed(6)}</Text>
                </>
              ) : locationErrorMsg ? (
                <Text style={styles.errorText}>{locationErrorMsg}</Text>
              ) : (
                <ActivityIndicator size="small" color="#3b82f6" />
              )}
            </View>

            {/* Login Button */}
            {loading ? (
              <ActivityIndicator size="large" color="#3b82f6" style={styles.activityIndicator} />
            ) : (
              <TouchableOpacity onPress={handleLogin} style={styles.loginButton} disabled={loading}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            )}

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={() => router.push('/auth/forgotPassword')}
              style={styles.forgotPasswordContainer}
              accessibilityLabel="Forgot Password"
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Link to Register */}
            <View style={styles.navigationContainer}>
              <Text style={styles.navigationText}>Don't have an account?</Text>
              <Link href="/auth/register" style={styles.registerLink}>
                Register
              </Link>
            </View>

            {/* Display Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background to match Register screen
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center vertically
    padding: 25,
  },
  innerContainer: {
    // No additional padding needed as ScrollView handles it
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 30,
    color: '#111827', 
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#ffffff', // White background for form
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  inputContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderColor: '#d1d5db', // Light gray border
    marginBottom: 20,
    paddingBottom: 5,
  },
  textInput: {
    height: 40,
    fontSize: 16,
    paddingLeft: 40, // To accommodate the icon
    paddingRight: 40, // To accommodate the eye icon
    color: '#111827', // Dark text color
  },
  label: {
    position: 'absolute',
    left: 40,
    bottom: 10,
    color: '#9ca3af', // Gray color for labels
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    left: 0,
    top: 8,
    color: '#9ca3af'
    // color: '#d1d5db', // Blue color for icons
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    top: 8,
    padding: 5,
  },
  locationLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#3b82f6', // Blue label
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#111827', // Dark text
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#3b82f6', // Blue background
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#3b82f6', // Blue text
    fontSize: 16,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navigationText: {
    marginRight: 5,
    color: '#111827', // Dark text
  },
  registerLink: {
    color: '#3b82f6', // Blue link
    fontWeight: '600',
  },
  activityIndicator: {
    marginTop: 16,
  },
});
