import React from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function JoinTournamentModal(props) {
  return (
    <Dialog
      open={props.openJoin}
      onClose={props.handleCloseJoin}
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
          onChange={props.updateTeamField}
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
          onChange={props.updateTeamField}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCloseJoin}>Cancel</Button>
        <Button onClick={props.joinTournament}>Join</Button>
      </DialogActions>
    </Dialog>
  )
}

export default JoinTournamentModal