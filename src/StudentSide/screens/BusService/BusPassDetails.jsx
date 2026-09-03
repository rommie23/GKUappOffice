import { RefreshControl, Dimensions, ScrollView, StyleSheet, Text, Alert, View, TouchableOpacity, ActivityIndicator, Modal, Image } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import colors from '../../../colors';
import { useCallback, useContext, useEffect, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { StudentContext } from '../../../context/StudentContext';
import { SelectList } from 'react-native-dropdown-select-list';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const BusPassDetails = () => {
	const { data } = useContext(StudentContext)
	const [busRootData, setBusRootData] = useState([])
	const [busSpotData, setBusSpotData] = useState([])
	const [selectedRoot, setSelectedRoot] = useState('')
	const [selectedSpot, setSelectedSpot] = useState('')
	const [applyResponse, setApplyResponse] = useState('')
	const [passData, setPassData] = useState({})
	const [pendingPassData, setPendingPassData] = useState({})
	const [busFees, setBusFees] = useState(0)
	const [semester, setSemester] = useState(0)

	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false)
	const md5Hash = data.data[0]['IDNo'];
	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(md5Hash)}`;
	const navigation = useNavigation()

	const getPendingPassData = async () => {
		setLoading(true)
		const session = await EncryptedStorage.getItem("user_session")
		if (session != null) {
			try {
				const passData = await fetch(`${BASE_URL}/student/pendingBusPass`, {
					method: 'POST',
					headers: {
						Accept: "application/json",
						"Content-type": "application/json",
						Authorization: `Bearer ${session}`,
					}
				})
				const passDataDetails = await passData.json()
				console.log("pendingBusPassDetails::::::::: ", passDataDetails);
				setPendingPassData(passDataDetails)
				setLoading(false)
			} catch (error) {
				console.log('Error fetching OldBusPass data:apply:', error);
				setLoading(false)
			}
		}
	}

	const oldBusPass = async () => {
		setLoading(true)
		const session = await EncryptedStorage.getItem("user_session")
		if (session != null) {
			try {
				const passData = await fetch(`${BASE_URL}/student/eachbuspass`, {
					method: 'POST',
					headers: {
						Accept: "application/json",
						"Content-type": "application/json",
						Authorization: `Bearer ${session}`,
					}
				})
				const passDataDetails = await passData.json()
				// console.log("passDataDetails::::::::: ", passDataDetails);
				setPassData(passDataDetails)
				setLoading(false)
			} catch (error) {
				console.log('Error fetching OldBusPass data:apply:', error);
				setLoading(false)
			}
		}
	}

	// get details about the routes of the buses
	const getBusRoutesDetails = async () => {
		setLoading(true)
		const session = await EncryptedStorage.getItem("user_session")
		if (session != null) {
			try {
				const busRoot = await fetch(`${BASE_URL}/student/transportrootes`, {
					method: 'POST',
					headers: {
						Accept: "application/json",
						"Content-type": "application/json",
						Authorization: `Bearer ${session}`,
					}
				})
				const busRootDetails = await busRoot.json()
				// console.log('bus Root details', busRootDetails["data"])

				const busRootsArray = busRootDetails['data'].map((item, i) => {
					return { key: item['BusRouteID'], value: item['RouteName'].trim() }
				})
				setBusRootData(busRootsArray)

				setLoading(false)

			} catch (error) {
				console.log('Error fetching bus route data:apply:', error);
				errorModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!");
				// setShowModal(true)
				setLoading(false)
			}
		}
	}

	// get all the stops of each bus from where users can aboard bus
	const getBusSpot = async (spotid) => {
		console.log("getBusSpot::", spotid);

		const session = await EncryptedStorage.getItem("user_session")
		if (session != null) {
			try {
				const busSpots = await fetch(`${BASE_URL}/student/transportspot/${spotid}`, {
					method: 'POST',
					headers: {
						Accept: "application/json",
						"Content-type": "application/json",
						Authorization: `Bearer ${session}`,
					}
				})
				const busSpotsDetail = await busSpots.json()
				const busSpotArray = busSpotsDetail['data'].map((item, i) => {
					return { "key": item['StopageID'], "value": item['Spot'], fees: item['BusFee'] }
				})
				// console.log(busSpotsDetail['data']);
				// console.log("bus stop array",busSpotArray);
				setBusSpotData(busSpotArray)
				setSelectedRoot(spotid)
				setLoading(false)
				setSelectedSpot(0)
			} catch (error) {
				console.log('Error fetching busStop data:passApply:', error);
				setLoading(false)
			}
		}
	}

	const selectSpot = (val) => {
		console.log(busSpotData);

		const spot = busSpotData.find(item => item.key === val);
		setSelectedSpot(val);
		setBusFees(spot?.fees || 0);
	}

	useEffect(() => {
		oldBusPass();
		getBusRoutesDetails();
		getPendingPassData();
	}, [])

	const options = [
		{ key: '1', value: '1' },
		{ key: '2', value: '2' },
		{ key: '3', value: '3' },
		{ key: '4', value: '4' },
		{ key: '5', value: '5' },
		{ key: '6', value: '6' },
		{ key: '7', value: '7' },
		{ key: '8', value: '8' },
		{ key: '9', value: '9' },
		{ key: '10', value: '10' },
		{ key: '11', value: '11' },
		{ key: '12', value: '12' },
		{ key: '13', value: '13' },
		{ key: '14', value: '14' },
		{ key: '15', value: '15' },
		{ key: '16', value: '16' },
		{ key: '17', value: '17' },
		{ key: '18', value: '18' },
		{ key: '19', value: '19' },
		{ key: '20', value: '20' },
	]

	// function to operaions when apply button will appear and pressed for non-fees
	// const applyBusPass = async () => {
	// 	const session = await EncryptedStorage.getItem("user_session")
	// 	if (session != null) {
	// 		try {
	// 			const busPassSend = await fetch(`${BASE_URL}/student/applybuspass/${selectedRoot}/${selectedSpot}`, {
	// 				method: 'POST',
	// 				headers: {
	// 					Accept: "application/json",
	// 					"Content-type": "application/json",
	// 					Authorization: `Bearer ${session}`,
	// 				}
	// 			})
	// 			// console.log("route: ", selectedRoot, 'spot: ', selectedSpot);
	// 			const busPassSendDetails = await busPassSend.json()

	// 			// console.log('Bus pass apply flag',busPassSendDetails);
	// 			setApplyResponse(busPassSendDetails['data'])
	// 			setLoading(false)
	// 			busPassSendDetails['data'] == 1 ?
	// 				submitModel(ALERT_TYPE.SUCCESS, "Done", "Bus pass applied Successfully.")
	// 				: busPassSendDetails['data'] == -1 ?
	// 					submitModel(ALERT_TYPE.WARNING, "Sorry", "Form already applied.")
	// 					: busPassSendDetails['data'] == -2 ?
	// 						submitModel(ALERT_TYPE.WARNING, "Oops!!", "Please Select Route and Spot.")
	// 						:
	// 						errorModel(ALERT_TYPE.DANGER, "oops!!!", "Something went wrong !!!");
	// 			// setApplyModal(true)
	// 		} catch (error) {
	// 			console.log('Error fetching busApplyBtn data:passApply:', error);
	// 			setLoading(false)
	// 			// setApplyModal(true)
	// 		}
	// 	}
	// }


	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => {
			oldBusPass();
			getPendingPassData();
			setRefreshing(false);
		}, 2000);
	}, []);
	return (
		<AlertNotificationRoot>
			<ScrollView
				style={{ backgroundColor: '#f1f1f1' }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				{
					passData.flag == 0 &&
					<View style={[styles.formSelectors, { alignSelf: 'flex-start' }]}>
						<Text style={styles.label}>Select Bus Roots</Text>

						<SelectList boxStyles={{ padding: 10, width: "100%" }}
							setSelected={(val) => getBusSpot(val)}
							fontFamily='time'
							data={busRootData}
							arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4 }} />}
							search={false}
							defaultOption={{ key: '0', value: 'Select Bus Route' }}
							inputStyles={{ color: 'black' }}
							dropdownTextStyles={{ color: 'black' }}
							onFocus={() => console.log('focus is on')}
							onBlur={() => console.log('focus is off')}
						/>

						<Text style={[styles.label, { marginTop: 16 }]}>Select Pickup Spot</Text>
						<SelectList boxStyles={{ padding: 10, width: "100%" }}
							setSelected={(val) => selectSpot(val)}
							fontFamily='time'
							data={busSpotData}
							arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
							search={false}
							defaultOption={{ key: '0', value: 'Select Bus Spot' }}
							inputStyles={{ color: 'black' }}
							dropdownTextStyles={{ color: 'black' }}
						/>
						<Text style={[styles.label, { marginTop: 16 }]}>Select Semester</Text>
						<SelectList boxStyles={{ padding: 10, width: "100%" }}
							setSelected={(val) => setSemester(val)}
							fontFamily='time'
							data={options}
							arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
							search={false}
							defaultOption={{ key: '0', value: 'Select Semester' }}
							inputStyles={{ color: 'black' }}
							dropdownTextStyles={{ color: 'black' }}
						/>
						{/* { console.log(selectedSpot) } */}
						{
							selectedRoot != '' && selectedSpot != 0 && semester != 0 &&
							<View>
								<Text style={styles.textSmall}>Fees to be paid : {busFees}</Text>
								{/* <TouchableOpacity style={styles.button} onPress={applyBusPass}>
												<Text style={styles.btnText}>Apply Bus Pass</Text>
										</TouchableOpacity> */}
								<TouchableOpacity style={[styles.button, {opacity:pendingPassData.flag === 1 ? 0.5 : 1}]} onPress={() => navigation.navigate('BusFeePay', { fee: busFees, sem: semester, routeId: selectedRoot, spotId: selectedSpot })}
									disabled={pendingPassData.flag === 1}>
									<Text style={styles.btnText}>Apply</Text>
								</TouchableOpacity>
							</View>
						}
						{
							applyResponse == -1 ? <Text style={{ color: colors.uniBlue, alignSelf: 'center' }}>Bus Pass is Already Applied</Text>
								: applyResponse == 1 ? <Text style={{ color: colors.uniBlue, alignSelf: 'center' }}>Bus Pass Applied Successfully</Text> :
									null
						}
					</View>
				}
				{passData.flag == 1 &&
					<View style={{ alignItems: 'center', marginTop: 20, backgroundColor: '#fff', paddingVertical: 24 }}>
						<View style={{ borderColor: colors.uniRed, borderWidth: 2, padding: 20, borderRadius: 16 }}>
							<View style={{ alignContent: 'flex-start' }}>
								<Text style={{ color: colors.uniBlue, fontSize: 20, marginBottom: 8, fontWeight: '700', alignSelf: 'center' }}>Bus Pass</Text>
								<Text style={styles.smallTxt}>Pass No : {passData?.data?.[0]['SerialNo']}</Text>
								<Text style={styles.smallTxt}>{data.data[0].StudentName}</Text>
								<Text style={styles.smallTxt}>{data.data[0].UniRollNo}</Text>
							</View>
							<Image
								source={{ uri: qrUrl }}
								style={{ width: 220, height: 220, marginVertical: 16, alignSelf: 'center' }}
							/>
							<View style={{ alignContent: 'flex-start' }}>
								<Text style={styles.smallTxt}>Route : {passData?.data?.[0]['route']}</Text>
								<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
									<Text style={{ fontSize: 16, fontWeight: '500' }}><Text style={[styles.smallTxt, { color: colors.uniBlue }]}>Spot: </Text>{passData?.data?.[0]['spot']}</Text>
								</View>
								<Text style={[styles.smallTxt, { color: colors.uniRed }]}>Expiry : {passData?.data?.[0]['expiryDate'].split("T")[0].split("-").reverse().join("-")}</Text>
								<Text style={{ fontSize: 14, alignSelf: 'center', marginTop: 10 }}>Scan to verify Bus Pass</Text>
							</View>
						</View>
					</View>
				}
				<View style={{ marginTop: 16, minWidth: '96%', alignSelf: 'center' }}>
					{pendingPassData?.data?.map((item, i) => {
						const status =
							item.p_status == 0 ? { text: 'Applied', color: '#2563EB', bg: '#EFF6FF' } :
								item.p_status == 1 ? { text: 'Pending', color: '#D97706', bg: '#FFFBEB' } :
									item.p_status == 2 ? { text: 'Rejected By IT', color: '#DC2626', bg: '#FEF2F2' } :
										item.p_status == 3 ? { text: 'Forwarded to Account', color: '#2563EB', bg: '#EFF6FF' } :
											item.p_status == 4 ? { text: 'Rejected By Account', color: '#DC2626', bg: '#FEF2F2' } :
												item.p_status == 5 ? { text: 'Ready to Print', color: '#7C3AED', bg: '#F5F3FF' } :
													{ text: 'Printed', color: '#16A34A', bg: '#F0FDF4' };

						const expiryDate = item.expiryDate
							? item.expiryDate.slice(0, 10).split('-').reverse().join('-')
							: 'N/A';

						const rejectionReason =
							item.p_status == 4 && item.ac_reason
								? `${item.ac_reason} on ${item.acrejectdate}`
								: item.p_status == 2 && item.itreason
									? item.itreason
									: null;

						return (
							<View
								key={i}
								style={{ backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 14, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, borderWidth: 1, borderColor: '#E5E7EB', }}>

								{/* Header */}
								<View
									style={{ paddingHorizontal: 16, paddingVertical: 13, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
									<View style={{ flex: 1 }}>
										<Text
											style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5, }}>Pass Number</Text>

										<Text
											style={{
												fontSize: 17,
												fontWeight: '800',
												color: '#0F172A',
											}}
										>
											#{item.SerialNo}
										</Text>
									</View>

									<View
										style={{
											backgroundColor: status.bg, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: status.color + '25'
										}}>
										<Text
											style={{ fontSize: 12, fontWeight: '700', color: status.color, }}>
											{status.text}</Text>
									</View>
								</View>

								{/* Main information */}
								<View
									style={{ paddingHorizontal: 16, paddingVertical: 15, flexDirection: 'row', }}>
									<View style={{ flex: 1 }}>
										<Text
											style={{fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 5}}>BUS ROUTE</Text>
										<Text
											style={{fontSize: 14, color: '#1E293B', fontWeight: '700',
											}}numberOfLines={2}>{item.route}</Text>
									</View>

									<View
										style={{width: 1, backgroundColor: '#E2E8F0', marginHorizontal: 12,
										}}/>

									<View style={{ flex: 1 }}>
										<Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 5, }}>BUS STOP</Text>

										<Text
											style={{fontSize: 14, color: '#1E293B', fontWeight: '700',}}
											numberOfLines={2}>{item.spot}</Text>
									</View>
								</View>

								{/* Bottom information */}
								<View
									style={{
										marginHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', flexDirection: 'row',
									}}
								>
									<View style={{ flex: 1 }}>
										<Text
											style={{
												fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 4,
											}}
										>
											SESSION
										</Text>

										<Text
											style={{
												fontSize: 14, color: '#334155', fontWeight: '600',
											}}
										>
											{item.session}
										</Text>
									</View>

									<View style={{ flex: 1 }}>
										<Text
											style={{
												fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 4,
											}}
										>
											EXPIRY DATE
										</Text>

										<Text
											style={{
												fontSize: 14, color:
													item.expiryDate
														? '#334155'
														: '#94A3B8', fontWeight: '600',
											}}>{expiryDate}
										</Text>
									</View>
								</View>

								{/* Rejection reason */}
								{rejectionReason && (
									<View
										style={{
											marginTop: 2, paddingHorizontal: 16, paddingVertical: 11, backgroundColor: '#FEF2F2', borderTopWidth: 1, borderTopColor: '#FECACA',
										}}>
										<Text
											style={{ fontSize: 11, fontWeight: '700', color: '#B91C1C', marginBottom: 3, }}>REASON</Text>

										<Text
											style={{ fontSize: 13, lineHeight: 18, color: '#DC2626', }}>
											{rejectionReason}</Text>
									</View>
								)}
							</View>
						);
					})}
				</View>

			</ScrollView>
		</AlertNotificationRoot>
	)
}

export default BusPassDetails

const styles = StyleSheet.create({
	mainTable: {
		backgroundColor: 'white',
	},
	headerTable: {
		backgroundColor: colors.uniBlue,
	},
	headerText: {
		color: 'white',
		fontSize: 16
	},
	cardOuter: {
		width: screenWidth,
		alignItems: 'center',
		paddingHorizontal: 8,
	},
	card: {
		width: '100%',
		backgroundColor: 'white',
		flexDirection: "row",
		justifyContent: 'space-between',
		padding: 16,
		marginTop: 8,
		borderRadius: 16,
		elevation: 1
	},
	cardTxt: {
		color: '#1b1b1b',
		fontSize: 20,
		fontWeight: '500'
	},
	smallTxt: {
		color: '#1b1b1b',
		fontSize: 16,
		fontWeight: '700',
		alignSelf: 'center',
	},
	textSmall: {
		color: 'grey',
		fontSize: 13,
		alignSelf: 'center',
	},
	formSelectors: {
		marginVertical: 16,
		justifyContent: 'space-between',
		backgroundColor: 'white',
		elevation: 1,
		paddingHorizontal: 36,
		paddingVertical: 16,
		borderRadius: 16,
		rowGap: 8
	},
	button: {
		backgroundColor: "#223260",
		height: 45,
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 3,
		paddingHorizontal: 12,
		marginHorizontal: 32,
	},
	btnText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold"
	},
	outerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 8,

	},
})