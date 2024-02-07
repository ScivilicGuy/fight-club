import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { apiFetch } from '../util'
import { useParams } from 'react-router-dom'

function Tournament() {
  const params = useParams()
  const [tournament, setTournament] = useState({})

  useEffect(() => {
    (async () => {
      const res = await apiFetch(`tournament/${params.tournamentId}`)
      setTournament(res.tournament)
    })()
  }, [params.tournamentId])

  return (
    <>
      <Typography variant='h2' align='center'>{tournament.name}</Typography>
    </>
  )
}

export default Tournament