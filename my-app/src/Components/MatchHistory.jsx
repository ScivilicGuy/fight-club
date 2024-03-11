import React from 'react'
import DisplayWinnerBtns from './DisplayWinnerBtns'
import { Typography, Card, CardContent } from '@mui/material'

function MatchHistory({ matches }) {
  return (
    <>
      <Typography variant='h4' align='center' gutterBottom>Match History</Typography>
      {matches.map((match) => (
        <div key={`finished-match-${match.matchId}`} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
          <Card variant="outlined" sx={{ minWidth: 600 }}>
            <CardContent>
              <Typography variant='h6' align='center' gutterBottom>Round {match.round}</Typography>
              <DisplayWinnerBtns selections={[match.player1, match.player2]} winner={match.winner} />
            </CardContent>
          </Card>
        </div>
      ))}
    </>
  )
}

export default MatchHistory