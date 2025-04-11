import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { styles } from './style';
import usuarioService from '../../services/usuarioService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [userInput, setUserInput] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<any>();

    const handleLogin = async () => {
        try {
            const { jwt } = await usuarioService.login({
                emailOrCode: userInput,
                password: password,
            });

            await AsyncStorage.setItem('token', jwt);
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Erro', 'Login não foi bem-sucedido. Verifique suas credenciais.');
        }
    };

    const handleCadastrar = () => {
        navigation.replace('Cadastro');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email ou Código SUAP"
                        value={userInput}
                        onChangeText={setUserInput}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Logar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...styles.button, marginTop: 10 }}
                        onPress={handleCadastrar}
                    >
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;
