import React, { useEffect, useState } from 'react'
import { Typography, Card, CardContent, Button, Box } from '@mui/material'
import { apiFetch } from '../util'
import { useParams } from 'react-router-dom'
import PlayerList from '../Components/PlayerList';
import MatchesList from '../Components/MatchesList';
import TournamentResult from '../Components/TournamentResult';
import { States } from '../TournamentState'

function Tournament() {
  const params = useParams()
  const [tournament, setTournament] = useState({
    name: '',
    desc: '',
    inviteCode: '',
    state: '',
    round: 1,
    winner: '',
    players: []
  })
  const [tournamentState, setTournamentState] = useState('')
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [winners, setWinners] = useState({})
  const [round, setRound] = useState(1)

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch(`tournament/${params.tournamentId}`, 'GET')
        setTournament(res.tournament)
        setTournamentState(res.tournament.state)
        setPlayers(res.tournament.players)
        if (tournament.state === States.STARTED) {
          const res = await apiFetch(`tournament/${params.tournamentId}/matches/${tournament.round}`, 'GET')
          setMatches(res.matches)
        }
      } catch (error) {
        alert(error)
      }
    })()
  }, [params.tournamentId, tournament.round, tournament.state, tournamentState])

  const handleTournamentStart = async () => {
    const numPlayers = tournament.players.length
    if ((numPlayers % 2 !== 0) || (numPlayers === 0)) {
      alert('ERROR: Must have an even number of players to start!')
      return 
    }

    setTournamentState(States.STARTED)
    try {
      await apiFetch(`tournament/${params.tournamentId}/start`, 'POST', {'players': tournament.players, 'round': tournament.round})
      const res = await apiFetch(`tournament/${params.tournamentId}/matches/${round}`, 'GET')
      setMatches(res.matches)
    } catch (error) {
      alert(error)
    }
  }

  const handleTournamentFinish = async (winner) => {
    try {
      await apiFetch(`tournament/${params.tournamentId}/end`, 'PUT', {'winner': winner})
      setTournamentState(States.FINISHED)
    } catch (error) {
      alert(error)
    }
  }

  const handleNextRound = async () => {
    if (Object.keys(winners).length === 1) {
      alert(`WINNER: ${winners[0]}`)
      handleTournamentFinish(winners[0])
      return
    }

    if (Object.keys(winners).length !== tournament.players.length / (2 * tournament.round)) {
      alert('ERROR: All matches must have a winner!')
      return 
    }

    try {
      await apiFetch(`tournament/${params.tournamentId}/next/round`, 'POST', {'players': Object.values(winners), 'round': round + 1})
      const res = await apiFetch(`tournament/${params.tournamentId}/matches/${round + 1}`, 'GET')
      setMatches(res.matches)
      setRound(round + 1)
      setWinners({})
    } catch (error) {
      alert(error)
    }
  }

  const removePlayer = async (player) => {
    try {
      await apiFetch(`tournament/${params.tournamentId}/remove/player`, 'DELETE', {'player': player})
      const newPlayersArray = players.filter(i => i !== player)
      setPlayers(newPlayersArray)
    } catch (error) {
      alert(error)
    }
  }

  const renderTourneyState = (tournamentState) => {
    if (tournamentState === States.SCHEDULED) {
      return ( 
        <>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
            <Card variant="outlined" sx={{ minWidth: 300 }}>
              <CardContent>
                <Typography variant='h6' align='center'>Invite Code: {tournament.inviteCode}</Typography>
              </CardContent>
            </Card>
            <Button variant="contained" onClick={handleTournamentStart}>Start Tournament</Button>
          </div>
          <PlayerList players={players} removePlayer={removePlayer}></PlayerList>
        </>
      )
    } else if (tournamentState === States.STARTED) {
      let msg = 'Start Next Round'
      if (matches.length === 1) {
        msg = 'Finish Tournament'
      }
      return (
        <>
          <Box sx={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Button variant="contained" onClick={handleNextRound}>{msg}</Button>
          </Box>
          <MatchesList matches={matches} winners={winners} setWinners={setWinners}></MatchesList>
        </>
      )
    } else if (tournamentState === States.FINISHED) {
      return <TournamentResult winner={tournament.winner}></TournamentResult>
    } else if (tournamentState === '') {
      return <></>
    } else {
      alert('Invalid tournament state')
    }
  }

  return (
    <>
      <Typography variant='h2' align='center' gutterBottom>{tournament.name}</Typography>
      {renderTourneyState(tournamentState)}
    </>
  )
}

export default Tournament