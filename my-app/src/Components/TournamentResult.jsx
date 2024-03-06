import React from 'react'
import { Typography, Card, CardContent } from '@mui/material'

function TournamentResult(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
        <Card variant="outlined" sx={{ minWidth: 600 }}>
          <CardContent>
            <Typography variant='h6' align='center' gutterBottom>Winner: {props.winner}</Typography>
          </CardContent>
        </Card>
      </div>
  )
}

export default TournamentResult