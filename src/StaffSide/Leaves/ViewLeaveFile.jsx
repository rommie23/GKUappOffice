import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf'
import { useNavigation, useRoute } from '@react-navigation/native';
import { IMAGE_URL } from '@env';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height
const ViewLeaveFile = () => {
    const route = useRoute();
    const FilePAth = route.params.FilePAth;
    console.log(IMAGE_URL+ "Images/Staff/LeaveFileAttachment/" + FilePAth);
    
    const navigation = useNavigation()
    // const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    function getExtension(filename) {
        return filename.split('.').pop()
    }
    console.log(FilePAth);
    
    return (
        <ScrollView>
            <View style={styles.container}>
                {getExtension(FilePAth) == 'jpg' || getExtension(FilePAth) == 'png' || getExtension(FilePAth) == 'jpeg' ?
                    <Image
                        source={{ uri: IMAGE_URL+"/Images/Staff/LeaveFileAttachment/" + FilePAth }}
                        style={
                            {
                                flex: 1,
                                resizeMode: 'contain',
                                width: screenWidth,
                                height: screenHeight
                            }}
                    />
                    :
                    <Pdf
                        trustAllCerts={false}
                        source={{ uri: IMAGE_URL+'/Images/Staff/LeaveFileAttachment/' + FilePAth, cache: true }}
                        onLoadComplete={(numberOfPages, filePath) => {
                            // console.log(`Number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            // console.log(`Current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        onPressLink={(uri) => {
                            // console.log(`Link pressed: ${uri}`);
                        }}
                        style={styles.pdf} />
                }
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    examsView: {
        borderBottomWidth: 1,
        paddingVertical: 16,
        width: screenWidth - 32,
        paddingHorizontal: 16,
    },
    ExamTxt: {
        fontSize: 20,
        color: '#000'
    },
    smallText: {
        fontSize: 12,
        color: 'green'
    },
    subjectDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    examTabs: {
        backgroundColor: '#FFF7D4',
        padding: 10,
        marginTop: 16,
        borderRadius: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 300,
    }

})

export default ViewLeaveFile