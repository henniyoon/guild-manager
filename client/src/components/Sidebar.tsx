import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Toolbar, Typography } from '@mui/material';
import styles from '../styles/Header.module.css';
import { useTheme } from '@mui/material/styles';

interface SidebarProps {
    mainItems: string[];
    secondaryItems: string[];
}
const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ mainItems, secondaryItems }) => {
    const theme = useTheme();

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    // backgroundColor: theme.palette.primary.light,
                    // color: '#fff',
                    border: 'none'
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 0,
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.4)'
                }}
            >
                <Link to="/" className={styles.logoLink}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" className={styles.logo} alt="Guild Manager Logo" />
                        <div style={{ marginLeft: '5px' }}>
                            <Typography variant="h5" noWrap style={{ fontWeight: 'bold' }}>
                                메소
                            </Typography>
                            <Typography style={{ fontWeight: 'bold', fontSize: 15 }}>
                                메이플길드관리소
                            </Typography>
                        </div>
                    </div>
                </Link>
            </Toolbar>
            {/* <Divider /> */}
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer >
    );
};

export default Sidebar;
