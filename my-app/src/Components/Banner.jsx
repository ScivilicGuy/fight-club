import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom'

function Banner() {
  const navigate = useNavigate()

  const viewHome = () => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem'
      }}
    >
      <IconButton sx={{ '&:hover': { color: 'red' }}} onClick={viewHome}>
        <HomeIcon fontSize="large" color="primary" sx={{ fontSize: '3rem', margin: '1rem' }} />
      </IconButton>
      <Typography variant="h3">Fight Club</Typography>
    </Box>
  )
}

export default Banner