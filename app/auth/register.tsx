import React, { useState, useEffect } from 'react';
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
import { registerUser } from '~/redux/slices/authSlice'; // Thunk import
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/store';
import { Gender } from '~/types/all_types';
import { RegistrationDataType } from '~/types/all_types';
import { USER_EMAIL_CHECK, USER_NAME_CHECK } from '~/utils/constraints';

const Register: React.FC = () => {
  // Form state variables
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [gender, setGender] = useState<Gender>(Gender.Male); // Enum imported from ~/types/Gender

  // Password visibility states
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);

  // Location state variables
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);

  // Floating label states
  const [usernameFocused, setUsernameFocused] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState<boolean>(false);

  // Redux dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Access loading and error state from auth slice
  const { loading, error } = useSelector((state: RootState) => state.auth);


  // Floating label animation
  const animateLabel = (focused: boolean, hasValue: boolean) => ({
    transform: [{ translateY: focused || hasValue ? -25 : 0 }],
    fontSize: focused || hasValue ? 12 : 16,
    color: focused ? '#3b82f6' : '#9ca3af',
  });

  // Request location permissions and fetch location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationErrorMsg('Permission to access location was denied');
          // Optionally, you can alert the user here
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

  // Handle Register button press
  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword || !gender) {
      // Optionally, alert the user
      console.error('Incomplete Form', 'Please fill out all fields.');
      return;
    }

    // Email validation
    const isValidEmail = (email: string) => USER_EMAIL_CHECK.test(email);
    if (!isValidEmail(email)) {
      console.error('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Username validation
    const isValidUsername = (username: string) => USER_NAME_CHECK.test(username);
    if (!isValidUsername(username)) {
      console.error('Invalid Username', 'Please enter a valid username');
      return;
    }

    // Password and confirm password match check
    if(password !== confirmPassword) {
      console.error('Password and Confirm password do not match');
      return;
    }

    if (!location) {
      console.error('Location Not Available', 'Please ensure location services are enabled.');
      return;
    }

    // Log registration details
    const registrationData: RegistrationDataType = {
      username,
      email,
      password,
      confirmPassword,
      gender,
      location: {
        type: 'Point', // Required for GeoJSON
        coordinates: [location.coords.longitude, location.coords.latitude], // Correct order: [longitude, latitude]
      },
    };

    // Dispatch the registration request
    try {
      const res = await dispatch(registerUser(registrationData)).unwrap();
      if (res.success ) {
        console.error( res.message || 'Registered successfully');
        router.replace('/main/home');
      } 
    } catch (err: any) {
      if(error) {
        router.replace('/auth/register')
        console.error(error)
      } else {
        console.error('Registration Error:', err?.msg || err?.message || err);
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
          <Text style={styles.title}>Create an Account</Text>

          <View style={styles.formContainer}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="gray" style={styles.icon} />
              <TextInput
                placeholder=" "
                value={username}
                onChangeText={setUsername}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(username.length === 0)}
                style={styles.textInput}
                autoCapitalize="none"
              />
              
              <View pointerEvents='none'>
                <Animated.Text
                  style={[styles.label, animateLabel(usernameFocused, username.length > 0)]}
                >
                  Username
                </Animated.Text>
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="gray" style={styles.icon} />
              <TextInput
                placeholder=" "
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(email.length === 0)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput}
              />
              <View pointerEvents='none'>
                <Animated.Text
                  style={[styles.label, animateLabel(emailFocused, email.length > 0)]}
                >
                  Email
                </Animated.Text>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.icon} />
              <TextInput
                placeholder=" "
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(password.length === 0)}
                style={styles.textInput}
              />
              <View pointerEvents='none'>
                <Animated.Text
                  style={[styles.label, animateLabel(passwordFocused, password.length > 0)]}
                >
                  Password
                </Animated.Text>
              </View>
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
                accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
              >
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.icon} />
              <TextInput
                placeholder=" "
                secureTextEntry={!confirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(confirmPassword.length === 0)}
                style={styles.textInput}
              />
              <View pointerEvents='none'>
                <Animated.Text
                  style={[styles.label, animateLabel(confirmPasswordFocused, confirmPassword.length > 0)]}
                >
                  Confirm Password
                </Animated.Text>
              </View>
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                accessibilityLabel={confirmPasswordVisible ? "Hide confirm password" : "Show confirm password"}
              >
                <Ionicons
                  name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Gender Selection */}
            <Text style={styles.genderLabel}>Gender:</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                onPress={() => setGender(Gender.Male)}
                style={[
                  styles.genderButton,
                  gender === Gender.Male ? styles.genderSelected : styles.genderUnselected,
                  styles.genderLeft,
                ]}
              >
                <Text style={gender === Gender.Male ? styles.genderTextSelected : styles.genderTextUnselected}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender(Gender.Female)}
                style={[
                  styles.genderButton,
                  gender === Gender.Female ? styles.genderSelected : styles.genderUnselected,
                  styles.genderMiddle,
                ]}
              >
                <Text style={gender === Gender.Female ? styles.genderTextSelected : styles.genderTextUnselected}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender(Gender.Other)}
                style={[
                  styles.genderButton,
                  gender === Gender.Other ? styles.genderSelected : styles.genderUnselected,
                  styles.genderRight,
                ]}
              >
                <Text style={gender === Gender.Other ? styles.genderTextSelected : styles.genderTextUnselected}>
                  Other
                </Text>
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
                <ActivityIndicator size="small" color="#0000ff" />
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity>

            {/* Navigation Link */}
            <View style={styles.navigationContainer}>
              <Text style={styles.navigationText}>Already have an account?</Text>
              <Link href="/auth/login" style={styles.loginLink}>
                Login
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center vertically
    padding: 20,
  },
  innerContainer: {
    // Removed padding: 20 since ScrollView has padding
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#111827',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 20,
    paddingBottom: 5,
    // Removed flexDirection: 'row' and justifyContent: 'center' to allow proper alignment
  },
  textInput: {
    height: 40,
    fontSize: 16,
    paddingLeft: 40, // Padding to avoid overlap with the icon
    paddingRight: 40, // Padding to accommodate the eye icon
    color: '#111827',
  },
  label: {
    position: 'absolute',
    left: 40,
    bottom: 10,
    color: '#9ca3af',
    fontSize: 16,
    // Optional: Add transitions for smoother animations
  },
  icon: {
    position: 'absolute',
    left: 0, // Positioned to the left of the input field
    top: 8, // Adjusted to better align vertically
  },
  eyeIcon: {
    position: 'absolute',
    right: 0, // Positioned to the right of the input field
    top: 8, // Adjusted to better align vertically
    padding: 5,
  },
  genderLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#111827',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    borderRadius: 5,
  },
  genderSelected: {
    backgroundColor: '#3b82f6',
  },
  genderUnselected: {
    backgroundColor: '#ffffff',
  },
  genderLeft: {
    marginRight: 5,
  },
  genderMiddle: {
    marginHorizontal: 5,
  },
  genderRight: {
    marginLeft: 5,
  },
  genderTextSelected: {
    color: '#ffffff',
  },
  genderTextUnselected: {
    color: '#111827',
  },
  locationLabel: {
    fontSize: 16,
    marginVertical: 10,
    color: '#111827',
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationText: {
    color: '#111827',
  },
  errorText: {
    color: 'red',
  },
  registerButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navigationText: {
    marginRight: 5,
  },
  loginLink: {
    color: '#3b82f6',
  },
});

export default Register;








