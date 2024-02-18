import React, {useState} from 'react'
import { Button, ButtonGroup, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { makeid, apiFetch } from '../util';
import { useNavigate } from 'react-router-dom';

const CODE_LENGTH = 6

function Landing() {
  const navigate = useNavigate()
  const [openCreate, setOpenCreate] = useState(false);
  const [openInviteCode, setOpenInviteCode] = useState(false);
  const [openJoin, setOpenJoin] = useState(false)
  const [tournament, setTournament] = useState({
    name: '',
    desc: '',
    inviteCode: '',
    numTeams: 0,
    format: ''
  })

  const [team, setTeam] = useState({
    code: '',
    playerName: ''
  })

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
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

  const joinTournament = async() => {
    try {
      handleCloseJoin()
      await apiFetch('/tournament/join', 'POST', team)
      alert('Successfully registered into tournament!')
    } catch (error) {
      alert(error)
    }
  }

  const tourney_btns = [
    <Button variant="contained" size="large" onClick={handleOpenCreate}>Create Tournament</Button>,
    <Button variant="contained" size="large" onClick={handleOpenJoin}>Join Tournament</Button>,
    <Button variant="contained" size="large" onClick={viewTournaments}>View Tournaments</Button>
  ]

  const handleCloseInvite = () => {
    setOpenInviteCode(false);
  };

  const updateInviteCode = () => {
    setTournament({ ...tournament, inviteCode: makeid(CODE_LENGTH)})
  }

  const handleSubmit = async () => {
    await updateInviteCode()
    setOpenInviteCode(true)
    handleCloseCreate()
    try {
      const res = await apiFetch('/tournament/create', 'POST', tournament)
      alert(`Successfully created tournament #${res.tournamentId}`)
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

  const updateTournamentFormat = (e) => {
    setTournament({ ...tournament, format: e.target.value})
  }

  return (
    <>
      <ButtonGroup
        orientation="vertical"
        aria-label="vertical contained button group"
        variant="contained"
      >
        {tourney_btns}
      </ButtonGroup>
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        PaperProps={{
          component: 'form'
        }}
      >
        <DialogTitle>Create Tournament</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a tournament, please fill out all the fields below.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Tournament Name"
            type="string"
            fullWidth
            variant="standard"
            onChange={updateTournamentField}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="desc"
            name="desc"
            label="Description"
            type="string"
            fullWidth
            variant="standard"
            onChange={updateTournamentField}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="num-teams"
            name="numTeams"
            label="Number of Teams"
            type="number"
            fullWidth
            variant="standard"
            onChange={updateTournamentField}
          />
          <FormControl sx={{ m: 2, minWidth: 130 }}>
            <InputLabel id="tournament-format">Format</InputLabel>
            <Select
              labelId="tournament-format"
              id="format"
              value={tournament.format}
              label="Format"
              onChange={updateTournamentFormat}
            >
              <MenuItem value={'Round Robin'}>Round Robin</MenuItem>
              <MenuItem value={'Elimination'}>Elimination</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
    </Dialog>
    <Dialog
        open={openInviteCode}
        onClose={handleCloseCreate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Invite Code
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {tournament.inviteCode}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvite} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openJoin}
        onClose={handleCloseJoin}
        PaperProps={{
          component: 'form'
        }}
      >
        <DialogTitle>Join Tournament</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To join a tournament, please fill out all the fields below.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="tournament-code"
            name="code"
            label="Invite Code"
            type="string"
            fullWidth
            variant="standard"
            onChange={updateTeamField}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="player-name"
            name="playerName"
            label="Summoner Name"
            type="string"
            fullWidth
            variant="standard"
            onChange={updateTeamField}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJoin}>Cancel</Button>
          <Button onClick={joinTournament}>Create</Button>
        </DialogActions>
    </Dialog>
   </>
  )
}

export default Landing