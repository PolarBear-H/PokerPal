import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useScoreContext } from '../../Components/ScoreManager';
import { useNavigation } from '@react-navigation/native';
import Score from '../../Components/Score';
import { showMessage } from 'react-native-flash-message';
import { Utils } from '../../Components/Utils';

const ImportDataPage: React.FC = () => {
    const navigation = useNavigation<any>();
    const [importedData, setImportedData] = useState('');
    const { setScoreHistory } = useScoreContext();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleImportData}>
                    <Text style={styles.headerButton}>Import</Text>
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
                    'Data imported successfully',
                    'Data imported successfully, you can now go back to the main page to check the data.',
                        [
                            {
                                text: 'Ok',
                                style: 'cancel',
                            },
                        ]
                );

                showMessage({
                    message: 'Data imported successfully',
                    type: 'success',
                    floating: true,
                });
            } catch (error: any) {
                Alert.alert(
                    'Data imported failed',
                    error.message,
                        [
                            {
                                text: 'Ok',
                                style: 'cancel',
                            },
                        ]
                );
                showMessage({
                    message: 'Data imported failed, please check the format of the input data.',
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
                    style={styles.inputContainer}
                    multiline 
                />
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
        height: 400,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    }
});

export default ImportDataPage;
