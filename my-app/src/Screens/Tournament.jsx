import React, { useEffect, useState } from 'react'
import { Typography, Card, CardContent, Button } from '@mui/material'
import { apiFetch } from '../util'
import { useParams } from 'react-router-dom'
import PlayerList from '../Components/PlayerList';
import MatchesList from '../Components/MatchesList';
import TournamentResult from '../Components/TournamentResult';
import States from '../TournamentState'

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
  const [tournamentState, setTournamentState] = useState('')
  const [matches, setMatches] = useState([])
  const [winners, setWinners] = useState({})
  const [round, setRound] = useState(1)

  useEffect(() => {
    (async () => {
      const res = await apiFetch(`tournament/${params.tournamentId}`, 'GET')
      setTournament(res.tournament)
      setTournamentState(tournament.state)
      if (tournament.state === States.STARTED) {
        const res = await apiFetch(`tournament/${params.tournamentId}/matches/${tournament.round}`, 'GET')
        setMatches(res.matches)
      }
    })()
  }, [])

  const handleTournamentStart = async () => {
    const numPlayers = tournament.players.length
    if ((numPlayers % 2 !== 0) || (numPlayers === 0)) {
      alert('ERROR: Must have an even number of players to start!')
      return 
    }

    setTournamentState(States.STARTED)
    await apiFetch(`tournament/${params.tournamentId}/start`, 'POST', {'players': tournament.players})
    const res = await apiFetch(`tournament/${params.tournamentId}/matches/${round}`, 'GET')
    setMatches(res.matches)
  }

  const handleTournamentFinish = async (winner) => {
    await apiFetch(`tournament/${params.tournamentId}/end`, 'PUT', {'winner': winner})
    setTournamentState(States.FINISHED)
  }

  const handleNextRound = async () => {
    if (Object.keys(winners).length === 1) {
      alert(`WINNER: ${winners[0]}`)
      handleTournamentFinish(winners[0])
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

  const renderTourneyState = (tournamentState) => {
    if (tournamentState === 'SCHEDULED') {
      return ( 
        <>
          <Button variant="contained" onClick={handleTournamentStart}>Start Tournament</Button>
          <PlayerList tournament={tournament}></PlayerList>
        </>
      )
      
    } else if (tournamentState === 'IN PROGRESS') {
      let msg = 'Start Next Round'
      if (matches.length === 1) {
        msg = 'Finish Tournament'
      }
      return (
        <>
          <Button variant="contained" onClick={handleNextRound}>{msg}</Button>
          <MatchesList matches={matches} winners={winners} setWinners={setWinners}></MatchesList>
        </>
      )
    } else if (tournamentState === 'FINISHED') {
      return <TournamentResult winner={winners[0]}></TournamentResult>
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