import React, { useContext, useState } from 'react'
import { Stack } from '@mui/material';
import { makeid, apiFetch } from '../util';
import { useNavigate } from 'react-router-dom';
import TournamentBtn from '../Components/TournamentBtn';
import JoinTournamentModal from '../Components/JoinTournamentModal';
import CreateTournamentModal from '../Components/CreateTournamentModal';
import { States } from '../TournamentState'
import SnackBarAlert from '../Components/SnackBarAlert';

const CODE_LENGTH = 6

function Landing() {
  const navigate = useNavigate()
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [openJoin, setOpenJoin] = useState(false)
  const [tournament, setTournament] = useState({
    name: '',
    desc: '',
    inviteCode: makeid(CODE_LENGTH),
    state: States.SCHEDULED
  })
  
  const [inviteCode, setInviteCode]= useState('')
  const [players, setPlayers] = useState([])

  const handleOpenCreate = () => {
    setOpenCreate(true)
  };

  const handleCloseCreate = () => {
    setOpenCreate(false)
  };

  const handleOpenJoin = () => {
    setOpenJoin(true);
  };

  const handleCloseJoin = () => {
    setOpenJoin(false);
  };

  const viewTournaments = () => {
    navigate('/tournaments')
  }

  const viewLeaderboards = () => {
    navigate('/leaderboard')
  }

  const joinTournament = async() => {
    try {
      handleCloseJoin()
      await apiFetch('/tournament/join', 'POST', {
        code: inviteCode,
        players: players
      })
      setOpenSuccess(true)
      setSuccessMsg('Successfully joined tournament!')
      setInviteCode('')
      setPlayers([])
    } catch (error) {
      setOpenError(true)
      setErrorMsg(error.message)
    }
  }

  const tourney_btns = [
    <TournamentBtn key={'create-tournament-btn'} action={handleOpenCreate} title={'Create Tournament'}></TournamentBtn>,
    <TournamentBtn key={'join-tournament-btn'} action={handleOpenJoin} title={'Join Tournament'}></TournamentBtn>,
    <TournamentBtn key={'view-tournaments-btn'} action={viewTournaments} title={'View Tournaments'}></TournamentBtn>,
    <TournamentBtn key={'view-leaderboard-btn'} action={viewLeaderboards} title={'Leaderboards'}></TournamentBtn>
  ]

  const handleSubmit = async () => {
    try {
      handleCloseCreate()
      const res = await apiFetch('/tournament/create', 'POST', tournament)
      navigate(`/tournaments/${res.tournamentId}`)
    } catch (error) {
      setOpenError(true)
      setErrorMsg(error.message)
    }
  }

  const updateTournamentField = (e) => {
    const { name, value } = e.target
    setTournament({ ...tournament, [name]: value.trim() })
  }

  const updateInviteCode = (e) => {
    setInviteCode(e.target.value)
  }

  return (
    <>
      <SnackBarAlert severity={'success'} open={openSuccess} setOpen={setOpenSuccess} msg={successMsg}/>
      <SnackBarAlert severity={'error'} open={openError} setOpen={setOpenError} msg={errorMsg}/>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
        <Stack spacing={8}>
          {tourney_btns}
        </Stack>   
      </div>     
      <CreateTournamentModal openCreate={openCreate} handleCloseCreate={handleCloseCreate} handleSubmit={handleSubmit} updateTournamentField={updateTournamentField} ></CreateTournamentModal>
      <JoinTournamentModal openJoin={openJoin} handleCloseJoin={handleCloseJoin} updateInviteCode={updateInviteCode} setPlayers={setPlayers} players={players} joinTournament={joinTournament}></JoinTournamentModal>
   </>
  )
}

export default Landing