import React from 'react'
import { CardActionArea, Card, Typography } from '@mui/material';

function TournamentBtn({ action, title }) {
  return (
    <Card variant="outlined" sx={{ minWidth: 600, minHeight: 60, backgroundColor: 'lightblue' }}>
      <CardActionArea onClick={action}> 
        <Typography variant='h3' align='center'>{title}</Typography>
      </CardActionArea>
    </Card>
  )
}

export default TournamentBtn