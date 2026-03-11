import { Alert } from 'react-native'

const useConfirm = () => {
    const confirmAction = (message, onConfirm, onCancel)=>{
        Alert.alert('Confirm Action', message,[
            {
                text : "No",
                style : "cancel",
                onPress : ()=>{
                    console.log("User Canceled");
                    if (onCancel) onCancel();
                }
            },
            {
                text : "Yes",
                style:"default",
                onPress : ()=>{
                    if (onConfirm) onConfirm();
                }
            }
        ])
    }
  return { confirmAction }
}

export default useConfirm