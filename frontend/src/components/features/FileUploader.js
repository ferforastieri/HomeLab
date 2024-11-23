import React, { useState } from 'react';
import {
    Box,
    Button,
    LinearProgress,
    Typography,
    Card,
    CardContent
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';

function FileUploader({ onUploadComplete }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            
            await axios.post('http://localhost:5000/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Adicionar token de autenticação quando implementar
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                }
            });

            onUploadComplete?.();
        } catch (error) {
            console.error('Erro no upload:', error);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                    <input
                        accept="*/*"
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    <label htmlFor="file-upload">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                            disabled={uploading}
                        >
                            Upload de Arquivo
                        </Button>
                    </label>

                    {uploading && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress variant="determinate" value={progress} />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {progress}% Completo
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default FileUploader;
