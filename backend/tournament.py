import string
from util import create_random_pairs
from connect import connect


def add_tournament(name: string, desc: string, inviteCode: string, state: string, round: int):
  insert_tournament = '''
    INSERT INTO Tournaments (name, description, inviteCode, state, round)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING tournamentId
  '''

  tournamentId = -1
  try:
    conn = connect()
    cur = conn.cursor()
    cur.execute(insert_tournament, [name, desc, inviteCode, state, round])
    tournamentId = cur.fetchone()[0]
    conn.commit()
  except:
    print("ERROR: problem occurred when adding tournament")
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
        'state': tournament[4],
        'round': tournament[5]
      })
  except:
    print("ERROR: problem occurred when retrieving all tournament info")
  finally: 
    if cur:
      cur.close()

  return tournaments

def get_tournament(tournamentId):
  retrieve_tournament = '''
    SELECT name, description, inviteCode, state, round
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
      'state': res[3],
      'round': res[4],
      'players': []
    }

    cur.execute(retrieve_players, [tournamentId])
    res = cur.fetchall()
    for player in res:
      tournament['players'].append(player[0])
  except:
    print("ERROR: problem occurred when getting the info for a tournament")
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
    print("ERROR: problem occurred when adding a team to a tournament")
  finally: 
    if cur:
      cur.close()

  return {}

def create_matches(tournamentId, players, round):
  opponent_pairs = create_random_pairs(players)

  add_match = '''
    INSERT INTO Matches (tournamentId, player1, player2, round)
    VALUES (%s, %s, %s, %s)
  '''

  update_tournament_state = '''
    UPDATE Tournaments
    SET state = 'IN PROGRESS', round = %s
    WHERE (tournamentId = %s)
  '''

  try:
    conn = connect()
    cur = conn.cursor()
    for pair in opponent_pairs:
      cur.execute(add_match, [tournamentId, pair[0], pair[1], round])
    cur.execute(update_tournament_state, [round, tournamentId])
    conn.commit()
  except:
    pass 
  finally:
    if cur:
      cur.close()

def get_matches(tournamentId):
  get_tournament_matches = '''
    SELECT player1, player2
    FROM Matches
    WHERE (tournamentId = %s)
  '''

  matches = []
  try: 
    conn = connect()
    cur = conn.cursor()
    cur.execute(get_tournament_matches, [tournamentId])
    for res in cur.fetchall():
      matches.append({
        "player1": res[0],
        "player2": res[1]
      })
  except:
    pass 
  finally:
    if cur:
      cur.close()

  return matches

def get_matches_for_round(tournamentId, round):
  get_tournament_matches = '''
    SELECT player1, player2
    FROM Matches
    WHERE (tournamentId = %s AND round = %s)
  '''

  matches = []
  try: 
    conn = connect()
    cur = conn.cursor()
    cur.execute(get_tournament_matches, [tournamentId, round])
    for res in cur.fetchall():
      matches.append({
        "player1": res[0],
        "player2": res[1]
      })
  except:
    pass 
  finally:
    if cur:
      cur.close()

  return matches



