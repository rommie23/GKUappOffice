import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import colors from '../../colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const FeedbackFrom = () => {
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({});

    const navigation = useNavigation()


    const fetchQuestions = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            const res = await fetch(BASE_URL + "/student/feedbackquestions", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'Content-Type': 'application/json'
                },
            })
            const response = await res.json();
            setLoading(false)
            const result = {};

            response['feedback'].forEach(item => {
                const qId = item.QuestionID;

                if (!result[qId]) {
                    result[qId] = {
                        questionId: qId,
                        questionText: item.QuestionText,
                        options: []
                    };
                }
                result[qId].options.push({
                    optionId: item.ID[1],   // second value is option id
                    optionText: item.OptionText,
                    score: item.Score
                });
            });

            // console.log("result::", result);
            setQuestions(result)
        }
    }
    useEffect(() => {
        fetchQuestions()
    }, [])

    const selectOption = (questionId, optionText) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionText
        }));
    };
    console.log(answers);

    const buildAnswerArray = () => {
        return Object.values(questions).map(
            question => answers[question.questionId] || null
        );
    };


    const sendAnswers = async () => {
        setLoading(true)
        const answersArray = buildAnswerArray();
        const payload = {
            answers: answersArray
        };

        // console.log(payload);

        const totalQuestions = Object.keys(questions).length;
        const answeredQuestions = Object.keys(answers).length;
        if (answeredQuestions < totalQuestions) {
            submitModel(ALERT_TYPE.WARNING, "Select All", "All the questions are required to be answered.")
            setLoading(false);
            return;
        }
        
        console.log("sendAnswerssendAnswers");
        
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + "/student/feedbackanswers", {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                const response = await res.json()
                console.log("Answer response ::", response);
                
                setLoading(false)
                outModel(ALERT_TYPE.SUCCESS, "Success", response.message)

            } catch (error) {
                console.log('Error fetching sendAnswers data:apply:', error);
                setLoading(false)
            }
        }
    }

    const submitModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
        })
    }
    const outModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: () => navigation.navigate('StudentDashboard')
        })
    }


    return (
        <AlertNotificationRoot>
            {
                loading && <ActivityIndicator/>
            }
            <SafeAreaView>
                <View style={{ backgroundColor: colors.uniBlue }}>
                    <Text style={styles.heading}>Feedback Form</Text>
                </View>
                <ScrollView style={{ marginBottom: 16 }}>
                    <View style={{ marginHorizontal: 8 }}>
                        {
                            Object.values(questions).map((item, qIndex) => (
                                <View key={item.questionId} style={styles.questionCard}>

                                    <Text style={styles.questionText}>
                                        {qIndex + 1}. {item.questionText}
                                    </Text>

                                    {item.options.map((option, oIndex) => {
                                        const selected =
                                            answers[item.questionId] === option.optionText;

                                        return (
                                            <TouchableOpacity
                                                key={option.optionId}
                                                style={[
                                                    styles.option,
                                                    selected && styles.optionSelected
                                                ]}
                                                onPress={() =>
                                                    selectOption(item.questionId, option.optionText)
                                                }
                                            >
                                                <View
                                                    style={[
                                                        styles.radio,
                                                        selected && styles.radioSelected
                                                    ]}
                                                />

                                                <Text
                                                    style={[
                                                        styles.optionText,
                                                        selected && styles.optionTextSelected
                                                    ]}
                                                >
                                                    {option.optionText}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ))
                        }
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: colors.uniBlue, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16, paddingVertical: 12, borderRadius: 8 }} onPress={() => sendAnswers()}>
                                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Submit</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </ScrollView>

            </SafeAreaView>
        </AlertNotificationRoot>
    )
}

export default FeedbackFrom

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        alignSelf: 'center',
        color: '#fff'
    },

    questionCard: {
        marginBottom: 24,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8
    },

    questionText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12
    },

    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 8
    },

    optionSelected: {
        borderColor: '#2563EB',
        backgroundColor: '#EFF6FF'
    },

    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#999',
        marginRight: 12
    },

    radioSelected: {
        borderColor: '#2563EB',
        backgroundColor: '#2563EB'
    },

    optionText: {
        fontSize: 14,
        color: '#333'
    },

    optionTextSelected: {
        color: '#1E40AF',
        fontWeight: '600'
    }
});
