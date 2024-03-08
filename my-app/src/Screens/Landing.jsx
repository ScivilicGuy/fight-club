import React, { useState } from 'react'
import { Stack } from '@mui/material';
import { makeid, apiFetch } from '../util';
import { useNavigate } from 'react-router-dom';
import TournamentBtn from '../Components/TournamentBtn';
import InviteCodeModal from '../Components/InviteCodeModal';
import JoinTournamentModal from '../Components/JoinTournamentModal';
import CreateTournamentModal from '../Components/CreateTournamentModal';
import { States } from '../TournamentState'
import SuccessAlert from '../Components/SuccessAlert';

const CODE_LENGTH = 6

function Landing() {
  const navigate = useNavigate()
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [openInviteCode, setOpenInviteCode] = useState(false)
  const [openJoin, setOpenJoin] = useState(false)
  const [tournament, setTournament] = useState({
    name: '',
    desc: '',
    inviteCode: '',
    state: States.SCHEDULED
  })

  const [team, setTeam] = useState({
    code: '',
    playerName: ''
  })

  const handleOpenCreate = () => {
    setOpenCreate(true)
  };

  const handleCloseCreate = () => {
    setOpenCreate(false)
  };

  const handleConfirmedCreate = () => {
    setOpenCreate(false)
    updateInviteCode()
    setOpenInviteCode(true)
  }

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
      await apiFetch('/tournament/join', 'POST', team)
      setOpenSuccess(true)
    } catch (error) {
      alert(error)
      console.log(error)
    }
  }

  const tourney_btns = [
    <TournamentBtn action={handleOpenCreate} title={'Create Tournament'}></TournamentBtn>,
    <TournamentBtn action={handleOpenJoin} title={'Join Tournament'}></TournamentBtn>,
    <TournamentBtn action={viewTournaments} title={'View Tournaments'}></TournamentBtn>,
    <TournamentBtn action={viewLeaderboards} title={'Leaderboards'}></TournamentBtn>
  ]

  const handleCloseInvite = () => {
    setOpenInviteCode(false);
  };

  const updateInviteCode = () => {
    setTournament({ ...tournament, inviteCode: makeid(CODE_LENGTH)})
  }

  const handleSubmit = async () => {
    handleCloseInvite()
    try {
      const res = await apiFetch('/tournament/create', 'POST', tournament)
      navigate(`/tournaments/${res.tournamentId}`)
    } catch (error) {
      alert(error)
      console.log(error)
    }
  }

  const updateTournamentField = (e) => {
    const { name, value } = e.target
    setTournament({ ...tournament, [name]: value })
  }

  const updateTeamField = (e) => {
    const { name, value } = e.target
    setTeam({ ...team, [name]: value })
  }

  return (
    <>
      <SuccessAlert open={openSuccess} setOpen={setOpenSuccess} msg={'Successfully joined tournament!'}/>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
        <Stack spacing={8}>
          {tourney_btns}
        </Stack>   
      </div>     
      <CreateTournamentModal openCreate={openCreate} handleCloseCreate={handleCloseCreate} updateTournamentField={updateTournamentField} handleConfirmedCreate={handleConfirmedCreate}></CreateTournamentModal>
      <InviteCodeModal openInviteCode={openInviteCode} handleCloseCreate={handleCloseCreate} inviteCode={tournament.inviteCode} handleSubmit={handleSubmit}></InviteCodeModal>
      <JoinTournamentModal openJoin={openJoin} handleCloseJoin={handleCloseJoin} updateTeamField={updateTeamField} joinTournament={joinTournament}></JoinTournamentModal>
   </>
  )
}

export default Landing