import axios from 'axios';

export interface LoginRequest {
    emailOrCode: string;
    password: string;
}

export interface TokenResponse {
    jwt: string;
}

export interface UserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    identificationCode: string;
    typeUser: 'Administrador' | 'Professor';
}

class UsuarioService {
    private baseURL = 'http://172.16.6.247:8080';

    async login(data: LoginRequest): Promise<TokenResponse> {
        try {
            const response = await axios.post<TokenResponse>(`${this.baseURL}/users/login`, data);
            return response.data;
        } catch (error: any) {
            console.error('Erro ao fazer login:', error.response?.data || error.message);
            throw error;
        }
    }

    async createUser(userRequest: UserRequest): Promise<void> {
        try {
            const formData = new FormData();

            formData.append('userRequest', JSON.stringify(userRequest));

            const response = await axios.post(`${this.baseURL}/users/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Usuário criado com sucesso:', response.data);
        } catch (error: any) {
            console.error('Erro ao criar usuário:', error.response?.data || error.message);
            throw error;
        }
    }
}

export default new UsuarioService();
