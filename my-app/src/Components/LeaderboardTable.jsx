import React from 'react'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

function LeaderboardTable({ data }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {Object.keys(data[0]).map((key) => (
            <TableCell key={key}>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {Object.values(row).map((value, index) => (
              <TableCell key={index}>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default LeaderboardTable