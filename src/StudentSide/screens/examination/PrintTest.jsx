// import React from 'react';
// import { View, Button, Alert } from 'react-native';
// import RNPrint from 'react-native-print';

// const PrintTest = () => {
//   const printHTML = async () => {
//     try {
//       await RNPrint.print({
//         html: `
//           <h1 style="text-align:center;color:#4A90E2;">Hello GKU!</h1>
//           <p>This is a <b>React Native Print</b> test page.</p>
//         `,
//       });
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
//       <Button title="Print Test PDF" onPress={printHTML} />
//     </View>
//   );
// };

// export default PrintTest;

import React from 'react';
import { Button, View, Alert } from 'react-native';
import RNPrint from 'react-native-print';

const PrintTest = () => {

  const handleSaveAsPDF = async () => {
    try {
      // Step 1: Define your HTML content
      const htmlContent = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { color: #223260; text-align: center; }
              p { font-size: 16px; }
              .footer { margin-top: 30px; font-size: 14px; color: gray; text-align: center; }
            </style>
          </head>
          <body>
            <h1>Guru Kashi University</h1>
            <p>This document is generated using <b>react-native-print</b>.</p>
            <div class="footer">© 2025 GKU</div>
          </body>
        </html>
      `;

      // Step 2: Call the print function
      await RNPrint.print({
        html: htmlContent,
      });

      // User can select “Save as PDF” or print directly
      Alert.alert('PDF Generated', 'You can choose "Save as PDF" in the print dialog.');

    } catch (error) {
      console.error('Print Error:', error);
      Alert.alert('Error', 'Failed to generate PDF.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Save / Print PDF" onPress={handleSaveAsPDF} />
    </View>
  );
};

export default PrintTest;




