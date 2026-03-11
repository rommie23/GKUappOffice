import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const PayFeeScreen = ({ route }) => {
    const { payData } = route.params;
    console.log("payData", payData);
    

    const [formHtml, setFormHtml] = useState('')
    const navigation = useNavigation()



    //   const paymentUrl = `https://your-laravel-domain.com/pay-fee/${userId}`;

    const htmlForm = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Payment</title>
                    </head>
                    <body onload="document.forms['payuForm'].submit()">
                        <form id="payuForm" name="payuForm" method="POST" action="https://secure.payu.in/_payment">
                            <input type="hidden" name="key" value="${payData.key}" />
                            <input type="hidden" name="txnid" value="${payData.txnid}" />
                            <input type="hidden" name="amount" value="${payData.amount}" />
                            <input type="hidden" name="productinfo" value="${payData.productinfo}" />
                            <input type="hidden" name="firstname" value="${payData.firstname}" />
                            <input type="hidden" name="email" value="${payData.email}" />
                            <input type="hidden" name="phone" value="${payData.phone}" />
                            <input type="hidden" name="surl" value="https://payment.gku.ac.in/api/payu/payment-response" />
                            <input type="hidden" name="furl" value="https://payment.gku.ac.in/api/payu/payment-response" />
                            <input type="hidden" name="udf1" value="${payData.udf1}"/>
                            <input type="hidden" name="udf2" value="${payData.udf2}"/>
                            <input type="hidden" name="udf3" value="${payData.udf3}"/>
                            <input type="hidden" name="udf4" value="${payData.udf4}"/>
                            <input type="hidden" name="udf5" value="${payData.udf5}"/>
                            <input type="hidden" name="udf6" value="${payData.udf6}"/>
                            <input type="hidden" name="udf7" value="${payData.udf7}"/>
                            <input type="hidden" name="udf8" value="${payData.udf8}"/>
                            <input type="hidden" name="udf9" value="${payData.udf9}"/>
                            <input type="hidden" name="udf10" value="${payData.udf10}"/>
                            <input type="hidden" name="hash" value="${payData.hash}" />
                        </form>
                    </body>
                    </html>
                `;
    useEffect(() => {
        setFormHtml(htmlForm)
    }, [])

    return (
        <View style={styles.container}>
            <WebView
                source={{ html: formHtml }}
                style={{ flex: 1 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                onMessage={(event) => {
                    const status = JSON.parse(event.nativeEvent.data);
                    console.log('WebView says:', status);
                    if (status['status'] == 'success') {
                        navigation.replace('PaymentSuccessScreen', {status});
                    } else {
                        navigation.replace('PaymentFailureScreen', {status});
                    }
                }}
            />
        </View>
    );
};

export default PayFeeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
