import string
from connect import connect
import psycopg2


def add_tournament(name: string, desc: string, inviteCode: string, numTeams: int, format: string):
  insert_tournament = '''
    INSERT INTO Tournaments (name, description, inviteCode, numTeams, format)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING tournamentId
  '''

  tournamentId = -1
  try:

    conn = connect()
    cur = conn.cursor()
    cur.execute(insert_tournament, [name, desc, inviteCode, numTeams, format])
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
    FROM Tournaments
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
        'format': tournament[5]
      })
  except:
    pass
  finally: 
    if cur:
      cur.close()

  return tournaments

def get_tournament(tournamentId):
  retrieve_tournament = '''
    SELECT name, description, inviteCode, numTeams, format
    FROM Tournaments
    WHERE (tournamentId = %s)
  '''

  retrieve_players = '''
    SELECT playerName
    FROM Players
    WHERE (tournamentId = %s)
  '''

  tournament = None

  try:
    conn = connect()
    cur = conn.cursor()
    cur.execute(retrieve_tournament, [tournamentId])
    res = cur.fetchone()
    tournament = {
      'name': res[0],
      'desc': res[1],
      'inviteCode': res[2],
      'numTeams': res[3],
      'format': res[4],
      'players': []
    }

    cur.execute(retrieve_players, [tournamentId])
    res = cur.fetchall()
    for player in res:
      tournament['players'].append(player[0])
  
  except:
    pass
  finally: 
    if cur:
      cur.close()

  return tournament

def add_team_to_tournament(code: string, playerName: string):
  add_player = '''
    INSERT INTO Players
    VALUES (%s, %s)
  '''

  check_code = '''
    SELECT tournamentId 
    FROM Tournaments
    WHERE (inviteCode = %s)
  '''

  try:
    conn = connect()
    cur = conn.cursor()
    cur.execute(check_code, [code])
    res = cur.fetchone()
    if not res:
      raise Exception('No such tournament')
    
    tournamentId = res[0]
    print(tournamentId)
    cur.execute(add_player, [playerName, tournamentId])
    conn.commit()
  except:
    pass
  finally: 
    if cur:
      cur.close()

  return {}


