import React, { useState, useEffect } from 'react'
import { apiFetch } from '../util'
import { Card, CardContent, Typography, CardActionArea } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DropdownFilter from '../Components/DropdownFilter'
import { TOURNAMENT_VIEWS, FILTER_OPTIONS } from '../constants'

function ViewTournaments({ view }) {
  const [tournaments, setTournaments] = useState([])
  const [renderedTournaments, setRenderedTournaments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    (async() => {
      try {
        let res = null
        if (view === TOURNAMENT_VIEWS.PUBLIC) {
          res = await apiFetch('tournaments/public', 'GET')
        } else if (view === TOURNAMENT_VIEWS.CREATED) {
          res = await apiFetch('tournaments/created', 'GET')
        } else {
          res = await apiFetch('tournaments/joined', 'GET')
        }
        setTournaments(res.tournaments)
        setRenderedTournaments(res.tournaments)
      } catch (error) {
        alert(error) 
      }
    })()
  }, [])

  const openTournament = (tournamentId) => {
    navigate(`/tournaments/${tournamentId}`)
  }

  const onFilter = (selectedOption) => {
    const filteredTournaments = tournaments.filter(tournament => tournament.state === selectedOption)
    setRenderedTournaments(filteredTournaments)
  }

  return (
    <>
      <Typography variant="h2" align='center' gutterBottom>
        {`${view} Tournaments`}
      </Typography>
      <DropdownFilter options={FILTER_OPTIONS} onFilter={onFilter} />
      {renderedTournaments.map((tournament) => (
        <Card key={`tournament-${tournament.id}`}>
          <CardActionArea onClick={() => openTournament(tournament.id)}>
            <CardContent>
              <Typography variant='h6' align='center'>{tournament.name}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </>
  )
}

export default ViewTournaments