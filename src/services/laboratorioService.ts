import axios from 'axios';

export interface ReservableRequest {
    name: string;
    location: string;
}

export interface ReservableResponse {
    id: number;
    name: string;
    location: string;
}

class LaboratorioService {
    private baseURL = 'http://172.16.6.247:8080';

    async createReservable(data: ReservableRequest, token: string): Promise<void> {
        try {
            const response = await axios.post(`${this.baseURL}/reservables`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Reservável criado com sucesso:', response.data);
        } catch (error: any) {
            console.error('Erro ao criar reservável:', error.response?.data || error.message);
            throw error;
        }
    }
    async getReservables(token: string): Promise<ReservableResponse[]> {
        try {
            const response = await axios.get<ReservableResponse[]>(`${this.baseURL}/reservables`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Erro ao buscar reserváveis:', error.response?.data || error.message);
            throw error;
        }
    }
}

export default new LaboratorioService();
