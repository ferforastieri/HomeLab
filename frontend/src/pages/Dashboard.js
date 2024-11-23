import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Grid,
    Card,
    CardContent,
    Button,
    LinearProgress
} from '@mui/material';
import {
    Memory as CpuIcon,
    Storage as DiskIcon,
    Memory as RamIcon,
    Folder as FolderIcon,
    Share as ShareIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [systemInfo, setSystemInfo] = useState({
        cpu: {
            usage: 0,
            cores: 0
        },
        memory: {
            total: 0,
            used: 0,
            free: 0
        },
        disk: {
            total: 0,
            used: 0,
            free: 0
        },
        os: {
            platform: '',
            type: '',
            release: '',
            uptime: 0
        },
        application: {
            users: 0,
            files: 0,
            totalStorage: 0
        }
    });

    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const response = await api.get('/monitor/system');
                setSystemInfo(response.data);
            } catch (error) {
                console.error('Erro ao buscar informações do sistema:', error);
            }
        };

        fetchSystemInfo();
        const interval = setInterval(fetchSystemInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatBytes = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Bem-vindo, {user?.name}!
            </Typography>

            {/* Informações do Sistema */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* CPU */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CpuIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">CPU</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={systemInfo.cpu.usage} 
                                sx={{ mb: 1, height: 10, borderRadius: 5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {systemInfo.cpu.usage.toFixed(1)}% em uso
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {systemInfo.cpu.cores} núcleos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Memória */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <RamIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Memória</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(systemInfo.memory.used / systemInfo.memory.total) * 100}
                                sx={{ mb: 1, height: 10, borderRadius: 5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {formatBytes(systemInfo.memory.used)} / {formatBytes(systemInfo.memory.total)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Disco */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <DiskIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Armazenamento</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(systemInfo.disk.used / systemInfo.disk.total) * 100}
                                sx={{ mb: 1, height: 10, borderRadius: 5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {formatBytes(systemInfo.disk.used)} / {formatBytes(systemInfo.disk.total)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Ações Administrativas */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Gerenciar Arquivos
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Upload, download e organização de arquivos
                            </Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<FolderIcon />}
                                onClick={() => navigate('/files')}
                                fullWidth
                            >
                                Arquivos
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Compartilhamentos
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Gerenciar links e permissões
                            </Typography>
                            <Button 
                                variant="contained"
                                startIcon={<ShareIcon />}
                                onClick={() => navigate('/shared')}
                                fullWidth
                            >
                                Compartilhamentos
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Configurações
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Preferências e configurações do sistema
                            </Typography>
                            <Button 
                                variant="contained"
                                startIcon={<SettingsIcon />}
                                onClick={() => navigate('/settings')}
                                fullWidth
                            >
                                Configurações
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button 
                    variant="outlined" 
                    color="error"
                    onClick={logout}
                >
                    Sair
                </Button>
            </Box>
        </Box>
    );
}

export default Dashboard;