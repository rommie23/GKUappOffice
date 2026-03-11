import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { StudentContext } from '../../context/StudentContext';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import RNBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';

const d = new Date();
const CurrentMonth = d.getMonth() + 1;
const CurrentYear = d.getFullYear();
const years = [];
for (let i = CurrentYear - 4; i <= CurrentYear; i++) {
  years.push({ label: i.toString(), value: i.toString() });
}
const months = [
  { key: '01', value: 'January' },
  { key: '02', value: 'February' },
  { key: '03', value: 'March' },
  { key: '04', value: 'April' },
  { key: '05', value: 'May' },
  { key: '06', value: 'June' },
  { key: '07', value: 'July' },
  { key: '08', value: 'August' },
  { key: '09', value: 'September' },
  { key: '10', value: 'October' },
  { key: '11', value: 'November' },
  { key: '12', value: 'December' }
];
const AttandancePdf = () => {
  const { StaffIDNo, setStaffIDNo } = useContext(StudentContext);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const forDownloadPDf = () => {
    setLoading(true)
    if (selectedMonth && selectedYear) {
      const url = `http://gurukashiuniversity.co.in/GMS/attendance-pdf-summary.php?month=${selectedMonth}&year=${selectedYear}&EmployeeId=${StaffIDNo}`;
      // setPdfUrl(url);
      // Get the app's document directory path
      const { dirs } = RNBlobUtil.fs;
      const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
      // Configure the download
      const config = {
        fileCache: true,
        appendExt: 'pdf',
        trusty: true,
        path: `${dirToSave}/attendance_${selectedMonth}_${selectedYear}.pdf`,
        addAndroidDownloads: { // Android-specific download manager notification
          useDownloadManager: true,
          notification: true,
          path: `${dirToSave}/attendance_${selectedMonth}_${selectedYear}.pdf`,
          description: 'Downloading PDF report.',
        }
      };
      RNBlobUtil.config(config).fetch('GET', url, {
        'Cache-Control': 'no-cache',
        'Accept': 'application/pdf',
        'Connection': 'keep-alive',
      }).then((res) => {
        // On iOS, you might want to open a share sheet or preview the file
        console.log('Downloaded:', res.path());
        if (Platform.OS === 'ios') {
          RNBlobUtil.ios.previewDocument(res.path());
        }else{
          setTimeout(() => {
            newModel(ALERT_TYPE.SUCCESS, "Download Success", `Please locate file in file manager.`)
          }, 0);
        }
        console.log('File downloaded to:', res.path());
        setLoading(false)
      }).catch((errorMessage, statusCode) => {
        console.error(errorMessage);
        newModel(ALERT_TYPE.DANGER, "Download Failed", `Please try again`)
        setLoading(false)
      });
    } else {
      newModel(ALERT_TYPE.WARNING, "Selection", `please select month and year`)
      setShowModal(true)
    }
  };

  const newModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }
  return (
    <View style={styles.container}>
      {/* <Modal
      transparent={true}
      visible={showModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <FontAwesome5Icon name='exclamation' size={64} color={colors.uniRed} style={{position:'absolute', top:-48, backgroundColor:'white', paddingVertical:16, borderRadius:100, paddingHorizontal:32}} />
            <Text style={styles.textSmall}>please select month and year</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={()=>setShowModal(false)}>
              <Text style={{color:'white', fontSize:16}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      <View>
        <Text style={styles.txtStyle}>Month</Text>
        <SelectList boxStyles={{ padding: 10, width: "100%" }}
          setSelected={(val) => setSelectedMonth(val)}
          fontFamily='time'
          data={months}
          arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
          search={false}
          defaultOption={{ key: '0', value: 'Select Month' }}
          inputStyles={{ color: 'black' }}
          dropdownTextStyles={{ color: 'black' }}
        />
      </View>
      <View>
        <View style={styles.eachInput}>
          <Text style={styles.txtStyle}>Year</Text>
          <SelectList boxStyles={{ padding: 10, width: "100%" }}
            setSelected={(val) => setSelectedYear(val)}
            fontFamily='time'
            data={years}
            arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
            search={false}
            defaultOption={{ key: '0', value: 'Select Year' }}
            inputStyles={{ color: 'black' }}
            dropdownTextStyles={{ color: 'black' }}
          />
        </View>
      </View>
      <View style={styles.rowSpacer} />
      <TouchableOpacity style={styles.bottomBtn} onPress={forDownloadPDf}>
        <Text style={styles.btnTxt}>Download PDF</Text>
      </TouchableOpacity>
      {/* {pdfUrl && (
            <WebView
              source={{ uri: pdfUrl }}
              style={{ marginTop: 20, width: '100%', height: '80%' }}
            />
          )} */}

      {loading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999
        }}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#ffff'
  },
  rowSpacer: {
    marginTop: 10,
  },
  label: {
    marginTop: 20,
    fontSize: 18
  },
  bottomBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 0,
    height: 44,
    backgroundColor: '#223260',
    color: '#fff',
    textAlignVertical: "center"
  },
  btnTxt: {
    color: '#fff',
    textAlign: 'center',
    padding: 5
  },
  pickerStyle: {
    placeholder: {
      color: 'black'
    },
    inputAndroid: {
      color: 'black'
    }
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: 'black',
    elevation: 2,
    alignItems: 'center',
    width: '80%',
    paddingTop: 48
  },
  modalBtn: {
    backgroundColor: colors.uniRed,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 12,
  },
  eachInput: {
    marginTop: 16,
    rowGap: 4
  },
  txtStyle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600'
  },
});

export default AttandancePdf;
