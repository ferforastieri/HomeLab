import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    Alert
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('As senhas não coincidem');
        }

        try {
            setError('');
            setLoading(true);
            
            console.log('Tentando registrar:', { name, email, password });
            
            const response = await api.post('/auth/register', {
                name,
                email,
                password
            });
            
            console.log('Registro bem-sucedido:', response.data);
            navigate('/login', { 
                state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            setError(
                error.response?.data?.message || 
                'Erro ao criar conta. Tente novamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default'
            }}
        >
            <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Registro
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nome"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="Confirmar Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Criando conta...' : 'Criar Conta'}
                    </Button>
                </form>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Link component={RouterLink} to="/login">
                        Já tem uma conta? Faça login
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
}

export default Register;