import React, { useState, useEffect } from 'react'
import { Box, Typography, IconButton, Button, AppBar, Toolbar } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../util';

function Banner() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function checkLogin() {
        const res = await apiFetch('/check/login', 'GET');
        setIsLoggedIn(res.logged_in);
    }
    checkLogin();
}, []);

  const viewHome = () => {
    navigate('/')
  }

  const login = () => {
    navigate('/login')
  }

  const logout = () => {

  }

  return (
    <Box sx={{ flexGrow: 1, marginBottom: '2rem' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }} 
            onClick={viewHome}
          >
            <HomeIcon fontSize="large" sx={{ fontSize: '3rem', margin: '1rem' }} />
          </IconButton>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>Fight Club</Typography>
          {!isLoggedIn 
            ? <Button color="inherit" sx={{ fontSize: '1.5rem', marginRight: '1rem' }} onClick={login}>Login</Button>
            : <Button color="inherit" sx={{ fontSize: '1.5rem', marginRight: '1rem' }} onClick={logout}>Logout</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Banner