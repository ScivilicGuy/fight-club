import React, { useState, useEffect } from 'react'
import { apiFetch } from '../util'
import { Card, CardContent, Typography, CardActionArea } from '@mui/material'
import LeaderboardTable from '../Components/LeaderboardTable'

function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    (async() => {
      try {
        const res = await apiFetch('leaderboard', 'GET')
        const formatted_data = []
        for (let i = 0; i < res.leaderboard.length; i++) {
          let entry = res.leaderboard[0]
          formatted_data.push({
            '#': i+1,
            Player: entry[0],
            Wins: entry[1]
          })
        }
        console.log(formatted_data)
        setLeaderboard(formatted_data)
      } catch (error) {
        alert(error) 
      }
    })()
  }, [])

  return (
    <>
      <Typography variant="h2" align='center' gutterBottom>
        Leaderboard
      </Typography>
      <LeaderboardTable data={leaderboard}></LeaderboardTable>
    </>
  )
}

export default Leaderboards