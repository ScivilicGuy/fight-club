import React, { useState, useEffect } from 'react'
import { apiFetch } from '../util'
import { Typography } from '@mui/material'
import LeaderboardTable from '../Components/LeaderboardTable'

function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    (async() => {
      try {
        const res = await apiFetch('leaderboard', 'GET')
        const formatted_data = []
        for (let i = 0; i < res.leaderboard.length; i++) {
          let entry = res.leaderboard[i]
          formatted_data.push({
            '#': i+1,
            Player: entry[0],
            Wins: entry[1]
          })
        }
        setLeaderboard(formatted_data)
      } catch (error) {
        alert(error) 
      }
    })()
  }, [])

  return (
    <>
      <Typography variant="h3" align='center' gutterBottom>
        Leaderboard
      </Typography>
      {leaderboard.length > 0 && <LeaderboardTable data={leaderboard}></LeaderboardTable>}
    </>
  )
}

export default Leaderboards