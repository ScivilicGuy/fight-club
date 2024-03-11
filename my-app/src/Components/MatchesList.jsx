import React from 'react'
import SelectWinnerBtns from './SelectWinnerBtns';
import { Typography, Card, CardContent } from '@mui/material'

function MatchesList({ matches, winners, setWinners }) {
  const updateWinners = (e, index) => {
    if (!e.target.value) {
      return
    }
    setWinners({...winners, [index]: e.target.value})
  }

  return (
    matches.map((match, index) => (
      <div key={`match-${match.matchId}`} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
        <Card variant="outlined" sx={{ minWidth: 600 }}>
          <CardContent onClick={(e) => updateWinners(e, index)}>
            <Typography variant='h6' align='center' gutterBottom>Match {index+1}</Typography>
            <SelectWinnerBtns selections={[match.player1, match.player2]} />
          </CardContent>
        </Card>
      </div>
    ))
  )
}

export default MatchesList