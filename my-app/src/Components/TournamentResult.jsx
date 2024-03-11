import React from 'react'
import { Typography, Card, CardContent } from '@mui/material'

function TournamentResult(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
        <Card variant="outlined" sx={{ minWidth: 250, borderRadius: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: 2 }}>
          <CardContent>
            <Typography variant='h4' align='center' sx={{ color: 'red' }}>Winner is {props.winner}</Typography>
          </CardContent>
        </Card>
      </div>
  )
}

export default TournamentResult