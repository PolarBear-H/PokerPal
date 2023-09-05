import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useScoreContext } from '../../Components/ScoreManager';
import { useNavigation } from '@react-navigation/native';
import Score from '../../Components/Score';
import { showMessage } from 'react-native-flash-message';
import { Utils } from '../../Components/Utils';
import Localization from '../../Components/Localization';

const ImportDataPage: React.FC = () => {
    const navigation = useNavigation<any>();
    const [importedData, setImportedData] = useState('');
    const { setScoreHistory } = useScoreContext();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleImportData}>
                    <Text style={styles.headerButton}>{Localization.import}</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, importedData]);

    const handleImportData = async () => {
        if(Utils.printLog) console.log('importedData: ', importedData);
        if (importedData) {
            try {
                const newScoreHistory: Score[] = JSON.parse(importedData);
                setScoreHistory(newScoreHistory);
                await AsyncStorage.setItem('scoreHistory', importedData);

                Alert.alert(
                    Localization.importSuccess,
                    Localization.importSuccessMessage,
                        [
                            {
                                text: Localization.ok,
                                style: 'cancel',
                            },
                        ]
                );

                showMessage({
                    message: Localization.importSuccess,
                    type: 'success',
                    floating: true,
                });
            } catch (error: any) {
                Alert.alert(
                    Localization.importFail,
                    error.message,
                        [
                            {
                                text: Localization.ok,
                                style: 'cancel',
                            },
                        ]
                );
                showMessage({
                    message: Localization.importFailMessage,
                    type: 'danger',
                    floating: true,
                });
            }
        }
    };


  return (
    <View style={styles.container}>
        <KeyboardAvoidingView
            behavior={'position'}
            keyboardVerticalOffset={50} // Adjust the value as needed
        >
            <ScrollView keyboardShouldPersistTaps="handled">
                <TextInput 
                    value={importedData} 
                    onChangeText={(item) => setImportedData(item)} 
                    placeholder={Localization.importMessage}
                    placeholderTextColor={'#ccc'}
                    style={styles.inputContainer}
                    multiline 
                />
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructions}>
                        {Localization.importTitle}
                    </Text>
                    <Text style={styles.step}>
                        {Localization.importStep1}
                    </Text>
                    <Text style={styles.step}>
                        {Localization.importStep2}
                    </Text>
                    <Text style={styles.step}>
                        {Localization.importStep3}
                    </Text>
                    <Text style={styles.step}>
                        {Localization.importStep4}
                    </Text>
                    <Text style={styles.note}>
                        {Localization.importNote}
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
        borderRadius: 8,
        padding: 8,
        backgroundColor: 'white',
    },
    headerButton: {
        fontSize: 18,
        color: '#007AFF', // Set header button color
        marginRight: 16,
        marginLeft: 16,
    },
    inputContainer: {
        height: 350,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 24,
    },
    instructionsContainer: {
        padding: 12,
        justifyContent: 'center',
        marginTop: 40,
        //alignItems: 'center',
    },
    instructions: {
        fontSize: 16,
        marginBottom: 16,
    },
    step: {
        fontSize: 14,
        marginBottom: 8,
    },
    note: {
        fontSize: 12,
        marginTop: 16,
        color: 'gray',
    },
});

export default ImportDataPage;
