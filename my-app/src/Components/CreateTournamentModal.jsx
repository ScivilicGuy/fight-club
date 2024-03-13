import React from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Checkbox, FormControl } from '@mui/material';

function CreateTournamentModal({ openCreate, handleCloseCreate, handleSubmit, updateTournamentField, handleCheckBoxChange }) {
  return (
    <Dialog
      open={openCreate}
      onClose={handleCloseCreate}
      PaperProps={{
        component: 'form'
      }}
    >
      <FormControl>
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
          <FormControlLabel
            control={<Checkbox onChange={handleCheckBoxChange} />}
            label="Is Private"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </FormControl>
        
    </Dialog>
  )
}

export default CreateTournamentModal