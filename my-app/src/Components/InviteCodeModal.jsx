import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function InviteCodeModal(props) {
  return (
    <Dialog
      open={props.openInviteCode}
      onClose={props.handleCloseCreate}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Invite Code
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.inviteCode}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleSubmit} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InviteCodeModal