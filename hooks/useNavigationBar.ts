import { useState, useEffect } from 'react';
import { Platform, ColorValue } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export function useNavigationBar() {
  const [visibility, setVisibility] = useState<NavigationBar.NavigationBarVisibility | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<ColorValue | null>(null);
  const [borderColor, setBorderColor] = useState<ColorValue | null>(null);
  const [buttonStyle, setButtonStyle] = useState<NavigationBar.NavigationBarButtonStyle>('dark');
  const [behavior, setBehavior] = useState<NavigationBar.NavigationBarBehavior>('overlay-swipe');
  const [position, setPosition] = useState<NavigationBar.NavigationBarPosition>('relative');

  // Initialize the navigation bar state on component mount
  useEffect(() => {
    async function initializeNavigationBar() {
      if (Platform.OS !== 'android') return;

      const currentVisibility = await NavigationBar.getVisibilityAsync();
      const currentBackgroundColor = await NavigationBar.getBackgroundColorAsync();
      const currentBorderColor = await NavigationBar.getBorderColorAsync();
      const currentButtonStyle = await NavigationBar.getButtonStyleAsync();
      const currentBehavior = await NavigationBar.getBehaviorAsync();
      const currentPosition = await NavigationBar.unstable_getPositionAsync();

      setVisibility(currentVisibility);
      setBackgroundColor(currentBackgroundColor);
      setBorderColor(currentBorderColor);
      setButtonStyle(currentButtonStyle);
      setBehavior(currentBehavior);
      setPosition(currentPosition);
    }

    initializeNavigationBar();
  }, []);

  // Functions to control the navigation bar

  async function showNavigationBar() {
    await NavigationBar.setVisibilityAsync('visible');
    setVisibility('visible');
  }

  async function hideNavigationBar() {
    await NavigationBar.setVisibilityAsync('hidden');
    setVisibility('hidden');
  }

  async function updateVisibility(newVisibility: NavigationBar.NavigationBarVisibility) {
    await NavigationBar.setVisibilityAsync(newVisibility);
    setVisibility(newVisibility);
  }

  async function updateBackgroundColor(color: ColorValue) {
    await NavigationBar.setBackgroundColorAsync(color);
    setBackgroundColor(color);
  }

  async function updateBorderColor(color: ColorValue) {
    await NavigationBar.setBorderColorAsync(color);
    setBorderColor(color);
  }

  async function updateButtonStyle(style: NavigationBar.NavigationBarButtonStyle) {
    await NavigationBar.setButtonStyleAsync(style);
    setButtonStyle(style);
  }

  async function updateBehavior(newBehavior: NavigationBar.NavigationBarBehavior) {
    await NavigationBar.setBehaviorAsync(newBehavior);
    setBehavior(newBehavior);
  }

  async function updatePosition(newPosition: NavigationBar.NavigationBarPosition) {
    await NavigationBar.setPositionAsync(newPosition);
    setPosition(newPosition);
  }

  return {
    visibility,
    backgroundColor,
    borderColor,
    buttonStyle,
    behavior,
    position,
    showNavigationBar,
    hideNavigationBar,
    updateVisibility,      // Added updateVisibility
    updateBackgroundColor,
    updateBorderColor,
    updateButtonStyle,
    updateBehavior,
    updatePosition,
  };
}
