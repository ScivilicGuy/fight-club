import React from 'react'
import IconlessRadio from '../Components/IconlessRadio';
import { Typography, Card, CardContent } from '@mui/material'

function MatchesList(props) {
  const updateWinners = (e, index) => {
    if (!e.target.value) {
      return
    }
    props.setWinners({...props.winners, [index]: e.target.value})
  }

  return (
    props.matches.map((match, index) => (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
        <Card variant="outlined" sx={{ minWidth: 600 }}>
          <CardContent onClick={(e) => updateWinners(e, index)}>
            <Typography variant='h6' align='center' gutterBottom>Match {index+1}</Typography>
            <IconlessRadio selections={[match.player1, match.player2]}></IconlessRadio>
          </CardContent>
        </Card>
      </div>
    ))
  )
}

export default MatchesList