import React from 'react';
import { Snackbar, Alert } from '@mui/material';

function SnackBarAlert({ severity, open, setOpen, msg }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar 
        open={open} 
        autoHideDuration={1500} 
        onClose={handleClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SnackBarAlert;