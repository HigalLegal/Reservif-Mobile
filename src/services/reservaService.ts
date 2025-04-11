import axios from 'axios';

export interface ReserveResponse {
    id: number;
    observation: string;
    reservable: string;
    status: 'Pendente' | 'Aprovado' | 'Desaprovado';
}

export interface PeriodReserve {
    startDay: string; // formato: "dd/MM/yyyy"
    endDay: string; // formato: "dd/MM/yyyy"
    startHorary: string; // formato: "HH:mm"
    endHorary: string; // formato: "HH:mm"
    daysOfWeek: number[]; // 1 (domingo) a 7 (sábado)
}

export interface ReserveRequest {
    observation: string;
    reservableId: number;
    userId: number;
    periodReserve: PeriodReserve;
}

class ReservaService {
    private baseURL = 'http://172.16.6.247:8080';

    async getReservesByUser(userId: string, token: string): Promise<ReserveResponse[]> {
        try {
            const response = await axios.get<ReserveResponse[]>(
                `${this.baseURL}/reserves/by-user`,
                {
                    params: { userID: userId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            console.error('Erro ao buscar reservas:', error.response?.data || error.message);
            throw error;
        }
    }

    async createReserve(data: ReserveRequest, token: string): Promise<void> {
        // esse aqui!
        try {
            const response = await axios.post(`${this.baseURL}/reserves`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Reserva criada com sucesso:', response.data);
        } catch (error: any) {
            console.error('Erro ao criar reserva:', error.response?.data || error.message);
            throw error;
        }
    }

    async updateReserveStatus(reservaId: number, approved: boolean, token: string): Promise<void> {
        try {
            await axios.patch(
                `${this.baseURL}/reserves/${reservaId}`,
                { approved },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            console.log('Status da reserva atualizado com sucesso.');
        } catch (error: any) {
            console.error(
                'Erro ao atualizar status da reserva:',
                error.response?.data || error.message,
            );
            throw error;
        }
    }

    async getReservesByStatus(
        status: 'Pendente' | 'Aprovado' | 'Desaprovado',
        token: string,
    ): Promise<ReserveResponse[]> {
        try {
            const response = await axios.get<ReserveResponse[]>(
                `${this.baseURL}/reserves/by-status`,
                {
                    params: { statusReserve: status },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            console.error(
                'Erro ao buscar reservas por status:',
                error.response?.data || error.message,
            );
            throw error;
        }
    }
}

export default new ReservaService();
