import React, { useState, useEffect } from 'react'
import { apiFetch } from '../util'
import { Card, CardContent, Typography, CardActionArea } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function ViewTournaments() {
  const [tournaments, setTournaments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    (async() => {
      const res = await apiFetch('tournaments', 'GET')
      setTournaments(res.tournaments)
    })()
  }, [])

  const openTournament = (tournamentId) => {
    navigate(`/tournaments/${tournamentId}`)
  }

  return (
    <>
      <Typography variant="h2" align='center' gutterBottom>
        My Tournaments
      </Typography>
      {tournaments.map((tournament) => (
        <Card>
          <CardActionArea onClick={() => openTournament(tournament.id)}>
            <CardContent>
              <Typography variant='h6' align='center'>{tournament.name}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </>
  )
}

export default ViewTournaments