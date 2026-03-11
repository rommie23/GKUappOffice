import { View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import Pdf from 'react-native-pdf'
import { useRoute } from '@react-navigation/native';

const OpenPDF = () => {
    const route = useRoute();
    const fileURL = route.params.fileURL;
    console.log("pdf correction path", fileURL);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Pdf
                    trustAllCerts={false}
                    source={{ uri: fileURL, cache: true }}
                    //   onLoadComplete={(numberOfPages,filePath) => {
                    //     // console.log(`Number of pages: ${numberOfPages}`);
                    //   }}
                    //   onPageChanged={(page,numberOfPages) => {
                    //     // console.log(`Current page: ${page}`);
                    //   }}
                    //   onError={(error) => {
                    //     console.log(error);
                    //   }}
                    //   onPressLink={(uri) => {
                    //     // console.log(`Link pressed: ${uri}`);
                    // }}
                    style={styles.pdf} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 100,
    },


})


export default OpenPDF