import React, { useState } from 'react';
import { Select, MenuItem, Button, Box, InputLabel, FormControl } from '@mui/material';

function DropdownFilter({ options, onFilter }) {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleFilterClick = () => {
        onFilter(selectedOption);
    };

    return (
      <Box sx={{ display: 'flex', margin: 4, maxWidth: 300 }}>
        <FormControl variant='filled' fullWidth>
          <InputLabel id='filter'>Filter Tournaments</InputLabel>
          <Select
              value={selectedOption}
              onChange={handleOptionChange}
              label="filter"
          >
              {options.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleFilterClick}>Apply</Button>
      </Box>
    );
}

export default DropdownFilter;