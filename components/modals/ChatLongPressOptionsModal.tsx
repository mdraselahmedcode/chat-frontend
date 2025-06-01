// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   Dimensions,
//   Animated,
//   Easing,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { Chat } from '~/types/chatTypes';

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

// interface ChatLongPressOptionsModalProps {
//   visible: boolean;
//   onRequestClose: () => void;
//   onDelete: () => void;
//   selectedChats: string[]; // Ensure this matches with `Chat[] | null`
// }

// const ChatLongPressOptionsModal: React.FC<ChatLongPressOptionsModalProps> = ({
//   visible,
//   onRequestClose,
//   onDelete,
//   selectedChats,
// }) => {
//   const translateY = useRef(new Animated.Value(screenHeight)).current;
//   const [showModal, setShowModal] = useState(visible);

//   useEffect(() => {
//     if (visible) {
//       setShowModal(true);
//       Animated.timing(translateY, {
//         toValue: 0,
//         duration: 500,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(translateY, {
//         toValue: screenHeight,
//         duration: 600,
//         easing: Easing.in(Easing.ease),
//         useNativeDriver: true,
//       }).start(() => setShowModal(false));
//     }
//   }, [visible, translateY]);

//   if (!showModal) {
//     return null;
//   }

//   return (
//     <Modal
//       visible={showModal}
//       transparent
//       animationType="none"
//       onRequestClose={onRequestClose}
//     >
//       <TouchableWithoutFeedback onPress={onRequestClose}>
//         <View style={styles.modalContainer}>
//           <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
//             <TouchableOpacity onPress={onDelete} style={styles.optionButton}>
//               <Feather name="trash-2" size={24} color="black" />
//               <Text style={styles.optionText}>Delete</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     // backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adds background overlay
//   },
//   modalContent: {
//     width: screenWidth,
//     height: 100,
//     backgroundColor: 'white',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     elevation: 5,
//   },
//   optionButton: {
//     alignItems: 'center',
//   },
//   optionText: {
//     marginTop: 5,
//     fontSize: 12,
//   },
// });

// export default ChatLongPressOptionsModal;






