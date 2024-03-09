import React from 'react'
import { CardActionArea, Card, Typography } from '@mui/material';

function TournamentBtn(props) {
  return (
    <Card variant="outlined" sx={{ minWidth: 600, minHeight: 60, backgroundColor: 'lightblue' }}>
      <CardActionArea onClick={props.action}> 
        <Typography variant='h3' align='center'>{props.title}</Typography>
      </CardActionArea>
    </Card>
  )
}

export default TournamentBtn