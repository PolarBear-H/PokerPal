import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import BlindLevel from '../../Components/BlindLevel';
import { Utils } from '../../Components/Utils';
import { useCurrencyContext } from '../../Components/CurrencyManager';

const ManageBlindPage: React.FC = () => {
    const { currency } = useCurrencyContext();
    
    const [blindLevels, setBlindLevels] = useState<BlindLevel[]>(Utils.blindLevelList);
    const [newSmallBlind, setNewSmallBlind] = useState<number | null>();
    const [newBigBlind, setNewBigBlind] = useState<number | null>();

    const addBlindLevel = async () => {
        if (newSmallBlind && newBigBlind) {
            const updatedLevels = [...blindLevels, { smallBlind: newSmallBlind, bigBlind: newBigBlind }]
            updatedLevels.sort((a, b) => {
                if (a.smallBlind < b.smallBlind) {
                    return -1;
                } else if (a.smallBlind > b.smallBlind) {
                    return 1;
                } else {
                    if (a.bigBlind < b.bigBlind) {
                        return -1;
                    } else if (a.bigBlind > b.bigBlind) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
            setBlindLevels(updatedLevels);
            Utils.blindLevelList = updatedLevels;
            await AsyncStorage.setItem('blindLevelList', JSON.stringify(updatedLevels));
            setNewSmallBlind(null);
            setNewBigBlind(null);
        }
    };

    const removeBlindLevel = async (blindLevel: { smallBlind: number; bigBlind: number; }) => {
        const updatedLevels = blindLevels.filter((item) => item !== blindLevel);
        setBlindLevels(updatedLevels);
        await AsyncStorage.setItem('blindLevelList', JSON.stringify(updatedLevels));
    };

    useEffect(() => {
        // 可以在这里保存 blindLevels 到应用的状态中或持久化存储中
    }, [blindLevels]);

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={[styles.title, {flex: 1}]}>Small Blind</Text>
                <Text style={[styles.title, {flex: 1}]}>Big Blind</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Small Blind"
                    style={styles.input}
                    value={newSmallBlind?.toString()}
                    onChangeText={(text) => {
                        try {
                            setNewSmallBlind(parseInt(text));
                        } catch (error) {
                        }}
                    }
                />
                <Text style={styles.inputText}>/</Text>
                <TextInput
                    placeholder="Big Blind"
                    style={styles.input}
                    value={newBigBlind?.toString()}
                    onChangeText={(text) => {
                        try {
                            setNewBigBlind(parseInt(text));
                        } catch (error) {
                        }}}
                />
                <TouchableOpacity style={styles.addButton} onPress={addBlindLevel}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.title, {marginBottom:16}]}>Blind Levels</Text>
            <FlatList
                data={blindLevels}
                //keyExtractor={(item) => item.level.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.levelItem}>
                        <Text style={styles.levelItemtext}>Level {index + 1}: {Utils.getFormattedBlindLevel(item, currency)}</Text>
                        <TouchableOpacity onPress={() => removeBlindLevel(item)}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
    },
    inputText: {
        padding: 8,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    levelItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
    },
    levelItemtext: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        fontSize: 16,
    },
    deleteButtonText: {
        color: '#DD3E35',
        fontWeight: 'bold',
    },
});

export default ManageBlindPage;
