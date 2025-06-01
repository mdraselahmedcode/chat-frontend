  // Function to get color based on Tailwind-like class names
  export const getColorFromClass = (colorClass: string): string => {
    switch (colorClass) {
      case 'bg-gray-800':
        return '#1F2937'; // Dark background
      case 'bg-gray-200':
        return '#E5E7EB'; // Light background
      case 'text-gray-100':
        return '#F3F4F6'; // Very light text in dark mode
      case 'text-gray-800':
        return '#1F2937'; // Dark text in light mode
      case 'text-gray-300':
        return '#D1D5DB'; // Light subtext in dark mode
      case 'text-gray-500':
        return '#6B7280'; // Dark subtext in light mode
      case 'text-blue-500':
        return '#3B82F6'; // Tailwind blue-500 for actionable items
      // Add more mappings as needed
      default:
        return colorClass; // Default fallback (allows direct color values)
    }
  };