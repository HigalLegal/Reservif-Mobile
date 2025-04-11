import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import HamburguerMenu from '../../components/HamburguerMenu';
import LaboratorioService, { ReservableResponse } from '../../services/laboratorioService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Laboratorios = () => {
    const [labs, setLabs] = useState<ReservableResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    console.warn('Token não encontrado');
                    return;
                }
                const data = await LaboratorioService.getReservables(token);
                setLabs(data);
            } catch (error) {
                console.error('Erro ao buscar laboratórios:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLabs();
    }, []);

    const renderItem = ({ item }: { item: ReservableResponse }) => (
        <TouchableOpacity style={styles.labItem}>
            <Text style={styles.labName}>{item.name}</Text>
            <Text style={styles.labDescription}>{item.location}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <HamburguerMenu />

            <View style={styles.contentContainer}>
                <View style={styles.innerContent}>
                    <Text style={styles.title}>Laboratórios</Text>

                    {loading ? (
                        <Text style={styles.emptyText}>Carregando laboratórios...</Text>
                    ) : labs.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum laboratório registrado.</Text>
                    ) : (
                        <FlatList
                            data={labs}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.labList}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        flex: 2,
        backgroundColor: '#2F9E41',
        margin: 16,
        borderRadius: 8,
        padding: 10,
    },
    innerContent: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 15,
        textAlign: 'center',
        color: '#000',
    },
    emptyText: {
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
    labList: {
        marginTop: 10,
    },
    labItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 12,
    },
    labName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    labDescription: {
        fontSize: 14,
        color: '#666',
    },
});

export default Laboratorios;
