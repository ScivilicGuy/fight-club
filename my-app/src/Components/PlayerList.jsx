import React, { useState } from 'react'
import { Typography, Card, CardActionArea, Grid, Box } from '@mui/material'
import RemovePlayerConfirmation from './RemovePlayerConfirmation';

function PlayerList(props) {
  const [open, setOpen] = useState(false);
  const [player, setPlayer] = useState()

  const handleClickOpen = (player) => {
    setOpen(true)
    setPlayer(player)
  };

  const handleClose = (e) => {
    setOpen(false);
    if (e.target.textContent === 'Confirm') {
      props.removePlayer(player)
    }
  };

  return (
    <>
      <RemovePlayerConfirmation open={open} handleClose={handleClose}></RemovePlayerConfirmation>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid 
          container
          spacing={2}
          alignItems="center"
          justifyContent='center'
          sx={{ width: '80%' }}
        >
          {props.players.map((player) => (
            <Grid key={player} item xs={4}>
              <Card variant='outlined' sx={{ padding: '1rem' }}> 
                <CardActionArea onClick={() => handleClickOpen(player)}>
                  <Typography variant='h5' align='center'>{player}</Typography>
                </CardActionArea>
              </Card>
          </Grid>
          ))} 
        </Grid>
      </Box>
      
    </>
  )
}

export default PlayerList