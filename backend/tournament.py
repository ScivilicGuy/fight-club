import string
from connect import connect
import psycopg2


def add_tournament(name: string, desc: string, num_teams: int, num_rounds: int):
  insert_tournament = '''
    INSERT INTO tournaments 
    VALUES (%s, %s, %s, %s)
    RETURNING tournamentId
  '''
  
  tournamentId = -1

  try:
    conn = connect()
    cur = conn.cursor()
    cur.execute(insert_tournament, [name, desc, num_teams, num_rounds])
    tournamentId = cur.fetchone()[0]
    conn.commit()
  except:
    pass
  finally: 
    if cur:
      cur.close()

  return tournamentId
