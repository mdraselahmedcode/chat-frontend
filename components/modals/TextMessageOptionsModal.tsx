

// // import React, { useEffect, useRef, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Modal,
// //   Dimensions,
// //   Animated,
// //   Easing,
// //   TouchableWithoutFeedback,
// // } from 'react-native';
// // import { Feather } from '@expo/vector-icons';
// // import { Message } from '~/types/messageTypes'; // Update this import to your actual type path

// // const screenWidth = Dimensions.get('window').width;
// // const screenHeight = Dimensions.get('window').height;

// // interface TextMessageOptionsModalProps {
// //   visible: boolean;
// //   onRequestClose: () => void;
// //   onCopy: () => void;
// //   onDelete: () => void;
// //   onUnsend: () => void;
// //   onForward: () => void;
// //   selectedMessage: Message | null;
// // }

// // const TextMessageOptionsModal: React.FC<TextMessageOptionsModalProps> = ({
// //   visible,
// //   onRequestClose,
// //   onCopy,
// //   onDelete,
// //   onUnsend,
// //   onForward,
// //   selectedMessage,
// // }) => {
// //   const translateY = useRef(new Animated.Value(screenHeight)).current;
// //   const [showModal, setShowModal] = useState(visible);
// //   const messageType = selectedMessage?.type;

// //   useEffect(() => {
// //     if (visible) {
// //       setShowModal(true);
// //       Animated.timing(translateY, {
// //         toValue: 0,
// //         duration: 500,
// //         easing: Easing.out(Easing.ease),
// //         useNativeDriver: true,
// //       }).start();
// //     } else {
// //       Animated.timing(translateY, {
// //         toValue: screenHeight,
// //         duration: 600,
// //         easing: Easing.in(Easing.ease),
// //         useNativeDriver: true,
// //       }).start(() => setShowModal(false));
// //     }
// //   }, [visible]);

// //   if (!showModal) {
// //     return null;
// //   }

// //   return (
// //     <Modal
// //       visible={showModal}
// //       transparent={true}
// //       animationType="none"
// //       onRequestClose={onRequestClose}
// //     >
// //       <TouchableWithoutFeedback onPress={onRequestClose}>
// //         <View style={styles.modalContainer}>
// //           <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>
// //             {messageType === 'text' && (
// //               <TouchableOpacity onPress={() => onCopy()} style={styles.optionButton}>
// //                 <Feather name="copy" size={24} color="black" />
// //                 <Text style={styles.optionText}>Copy</Text>
// //               </TouchableOpacity>
// //             )}
// //             <TouchableOpacity onPress={() => onDelete()} style={styles.optionButton}>
// //               <Feather name="trash-2" size={24} color="black" />
// //               <Text style={styles.optionText}>Delete</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity onPress={() => onUnsend()} style={styles.optionButton}>
// //               <Feather name="send" size={24} color="black" />
// //               <Text style={styles.optionText}>Unsend</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity onPress={onForward} style={styles.optionButton}>
// //               <Feather name="corner-up-right" size={24} color="black" />
// //               <Text style={styles.optionText}>Forward</Text>
// //             </TouchableOpacity>
// //           </Animated.View>
// //         </View>
// //       </TouchableWithoutFeedback>
// //     </Modal>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'flex-end',
// //   },
// //   modalContent: {
// //     width: screenWidth,
// //     height: 100,
// //     backgroundColor: 'white',
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     alignItems: 'center',
// //     paddingVertical: 10,
// //     borderTopLeftRadius: 10,
// //     borderTopRightRadius: 10,
// //     elevation: 5,
// //   },
// //   optionButton: {
// //     alignItems: 'center',
// //   },
// //   optionText: {
// //     marginTop: 5,
// //     fontSize: 12,
// //   },
// // });

// // export default TextMessageOptionsModal;











