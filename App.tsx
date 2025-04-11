import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import RegistroLab from './src/screens/RegistroLab';
import RegistroReserva from './src/screens/RegistroReserva';
import Laboratorios from './src/screens/Laboratorios';
import ReservasPendentes from './src/screens/ReservasPendentes';
import Cadastro from './src/screens/Cadastro';
import { SafeAreaView, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Laboratorios" component={Laboratorios} />
                    <Stack.Screen name="RegistroLab" component={RegistroLab} />
                    <Stack.Screen name="RegistroReserva" component={RegistroReserva} />
                    <Stack.Screen name="ReservasPendentes" component={ReservasPendentes} />
                    <Stack.Screen name="Cadastro" component={Cadastro} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});
