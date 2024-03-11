import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { capitalizeFirstLetter } from '../util';

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
        autoHideDuration={3000} 
        onClose={handleClose} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          <AlertTitle>{capitalizeFirstLetter(severity)}</AlertTitle>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SnackBarAlert;