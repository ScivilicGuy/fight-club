import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleButtons(props) {
  const [selection, setSelection] = React.useState('');

  const handleSelection = (event, newSelection) => {
    setSelection(newSelection);
  };

  return (
    <ToggleButtonGroup
      value={selection}
      exclusive
      fullWidth
      size='large'
      color='primary'
      onChange={handleSelection}
      aria-label="winner-selection"
    >
      {props.selections.map((curr) => (
        <ToggleButton value={curr} key={curr} aria-label={curr}>{curr}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}