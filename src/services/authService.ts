import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    userId: number;
    userFullName: string;
    email: string;
    groups: string[];
    exp: number;
    iat: number;
    upn: string;
}

export interface UsuarioLogado {
    id: number;
    nome: string;
    email: string;
    roles: string[];
}

const TOKEN_KEY = 'token';

class AuthService {
    async getUsuarioLogado(): Promise<UsuarioLogado | null> {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            if (!token) return null;

            const decoded = jwtDecode<JwtPayload>(token);

            return {
                id: decoded.userId,
                nome: decoded.userFullName,
                email: decoded.email,
                roles: decoded.groups,
            };
        } catch (error) {
            console.error('Erro ao decodificar token JWT:', error);
            return null;
        }
    }

    async logout() {
        await AsyncStorage.removeItem(TOKEN_KEY);
    }

    async setToken(token: string) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    }

    async getToken() {
        return AsyncStorage.getItem(TOKEN_KEY);
    }
}

export default new AuthService();
