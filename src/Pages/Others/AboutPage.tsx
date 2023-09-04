import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Utils } from '../../Components/Utils';
import { useNavigation } from '@react-navigation/native';

const AboutPage: React.FC = () => {
    const navigation = useNavigation<any>();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity>
                    <Text>Import</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>About Our App</Text>
            <Text style={styles.version}>Version: {Utils.appVersion}</Text>
            <Text style={styles.text}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ex sit amet velit vehicula condimentum. Sed ultrices velit nec libero tristique, a posuere risus eleifend.
            </Text>
            {/* 其他关于应用的文本 */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    version: {
        fontSize: 18,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 16,
    },
});

export default AboutPage;
