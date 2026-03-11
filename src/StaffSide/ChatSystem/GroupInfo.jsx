import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { Appbar, TextInput, IconButton, Modal, Portal, Button, List, Avatar } from "react-native-paper";
import { BASE_URL, IMAGE_URL } from '@env'
import { StudentContext } from "../../context/StudentContext";
import colors from "../../colors";
import EncryptedStorage from 'react-native-encrypted-storage';

const COLORS = {
    primary: colors.uniBlue,
    primaryLight: "#3a4b78",
    accent: colors.uniRed,
    bg: "#f7f8fc",
    myMsg: "#e6e9f5",
    otherMsg: "#ffffff",
};

const GroupInfo = ({ route, navigation }) => {
    const { chatId, chatType, recepientId, title } = route.params;
    console.log({ chatId, chatType, recepientId, title });
    const [groupMembersList, setGroupMembersList] = useState([]);
    const [loading, setLoading] = useState(false)

    const groupMemberListFun = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + '/notifiaction/getGroupMembersList', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: recepientId
                    })
                })
                const membersList = await res.json();
                console.log("membersList::", membersList);
                setGroupMembersList(membersList)
                setLoading(false)

            } catch (error) {
                console.log("fetchGroups error ::: ", error);
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        groupMemberListFun();
    }, [])

    return (
        <AlertNotificationRoot>
            <Appbar.Header style={{ backgroundColor: COLORS.primary }}>
                <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
                <Appbar.Content color="white" title={`Group Information`} />
            </Appbar.Header>
            <View style={{backgroundColor:'#fff'}}>
                <Text style={{color: '#1b1b1b', fontSize:24, fontWeight:'600', alignSelf:'center', marginVertical:16}}>{title}</Text>
                <Text style={{color: '#6b6b6b', fontSize:14, alignSelf:'center'}}>Group Members</Text>
                <View style={{marginHorizontal:'24'}}>
                {
                    loading ? <ActivityIndicator/> :
                    groupMembersList.length > 0 &&
                    groupMembersList.map((item) => {
                        const name = item.Name.trim()
                        return (
                            <List.Item
                                key={item.IDNo}
                                title={`${name}(${item.IDNo})`}
                                description={item?.Department}
                                titleStyle={styles.title}
                                left={() => (
                                    item.Imagepath != null || item.Imagepath != undefined ?
                                        <Avatar.Image
                                            size={40}
                                            source={{ uri: item.MemberType == 'Staff' ? `${IMAGE_URL}Images/Staff/${item.Imagepath}` : `${IMAGE_URL}Images/Students/${item.Imagepath}` }}
                                            style={styles.avatar}
                                        /> :

                                        <Avatar.Text
                                            size={40}
                                            label={name.charAt(0).toUpperCase()}
                                            style={styles.avatar}
                                        />
                                )}
                                style={styles.item}
                            />
                        )
                    })
                }
                </View>
            </View>
        </AlertNotificationRoot>
    )
}

export default GroupInfo

const styles = StyleSheet.create({
    item: {
        borderBottomWidth:0.7,
        borderBottomColor:'#a1a1a1',
        marginVertical: 6,
        borderRadius: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        backgroundColor: "#e6e9f5",
    },
    title: {
        fontSize: 15,
        fontWeight: "600",
    }
})