import React from 'react'
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import makeid from '../util';

function Landing() {
  const [open, setOpen] = React.useState(false);
  const [openInviteCode, setOpenInviteCode] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseInvite = () => {
    setOpenInviteCode(false);
  };

  const handleSubmit = () => {
    setOpenInviteCode(true)
    handleClose()
  }

  return (
    <>
      <Stack spacing={2} direction="row">
        <Button variant="outlined" onClick={handleClickOpen}>Create Tournament</Button>
        <Button variant="outlined">Edit Tournament</Button>
        <Button variant="outlined">Start Tournament</Button>
        <Button variant="outlined">View Tournaments</Button>
      </Stack>
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
            {makeid(6)}
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