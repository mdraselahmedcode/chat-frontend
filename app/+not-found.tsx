import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-lg font-bold text-black dark:text-white">
        Oops! Page Not Found
      </Text>
      <Link href="/" className="mt-4 text-blue-500 underline">
        Go back to Home
      </Link>
    </View>
  );
}
