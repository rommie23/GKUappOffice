import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";
import { Appbar, Searchbar, List, Avatar, Badge } from "react-native-paper";
import { BASE_URL, IMAGE_URL } from "@env";
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { socket } from "../../../socket";
import { StudentContext } from "../../../context/StudentContext";
import Ionicons from 'react-native-vector-icons/Ionicons';

const COLORS = {
    primary: "#223260",
    primaryLight: "#3a4b78",
    accent: "#a62535",
    accentLight: "#c74354",
    bg: "#f7f8fc",
    subtitle: "#6e6e73",
};

const AllThreads = ({ handleIncomingMessage }) => {
    const [search, setSearch] = React.useState("");
    const [chats, setChats] = useState([])
    const { studentIDNo } = useContext(StudentContext);
    const [isLoading, setIsLoading] = useState(false)
    const ImageUrl = `${IMAGE_URL}Images/Staff/`;
    const ImageUrlStudent = `${IMAGE_URL}Images/Students/`;
    const navigation = useNavigation();

    const myUserId = studentIDNo;

    // socket.on("new-message", (msg) => {
    //     updateChatList(msg);
    // }); 

    useEffect(() => {
        socket.on("new-message", handleIncomingMessage);

        return () => {
            socket.off("new-message", handleIncomingMessage);
        };
    }, []);



    const getAllChats = async () => {        
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {

                const chats = await fetch(BASE_URL + '/notifiaction/allChats', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                })
                const res = await chats.json()
                console.log("All Threads :: ", res);                
                if (res.length < 1) {
                    errorModel(ALERT_TYPE.WARNING, "No Message", "There are no messages to show");
                }
                else {
                    setChats(res)
                }
                setIsLoading(false)
            } catch (error) {
                errorModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!");
                console.log('Error fetching data:getAllChats:', error);
            }
        }
    }

    const formatChatTime = (dateString) => {
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


    useFocusEffect(useCallback(() => {
        getAllChats()
    }, []))

    const newModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
        })
    }

    const errorModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: () => navigation.goBack()
        })
    }

    const renderItem = ({ item }) => (
        <List.Item
            key={item.Title}
            title={`${item.Title?.trim()}(${item.RefId})`}
            description={item.LastMessage}
            titleStyle={{ color: COLORS.primary, fontWeight: "600" }}
            descriptionStyle={{ color: COLORS.subtitle }}
            left={() => {
                if (item.ChatType === "group") {
                    return (
                        <Avatar.Icon
                            size={45}
                            icon="account-group"
                            style={{ backgroundColor: COLORS.primaryLight }}
                        />
                    );
                }
                const dp = item.DisplayPicture;
                if (dp && dp !== "null" && dp !== "undefined") {
                    return (
                        <Avatar.Image
                            size={45}
                            source={{ uri: item.RefId.length > 6 ? ImageUrlStudent+dp : ImageUrl + dp }}
                            style={{ backgroundColor: COLORS.accentLight }}
                        />
                    );
                }
                return (
                    <Avatar.Text
                        size={45}
                        label={item.Title?.charAt(0) ?? "?"}
                        style={{ backgroundColor: COLORS.accentLight }}
                    />
                );
            }}
            right={() => (
                <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
                    <List.Subheader style={{ margin: 0, color: COLORS.subtitle }}>
                        {formatChatTime(item.LastMessageDate)}
                    </List.Subheader>

                    {!item.MessageStatus > 0 && (
                        <Badge
                            size={12}
                            style={{
                                backgroundColor: COLORS.accentLight,
                                marginTop: 4,
                            }}
                        >
                            {!item.MessageStatus}
                        </Badge>
                    )}
                </View>
            )}
            style={styles.listItem}
            onPress={() => navigation.navigate("EachThread", {
                chatId: item.ChatId,
                chatType: item.ChatType,
                recepientId: item.RefId,
                title: `${item.Title?.trim()}`
            })
            }
        />
    );

    return (
        <AlertNotificationRoot>
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: COLORS.primary }}>
                <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
                <Appbar.Content color="white" title={`All Messages`} />
            </Appbar.Header>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.ChatId}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
        </AlertNotificationRoot>
    );
};

export default AllThreads;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    searchbar: {
        margin: 12,
        borderRadius: 12,
        backgroundColor: "#cfd0d3ff",
        width: '70%'
    },
    listItem: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginVertical: 6,
        borderRadius: 12,
        elevation: 1,
        paddingHorizontal: 8,
    },
});
