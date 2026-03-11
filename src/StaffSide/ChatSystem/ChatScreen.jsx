import React, { useEffect, useState, useRef, useContext, useCallback, memo } from "react";
import { View, FlatList, StyleSheet, Platform, TouchableOpacity, Image } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import { Appbar, TextInput, IconButton, Text, Modal, Portal, Button } from "react-native-paper";
import { BASE_URL, IMAGE_URL } from '@env'
import { StudentContext } from "../../context/StudentContext";
import { socket } from "../../socket";
import colors from "../../colors";
import { pick, types } from '@react-native-documents/picker'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { Linking } from "react-native";
import { KeyboardProvider, KeyboardAvoidingView } from "react-native-keyboard-controller";
import { launchImageLibrary } from 'react-native-image-picker';



const COLORS = {
    primary: colors.uniBlue,
    primaryLight: "#3a4b78",
    accent: colors.uniRed,
    bg: "#f7f8fc",
    myMsg: "#e6e9f5",
    otherMsg: "#ffffff",
};


const ChatScreen = ({ route, navigation }) => {
    const { chatId, chatType, recepientId, title } = route.params;
    const { StaffIDNo, data } = useContext(StudentContext);
    const CURRENT_USER_ID = StaffIDNo

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialLoaded, setIsInitialLoaded] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [fileResponse, setFileResponse] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [attachmentMenu, setAttachmentMenu] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 50;



    const flatListRef = useRef(null);
    const hasScrolledInitially = useRef(false);


    useEffect(() => {
        // setIsInitialLoaded(false); // reset for new chat
        fetchMessages(false);
        hasScrolledInitially.current = false;
    }, [recepientId]);

    // const fetchMessages = async () => {
    //     console.log("fetchMessages__fetchMessages");
    //     setIsLoading(true)
    //     const session = await EncryptedStorage.getItem("user_session");
    //     if (session != null) {
    //         try {
    //             const res = await fetch(BASE_URL + "/notifiaction/eachChat", {
    //                 method: 'POST',
    //                 headers: {
    //                     Authorization: `Bearer ${session}`,
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({
    //                     sentTo: recepientId,
    //                     chatType: chatType,

    //                 })
    //             })
    //             const response = await res.json();
    //             console.log("fetchMessagesss::", response);
    //             if (Array.isArray(response)) {
    //                 setMessages(response);
    //                 setIsInitialLoaded(true);
    //             }
    //             setIsLoading(false)
    //         } catch (error) {
    //             console.log("/notifiaction/eachChat", error);
    //             setIsLoading(false)
    //         }
    //     }
    // }

    const fetchMessages = async (loadMore = false) => {
        if (loadingMore || (!hasMore && loadMore)) return;
        loadMore ? setLoadingMore(true) : setIsLoading(true);
        const session = await EncryptedStorage.getItem("user_session");

        if (!session) return;
        try {
            const res = await fetch(BASE_URL + "/notifiaction/eachChat", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sentTo: recepientId,
                    chatType: chatType,
                    limit: LIMIT,
                    offset: loadMore ? offset : 0
                })
            });
            const response = await res.json();
            if (Array.isArray(response)) {

                if (response.length < LIMIT) {
                    setHasMore(false); // no more messages in DB
                }
                if (loadMore) {
                    // add older messages on top
                    setMessages(prev => [...prev, ...response]);
                    setOffset(prev => prev + LIMIT);
                } else {
                    // first load
                    setMessages(response);
                    setOffset(LIMIT);
                    setIsInitialLoaded(true);
                }
            }
        } catch (error) {
            console.log("eachChat error:", error);
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    };

    const sendDocument = async () => {
        if (!selectedFile) return;

        const tempId = Date.now();

        const newMsg = {
            ID: tempId,
            SentBy: CURRENT_USER_ID,
            SentTo: recepientId,
            Message: "",
            AttachmentPath: selectedFile.uri,   // local URI
            FileName: selectedFile.name,
            FileType: selectedFile.type,
            LocalFile: true,                    // important flag
            DateSent: normalizeDateSent(new Date().toISOString()),
        };

        setMessages(prev => [...prev, newMsg]);

        setSelectedFile(null);
        setPreviewVisible(false);

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        try {
            const session = await EncryptedStorage.getItem("user_session");

            const formData = new FormData();

            formData.append("file", {
                uri: selectedFile.uri,
                name: selectedFile.name,
                type: selectedFile.type,
            });

            formData.append("message", "");
            formData.append("recipients", JSON.stringify([recepientId]));
            formData.append("chatType", chatType);

            const res = await fetch(
                BASE_URL + "/notifiaction/sendMessageWithFile",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "multipart/form-data",
                    },
                    body: formData,
                }
            );
            notificationfunction();
            if (!res.ok) {
                console.log("File upload failed");
            }

        } catch (err) {
            console.log("File send error:", err);
        }
    };

    const normalizeDateSent = (dateString) => {
        if (!dateString) return dateString;

        if (dateString.endsWith("Z")) {
            const d = new Date(dateString);
            return d.toLocaleString("sv-SE").replace(" ", "T");
        }
        return dateString;
    };

    const sendMessage = async () => {
        if (!text.trim()) return;

        const newMsg = {
            ID: Date.now(),
            SentBy: CURRENT_USER_ID,
            SentTo: recepientId,
            Message: text,
            DateSent: new Date().toISOString(),
        };

        // setMessages(prev => [...prev, newMsg]);
        setMessages(prev => [
            ...prev,
            {
                ...newMsg,
                DateSent: normalizeDateSent(newMsg.DateSent),
            },
        ]);
        setText("");

        const session = await EncryptedStorage.getItem("user_session");
        try {
            const res = await fetch(BASE_URL + '/notifiaction/sendMessage', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: newMsg.Message,
                    recipients: [recepientId],
                    chatType: chatType,
                    SenderName: `${data.data[0].Name}`,
                }),
            });

            const result = await res.json();
            console.log(result['data'][0]['ID']);

            if (res.ok) {
                console.log("Message sent successfully");
                // notificationfunction(result['data'][0]['ID']);
            } else {
                console.log("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            alert("Network error");
        }

        // setTimeout(() => {
        //     flatListRef.current?.scrollToEnd({ animated: true });
        // }, 100);
    };

    useEffect(() => {
        socket.on("new-message", (msg) => {
            const isThisChat =
                (msg.SentBy === recepientId && msg.SentTo === StaffIDNo) ||
                (msg.SentBy === StaffIDNo && msg.SentTo === recepientId);

            if (isThisChat) {
                setMessages(prev => [...prev, msg]);
            }
        });

        return () => {
            socket.off("new-message");
        };
    }, [recepientId, StaffIDNo]);


    const notificationfunction = async () => {
        const session = await EncryptedStorage.getItem("user_session");
        console.log("notificationfunction");
        try {
            if (session != null) {
                const res = await fetch(BASE_URL + '/notifiaction/chatNotifications', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        sendby: StaffIDNo,
                        receipients: [recepientId],
                        Title: `${data.data[0].Name}`,
                        body: `${text}`,
                        screenName: 'AllChats',
                        webUrl: 'send-message.php',
                        chatType: chatType,
                    })
                })
                const response = await res.json()
                console.log(response);
            }
        } catch (error) {
            console.log("error in Notification::", error);

        }
    };


    // //////////////// PICK DOCUMNENT FUNCTION //////////////
    const pickDocument = useCallback(async () => {
        try {
            const response = await pick({
                presentationStyle: 'fullScreen',
                type: [types.pdf, types.images],
                multi: false,
            });
            const file = response[0];
            if (file && file.size <= 5000000) {
                setSelectedFile(file);
                setPreviewVisible(true);
                setAttachmentMenu(false)
                console.log("After file select::: ", file);
            } else {
                submitModel(
                    ALERT_TYPE.DANGER,
                    "Pdf file Size",
                    "Pdf file size should be less than 5 MB"
                );
            }
        } catch (err) {
            console.log("Document Picker Error:", err);
        }
    }, []);

    ///////////// PICK PHOTOS //////////

    const pickImageFromGallery = () => {

        const options = {
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 1,
        };

        launchImageLibrary(options, (response) => {

            if (response.didCancel) {
                return;
            }

            if (response.errorCode) {
                console.log("ImagePicker Error:", response.errorMessage);
                return;
            }

            const asset = response.assets[0];

            const file = {
                uri: asset.uri,
                name: asset.fileName || `image_${Date.now()}.jpg`,
                type: asset.type,
                size: asset.fileSize,
            };

            if (file.size <= 5000000) {

                setSelectedFile(file);
                setPreviewVisible(true);
                setAttachmentMenu(false)

                console.log("Selected image:", file);

            } else {

                submitModel(
                    ALERT_TYPE.DANGER,
                    "Image Size",
                    "Image must be less than 5 MB"
                );

            }

        });
    };


    const handleDeleteMessage = async (selectedMessage) => {
        let deletedIndex;
        setMessages(prev => {
            deletedIndex = prev.findIndex(
                msg => msg.ID === selectedMessage.ID
            );
            return prev.filter(
                msg => msg.ID !== selectedMessage.ID
            );
        });
        const session = await EncryptedStorage.getItem("user_session");
        try {
            const res = await fetch(
                BASE_URL + '/notifiaction/deleteChatMessage',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        selectedMessage
                    })
                }
            );
            setMenuVisible(false)
            if (!res.ok) throw new Error();
        } catch {
            // restore at original position
            setMessages(prev => {
                const copy = [...prev];
                copy.splice(deletedIndex, 0, selectedMessage);
                return copy;
            });
        }
    };



    const formatWhatsAppTime = (dateString) => {
        if (!dateString) return "";
        const messageDate = new Date(dateString.replace("Z", ""));
        const now = new Date();
        const diffMs = now - messageDate;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const isToday =
            messageDate.toDateString() === now.toDateString();

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);

        const isYesterday =
            messageDate.toDateString() === yesterday.toDateString();
        if (diffSeconds < 60) {
            return "Just now";
        }
        if (diffMinutes < 60) {
            return `${diffMinutes} min ago`;
        }
        if (isToday) {
            return messageDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        }
        if (isYesterday) {
            return "Yesterday";
        }
        return messageDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
        });
    };


    const submitModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: setIsLoading(false)
        })
    }

    const openAttachment = (path) => {
        const url = IMAGE_URL + path;
        Linking.openURL(url);
    };



    const canDeleteMessage = (messageTimeISO) => {
        if (!messageTimeISO) return false;

        const messageTime = new Date(messageTimeISO).getTime();

        // current time + 5:30 IST offset
        const nowIST = Date.now() + (5 * 60 + 30) * 60 * 1000;

        const diffMinutes = (nowIST - messageTime) / (1000 * 60);

        return diffMinutes >= 0 && diffMinutes <= 5;
    };


    const renderMessage = ({ item }) => {
        const isMe = item.SentBy === CURRENT_USER_ID;
        const canDelete = isMe && canDeleteMessage(item.DateSent);

        const isImage =
            item.AttachmentPath?.toLowerCase().endsWith(".jpg") ||
            item.AttachmentPath?.toLowerCase().endsWith(".png") ||
            item.AttachmentPath?.toLowerCase().endsWith(".jpeg");

        // const isPdf =
        //     item.AttachmentPath?.toLowerCase().endsWith(".pdf");

        const isPdf =
            item.FileType === "application/pdf" ||
            item.AttachmentPath?.toLowerCase().endsWith(".pdf");


        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onLongPress={() => {
                    const allowed = isMe && canDeleteMessage(item.DateSent);
                    setSelectedMessage(item);
                    setCanDelete(allowed);
                    setMenuVisible(true);
                }}
                style={[
                    styles.messageBubble,
                    isMe ? styles.myMessage : styles.otherMessage,
                ]}
            >
                {/* GROUP SENDER NAME */}
                {chatType === "group" && !isMe && item.SenderName ? (
                    <Text style={styles.senderName}>
                        {item.SenderName.trim()}
                    </Text>
                ) : null}

                {/* TEXT MESSAGE */}
                {item.Message ? (
                    <Text style={styles.messageText}>{item.Message}</Text>
                ) : null}

                {/* IMAGE PREVIEW */}
                {isImage && (
                    <TouchableOpacity
                        style={{ marginTop: 6 }}
                        onPress={() =>
                            openAttachment(
                                item.LocalFile
                                    ? item.AttachmentPath
                                    : item.AttachmentPath
                            )
                        }
                    >
                        <Image
                            source={{
                                uri: item.LocalFile
                                    ? item.AttachmentPath
                                    : IMAGE_URL + item.AttachmentPath
                            }}
                            style={styles.chatImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}


                {/* PDF PREVIEW */}
                {isPdf && (
                    <TouchableOpacity
                        style={styles.pdfBubble}
                        onPress={() =>
                            openAttachment(
                                item.LocalFile
                                    ? item.AttachmentPath
                                    : item.AttachmentPath
                            )
                        }
                    >
                        <IconButton icon="file-pdf-box" size={26} />

                        <Text numberOfLines={1} style={styles.pdfName}>
                            {item.LocalFile
                                ? item.FileName
                                : item.AttachmentPath.split("/").pop()}
                        </Text>
                    </TouchableOpacity>
                )}


                {/* TIME */}
                <Text style={styles.time}>
                    {formatWhatsAppTime(item.DateSent)}
                </Text>
            </TouchableOpacity>
        );
    };


    return (
        <KeyboardProvider>
            <AlertNotificationRoot>
                {/* HEADER (outside) */}
                <Appbar.Header style={{ backgroundColor: COLORS.primary }}>
                    <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
                    <Appbar.Content color="white" title={title} />
                    {
                        chatType == 'group' &&
                        <TouchableOpacity style={{ backgroundColor: 'white', marginRight: 16, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, elevation: 1 }} onPress={() => navigation.navigate('GroupInfo', { chatId, chatType, recepientId, title })}>
                            <Text>Group Info</Text>
                        </TouchableOpacity>
                    }
                </Appbar.Header>

                {/* Keyboard-aware area */}

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="height"
                >
                    {/* MESSAGES */}
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        inverted
                        keyExtractor={(item) => item.ID.toString()}
                        renderItem={renderMessage}
                        keyboardShouldPersistTaps="handled"
                        onEndReached={() => {
                            if (!loadingMore && hasMore) {
                                fetchMessages(true);
                            }
                        }}
                        onEndReachedThreshold={0.2}
                    />


                    {/* INPUT BAR */}
                    <View style={styles.inputBar}>
                        <TouchableOpacity onPress={() => Platform.OS == 'android' ? pickDocument() : setAttachmentMenu(true)}>
                            <IconButton icon="paperclip" size={22} />
                        </TouchableOpacity>
                        <TextInput
                            value={text}
                            onChangeText={setText}
                            placeholder="Type a message"
                            style={styles.input}
                            multiline
                        />
                        <IconButton
                            icon="send"
                            size={22}
                            iconColor={COLORS.primary}
                            onPress={sendMessage}
                        />
                    </View>
                </KeyboardAvoidingView>

                {/* Portal 1 */}
                <Portal>
                    <Modal
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <Button
                            mode="text"
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate("NewChat", {
                                    forwardMessage: selectedMessage,
                                });
                            }}
                        >
                            Forward
                        </Button>
                        {canDelete && (
                            <Button
                                textColor="red"
                                onPress={() => handleDeleteMessage(selectedMessage)}
                            >
                                Delete
                            </Button>
                        )}
                        <Button onPress={() => setMenuVisible(false)}>
                            Cancel
                        </Button>
                    </Modal>
                </Portal>

                {/* Portal 2 */}
                <Portal>
                    <Modal
                        visible={previewVisible}
                        onDismiss={() => setPreviewVisible(false)}
                        contentContainerStyle={styles.previewContainer}
                    >
                        {/* CLOSE BUTTON */}
                        <IconButton
                            icon="close"
                            size={22}
                            style={{ alignSelf: "flex-end" }}
                            onPress={() => {
                                setSelectedFile(null);
                                setPreviewVisible(false);
                            }}
                        />

                        {/* PREVIEW CONTENT */}
                        {selectedFile?.type?.startsWith("image") ? (
                            <Image
                                source={{ uri: selectedFile.uri }}
                                style={styles.previewImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.pdfPreview}>
                                <IconButton icon="file-pdf-box" size={48} />
                                <Text style={{ fontSize: 16, marginTop: 8 }}>
                                    {selectedFile?.name}
                                </Text>
                                <Text style={{ color: "#666", marginTop: 4 }}>
                                    {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                                </Text>
                            </View>
                        )}

                        {/* SEND BUTTON */}
                        <Button
                            mode="contained"
                            style={{ marginTop: 16 }}
                            onPress={() => sendDocument()}
                        >
                            Send
                        </Button>
                    </Modal>
                </Portal>

                {/* Portal 3 */}
                <Portal>
                    <Modal
                        visible={attachmentMenu}
                        onDismiss={() => setAttachmentMenu(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <Button
                            mode="text"
                            onPress={() => pickDocument()}
                        >
                            Document
                        </Button>
                        <Button
                            textColor="red"
                            onPress={() => pickImageFromGallery()}
                        >
                            Photo
                        </Button>
                        <Button onPress={() => setAttachmentMenu(false)}>
                            Cancel
                        </Button>
                    </Modal>
                </Portal>
            </AlertNotificationRoot>
        </KeyboardProvider>

    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    list: {
        padding: 12,
    },
    messageBubble: {
        maxWidth: "75%",
        padding: 10,
        borderRadius: 10,
        marginVertical: 4,
    },
    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: COLORS.myMsg,
    },
    otherMessage: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.otherMsg,
    },
    messageText: {
        fontSize: 15,
    },
    time: {
        fontSize: 11,
        color: "#666",
        alignSelf: "flex-end",
        marginTop: 4,
    },
    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 6,
        paddingVertical: 6,
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: "#f1f2f6",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 16,
        marginHorizontal: 32,
        borderRadius: 12,
    },
    previewContainer: {
        backgroundColor: "white",
        padding: 16,
        marginHorizontal: 20,
        borderRadius: 12,
    },

    previewImage: {
        width: "100%",
        height: 250,
        borderRadius: 8,
    },

    pdfPreview: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    senderName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#223260",
        marginBottom: 4,
    },

    chatImage: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },

    pdfBubble: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        padding: 10,
        borderRadius: 8,
        marginTop: 6,
        maxWidth: 250,
    },

    pdfName: {
        flex: 1,
        fontSize: 14,
        marginLeft: 6,
    },


});
