import React from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import authService from '../../services/authService';

const VerticalMenu = () => {
    const navigation = useNavigation<any>();

    const logout = async () => {
        await authService.logout();
        navigation.replace('Login');
    };

    return (
        <View style={styles.drawer}>
            <View>
                <Image
                    source={require('../../assets/images/logoBranca.png')}
                    style={styles.menuLogo}
                />
            </View>

            <Text style={styles.menuTitle}>Menu</Text>

            <ScrollView>
                <MenuItem
                    icon="laptop"
                    text="Laboratórios"
                    onAction={() => {
                        navigation.replace('Laboratorios');
                    }}
                />
                <MenuItem
                    icon="app-registration"
                    text="Registrar Laboratório"
                    onAction={() => {
                        navigation.replace('RegistroLab');
                    }}
                />
                <MenuItem
                    icon="event-available"
                    text="Reservas"
                    onAction={() => {
                        navigation.replace('Home');
                    }}
                />
                <MenuItem
                    icon="article"
                    text="Nova Reserva"
                    onAction={() => {
                        navigation.replace('RegistroReserva');
                    }}
                />
                <MenuItem
                    icon="pending-actions"
                    text="Reservas Pendentes"
                    onAction={() => {
                        navigation.replace('ReservasPendentes');
                    }}
                />
                <MenuItem icon="logout" text="Logout" onAction={logout} />
            </ScrollView>
        </View>
    );
};

interface MenuItemProps {
    icon: string;
    text: string;
    onAction: () => void;
}

const MenuItem = ({ icon, text, onAction }: MenuItemProps) => {
    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
                onAction();
            }}
        >
            <MaterialIcons name={icon} size={24} color="#bec2c6" style={styles.menuIcon} />
            <Text style={styles.menuText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    drawer: {
        width: '100%',
        backgroundColor: '#1F2732',
        paddingVertical: 20,
        paddingHorizontal: 10,
        height: '100%',
    },
    logoBox: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 180,
        height: 50,
    },
    menuTitle: {
        textAlign: 'center',
        color: '#bec2c6',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        fontFamily: 'Roboto',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    menuIcon: {
        marginRight: 16,
    },
    menuText: {
        fontSize: 16,
        color: '#bec2c6',
        fontFamily: 'Roboto',
    },
    menuLogo: {
        width: 120,
        height: 60,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 20,
    },
});

export default VerticalMenu;
