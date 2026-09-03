// import { Alert, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import React, { useCallback, useEffect, useState } from 'react'
// import { List } from 'react-native-paper';
// import colors from '../../../colors'
// import { useNavigation } from '@react-navigation/native';
// import EncryptedStorage from 'react-native-encrypted-storage';
// import { BASE_URL, IMAGE_URL } from '@env';
// import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
// import Spinner from 'react-native-loading-spinner-overlay';
// import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { pick, types, isCancel } from '@react-native-documents/picker'

// let launchImageLibrary = _launchImageLibrary;
// let launchCamera = _launchCamera;
// const screenWidth = Dimensions.get('window').width
// const screenHeight = Dimensions.get('window').height

// const MyCertificates = () => {
// 	const [isloading, setIsLoading] = useState(false)
// 	const [refreshing, setRefreshing] = useState(false)
// 	const navigation = useNavigation()
// 	const [imageUri, setImageUri] = useState(null);
// 	const [ImgSizeError, setImgSizeError] = useState(null);
// 	const [SignSizeError, setSignSizeError] = useState(null);
// 	const [showImageChangeButton, setShowImageChangeButton] = useState(true)
// 	const [certificateList, setCertificateList] = useState([])
// 	const [fileResponse, setFileResponse] = useState([]);
// 	const [selectPdf, setSelectPdf] = useState(false)

// 	const getList = async () => {
// 		setIsLoading(true)
// 		const session = await EncryptedStorage.getItem("user_session")
// 		if (session != null) {
// 			try {
// 				const list = await fetch(`${BASE_URL}/student/certificateList`, {
// 					method: 'POST',
// 					headers: {
// 						"Contect-Type": "application/json",
// 						Authorization: `Bearer ${session}`,
// 					}
// 				})
// 				const listDetails = await list.json()
// 				setCertificateList(listDetails);
// 				setIsLoading(false)
// 				// console.log("listDetails", listDetails);

// 			} catch (error) {
// 				setIsLoading(false)
// 				errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
// 			}
// 		}
// 	}

// 	/////////////////////////////// UPLOAD the pdf for details correction /////////////////////////
// 	const pickDocument = useCallback(async () => {
// 		try {
// 			const response = await pick({
// 				presentationStyle: 'fullScreen',
// 				type: types.pdf
// 			});
// 			console.log("the reponse after file select :::", response);
// 			const file = response[0];
// 			if (file && file.size <= 600000) {
// 				setFileResponse(response);
// 				console.log("After file select::: ", file);
// 				setSelectPdf(true);
// 			} else {
// 				submitModel(
// 					ALERT_TYPE.DANGER,
// 					"Pdf file Size",
// 					"Pdf file size should be less than 500 KB"
// 				);
// 			}
// 		} catch (err) {
// 			console.log("Document Picker Error:", err);
// 		}
// 	}, []);

// 	const uploadPdf = async (srno) => {
// 		setIsLoading(true)
// 		if (!fileResponse) return;
// 		console.log("mmsmsjslsjklsjdkl:::: ", srno);

// 		const formData = new FormData();
// 		formData.append('certificate', {
// 			uri: fileResponse[0]["uri"],
// 			type: fileResponse[0]["type"],
// 			name: "studentIDNo" + '.pdf',
// 		});
// 		console.log("form data to submit", formData["_parts"]);
// 		try {
// 			const session = await EncryptedStorage.getItem("user_session")
// 			const response = await fetch(`${BASE_URL}/Student/uploadCertificates/${srno}`, {
// 				method: 'POST',
// 				headers: {
// 					Authorization: `Bearer ${session}`,
// 					'Content-Type': 'multipart/form-data',
// 				},
// 				body: formData
// 			});
// 			console.log('pdf uploaded successfully', response.json());
// 			errorModel(ALERT_TYPE.SUCCESS, "Done", `File Uploaded Successfully`)
// 			setIsLoading(false)
// 		} catch (error) {
// 			setIsLoading(false)
// 			console.error('pdf upload failed', error);
// 			errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
// 		}
// 	};


// 	useEffect(() => {
// 		getList();
// 	}, [])

// 	const onRefresh = useCallback(() => {
// 		setRefreshing(true);
// 		setTimeout(() => {
// 			setRefreshing(false);
// 		}, 2000);
// 	}, []);

// 	const errorModel = (type, title, message) => {
// 		Dialog.show({
// 			type: type,
// 			title: title,
// 			textBody: message,
// 			button: 'close',
// 			onHide: () => navigation.goBack()
// 		})
// 	}

// 	const submitModel = (type, title, message) => {
// 		Dialog.show({
// 			type: type,
// 			title: title,
// 			textBody: message,
// 			button: 'close',
// 		})
// 	}
// 	return (
// 		<AlertNotificationRoot>
// 			{isloading &&
// 				<Spinner visible={isloading}/>
// 			}
// 			<View
// 				refreshControl={
// 					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
// 				}>

// 				<ScrollView keyboardShouldPersistTaps={'handled'}>

// 					<List.AccordionGroup >
// 						{
// 							certificateList.length != 0 ?

// 								certificateList.map((certificate, index) =>
// 									<List.Accordion title={certificate['DocumentsRequired']} id={index} key={index}
// 										right={props =>
// 											certificate['Action'] == 0 ?
// 												<View style={{ flexDirection: 'row', columnGap: 4 }}>
// 													<Text style={{ color: 'gray' }}>In Review</Text>
// 													<FontAwesome name='clock-o' color={colors.uniBlue} size={24} />
// 												</View>
// 												: certificate["Action"] == 1 ?
// 													<View style={{ flexDirection: 'row', columnGap: 4 }}>
// 														<Text style={{ color: 'gray' }}>Verified</Text>
// 														<FontAwesome name='check-circle-o' color={"green"} size={24} />
// 													</View>
// 													: certificate["Action"] == 2 ?
// 														<View style={{ flexDirection: 'row', columnGap: 4 }}>
// 															<Text style={{ color: 'gray' }}>Rejected</Text>
// 															<FontAwesome name='times-circle-o' color={colors.uniRed} size={24} />
// 														</View>
// 														: <Text style={{ color: 'gray' }}>Not uploaded yet</Text>
// 										}
// 										description={`Click to check certificate`}
// 										style={styles.shadowView}
// 									>
// 										<View style={styles.uploadContainer}>
// 											{ImgSizeError &&
// 												<Text style={{ color: 'red', alignSelf: 'center' }} >Pdf size should be 500KB or less</Text>
// 											}
// 											{/* {
//                                     imageUri ? <Image source={{ uri: imageUri }} style={{ width: 200, height: 200,alignSelf:'center',marginTop:10 }} />:
//                                     <Image source={{ uri: IMAGE_URL+"Images/Students/"+ studentImage }} style={{ width: 200, height: 100,resizeMode:'contain',alignSelf:'center',marginTop:10 }} />  } */
// 											}
// 											{
// 												certificate['Original'] != null ?
// 													<TouchableOpacity style={{ alignItems: 'center', marginTop: 12 }} onPress={() => navigation.navigate('CertificateViewer', { filePath: `${IMAGE_URL}/StudentDocument/${certificate["Original"]}` })}>
// 														{console.log(`${IMAGE_URL}StudentDocument/${certificate["Original"]}`)}

// 														<FontAwesome name='file-pdf-o' size={48} color={colors.uniRed} />
// 														<Text style={{ color: colors.uniBlue }}>Tap to Preview</Text>
// 													</TouchableOpacity>
// 													: null
// 											}
// 											{
// 												certificate['Action'] != 1 ?
// 													<>
// 														{fileResponse.map((file, index) => (
// 															<Text
// 																key={index.toString()}
// 																style={{ color: 'black', marginTop: 20, marginRight: 20, marginLeft: 20 }}
// 																numberOfLines={1}
// 																ellipsizeMode={'middle'}>
// 																{file?.name}
// 															</Text>
// 														))}
// 														<TouchableOpacity style={{ marginTop: 4, marginRight: 20, marginLeft: 20, backgroundColor: '#778DA2', borderRadius: 10 }} onPress={() => pickDocument()}>
// 															<Text style={{ color: '#fff', padding: 10, alignSelf: 'center' }}>{`Choose File(pdf)`}</Text>
// 														</TouchableOpacity>
// 														<Text style={{ color: 'green', alignSelf: 'center' }} >Note: Upload File size should be 500KB or less</Text>
// 														<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }} onPress={() => uploadPdf(certificate['SerialNo'])}>
// 															<Text style={{ color: '#fff', padding: 10 }}>Upload</Text>
// 														</TouchableOpacity>
// 													</>
// 													: <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }}>
// 														<Text style={{ color: '#fff', padding: 10 }}>Already Verified</Text>
// 													</View>
// 											}
// 											{
// 												certificate['Remarks'] != null && certificate['Action'] == 2 ?
// 													<Text style={{ color: colors.uniRed, padding: 10, fontWeight: 600 }}>{`Reject Reason : ${certificate["Remarks"]}`}</Text>
// 													: null
// 											}
// 											<View><Text></Text></View>
// 										</View>

// 									</List.Accordion>
// 								) :
// 								<Text style={{ color: 'gray', textAlign: "center" }}>No Data Found</Text>
// 						}
// 					</List.AccordionGroup>
// 				</ScrollView>
// 			</View>
// 		</AlertNotificationRoot>
// 	)
// }

// export default MyCertificates

// const styles = StyleSheet.create({
// 	shadowView: {
// 		backgroundColor: 'white',
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		shadowColor: '#000', // Shadow color
// 		shadowOffset: { width: 0, height: 10 }, // Offset at the bottom
// 		shadowOpacity: 0.3, // How opaque the shadow is
// 		shadowRadius: 8, // Blur effect of the shadow
// 		elevation: 5, // Android shadow
// 	},
// })

import { Alert, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { List } from 'react-native-paper'
import colors from '../../../colors'
import { useNavigation } from '@react-navigation/native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL, IMAGE_URL } from '@env'
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker'
import Spinner from 'react-native-loading-spinner-overlay'
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { pick, types, isCancel } from '@react-native-documents/picker'

let launchImageLibrary = _launchImageLibrary
let launchCamera = _launchCamera
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const MyCertificates = () => {
	const [isloading, setIsLoading] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const navigation = useNavigation()
	const [imageUri, setImageUri] = useState(null)
	const [ImgSizeError, setImgSizeError] = useState(null)
	const [SignSizeError, setSignSizeError] = useState(null)
	const [showImageChangeButton, setShowImageChangeButton] = useState(true)
	const [certificateList, setCertificateList] = useState([])
	const [fileResponse, setFileResponse] = useState([])
	const [selectPdf, setSelectPdf] = useState(false)

	const getList = async () => {
		setIsLoading(true)
		const session = await EncryptedStorage.getItem("user_session")
		if (session != null) {
			try {
				const list = await fetch(`${BASE_URL}/student/certificateList`, {
					method: 'POST',
					headers: {
						"Contect-Type": "application/json",
						Authorization: `Bearer ${session}`,
					}
				})
				const listDetails = await list.json()
				setCertificateList(listDetails)
				setIsLoading(false)
			} catch (error) {
				setIsLoading(false)
				errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
			}
		}
	}

	// Upload the PDF for certificate/details correction
	const pickDocument = useCallback(async () => {
		try {
			const response = await pick({
				presentationStyle: 'fullScreen',
				type: types.pdf
			})
			console.log("the reponse after file select :::", response)
			const file = response[0]

			if (file && file.size <= 600000) {
				setFileResponse(response)
				console.log("After file select::: ", file)
				setSelectPdf(true)
			} else {
				submitModel(
					ALERT_TYPE.DANGER,
					"Pdf file Size",
					"Pdf file size should be less than 500 KB"
				)
			}
		} catch (err) {
			console.log("Document Picker Error:", err)
		}
	}, [])

	const uploadPdf = async (srno) => {
		setIsLoading(true)
		if (!fileResponse) return
		console.log("mmsmsjslsjklsjdkl:::: ", srno)

		const formData = new FormData()
		formData.append('certificate', {
			uri: fileResponse[0]["uri"],
			type: fileResponse[0]["type"],
			name: "studentIDNo" + '.pdf',
		})

		console.log("form data to submit", formData["_parts"])

		try {
			const session = await EncryptedStorage.getItem("user_session")
			const response = await fetch(`${BASE_URL}/Student/uploadCertificates/${srno}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${session}`,
					'Content-Type': 'multipart/form-data',
				},
				body: formData
			})

			console.log('pdf uploaded successfully', response.json())
			errorModel(ALERT_TYPE.SUCCESS, "Done", `File Uploaded Successfully`)
			setIsLoading(false)
		} catch (error) {
			setIsLoading(false)
			console.error('pdf upload failed', error)
			errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
		}
	}

	useEffect(() => {
		getList()
	}, [])

	const onRefresh = useCallback(() => {
		setRefreshing(true)
		setTimeout(() => {
			setRefreshing(false)
		}, 2000)
	}, [])

	const errorModel = (type, title, message) => {
		Dialog.show({
			type: type,
			title: title,
			textBody: message,
			button: 'close',
			onHide: () => navigation.goBack()
		})
	}

	const submitModel = (type, title, message) => {
		Dialog.show({
			type: type,
			title: title,
			textBody: message,
			button: 'close',
		})
	}

	return (
		<AlertNotificationRoot>
			{isloading && <Spinner visible={isloading} />}

			<View style={styles.container}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}>

				<ScrollView
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
				>
					<View style={styles.pageHeader}>
						{/* <View style={styles.headerIcon}>
							<FontAwesome name="files-o" size={22} color={colors.uniBlue} />
						</View> */}
						<View style={styles.headerText}>
							{/* <Text style={styles.title}>My Certificates</Text> */}
							<Text style={styles.subtitle}>Upload and manage your certificates</Text>
						</View>
					</View>

					<List.AccordionGroup>
						{certificateList.length != 0 ? (
							certificateList.map((certificate, index) => (
								<List.Accordion
									title={certificate['DocumentsRequired']}
									id={index}
									key={index}
									style={styles.accordion}
									titleStyle={styles.accordionTitle}
									description="Tap to view certificate details"
									descriptionStyle={styles.accordionDescription}
									right={props =>
										certificate['Action'] == 0 ? (
											<View style={styles.status}>
												<Text style={styles.reviewText}>In Review</Text>
												<FontAwesome name="clock-o" color={colors.uniBlue} size={20} />
											</View>
										) : certificate["Action"] == 1 ? (
											<View style={styles.status}>
												<Text style={styles.verifiedText}>Verified</Text>
												<FontAwesome name="check-circle-o" color="#4B8B63" size={20} />
											</View>
										) : certificate["Action"] == 2 ? (
											<View style={styles.status}>
												<Text style={styles.rejectedText}>Rejected</Text>
												<FontAwesome name="times-circle-o" color={colors.uniRed} size={20} />
											</View>
										) : (
											<View style={styles.status}>
												<Text style={styles.pendingText}>Not Uploaded</Text>
											</View>
										)
									}
								>
									<View style={styles.uploadContainer}>

										{ImgSizeError && (
											<Text style={styles.errorText}>
												Pdf size should be 500KB or less
											</Text>
										)}

										{certificate['Original'] != null ? (
											<TouchableOpacity
												style={styles.previewCard}
												onPress={() =>
													navigation.navigate('CertificateViewer', {
														filePath: `${IMAGE_URL}/StudentDocument/${certificate["Original"]}`
													})
												}
											>
												{console.log(`${IMAGE_URL}StudentDocument/${certificate["Original"]}`)}

												<View style={styles.pdfIconBox}>
													<FontAwesome name="file-pdf-o" size={30} color={colors.uniRed} />
												</View>

												<View style={styles.previewText}>
													<Text style={styles.previewTitle}>Certificate Available</Text>
													<Text style={styles.previewSubtitle}>Tap to preview document</Text>
												</View>

												<FontAwesome name="chevron-right" size={14} color="#9AA0A6" />
											</TouchableOpacity>
										) : (
											<View style={styles.noDocument}>
												<FontAwesome name="file-o" size={28} color="#A5A9AE" />
												<Text style={styles.noDocumentTitle}>No certificate uploaded</Text>
												<Text style={styles.noDocumentText}>
													Upload a PDF document below
												</Text>
											</View>
										)}

										{certificate['Action'] != 1 ? (
											<>
												{fileResponse.map((file, index) => (
													<View style={styles.selectedFile} key={index.toString()}>
														<FontAwesome name="file-pdf-o" size={18} color={colors.uniRed} />
														<Text
															style={styles.fileName}
															numberOfLines={1}
															ellipsizeMode="middle"
														>
															{file?.name}
														</Text>
														<FontAwesome name="check" size={14} color="#4B8B63" />
													</View>
												))}

												<TouchableOpacity
													style={styles.chooseButton}
													onPress={() => pickDocument()}
												>
													<FontAwesome name="folder-open-o" size={17} color="#FFFFFF" />
													<Text style={styles.buttonText}>Choose PDF File</Text>
												</TouchableOpacity>

												<View style={styles.fileNote}>
													<FontAwesome name="info-circle" size={14} color="#6D747A" />
													<Text style={styles.noteText}>
														Maximum file size: 500 KB
													</Text>
												</View>

												<TouchableOpacity
													style={styles.uploadButton}
													onPress={() => uploadPdf(certificate['SerialNo'])}
												>
													<FontAwesome name="cloud-upload" size={17} color="#FFFFFF" />
													<Text style={styles.buttonText}>Upload Certificate</Text>
												</TouchableOpacity>
											</>
										) : (
											<View style={styles.verifiedBox}>
												<FontAwesome name="check-circle" size={18} color="#4B8B63" />
												<Text style={styles.verifiedBoxText}>Certificate Already Verified</Text>
											</View>
										)}

										{certificate['Remarks'] != null && certificate['Action'] == 2 ? (
											<View style={styles.rejectBox}>
												<FontAwesome name="exclamation-circle" size={18} color={colors.uniRed} />
												<View style={styles.rejectContent}>
													<Text style={styles.rejectTitle}>Rejection Reason</Text>
													<Text style={styles.rejectText}>{certificate["Remarks"]}</Text>
												</View>
											</View>
										) : null}
									</View>
								</List.Accordion>
							))
						) : (
							<View style={styles.emptyState}>
								<FontAwesome name="folder-open-o" size={38} color="#A5A9AE" />
								<Text style={styles.emptyTitle}>No Data Found</Text>
								<Text style={styles.emptyText}>No certificate requirements are available.</Text>
							</View>
						)}
					</List.AccordionGroup>
				</ScrollView>
			</View>
		</AlertNotificationRoot>
	)
}

export default MyCertificates

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#F5F6F8' },
	scrollContent: { padding: 16, paddingBottom: 30 },

	pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
	headerIcon: {
		width: 46, height: 46, borderRadius: 13, backgroundColor: '#E8EDF0',
		alignItems: 'center', justifyContent: 'center'
	},
	headerText: { marginLeft: 12, flex: 1 },
	title: { fontSize: 21, fontWeight: '700', color: '#25292D' },
	subtitle: { marginTop: 3, fontSize: 14, color: '#7B8187' },

	accordion: {
		backgroundColor: '#FFFFFF', borderRadius: 14, marginBottom: 10,
		elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06, shadowRadius: 5
	},
	accordionTitle: { fontSize: 15, fontWeight: '600', color: '#30353A' },
	accordionDescription: { fontSize: 11, color: '#8A9096', marginTop: 2 },

	status: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 },
	reviewText: { fontSize: 11, color: colors.uniBlue, fontWeight: '600' },
	verifiedText: { fontSize: 11, color: '#4B8B63', fontWeight: '600' },
	rejectedText: { fontSize: 11, color: colors.uniRed, fontWeight: '600' },
	pendingText: { fontSize: 11, color: '#8A9096', fontWeight: '600', marginRight: 8 },

	uploadContainer: { backgroundColor: '#F8F9FA', padding: 14, borderTopWidth: 1, borderTopColor: '#EEF0F2' },

	errorText: { color: colors.uniRed, textAlign: 'center', fontSize: 12, marginBottom: 10 },

	previewCard: {
		backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12,
		flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E7E9EB'
	},
	pdfIconBox: {
		width: 48, height: 48, borderRadius: 10, backgroundColor: '#FCEBEC',
		alignItems: 'center', justifyContent: 'center'
	},
	previewText: { flex: 1, marginLeft: 11 },
	previewTitle: { fontSize: 13, fontWeight: '600', color: '#30353A' },
	previewSubtitle: { fontSize: 11, color: '#858B91', marginTop: 3 },

	noDocument: {
		backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 18,
		alignItems: 'center', borderWidth: 1, borderColor: '#E7E9EB', borderStyle: 'dashed'
	},
	noDocumentTitle: { fontSize: 13, fontWeight: '600', color: '#555B61', marginTop: 8 },
	noDocumentText: { fontSize: 11, color: '#8B9197', marginTop: 3 },

	selectedFile: {
		flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
		borderRadius: 10, padding: 11, marginTop: 12, borderWidth: 1, borderColor: '#E4E7E9'
	},
	fileName: { flex: 1, marginHorizontal: 9, fontSize: 12, color: '#3C4247' },

	chooseButton: {
		flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
		backgroundColor: '#778DA2', borderRadius: 10, paddingVertical: 11, marginTop: 12, gap: 8
	},
	uploadButton: {
		flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
		backgroundColor: '#223260', borderRadius: 10, paddingVertical: 12, marginTop: 10, gap: 8
	},
	buttonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

	fileNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 9 },
	noteText: { fontSize: 11, color: '#6D747A' },

	verifiedBox: {
		flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
		backgroundColor: '#EAF3ED', borderRadius: 10, paddingVertical: 12, marginTop: 12, gap: 8
	},
	verifiedBoxText: { color: '#477455', fontSize: 12, fontWeight: '600' },

	rejectBox: {
		flexDirection: 'row', backgroundColor: '#FCEBEC', borderRadius: 10,
		padding: 11, marginTop: 12, gap: 9
	},
	rejectContent: { flex: 1 },
	rejectTitle: { color: colors.uniRed, fontSize: 12, fontWeight: '700' },
	rejectText: { color: '#6E5557', fontSize: 11, marginTop: 3, lineHeight: 16 },

	emptyState: {
		backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 45,
		alignItems: 'center', marginTop: 5
	},
	emptyTitle: { fontSize: 15, fontWeight: '600', color: '#555B61', marginTop: 10 },
	emptyText: { fontSize: 12, color: '#8A9096', marginTop: 4 }
})