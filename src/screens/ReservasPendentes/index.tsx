import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HamburguerMenu from '../../components/HamburguerMenu';
import ReservaService, { ReserveResponse } from '../../services/reservaService';

interface Reserva {
    id: number;
    reservable: string;
    status: string;
    observation: string;
    period: {
        startDay: string;
        endDay: string;
        startHorary: string;
        endHorary: string;
    };
}

const ReservasPendentes = () => {
    const [pendingReservations, setPendingReservations] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPendingReservations = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    setError('Token de autenticação não encontrado.');
                    setLoading(false);
                    return;
                }

                const reserves = await ReservaService.getReservesByStatus('Pendente', token);
                // Mapear os dados para incluir informações de período fictícias, se necessário
                const reservasComPeriodo: Reserva[] = reserves.map((reserva) => ({
                    ...reserva,
                    period: {
                        startDay: '10/04/2025',
                        endDay: '10/04/2025',
                        startHorary: '08:00',
                        endHorary: '10:00',
                    },
                }));
                setPendingReservations(reservasComPeriodo);
            } catch (err: any) {
                setError('Erro ao buscar reservas pendentes.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingReservations();
    }, []);

    const handleApprove = async (reservationId: number, aprovada: boolean) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Erro', 'Token de autenticação não encontrado.');
                return;
            }

            await ReservaService.updateReserveStatus(reservationId, aprovada, token);
            setPendingReservations((prev) =>
                prev.filter((reservation) => reservation.id !== reservationId),
            );
            const mensagem = aprovada
                ? 'Reserva aprovada com sucesso!'
                : 'Reserva recusada com sucesso';
            Alert.alert('Sucesso', mensagem);
        } catch (error: any) {
            console.error('Erro ao atualizar status da reserva:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o status da reserva.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HamburguerMenu />
            <Text style={styles.title}>Reservas Pendentes</Text>
            <Text style={styles.subtitle}>Clique em uma reserva para aprová-la</Text>

            {loading && <ActivityIndicator size="large" color="#2F9E41" />}
            {error && <Text style={styles.error}>{error}</Text>}

            {!loading && pendingReservations.length === 0 && (
                <Text style={styles.noReservations}>Não há reservas pendentes.</Text>
            )}

            {pendingReservations.map((reservation) => (
                <View key={reservation.id} style={styles.card}>
                    <Text style={styles.cardTitle}>Laboratório: {reservation.reservable}</Text>
                    <Text>Status: {reservation.status}</Text>
                    <Text>Observação: {reservation.observation}</Text>
                    <Text>
                        Período: {reservation.period.startDay} até {reservation.period.endDay}
                    </Text>
                    <Text>
                        Horário: {reservation.period.startHorary} - {reservation.period.endHorary}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleApprove(reservation.id, true)}
                    >
                        <Text style={styles.buttonText}>Aprovar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonDesaprovar}
                        onPress={() => handleApprove(reservation.id, false)}
                    >
                        <Text style={styles.buttonText}>Reprovar</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
};

export default ReservasPendentes;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#2F9E41',
        minHeight: '100%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFF',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 18,
        marginBottom: 15,
        color: '#EEE',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    noReservations: {
        textAlign: 'center',
        color: '#FFF',
        fontSize: 16,
        marginVertical: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 6,
        fontSize: 16,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#2F9E41',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonDesaprovar: {
        marginTop: 10,
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
