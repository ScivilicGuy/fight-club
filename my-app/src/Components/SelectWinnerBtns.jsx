import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function SelectWinnerBtns({ selections }) {
  const [selection, setSelection] = useState(null);

  const handleSelection = (event, newSelection) => {
    if (newSelection !== null) {
      setSelection(newSelection);
    }
    
  }

  return (
    <ToggleButtonGroup
      value={selection}
      exclusive
      fullWidth
      size='large'
      color='primary'
      onChange={handleSelection}
      aria-label='winner-selection'
    >
      {selections.map((curr) => (
        <ToggleButton value={curr} aria-label='winner-selection'>{curr}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}