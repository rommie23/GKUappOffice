import React, { useEffect } from "react";
import { socket } from "../../../socket";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";


import AllThreads from "./AllThreads";
import EachThread from "./EachThread";

const Stack = createStackNavigator();

export default function MessagesRoot({ studentIDNo }) {

    useEffect(() => {
        console.log("MessagesRoot mounted");

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            socket.emit("join-user", String(studentIDNo));
        });

        socket.on("disconnect", (reason) => {
            console.log("⚠️ Socket disconnected:", reason);
        });

        socket.connect();

        return () => {
            console.log("MessagesRoot unmounted");
            socket.off("connect");
            socket.off("disconnect");
            //   socket.disconnect();
        };
    }, [studentIDNo]);

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
        <PaperProvider>
        <Stack.Navigator>
            <Stack.Screen name="AllThreads" options={{ headerShown: false }}>
                {(props) => (
                    <AllThreads
                        {...props}
                        handleIncomingMessage={handleIncomingMessage}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="EachThread" options={{ headerShown: false }}>
                {(props) => (
                    <EachThread
                        {...props}
                        handleIncomingMessage={handleIncomingMessage}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
        </PaperProvider>
    );
}

// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const MessagesRoot = () => {
//   return (
//     <View>
//       <Text>MessagesRoot</Text>
//     </View>
//   )
// }

// export default MessagesRoot

// const styles = StyleSheet.create({})