import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import HamburguerMenu from '../../components/HamburguerMenu';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import ReservaService from '../../services/reservaService';
import LaboratorioService, { ReservableResponse } from '../../services/laboratorioService';

type FieldKey = 'startDay' | 'endDay' | 'startHorary' | 'endHorary';

interface JWTDecoded {
    userId: number;
    [key: string]: any;
}

const RegistroReserva = () => {
    const [formData, setFormData] = useState({
        observation: '',
        reservableId: '',
        userId: '',
        periodReserve: {
            startDay: new Date(),
            endDay: new Date(),
            startHorary: new Date(),
            endHorary: new Date(),
            daysOfWeek: [2, 4], // Valor fixo por enquanto
        },
    });

    const [labs, setLabs] = useState<ReservableResponse[]>([]);
    const [pickerConfig, setPickerConfig] = useState<{
        isVisible: boolean;
        mode: 'date' | 'time';
        field: FieldKey | null;
    }>({ isVisible: false, mode: 'date', field: null });

    const [errors, setErrors] = useState({ dateError: '', timeError: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Token não encontrado');
                const decoded: JWTDecoded = jwtDecode(token);
                const userId = decoded.userId.toString();

                const reservables = await LaboratorioService.getReservables(token);
                setLabs(reservables);
                setFormData((prev) => ({ ...prev, userId }));
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                Alert.alert('Erro ao carregar dados');
            }
        };

        fetchData();
    }, []);

    const validateForm = () => {
        let dateError = '';
        let timeError = '';

        if (formData.periodReserve.startDay > formData.periodReserve.endDay) {
            dateError = 'A data de início não pode ser maior que a data de fim.';
        }

        if (formData.periodReserve.startHorary > formData.periodReserve.endHorary) {
            timeError = 'O horário de início não pode ser maior que o horário de fim.';
        }

        if (dateError || timeError) {
            setErrors({ dateError, timeError });
            return false;
        }

        setErrors({ dateError: '', timeError: '' });
        return true;
    };

    const handleConfirm = (date: Date) => {
        if (pickerConfig.field) {
            setFormData((prev) => ({
                ...prev,
                periodReserve: {
                    ...prev.periodReserve,
                    [pickerConfig.field!]: date,
                },
            }));
        }
        setPickerConfig({ isVisible: false, mode: 'date', field: null });
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');

            const reserveData = {
                observation: formData.observation,
                reservableId: Number(formData.reservableId),
                userId: Number(formData.userId),
                periodReserve: {
                    startDay: dayjs(formData.periodReserve.startDay).format('DD/MM/YYYY'),
                    endDay: dayjs(formData.periodReserve.endDay).format('DD/MM/YYYY'),
                    startHorary: dayjs(formData.periodReserve.startHorary).format('HH:mm'),
                    endHorary: dayjs(formData.periodReserve.endHorary).format('HH:mm'),
                    daysOfWeek: formData.periodReserve.daysOfWeek,
                },
            };

            await ReservaService.createReserve(reserveData, token);
            Alert.alert('Reserva cadastrada com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar reserva:', error);
            Alert.alert('Erro ao cadastrar reserva');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HamburguerMenu />
            <Text style={styles.title}>Cadastrar Reserva</Text>

            {errors.dateError ? <Text style={styles.error}>{errors.dateError}</Text> : null}
            {errors.timeError ? <Text style={styles.error}>{errors.timeError}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Observação"
                value={formData.observation}
                onChangeText={(text) => setFormData({ ...formData, observation: text })}
            />

            <Picker
                selectedValue={formData.reservableId}
                onValueChange={(value) =>
                    setFormData({ ...formData, reservableId: value.toString() })
                }
                style={styles.input}
            >
                <Picker.Item label="Selecione um laboratório" value="" />
                {labs.map((lab) => (
                    <Picker.Item
                        key={lab.id}
                        label={`ID: ${lab.id} - ${lab.name}`}
                        value={lab.id.toString()}
                    />
                ))}
            </Picker>

            <TextInput
                style={[styles.input, { backgroundColor: '#eee' }]}
                value={formData.userId}
                editable={false}
                placeholder="ID do Usuário"
            />

            {(['startDay', 'endDay', 'startHorary', 'endHorary'] as FieldKey[]).map((field) => {
                const isDate = field === 'startDay' || field === 'endDay';
                const label = {
                    startDay: 'Data de Início',
                    endDay: 'Data de Fim',
                    startHorary: 'Horário de Início',
                    endHorary: 'Horário de Fim',
                }[field];

                const value = formData.periodReserve[field];
                const formatted = isDate
                    ? dayjs(value).format('DD/MM/YYYY')
                    : dayjs(value).format('HH:mm');

                return (
                    <View key={field}>
                        <Text style={styles.label}>{label}</Text>
                        <TouchableOpacity
                            onPress={() =>
                                setPickerConfig({
                                    isVisible: true,
                                    mode: isDate ? 'date' : 'time',
                                    field,
                                })
                            }
                            style={styles.dateButton}
                        >
                            <Text style={styles.dateButtonText}>{formatted}</Text>
                        </TouchableOpacity>
                    </View>
                );
            })}

            <DateTimePickerModal
                isVisible={pickerConfig.isVisible}
                mode={pickerConfig.mode}
                date={pickerConfig.field ? formData.periodReserve[pickerConfig.field] : new Date()}
                onConfirm={handleConfirm}
                onCancel={() => setPickerConfig({ isVisible: false, mode: 'date', field: null })}
                locale="pt-BR"
                is24Hour
            />

            <View style={styles.buttonContainer}>
                <Button title="Cadastrar Reserva" onPress={handleSubmit} color="#2F9E41" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#ffffff',
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 6,
        padding: 10,
        marginTop: 15,
        marginBottom: 12,
    },
    label: {
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
    },
    dateButton: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        marginTop: 6,
        marginBottom: 12,
    },
    dateButtonText: {
        color: '#000',
        fontSize: 16,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default RegistroReserva;
