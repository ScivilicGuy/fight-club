import React from 'react'
import { Typography, Card, CardContent } from '@mui/material'

function PlayerList(props) {
  return (
    props.tournament.players.map((player) => (
      <Card>
        <CardContent>
          <Typography variant='h6' align='center'>{player}</Typography>
        </CardContent>
      </Card>
    )) 
  )
}

export default PlayerList