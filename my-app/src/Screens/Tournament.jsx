import React, { useEffect, useState } from 'react'
import { Typography, Card, CardContent, Button, Input, Grid } from '@mui/material'
import { apiFetch } from '../util'
import { useParams } from 'react-router-dom'
import { uid } from 'uid';

function Tournament() {
  const params = useParams()
  const [tournament, setTournament] = useState({
    name: '',
    desc: '',
    inviteCode: '',
    state: '',
    players: []
  })
  const [tournamentStarted, setTournamentStarted] = useState(false)
  const [matches, setMatches] = useState([])

  useEffect(() => {
    (async () => {
      const res = await apiFetch(`tournament/${params.tournamentId}`, 'GET')
      setTournament(res.tournament)
      if (tournament.state === 'IN PROGRESS' || tournament.state === 'COMPLETED') {
        setTournamentStarted(true)
        const res = await apiFetch(`tournament/${params.tournamentId}/matches`, 'GET')
        setMatches(res.matches)
      }
    })()
  }, [params.tournamentId, tournament.state])

  const handleTournamentStart = async () => {
    if (tournament.players.length % 2 !== 0) {
      alert('ERROR: Must have an even number of players to start!')
      return 
    }

    setTournamentStarted(true)
    await apiFetch(`tournament/${params.tournamentId}/start`, 'POST', {'players': tournament.players})
    const res = await apiFetch(`tournament/${params.tournamentId}/matches`, 'GET')
    setMatches(res.matches)
    console.log(res.matches)
  }

  return (
    <>
      <Typography variant='h2' align='center' gutterBottom>{tournament.name}</Typography>
      {!tournamentStarted && <Button variant="contained" onClick={handleTournamentStart} >Start Tournament</Button>}
      {!tournamentStarted 
        ? tournament.players.map((player) => (
          <Card>
            <CardContent>
              <Typography variant='h6' align='center'>{player}</Typography>
            </CardContent>
          </Card>
        )) 
        : matches.map((match) => (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
            <Card variant="outlined" sx={{ minWidth: 500 }}>
              <CardContent>
                <Typography variant='h3' align='center' gutterBottom>{match.player1} vs {match.player2}</Typography>
                <Typography variant='h5' align='center'>Winner: <Input></Input> </Typography>
              </CardContent>
            </Card>
          </div>
        ))} 
      
    </>
  )
}

export default Tournament