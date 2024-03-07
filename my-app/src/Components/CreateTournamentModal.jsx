import React from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function CreateTournamentModal(props) {
  return (
    <Dialog
        open={props.openCreate}
        onClose={props.handleCloseCreate}
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
            onChange={props.updateTournamentField}
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
            onChange={props.updateTournamentField}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleCloseCreate}>Cancel</Button>
          <Button onClick={props.handleConfirmedCreate}>Create</Button>
        </DialogActions>
    </Dialog>
  )
}

export default CreateTournamentModal