import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('@ServerApp:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para logs
api.interceptors.request.use(request => {
    console.log('Requisição sendo enviada:', {
        url: request.url,
        method: request.method,
        data: request.data,
        headers: request.headers
    });
    return request;
});

api.interceptors.response.use(
    response => {
        console.log('Resposta recebida:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('Erro na requisição:', {
            message: error.message,
            response: error.response?.data
        });
        return Promise.reject(error);
    }
);

export default api;
