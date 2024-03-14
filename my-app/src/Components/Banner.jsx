import React, { useContext } from 'react'
import { Box, Typography, IconButton, Button, AppBar, Toolbar } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom'
import { TOKEN } from '../config.js'
import { apiFetch } from '../util.jsx';
import { AuthContext } from '../App.js';

function Banner() {
  const navigate = useNavigate()
  const { isLoggedIn, setIsLoggedIn, setSuccessMsg, setOpenSuccess } = useContext(AuthContext)

  const viewHome = () => {
    navigate('/')
  }

  const login = () => {
    navigate('/login')
  }

  const logout = async () => {
    try {
      await apiFetch('/logout', 'POST')
      localStorage.removeItem(TOKEN)
      setIsLoggedIn(false)
      setSuccessMsg('Logged out successfully!')
      setOpenSuccess(true)
      viewHome()
    } catch (error) {
      alert(error)
    }
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