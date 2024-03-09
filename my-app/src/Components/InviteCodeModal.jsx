import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function InviteCodeModal({ open, handleClose, inviteCode }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode)
      .then(() => {
        handleClose()
        console.log('Text copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        Invite Code
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          {inviteCode}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleCopy} autoFocus>
          Copy
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InviteCodeModal