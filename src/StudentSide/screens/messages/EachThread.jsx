import React, { useEffect, useState, useRef, useContext } from "react";
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Linking } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import { Appbar, TextInput, IconButton, Text, Modal, Portal, Button } from "react-native-paper";
import { BASE_URL, IMAGE_URL } from '@env'
import { StudentContext } from "../../../context/StudentContext";
import { socket } from "../../../socket";

const COLORS = {
    primary: "#223260",
    primaryLight: "#3a4b78",
    accent: "#a62535",
    bg: "#f7f8fc",
    myMsg: "#e6e9f5",
    otherMsg: "#ffffff",
};


const EachThread = ({ route, navigation }) => {
    const { chatId, chatType, recepientId, title } = route.params;
    const { studentIDNo, data } = useContext(StudentContext);
    const CURRENT_USER_ID = studentIDNo

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialLoaded, setIsInitialLoaded] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);



    const flatListRef = useRef(null);

    useEffect(() => {
        setIsInitialLoaded(false); // reset for new chat
        fetchMessages();
    }, [recepientId]);

    const fetchMessages = async () => {
        console.log("fetchMessages__fetchMessages");
        setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + "/notifiaction/eachChat", {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sentTo: recepientId,
                        chatType: chatType,

                    })
                })
                const response = await res.json();
                console.log("fetchMessages::", response);
                if (Array.isArray(response)) {
                    setMessages(response);
                    setIsInitialLoaded(true);
                }
                setIsLoading(false)
            } catch (error) {
                console.log("/notifiaction/eachChat", error);
                setIsLoading(false)
            }
        }
    }

    const sendMessage = async () => {
        if (!text.trim()) return;

        const newMsg = {
            ID: Date.now(),
            SentBy: CURRENT_USER_ID,
            SentTo: recepientId,
            Message: text,
            DateSent: new Date().toISOString(),
        };

        setMessages(prev => [...prev, newMsg]);
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
                    chatType: chatType
                }),
            });

            const result = await res.json();
            if (res.ok) {
                console.log("Message sent successfully");
                // notificationfunction();
            } else {
                console.log("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            alert("Network error");
        }

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    useEffect(() => {
        socket.on("new-message", (msg) => {
            const isThisChat =
                (msg.SentBy === recepientId && msg.SentTo === studentIDNo) ||
                (msg.SentBy === studentIDNo && msg.SentTo === recepientId);

            if (isThisChat) {
                setMessages(prev => [...prev, msg]);
            }
        });

        return () => {
            socket.off("new-message");
        };
    }, [recepientId, studentIDNo]);

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
                        sendby: studentIDNo,
                        receipients: [recepientId],
                        Title: `${data.data[0].Name}`,
                        body: `${text}`,
                        screenName: 'AllChats',
                        webUrl: 'send-message.php',
                        chatType: chatType
                    })
                })
                const response = await res.json()
                console.log(response);
            }
        } catch (error) {
            console.log("error in Notification::", error);

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

    const openAttachment = (path) => {
        const url = IMAGE_URL + path;      
        Linking.openURL(url);
    };




    // const renderMessage = ({ item }) => {
    //     const isMe = item.SentBy === CURRENT_USER_ID;

    //     return (
    //         <TouchableOpacity
    //             onLongPress={() => {
    //                 setSelectedMessage(item)
    //                 setMenuVisible(true);
    //             }}
    //             style={[
    //                 styles.messageBubble,
    //                 isMe ? styles.myMessage : styles.otherMessage,
    //             ]}
    //         >
    //             {
    //                 chatType == 'group' && !isMe ?
    //                     <Text style={styles.time}>
    //                         {`${item.SenderName.trim()}`}
    //                     </Text> : null
    //             }
    //             <Text style={styles.messageText}>{item.Message}</Text>
    //             <Text style={styles.time}>
    //                 {formatWhatsAppTime(item.DateSent)}
    //             </Text>
    //         </TouchableOpacity>
    //     );
    // };

    const renderMessage = ({ item }) => {
        const isMe = item.SentBy === CURRENT_USER_ID;

        const isImage =
            item.AttachmentPath?.toLowerCase().endsWith(".jpg") ||
            item.AttachmentPath?.toLowerCase().endsWith(".png") ||
            item.AttachmentPath?.toLowerCase().endsWith(".jpeg");

        const isPdf =
            item.AttachmentPath?.toLowerCase().endsWith(".pdf");

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onLongPress={() => {
                    setSelectedMessage(item);
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
                        onPress={() => openAttachment(item.AttachmentPath)}
                    >
                        <Image
                            source={{ uri: IMAGE_URL + item.AttachmentPath }}
                            style={styles.chatImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}

                {/* PDF PREVIEW */}
                {isPdf && (
                    <TouchableOpacity
                        style={styles.pdfBubble}
                        onPress={() => openAttachment(item.AttachmentPath)}
                    >
                        <IconButton icon="file-pdf-box" size={26} />
                        <Text numberOfLines={1} style={styles.pdfName}>
                            {item.AttachmentPath.split("/").pop()}
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
        <>
            {/* HEADER (outside) */}
            <Appbar.Header style={{ backgroundColor: COLORS.primary }}>
                <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
                <Appbar.Content color="white" title={title} />
            </Appbar.Header>

            {/* Keyboard-aware area */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                {/* MESSAGES */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.ID.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.list}
                    keyboardShouldPersistTaps="handled"
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                />

                {/* INPUT BAR */}
            </KeyboardAvoidingView>
        </>

    );
};

export default EachThread;

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
