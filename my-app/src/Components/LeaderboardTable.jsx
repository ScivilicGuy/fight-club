import React from 'react'
import { Table, TableHead, TableBody, TableRow, TableCell, Box } from '@mui/material';

function LeaderboardTable({ data }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Table style={{ width: '50%' }}>
        <TableHead>
          <TableRow>
            {Object.keys(data[0]).map((key) => (
              <TableCell key={key} sx={{ fontSize: '1.5rem' }}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((value, index) => (
                <TableCell key={index} sx={{ fontSize: '1.5rem' }}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default LeaderboardTable