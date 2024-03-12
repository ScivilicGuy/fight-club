import React, { useEffect, useState } from 'react'
import { Typography, Button, ButtonGroup, Box } from '@mui/material'
import { apiFetch } from '../util'
import { useParams } from 'react-router-dom'
import PlayerList from '../Components/PlayerList';
import MatchesList from '../Components/MatchesList';
import TournamentResult from '../Components/TournamentResult';
import { States } from '../TournamentState'
import InviteCodeModal from '../Components/InviteCodeModal';
import SnackBarAlert from '../Components/SnackBarAlert';

function Tournament() {
  const params = useParams()
  const tournamentId = params.tournamentId
  const [tournament, setTournament] = useState({
    name: '',
    desc: '',
    inviteCode: '',
    state: '',
    round: 1,
    winner: '',
    players: []
  })
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [winners, setWinners] = useState({})
  const [openInviteCode, setOpenInviteCode] = useState(false)

  /* success/error alerts */
  const [openError, setOpenError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [openSuccess, setOpenSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch(`tournament/${tournamentId}`, 'GET')
        setTournament(res.tournament)
        setPlayers(res.tournament.players)
      } catch (error) {
        setOpenError(true)
        setErrorMsg(error.message)
      }
    })()
  }, [tournamentId])

  useEffect(() => {
    (async () => {
      try {
        if (tournament.state === States.STARTED) {
          const res = await apiFetch(`tournament/${tournamentId}/matches/${tournament.round}`, 'GET')
          setMatches(res.matches)
        } else if (tournament.state === States.FINISHED) {
          const res = await apiFetch(`tournament/${tournamentId}/matches`, 'GET')
          setMatches(res.matches)
        }
      } catch (error) {
        setOpenError(true)
        setErrorMsg(error.message)
      }
    })()
  }, [tournamentId, tournament.round, tournament.state])

  const handleOpenInviteCode = () => {
    setOpenInviteCode(true)
  }

  const handleCloseInviteCode = () => {
    setOpenInviteCode(false)
  }

  const setTournamentField = (key, newVal) => {
    setTournament(prevState => ({...prevState, [key]: newVal}))
  }

  const handleTournamentStart = async () => {
    try {
      await apiFetch(`tournament/${params.tournamentId}/start`, 'POST', {'players': players, 'round': tournament.round})
      setTournamentField('state', States.STARTED)
    } catch (error) {
      setOpenError(true)
      setErrorMsg(error.message)
    }
  }

  const handleTournamentFinish = async () => {
    try {
      const winnerEntry = Object.entries(winners)[0]
      await apiFetch(`tournament/${params.tournamentId}/end`, 'PUT', {'winner': winnerEntry})
      setTournamentField('state', States.FINISHED)
      setTournamentField('winner', winnerEntry[1])
      setWinners({})
    } catch (error) {
      setOpenError(true)
      setErrorMsg(error.message)
    }
  }

  const handleNextRound = async () => {
    console.log(winners)
    if (Object.keys(winners).length !== players.length / (2 ** tournament.round)) {
      setOpenError(true)
      setErrorMsg('All matches must have a winner!')
      return 
    }

    if (Object.keys(winners).length === 1) {
      handleTournamentFinish()
      return
    }

    try {
      const nextRound = tournament.round + 1
      await apiFetch(`tournament/${params.tournamentId}/next/round`, 'POST', {'players': winners, 'round': nextRound})
      setTournamentField('round', nextRound)
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

  const renderTourneyState = () => {
    if (tournament.state === States.SCHEDULED) {
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
    } else if (tournament.state === States.STARTED) {
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
    } else if (tournament.state === States.FINISHED) {
      return <TournamentResult winner={tournament.winner} matches={matches}></TournamentResult>
    } else if (tournament.state === '') {
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
      {renderTourneyState()}
      <InviteCodeModal open={openInviteCode} handleClose={handleCloseInviteCode} inviteCode={tournament.inviteCode} />
    </>
  )
}

export default Tournament