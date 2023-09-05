import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Utils } from '../../Components/Utils';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Localization from '../../Components/Localization';

const AboutPage: React.FC = () => {
    const navigation = useNavigation<any>();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={{flexDirection:'row', marginLeft: 8}} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color='#007AFF'/>
                    <Text style={styles.headerButton}>{Localization.back}</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);
    
    return (
        <View style={styles.container}>
            <Image 
                source={require('../../Assets/icon.png')}
                style={styles.imageStyle} />
            <Text style={styles.version}>{Localization.pokerPalName} v{Utils.appVersion}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        margin: 8,
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imageStyle: {
        width: 100, 
        height: 100,
        marginTop: "50%"
    },
    headerButton: {
        fontSize: 18,
        color: '#007AFF', // Set header button color
        marginRight: 16,
        marginLeft: 4,
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
