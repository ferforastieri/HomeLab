import React from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Folder as FolderIcon,
    Share as ShareIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function MainLayout({ children }) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
        { text: 'Arquivos', icon: <FolderIcon />, path: '/files' },
        { text: 'Compartilhados', icon: <ShareIcon />, path: '/shared' },
        { text: 'Configurações', icon: <SettingsIcon />, path: '/settings' }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Servidor Pessoal
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {user?.name}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                >
                    <List>
                        {menuItems.map((item) => (
                            <ListItem 
                                button 
                                key={item.text}
                                onClick={() => handleNavigation(item.path)}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        <Divider />
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Sair" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: '100%',
                    minHeight: '100vh',
                    mt: 8
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default MainLayout;