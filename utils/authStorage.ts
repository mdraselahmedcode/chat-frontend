// redux/authStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';


// Function to save a token
export const saveToken = async (key: string, token: string) => {
  try {
    await AsyncStorage.setItem(key, token);
    console.log('User auth token successfully saved');
  } catch (error) {
    console.error(`Error saving token with key ${key}:`, error);
  }
};

// Function to get a token
export const getToken = async (key: string) => {
  try {
    console.log('User auth token provided');
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error retrieving token with key ${key}:`, error);
    return null;
  }
};

// Function to remove a token
export const removeToken = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('User auth token has been removed');
  } catch (error) {
    console.error(`Error removing token with key ${key}:`, error);
  }
};





