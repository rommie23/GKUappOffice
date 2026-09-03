// import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
// import React, { useEffect, useState } from 'react'
// // import RNPickerSelect from 'react-native-picker-select'
// import colors from '../../../colors'
// import { SelectList } from 'react-native-dropdown-select-list'
// import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

// const CgpaCalculator = () => {
//   const [myTextInput, setMyTextInput] = useState([])
//   const [sgpaInput, setsgpaInput] = useState([])
//   const [totalCredit, setTotalCredit] = useState(0)
//   const [sgpaTotal, setSgpaTotal] = useState(0)
//   const [numberOfSemesters, setNumberOfSemesters] = useState(0);
//   const [loading, setLoading] = useState(false)
//   const [cgpa, setCgpa] = useState(0)
//   const [percentage, setPercentage] = useState(0)

//   const placeholder = {
//     label: 'Select an option...',
//     value: null,
//   }

//   const options = [
//     { key: '1', value: 1 },
//     { key: '2', value: 2 },
//     { key: '3', value: 3 },
//     { key: '4', value: 4 },
//     { key: '5', value: 5 },
//     { key: '6', value: 6 },
//     { key: '7', value: 7 },
//     { key: '8', value: 8 },
//     { key: '9', value: 9 },
//     { key: '10', value: 10 },
//     { key: '11', value: 11 },
//     { key: '12', value: 12 },
//   ]

//   // when number of semesters selected useEffect will create textInputs accondingly //
//   useEffect(() => {
//     setLoading(true)
//     let cloneArray = []
//     let cloneArray2 = []
//     setMyTextInput([]);
//     setTimeout(()=>{
//       for (let i = 0; i < numberOfSemesters; i++) {
//         cloneArray.push({ 'text': 0 })
//         cloneArray2.push({ 'text': 0 })
//       }
//       setMyTextInput(cloneArray)
//       setsgpaInput(cloneArray2)
//       setTotalCredit(0)
//       setSgpaTotal(0)
//       setCgpa(0)
//       setPercentage(0)
//       setLoading(false)
//     },100)
//   }, [numberOfSemesters])
//   // console.log(myTextInput);

//   // the values will come from textInputs and inserted in array of objects

//   const onChangeText = (text, index) => {
//     let newUpdatedInputs = [...myTextInput]
//     newUpdatedInputs[index].text = Number(text)
//     setMyTextInput(newUpdatedInputs)
//   }
//   const onChangeSgpa = (text, index) => {
//     let newUpdatedInputs = [...sgpaInput]
//     newUpdatedInputs[index].text = Number(text)
//     setsgpaInput(newUpdatedInputs)
//   }

//   // calculation of CGPA 
//   const onDone = () => {
//     let total = 0;
//     let totalSgpa = 0;
//     let creditArray = [];
//     let sgpaArray = [];

//     myTextInput.forEach(item=>
//       creditArray.push(item.text)
//     )
//     console.log(creditArray);

//     sgpaInput.forEach(item=>
//       sgpaArray.push(item.text)
//     )
//     console.log(sgpaArray);
//     let multipliedArray = [];
//     let multipliedArrayTotal = 0;
//     for (let j = 0; j < creditArray.length; j++) {
//       multipliedArray.push(sgpaArray[j]*creditArray[j])
//     }
//     console.log(multipliedArray);
//     multipliedArray.forEach(item =>
//       multipliedArrayTotal += item
//     )
//     console.log(multipliedArrayTotal);
//     myTextInput.forEach(item =>
//       total += item.text)

//     console.log(multipliedArrayTotal/total)
//     setCgpa(multipliedArrayTotal/total)
//     setPercentage((multipliedArrayTotal/total)*9.5)
//     console.log(percentage);

//     sgpaInput.forEach(item =>
//       totalSgpa += item.text)
//     setTotalCredit(total)
//     setSgpaTotal(totalSgpa)

//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: 'white' }}>
//       {loading?<View style={styles.loading}>
//         <ActivityIndicator size={'large'}/>
//         </View>:null}
//       <View style={{ flex: 1, paddingHorizontal: 8 }}>
//         <Text style={styles.label}>Select Number of Semesters</Text>
//         {/* <RNPickerSelect
//           placeholder={placeholder}
//           items={options}
//           onValueChange={(value) => setNumberOfSemesters(value)}
//           // value={(numberOfSemesters)}
//           // onDonePress={() => setMyTextInput([])}
//           style={styles.pickerStyle}
//         /> */}
//         <SelectList boxStyles={{ padding: 10, width: "100%" }}
//           setSelected={(val) => setNumberOfSemesters(val)}
//           fontFamily='time'
//           data={options}
//           arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
//           search={false}
//           defaultOption={{ key: '0', value: 'Select Semesters' }}
//           inputStyles={{ color: 'black' }}
//           dropdownTextStyles={{ color: 'black' }}
//         />

//         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//           <Text style={{ width: '5%', fontSize: 20 }}>#</Text>
//           <Text style={styles.labelTxt}>Total Credit</Text>
//           <Text style={styles.labelTxt}>SGPA</Text>
//         </View>
// {/* textinput fields */}
//         <ScrollView>
//           {myTextInput.map((val, i) => {
//             return (
//               <View style={styles.form} key={String(i)}>
//                 <Text>{i + 1}</Text>
//                 <TextInput
//                   // value={val.text}
//                   placeholder='enterValue'
//                   style={styles.inputFields}
//                   onChangeText={text => onChangeText(text, i)}
//                   keyboardType='number-pad'
//                   onSubmitEditing={(e)=> e.target.clear()}
//                   placeholderTextColor={'#c1c1c1'}
                  
//                 />
//                 <TextInput
//                   // value={val.text}
//                   placeholder='enterValue'
//                   style={styles.inputFields}
//                   onChangeText={text => onChangeSgpa(text, i)}
//                   keyboardType='number-pad'
//                   placeholderTextColor={'#c1c1c1'}
//                 />
//               </View>
//             )
//           })}
//         </ScrollView>
//         <Text style={{ alignSelf: 'center', marginVertical: 16, fontSize: 16, color:'black' }}> CGPA: {cgpa.toFixed(2)} Percentage:{percentage.toFixed(2)}%</Text>

//         <TouchableOpacity style={[styles.btnStyle]} onPress={onDone}>
//           <Text style={{ color: '#f1f1f1', alignSelf: 'center', fontSize: 20, color:'white' }}>Calculate</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   btnStyle: {
//     backgroundColor: colors.uniRed,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     width: '35%',
//     alignSelf: 'center',
//     marginVertical: 16
//   },
//   form: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inputFields: {
//     backgroundColor: '#f1f1f1',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     height:36,
//     margin: 8,
//     width: '45%',
//     fontSize: 16,
//     fontWeight: '400',
//     elevation: 1,
//     color:'black',
//   },
//   labelTxt: {
//     fontSize: 20,
//     width: '45%',
//     textAlign: 'center',
//     color:'black'
//   },
//   loading: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor:'rgba(0,0,0,0.5)'
//   },
//   pickerStyle: {
//       placeholder: {
//           color: 'black'
//       },
//       inputAndroid: {
//           color: 'black'
//       }
//   },
//   label: {
//     color: '#1b1b1b'
// },

// })

// export default CgpaCalculator


import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../colors';

const CgpaCalculator = () => {
  const [credits, setCredits] = useState([]);
  const [sgpas, setSgpas] = useState([]);
  const [numberOfSemesters, setNumberOfSemesters] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cgpa, setCgpa] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const options = Array.from({ length: 12 }, (_, i) => ({
    key: String(i + 1),
    value: i + 1,
  }));

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const creditArr = Array.from({ length: numberOfSemesters }, () => ({
        value: '',
      }));
      const sgpaArr = Array.from({ length: numberOfSemesters }, () => ({
        value: '',
      }));

      setCredits(creditArr);
      setSgpas(sgpaArr);
      setCgpa(0);
      setPercentage(0);

      setLoading(false);
    }, 200);
  }, [numberOfSemesters]);

  const updateCredit = (text, index) => {
    const updated = [...credits];
    updated[index].value = Number(text);
    setCredits(updated);
  };

  const updateSgpa = (text, index) => {
    const updated = [...sgpas];
    updated[index].value = Number(text);
    setSgpas(updated);
  };

  const calculate = () => {
    let totalCredits = 0;
    let weightedSum = 0;

    for (let i = 0; i < credits.length; i++) {
      const c = credits[i].value || 0;
      const s = sgpas[i].value || 0;

      totalCredits += c;
      weightedSum += c * s;
    }

    const result = weightedSum / totalCredits || 0;

    setCgpa(result);
    setPercentage(result * 9.5);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.heading}>CGPA Calculator</Text>

        {/* Select Semester */}
        <View style={styles.card}>
          <Text style={styles.label}>Select Semesters</Text>

          <SelectList
            setSelected={(val) => setNumberOfSemesters(val)}
            data={options}
            search={false}
            defaultOption={{ key: '0', value: 'Select Semesters' }}
            boxStyles={styles.dropdown}
            inputStyles={{ color: '#111' }}
            dropdownTextStyles={{ color: '#111' }}
            arrowicon={
              <FontAwesome5Icon name="chevron-down" size={12} color="#333" />
            }
          />
        </View>

        {/* Input Table */}
        {credits.length > 0 && (
          <View style={styles.card}>
            <View style={styles.rowHeader}>
              <Text style={styles.col1}>#</Text>
              <Text style={styles.col}>Credits</Text>
              <Text style={styles.col}>SGPA</Text>
            </View>

            {credits.map((_, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.col1}>{i + 1}</Text>

                <TextInput
                  placeholder="Credits"
                  placeholderTextColor="#aaa"
                  keyboardType="number-pad"
                  style={styles.input}
                  onChangeText={(text) => updateCredit(text, i)}
                />

                <TextInput
                  placeholder="SGPA"
                  placeholderTextColor="#aaa"
                  keyboardType="number-pad"
                  style={styles.input}
                  onChangeText={(text) => updateSgpa(text, i)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Result Card */}
        {cgpa > 0 && (
          <LinearGradient
            colors={['#4f46e5', '#7c3aed']}
            style={styles.resultCard}
          >
            <Text style={styles.resultTitle}>Your Result</Text>
            <View style={{flexDirection:'row5'}}>
              <Text style={styles.resultValue}>
                CGPA: {cgpa.toFixed(2)}
              </Text>
              <Text style={styles.resultValue}>
                Percentage: {percentage.toFixed(2)}%
              </Text>
            </View>
          </LinearGradient>
        )}

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={calculate}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CgpaCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 16,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },

  dropdown: {
    borderRadius: 10,
    borderColor: '#ddd',
  },

  rowHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  col1: {
    width: 30,
    color: '#333',
  },

  col: {
    flex: 1,
    textAlign: 'center',
    color: '#555',
    fontWeight: '600',
  },

  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginHorizontal: 5,
    color: '#111',
  },

  resultCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    height:130
  },

  resultTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },

  resultValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  button: {
    backgroundColor: colors.uniBlue,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 30,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  loading: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});