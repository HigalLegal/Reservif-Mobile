import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import reservaService, { ReserveResponse } from '../../services/reservaService';
import HamburguerMenu from '../../components/HamburguerMenu';

const screenWidth = Dimensions.get('window').width;

const Home = () => {
    const [nome, setNome] = useState('');
    const [reservas, setReservas] = useState<ReserveResponse[]>([]);
    const [loading, setLoading] = useState(true);

    console.log(nome)

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    console.warn('Token não encontrado.');
                    return;
                }

                const decoded: any = jwtDecode(token);
                const userId = decoded.userId;
                setNome(decoded.nome || '');

                const reservasData = await reservaService.getReservesByUser(userId, token);
                setReservas(reservasData);
            } catch (error) {
                console.error('Erro ao buscar reservas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, []);

    const renderReserva = ({ item }: { item: ReserveResponse }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.reservable}</Text>
            <Text>Observação: {item.observation}</Text>
            <Text>Status: {item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <HamburguerMenu />
            <Text style={styles.titulo}>Olá, {nome}</Text>
            <Text style={styles.subtitulo}>Veja suas reservas do dia</Text>
            <View style={styles.cardContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#2F9E41" />
                ) : reservas.length === 0 ? (
                    <Text style={styles.semReservasText}>
                        Nenhuma reserva encontrada para hoje.
                    </Text>
                ) : (
                    <FlatList
                        data={reservas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderReserva}
                        contentContainerStyle={styles.sliderContainer}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#2F9E41',
        flex: 1,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        flex: 1,
    },
    sliderContainer: {
        paddingHorizontal: 10,
    },
    card: {
        width: screenWidth * 0.8,
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        elevation: 3,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16,
    },
    semReservasText: {
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 20,
    },
});

export default Home;
