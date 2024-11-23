import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    CreateNewFolder,
    UploadFile,
    MoreVert,
    Share,
    Delete,
    Download
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import api from '../services/api';
import FileUploader from '../components/features/FileUploader';

function Files() {
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newFolderDialog, setNewFolderDialog] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [shareDialog, setShareDialog] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadFolderContents();
    }, [currentFolder]);

    const loadFolderContents = async () => {
        try {
            const response = await api.get(`/folders/${currentFolder || ''}`);
            setFolders(response.data.folders);
            setFiles(response.data.files);
        } catch (error) {
            enqueueSnackbar('Erro ao carregar arquivos', { variant: 'error' });
        }
    };

    const handleCreateFolder = async () => {
        try {
            await api.post('/folders', {
                name: newFolderName,
                parentFolderId: currentFolder
            });
            setNewFolderDialog(false);
            setNewFolderName('');
            loadFolderContents();
            enqueueSnackbar('Pasta criada com sucesso', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Erro ao criar pasta', { variant: 'error' });
        }
    };

    const handleShare = async () => {
        try {
            await api.post('/share', {
                resourceId: selectedItem._id,
                resourceType: selectedItem.type,
                emails: [shareEmail],
                permission: 'view'
            });
            setShareDialog(false);
            setShareEmail('');
            enqueueSnackbar('Compartilhado com sucesso', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Erro ao compartilhar', { variant: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            if (selectedItem.type === 'folder') {
                await api.delete(`/folders/${selectedItem._id}`);
            } else {
                await api.delete(`/files/${selectedItem._id}`);
            }
            loadFolderContents();
            enqueueSnackbar('Item deletado com sucesso', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Erro ao deletar item', { variant: 'error' });
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4">Meus Arquivos</Typography>
                <Box>
                    <Button
                        startIcon={<CreateNewFolder />}
                        onClick={() => setNewFolderDialog(true)}
                        sx={{ mr: 1 }}
                    >
                        Nova Pasta
                    </Button>
                    <FileUploader onUploadComplete={loadFolderContents} />
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Tamanho</TableCell>
                            <TableCell>Modificado</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* ... renderização dos itens ... */}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Diálogos */}
            <Dialog open={newFolderDialog} onClose={() => setNewFolderDialog(false)}>
                <DialogTitle>Nova Pasta</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome da Pasta"
                        fullWidth
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewFolderDialog(false)}>Cancelar</Button>
                    <Button onClick={handleCreateFolder}>Criar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={shareDialog} onClose={() => setShareDialog(false)}>
                <DialogTitle>Compartilhar</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialog(false)}>Cancelar</Button>
                    <Button onClick={handleShare}>Compartilhar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Files;
