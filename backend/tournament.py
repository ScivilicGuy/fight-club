import string
from connect import connect
import psycopg2


def add_tournament(name: string, desc: string, inviteCode: string, numTeams: int, numRounds: int):
  insert_tournament = '''
    INSERT INTO tournaments (name, description, inviteCode, numTeams, numRounds)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING tournamentId
  '''
  
  print(name, desc, inviteCode, numTeams, numRounds)
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

  return {'tournamentId': tournamentId}
