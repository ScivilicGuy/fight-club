import React, { useState, useEffect } from 'react'
import { apiFetch } from '../util'
import { Card, CardContent, Typography, CardActionArea } from '@mui/material'

function Leaderboards() {
  const [tournaments, setTournaments] = useState([])
  const [leaderboard, setLeaderboard] = useState({})

  useEffect(() => {
    (async() => {
      try {
        const res = await apiFetch('tournaments', 'GET')
        setTournaments(res.tournaments)
      } catch (error) {
        alert(error) 
      }
    })()
  }, [])

  const calcPlayersWins = () => {
    const temp_leaderboard = []
    for (tournament in tournaments) {
      
    }
  }

  return (
    <>
      <Typography variant="h2" align='center' gutterBottom>
        Leaderboards
      </Typography>
      {tournaments.map((tournament) => (
        <Card>
          <CardContent>
            <Typography variant='h6' align='center'>{tournament.name}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default Leaderboards