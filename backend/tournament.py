import string
from connect import connect
import psycopg2


def add_tournament(name: string, desc: string, inviteCode: string, numTeams: int, numRounds: int):
  insert_tournament = '''
    INSERT INTO tournaments (name, description, inviteCode, numTeams, numRounds)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING tournamentId
  '''

  tournamentId = -1
  try:
    conn = connect()
    cur = conn.cursor()
    cur.execute(insert_tournament, [name, desc, inviteCode, numTeams, numRounds])
    tournamentId = cur.fetchone()[0]
    conn.commit()
  except:
    pass
  finally: 
    if cur:
      cur.close()

  return tournamentId

def get_tournaments():
  retrieve_tournaments = '''
    SELECT * 
    FROM tournaments
  '''

  tournaments = []

  try:
    conn = connect()
    cur = conn.cursor()
    cur.execute(retrieve_tournaments, [])
    for tournament in cur.fetchall():
      tournaments.append({
        'id': tournament[0],
        'name': tournament[1],
        'desc': tournament[2],
        'inviteCode': tournament[3],
        'numTeams': tournament[4],
        'numRounds': tournament[5]
      })
  except:
    pass
  finally: 
    if cur:
      cur.close()

  return tournaments

def get_tournament(tournamentId):
  retrieve_tournament = '''
    SELECT * 
    FROM tournaments
    WHERE (tournamentId = %s)
  '''

  tournament = None

  try:
    conn = connect()
    cur = conn.cursor()
    cur.execute(retrieve_tournament, [tournamentId])
    res = cur.fetchone()
    tournament = {
      'id': res[0],
      'name': res[1],
      'desc': res[2],
      'inviteCode': res[3],
      'numTeams': res[4],
      'numRounds': res[5]
    }
  except:
    pass
  finally: 
    if cur:
      cur.close()

  return tournament
