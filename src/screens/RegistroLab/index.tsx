import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import HamburguerMenu from '../../components/HamburguerMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import laboratorioService from '../../services/laboratorioService';

const RegistroLab = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Erro', 'Token não encontrado.');
                return;
            }

            await laboratorioService.createReservable({ name, location }, token);
            Alert.alert('Sucesso', 'Laboratório cadastrado com sucesso!');
            setName('');
            setLocation('');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível cadastrar o laboratório.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View>
                <HamburguerMenu />
            </View>

            <View style={styles.formWrapper}>
                <Text style={styles.title}>Cadastrar Laboratório</Text>

                <TextInput
                    placeholder="Nome do Laboratório"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    placeholder="Localização"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={location}
                    onChangeText={setLocation}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    formWrapper: {
        flex: 2,
        backgroundColor: '#2F9E41',
        borderRadius: 8,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#1F2732',
        paddingVertical: 12,
        borderRadius: 6,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RegistroLab;
