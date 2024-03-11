import React from 'react'
import { Typography, Card, CardContent } from '@mui/material'
import MatchHistory from './MatchHistory'

function TournamentResult({ matches, winner }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
        <Card variant="outlined" sx={{ minWidth: 200, borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: 1 }}>
          <CardContent>
            <Typography variant='h4' align='center' sx={{ color: 'red' }}>Winner is {winner}</Typography>
          </CardContent>
        </Card>
      </div>
      <MatchHistory matches={matches} />
    </>
    
  )
}

export default TournamentResult