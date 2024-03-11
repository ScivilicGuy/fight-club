import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function DisplayWinnerBtns({ selections, winner }) {
  return (
    <ToggleButtonGroup
      value={winner}
      exclusive
      fullWidth
      disabled
      size='large'
      color='primary'
      aria-label='winner-selection'
    >
      {selections.map((curr) => (
        <ToggleButton value={curr} aria-label='winner-selection'>{curr}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}