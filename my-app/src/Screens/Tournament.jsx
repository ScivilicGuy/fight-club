import React, { useEffect, useState } from 'react'
import { Typography, Card, CardContent, Button } from '@mui/material'
import { apiFetch } from '../util'
import { useParams } from 'react-router-dom'
import { uid } from 'uid';
import IconlessRadio from '../Components/IconlessRadio';

function Tournament() {
  const params = useParams()
  const [tournament, setTournament] = useState({
    name: '',
    desc: '',
    inviteCode: '',
    state: '',
    round: 0,
    players: []
  })
  const [tournamentStarted, setTournamentStarted] = useState(false)
  const [matches, setMatches] = useState([])
  const [winners, setWinners] = useState({})
  const [round, setRound] = useState(1)

  useEffect(() => {
    (async () => {
      const res = await apiFetch(`tournament/${params.tournamentId}`, 'GET')
      setTournament(res.tournament)
      if (tournament.state === 'IN PROGRESS' || tournament.state === 'COMPLETED') {
        setTournamentStarted(true)
        const res = await apiFetch(`tournament/${params.tournamentId}/matches/${tournament.round}`, 'GET')
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
    const res = await apiFetch(`tournament/${params.tournamentId}/matches/${round}`, 'GET')
    setMatches(res.matches)
  }

  const handleNextRound = async () => {
    console.log(winners)
    if (Object.keys(winners).length === 1) {
      alert(`WINNER: ${winners[0]}`)
      return
    }

    if (Object.keys(winners).length % 2 !== 0) {
      alert('ERROR: Must have an even number of players to start!')
      return 
    }

    await apiFetch(`tournament/${params.tournamentId}/next/round`, 'POST', {'players': Object.values(winners), 'round': round + 1})
    const res = await apiFetch(`tournament/${params.tournamentId}/matches/${round + 1}`, 'GET')
    setMatches(res.matches)
    setRound(round + 1)
    setWinners({})
  }

  const updateWinners = (e, index) => {
    if (!e.target.value) {
      return
    }
    setWinners({...winners, [index]: e.target.value})
  }

  return (
    <>
      <Typography variant='h2' align='center' gutterBottom>{tournament.name}</Typography>
      {!tournamentStarted 
        ? <Button variant="contained" onClick={handleTournamentStart} >Start Tournament</Button>
        : <Button variant="contained" onClick={handleNextRound} >Start Next Round</Button>
      }
      {!tournamentStarted 
        ? tournament.players.map((player) => (
          <Card>
            <CardContent>
              <Typography variant='h6' align='center'>{player}</Typography>
            </CardContent>
          </Card>
        )) 
        : matches.map((match, index) => (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
            <Card variant="outlined" sx={{ minWidth: 600 }}>
              <CardContent onClick={(e) => updateWinners(e, index)}>
                <Typography variant='h6' align='center' gutterBottom>Match {index+1}</Typography>
                <IconlessRadio selections={[match.player1, match.player2]}></IconlessRadio>
              </CardContent>
            </Card>
          </div>
        ))} 

      
    </>
  )
}

export default Tournament