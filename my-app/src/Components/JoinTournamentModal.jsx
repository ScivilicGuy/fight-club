import React, { useState } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip } from '@mui/material';

function JoinTournamentModal({ openJoin, handleCloseJoin, updateInviteCode, setPlayers, players, joinTournament }) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      const newInputValue = inputValue.trim();
      if (newInputValue) {
        setPlayers([...players, newInputValue]);
        setInputValue('');
      }
    }
  };

  const handleChipDelete = (chipIndex) => {
    setPlayers(players.filter((_, index) => index !== chipIndex));
  };

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
          You can press enter after each player to add multiple players.
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
          onChange={updateInviteCode}
        />
        <TextField
          autoFocus
          required
          margin="dense"
          id="player-name"
          name="playerName"
          value={inputValue}
          label="Summoner Name"
          type="string"
          fullWidth
          variant="standard"
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <div>
          {players.map((chip, index) => (
            <Chip
              key={index}
              label={chip}
              onDelete={() => handleChipDelete(index)}
              style={{ margin: '4px' }}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseJoin}>Cancel</Button>
        <Button onClick={joinTournament}>Join</Button>
      </DialogActions>
    </Dialog>
  )
}

export default JoinTournamentModal