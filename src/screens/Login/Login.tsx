import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from './style';

const Login = () => {
    const [userInput, setUserInput] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {};

    return (
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
        </View>
    );
};

export default Login;
