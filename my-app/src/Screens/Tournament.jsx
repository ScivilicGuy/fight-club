import React, { useEffect, useState } from 'react'
import { Typography, Card, CardContent } from '@mui/material'
import { apiFetch } from '../util'
import { useParams } from 'react-router-dom'

function Tournament() {
  const params = useParams()
  const [tournament, setTournament] = useState({
    name: '',
    desc: '',
    inviteCode: '',
    numTeams: 0,
    format: '',
    players: []
  })

  useEffect(() => {
    (async () => {
      const res = await apiFetch(`tournament/${params.tournamentId}`)
      setTournament(res.tournament)
      console.log(res)
    })()
  }, [params.tournamentId])

  return (
    <>
      <Typography variant='h2' align='center'>{tournament.name}</Typography>
      {tournament.players.map((player) => (
        <Card>
          <CardContent>
            <Typography variant='h6' align='center'>{player}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default Tournament