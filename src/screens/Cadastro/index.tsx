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
import { Picker } from '@react-native-picker/picker';
import usuarioService, { UserRequest } from '../../services/usuarioService';
import { useNavigation } from '@react-navigation/native';

const typeUserOptions = [
    { value: 'Professor', label: 'Professor' },
    { value: 'Administrador', label: 'Administrador' },
];

const Cadastro = () => {
    const navigation = useNavigation<any>();

    const [formValues, setFormValues] = useState<UserRequest>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        identificationCode: '',
        typeUser: '' as 'Administrador' | 'Professor',
    });

    const handleChange = (field: keyof UserRequest, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            await usuarioService.createUser(formValues);

            Alert.alert(
                'Sucesso',
                'Usuário criado com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ],
                { cancelable: false },
            );
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar o usuário.');
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Formulário de Cadastro</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={formValues.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Sobrenome"
                value={formValues.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={formValues.email}
                onChangeText={(value) => handleChange('email', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={formValues.password}
                onChangeText={(value) => handleChange('password', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Código SUAP"
                value={formValues.identificationCode}
                onChangeText={(value) => handleChange('identificationCode', value)}
            />

            <Text style={styles.label}>Tipo de Usuário</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={formValues.typeUser}
                    onValueChange={(value) => handleChange('typeUser', value)}
                >
                    <Picker.Item label="Selecione..." value="" />
                    {typeUserOptions.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Enviar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Cadastro;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 6,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    label: {
        marginBottom: 5,
        marginTop: 10,
        fontWeight: '500',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    uploadButton: {
        backgroundColor: '#ddd',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadText: {
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: 'green',
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
