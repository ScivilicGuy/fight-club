import React, { useEffect, useState } from 'react'
import { Typography, Button, ButtonGroup, Box } from '@mui/material'
import { apiFetch } from '../util'
import { useParams } from 'react-router-dom'
import PlayerList from '../Components/PlayerList';
import MatchesList from '../Components/MatchesList';
import TournamentResult from '../Components/TournamentResult';
import { States } from '../TournamentState'
import { powerOf2 } from '../util';
import InviteCodeModal from '../Components/InviteCodeModal';
import SnackBarAlert from '../Components/SnackBarAlert';

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
  const [openInviteCode, setOpenInviteCode] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [openSuccess, setOpenSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

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
        setOpenError(true)
        setErrorMsg(error.message)
      }
    })()
  }, [params.tournamentId, tournament.round, tournament.state])

  const handleOpenInviteCode = () => {
    setOpenInviteCode(true)
  }

  const handleCloseInviteCode = () => {
    setOpenInviteCode(false)
  }

  const handleTournamentStart = async () => {
    const numPlayers = players.length
    if (!powerOf2(numPlayers)) {
      setOpenError(true)
      setErrorMsg('ERROR: Number of players must be a power of 2!')
    }

    setTournamentState(States.STARTED)
    try {
      await apiFetch(`tournament/${params.tournamentId}/start`, 'POST', {'players': players, 'round': tournament.round})
      const res = await apiFetch(`tournament/${params.tournamentId}/matches/${round}`, 'GET')
      setMatches(res.matches)
    } catch (error) {
      setOpenError(true)
      setErrorMsg(error.message)
    }
  }

  const handleTournamentFinish = async (winner) => {
    try {
      await apiFetch(`tournament/${params.tournamentId}/end`, 'PUT', {'winner': winner})
      setTournamentState(States.FINISHED)
      setTournament({...tournament, winner: winner})
    } catch (error) {
      setOpenError(true)
      setErrorMsg(error.message)
    }
  }

  const handleNextRound = async () => {
    if (Object.keys(winners).length !== players.length / (2 ** round)) {
      setOpenError(true)
      setErrorMsg('All matches must have a winner!')
      return 
    }

    if (Object.keys(winners).length === 1) {
      setOpenSuccess(true)
      setSuccessMsg(`Winner is ${winners[0]}`)
      handleTournamentFinish(winners[0])
      return
    }

    try {
      await apiFetch(`tournament/${params.tournamentId}/next/round`, 'POST', {'players': Object.values(winners), 'round': round + 1})
      const res = await apiFetch(`tournament/${params.tournamentId}/matches/${round + 1}`, 'GET')
      setMatches(res.matches)
      setRound(round + 1)
      setWinners({})
    } catch (error) {
      setOpenError(true)
      setErrorMsg(error.message)
    }
  }

  const removePlayer = async (player) => {
    try {
      await apiFetch(`tournament/${params.tournamentId}/remove/player`, 'DELETE', {'player': player})
      const newPlayersArray = players.filter(i => i !== player)
      setPlayers(newPlayersArray)
    } catch (error) {
      setOpenError(true)
      setErrorMsg(error.message)
    }
  }

  const renderTourneyState = (tournamentState) => {
    if (tournamentState === States.SCHEDULED) {
      return ( 
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
            <ButtonGroup variant='contained' size='large'>
              <Button onClick={handleTournamentStart}>Start Tournament</Button>
              <Button onClick={handleOpenInviteCode}>Show Invite Code</Button>
            </ButtonGroup>
          </Box>
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
      setOpenError(true)
      setErrorMsg('Invalid tournament state')
    }
  }

  return (
    <>
      <SnackBarAlert severity={'success'} open={openSuccess} setOpen={setOpenSuccess} msg={successMsg}/>
      <SnackBarAlert severity={'error'} open={openError} setOpen={setOpenError} msg={errorMsg}/>
      <Typography variant='h2' align='center' gutterBottom>{tournament.name}</Typography>
      {renderTourneyState(tournamentState)}
      <InviteCodeModal open={openInviteCode} handleClose={handleCloseInviteCode} inviteCode={tournament.inviteCode} />
    </>
  )
}

export default Tournament