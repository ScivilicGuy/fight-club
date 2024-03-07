import React, { useState } from 'react'
import { Typography, Card, CardContent, CardActionArea } from '@mui/material'
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
    console.log(e.target.textContent)
    if (e.target.textContent === 'Confirm') {
      props.removePlayer(player)
    }
  };

  return (
    <>
      <RemovePlayerConfirmation open={open} handleClose={handleClose}></RemovePlayerConfirmation>
      {props.players.map((player) => (
        <Card>
          <CardActionArea onClick={() => handleClickOpen(player)}>
            <Typography variant='h6' align='center'>{player}</Typography>
          </CardActionArea>
        </Card>
      ))} 
    </>
  )
}

export default PlayerList