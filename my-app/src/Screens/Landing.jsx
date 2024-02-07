import React, {useState} from 'react'
import { Button, ButtonGroup, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { makeid, apiFetch } from '../util';
import { useNavigate } from 'react-router-dom';

const CODE_LENGTH = 6

function Landing() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [openInviteCode, setOpenInviteCode] = useState(false);
  const [tournament, setTournament] = useState({
    name: '',
    desc: '',
    inviteCode: '',
    numTeams: 0,
    numRounds: 0
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const viewTournaments = () => {
    navigate('/tournaments')
  }

  const tourney_btns = [
    <Button variant="contained" size="large" mb-3 onClick={handleClickOpen}>Create Tournament</Button>,
    <Button variant="contained" size="large">Edit Tournament</Button>,
    <Button variant="contained" size="large">Start Tournament</Button>,
    <Button variant="contained" size="large" onClick={viewTournaments}>View Tournaments</Button>
  ]

  const handleCloseInvite = () => {
    setOpenInviteCode(false);
  };

  const handleSubmit = async () => {
    updateInviteCode()
    setOpenInviteCode(true)
    handleClose()
    try {
      const res = await apiFetch('create/tournament', 'POST', tournament)
      alert(`Successfully created tournament #${res.tournamentId}`)
    } catch (error) {
      alert(error)
      console.log(error)
    }

  }

  const updateName = (e) => {
    setTournament({ ...tournament, name: e.target.value })
  }

  const updateDesc = (e) => {
    setTournament({ ...tournament, desc: e.target.value })
  }

  const updateTeams = (e) => {
    setTournament({ ...tournament, numTeams: e.target.value })
  }

  const updateRounds = (e) => {
    setTournament({ ...tournament, numRounds: e.target.value })
  }

  const updateInviteCode = () => {
    setTournament({ ...tournament, inviteCode: makeid(CODE_LENGTH)})
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
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form'
        }}
      >
        <DialogTitle>Create Tournament</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
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
            onChange={updateName}
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
            onChange={updateDesc}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="num-teams"
            name="num-teams"
            label="Number of Teams"
            type="number"
            fullWidth
            variant="standard"
            onChange={updateTeams}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="num-rounds"
            name="num-rounds"
            label="Number of Rounds"
            type="number"
            fullWidth
            variant="standard"
            onChange={updateRounds}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
    </Dialog>
    <Dialog
        open={openInviteCode}
        onClose={handleClose}
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
   </>
  )
}

export default Landing