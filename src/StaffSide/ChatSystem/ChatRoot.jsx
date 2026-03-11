import React, { useEffect } from "react";
import { socket } from "../../socket";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { KeyboardProvider } from "react-native-keyboard-controller";


import AllChats from "./AllChats";
import ChatScreen from "./ChatScreen";
import NewChat from "./NewChat";
import GroupInfo from "./GroupInfo"

const Stack = createStackNavigator();

export default function ChatRoot({ StaffIDNo }) {

    useEffect(() => {
        console.log("ChatRoot mounted");

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            socket.emit("join-user", String(StaffIDNo));
        });

        socket.on("disconnect", (reason) => {
            console.log("⚠️ Socket disconnected:", reason);
        });

        socket.connect();

        return () => {
            console.log("ChatRoot unmounted");
            socket.off("connect");
            socket.off("disconnect");
            //   socket.disconnect();
        };
    }, [StaffIDNo]);

    useEffect(() => {
        socket.on("new-message", (msg) => {
            console.log("📩 REALTIME MESSAGE RECEIVED:", msg);
        });

        return () => {
            socket.off("new-message");
        };
    }, []);


    const handleIncomingMessage = (msg) => {
        setChats((prevChats) => {
            let updatedChats = [...prevChats];

            // 🔹 PERSONAL CHAT
            if (!msg.GroupId) {
                const otherUserId =
                    msg.SentBy === myUserId ? msg.SentTo : msg.SentBy;

                const index = updatedChats.findIndex(
                    (c) => c.ChatType === "personal" && c.RefId == otherUserId
                );

                if (index !== -1) {
                    // update existing chat
                    const updatedChat = {
                        ...updatedChats[index],
                        LastMessage: msg.Message,
                        LastMessageDate: msg.DateSent,
                        MessageStatus: msg.SentBy === myUserId ? 1 : 0,
                    };

                    updatedChats.splice(index, 1); // remove old
                    return [updatedChat, ...updatedChats];
                }

                // new personal chat
                return [
                    {
                        ChatType: "personal",
                        ChatId: msg.ID,
                        RefId: otherUserId,
                        Title: "New Chat",
                        LastMessage: msg.Message,
                        LastMessageDate: msg.DateSent,
                        DisplayPicture: null,
                        MessageStatus: 0,
                    },
                    ...updatedChats,
                ];
            }

            // 🔹 GROUP CHAT (future-safe)
            const index = updatedChats.findIndex(
                (c) => c.ChatType === "group" && c.RefId == msg.GroupId
            );

            if (index !== -1) {
                const updatedChat = {
                    ...updatedChats[index],
                    LastMessage: msg.Message,
                    LastMessageDate: msg.DateSent,
                    MessageStatus: 0,
                };

                updatedChats.splice(index, 1);
                return [updatedChat, ...updatedChats];
            }

            return updatedChats;
        });
    };


    return (
        <KeyboardProvider>
            <PaperProvider>
                <Stack.Navigator>
                    <Stack.Screen name="AllChats" options={{ headerShown: false }}>
                        {(props) => (
                            <AllChats
                                {...props}
                                handleIncomingMessage={handleIncomingMessage}
                            />
                        )}
                    </Stack.Screen>
                    <Stack.Screen name="ChatScreen" options={{ headerShown: false }}>
                        {(props) => (
                            <ChatScreen
                                {...props}
                                handleIncomingMessage={handleIncomingMessage}
                            />
                        )}
                    </Stack.Screen>
                    <Stack.Screen name="NewChat" component={NewChat} />
                    <Stack.Screen name="GroupInfo" component={GroupInfo} options={{ headerShown: false }} />
                </Stack.Navigator>
            </PaperProvider>
        </KeyboardProvider>
    );
}
