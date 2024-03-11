import React from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function JoinTournamentModal({ openJoin, handleCloseJoin, updateTeamField, joinTournament }) {
  return (
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
        <Button onClick={joinTournament}>Join</Button>
      </DialogActions>
    </Dialog>
  )
}

export default JoinTournamentModal