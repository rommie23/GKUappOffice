import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwsome6 from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../colors';
import { useNavigation } from '@react-navigation/native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';


const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const ApplyForDocuments = () => {
	const [tabsData, setTabsData] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation()


	const checkTabs = async () => {
		setLoading(true);
		const session = await EncryptedStorage.getItem("user_session");
		if (session != null) {
			try {
				const tabsData = await fetch(`${BASE_URL}/student/tabsToShowStudent`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${session}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						pageName: 'ApplyCertificates_st'
					})
				});
				const pageTabsData = await tabsData.json();
				console.log({ pageTabsData });

				setTabsData(pageTabsData);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		checkTabs();
	}, []);

	const errorModel = (type, title, message) => {
		Dialog.show({
			type: type,
			title: title,
			textBody: message,
			button: 'close',
		})
	}
	return (
		<ScrollView>
			{
				<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, columnGap: screenWidth / 30, paddingHorizontal: 24, justifyContent: 'flex-start', rowGap: 16, paddingBottom: 4 }}>
					{
						tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'ApplyUniCertificates' &&
						<TouchableOpacity style={[styles.cards]} onPress={() => navigation.navigate("ApplyDocumentsForm")}>
							<View style={styles.cardCont}>
								<View style={[styles.iconOuter, { marginTop: -2 }]}>
									<MaskedView
										style={{ flexDirection: 'row', height: 27, width: 27 }}
										maskElement={
											<View
												style={{
													backgroundColor: 'transparent',
													flex: 1,
													justifyContent: 'center',
													alignItems: 'center',
												}}>
												<MaterialCommunityIcons name='file-document-multiple' color={colors.uniBlue} size={27} />
											</View>
										}>
										<LinearGradient
											colors={[colors.uniRed, colors.uniBlue]}
											style={{ flex: 1 }}
										/>
									</MaskedView>

								</View>
								<Text style={[styles.cardText, { marginTop: 6 }]} >Apply for Document</Text>
							</View>
						</TouchableOpacity>
					}

					{
						tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'TrackAppliedUniCertificates' &&
						<TouchableOpacity style={[styles.cards]} onPress={() => navigation.navigate("TrackApplyDocument")}>
							<View style={styles.cardCont}>
								<View style={[styles.iconOuter, { marginTop: -2 }]}>
									<MaskedView
										style={{ flexDirection: 'row', height: 27, width: 27 }}
										maskElement={
											<View
												style={{
													backgroundColor: 'transparent',
													flex: 1,
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												<MaterialIcons name="my-location"  color={colors.uniBlue} size={21} />
											</View>
										}
									>
										<LinearGradient
											colors={[colors.uniRed, colors.uniBlue]}
											style={{ flex: 1 }}
										/>
									</MaskedView>

								</View>
								<Text style={[styles.cardText, { marginTop: 6 }]} >Track Applied Documents</Text>
							</View>
						</TouchableOpacity>
					}
					
					{
						tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'ApplyReturnCertificates' &&
						<TouchableOpacity style={[styles.cards]} onPress={() => navigation.navigate("OriginalDocumentReturn")}>
							<View style={styles.cardCont}>
								<View style={[styles.iconOuter, { marginTop: -2 }]}>
									<MaskedView
										style={{ flexDirection: 'row', height: 27, width: 27 }}
										maskElement={
											<View
												style={{
													backgroundColor: 'transparent',
													flex: 1,
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												<MaterialIcons name="post-add" color={colors.uniBlue} size={27} />
											</View>
										}
									>
										<LinearGradient
											colors={[colors.uniRed, colors.uniBlue]}
											style={{ flex: 1 }}
										/>
									</MaskedView>

								</View>
								<Text style={[styles.cardText, { marginTop: 6 }]} >Document Return Request</Text>
							</View>
						</TouchableOpacity>
					}

					{
						tabsData?.[3]?.['IsVisible'] == 1 && tabsData?.[3]?.ElementName === 'TrackReturnCertificates' &&
						<TouchableOpacity style={[styles.cards]} onPress={() => navigation.navigate("TrackReturnRequest")}>
							<View style={styles.cardCont}>
								<View style={[styles.iconOuter, { marginTop: -2 }]}>
									<MaskedView
										style={{ flexDirection: 'row', height: 27, width: 27 }}
										maskElement={
											<View
												style={{
													backgroundColor: 'transparent',
													flex: 1,
													justifyContent: 'center',
													alignItems: 'center',
												}}>
												<Ionicons name="locate" color={colors.uniBlue} size={21} />
											</View>
										}>
										<LinearGradient
											colors={[colors.uniRed, colors.uniBlue]}
											style={{ flex: 1 }}
										/>
									</MaskedView>

								</View>
								<Text style={[styles.cardText, { marginTop: 6 }]} >Track Return Documents</Text>
							</View>
						</TouchableOpacity>
					}
				</View>
			}
		</ScrollView>
	)
}

export default ApplyForDocuments

const styles = StyleSheet.create({
	// Common CSS of all the cards
	cards: {
		width: screenWidth / 2.4,
		paddingBottom: 28,
		alignSelf: 'center',
		elevation: 2,
		backgroundColor: 'white',
		// opacity: disabled? 0.5 :1
		borderRadius: 8
	},
	cardText: {
		fontSize: 12,
		textAlign: 'center',
		marginTop: 8,
		color: '#1b1b1b'
	},

	// Card outer container CSS
	cardCont: {
		alignItems: 'center',
		height: screenHeight / 11,
		padding: 8,
		alignSelf: 'center',
	},
	iconOuter: {
		borderColor: colors.uniBlue,
		borderWidth: 1,
		borderRadius: 32,
		padding: 10,
	},
})