import string
from error import AccessError, InputError
from util import create_random_pairs
from db import conn_pool
from tournament_states import States

# Creates a tournament in the database with given inputs
# tournamentId field is auto-generated (serial) and the winner field is set to empty string
# Errors can occur if any inputs are empty (they must all exist)
def add_tournament(name: string, desc: string, inviteCode: string, state: string):
  insert_tournament = '''
    INSERT INTO Tournaments (name, description, inviteCode, state)
    VALUES (%s, %s, %s, %s)
    RETURNING tournamentId
  '''

  tournamentId = -1
  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(insert_tournament, [name, desc, inviteCode, state])
      tournamentId = cur.fetchone()[0]
      conn.commit()
  except:
    print("ERROR: problem occurred when adding tournament")
    raise InputError(description="ERROR: problem occurred when adding tournament")
  finally: 
    if conn:
      conn_pool.putconn(conn)

  return tournamentId

# retrieve data for all existing tournaments 
# returns a list of dictionaries
def get_tournaments():
  retrieve_tournaments = '''
    SELECT * 
    FROM Tournaments
  '''

  tournaments = []

  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(retrieve_tournaments, [])
      for tournament in cur.fetchall():
        tournaments.append({
          'id': tournament[0],
          'name': tournament[1],
          'desc': tournament[2],
          'inviteCode': tournament[3],
          'state': tournament[4],
          'round': tournament[5],
          'winner': tournament[6]
        })
  except:
    print("ERROR: problem occurred when retrieving all tournament info")
    raise AccessError("ERROR: problem occurred when retrieving all tournament info")
  finally: 
    if conn:
      conn_pool.putconn(conn)

  return tournaments

# retrieve data for a select tournament (including players that have joined it)
# returns a dictionary
# error occurs if tournament does not exist
def get_tournament(tournamentId):
  retrieve_tournament = '''
    SELECT name, description, inviteCode, state, round, winner
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
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(retrieve_tournament, [tournamentId])
      res = cur.fetchone()
      tournament = {
        'name': res[0],
        'desc': res[1],
        'inviteCode': res[2],
        'state': res[3],
        'round': res[4],
        'winner': res[5],
        'players': []
      }

      cur.execute(retrieve_players, [tournamentId])
      res = cur.fetchall()
      for player in res:
        tournament['players'].append(player[0])
  except TypeError:
    raise InputError(description="Tournament does not exist")
  except:
    raise AccessError(description="Problem occurred when getting the info for a tournament")
  finally: 
    if conn:
      conn_pool.putconn(conn)

  return tournament

# adds a player to a given tournament (identified by input code)
# errors occur if the tournament has already started/finished
# or the player has already joined a separate tournament
# or the code is invalid
def add_player_to_tournament(code: string, playerName: string):
  add_player = '''
    INSERT INTO Players
    VALUES (%s, %s)
  '''

  check_code = '''
    SELECT tournamentId, state 
    FROM Tournaments
    WHERE (inviteCode = %s)
  '''

  count_existing_players = '''
    SELECT COUNT(playerName)
    FROM Players
    WHERE (tournamentId = %s)
  '''

  state = None

  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(check_code, [code])
      res = cur.fetchone()
      tournamentId = res[0]
      state = res[1]

      # can only join tournaments that haven't started
      if state == States.SCHEDULED.name:
        cur.execute(count_existing_players, [tournamentId])
        if cur.fetchone()[0] < 16:
          cur.execute(add_player, [playerName, tournamentId])
          conn.commit()
  except TypeError:
    raise InputError(description="Invalid code")
  except:
    raise InputError(description="Cannot join same tournament twice")
  finally: 
    if conn:
      conn_pool.putconn(conn)
  
  if state != States.SCHEDULED.name:
    raise InputError(description="Tournament has already started/finished")

  return {}

# generates a list of matches between pairs of players that is stored in the db
# updates tournament state since it is called at the start of every new round (new round = old round + 1)
def create_matches(tournamentId: int, players, round: int):
  if not isinstance(players, list):
    opponent_pairs = create_random_pairs(list(players.values()))
  else:
    opponent_pairs = create_random_pairs(players)

  add_match = '''
    INSERT INTO Matches (tournamentId, player1, player2, round)
    VALUES (%s, %s, %s, %s)
  '''

  update_tournament_state = '''
    UPDATE Tournaments
    SET state = 'STARTED', round = %s
    WHERE (tournamentId = %s)
  '''

  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      for pair in opponent_pairs:
        cur.execute(add_match, [tournamentId, pair[0], pair[1], round])
      cur.execute(update_tournament_state, [round, tournamentId])
      conn.commit()
  except TypeError:
    print("ERROR: problem occurred when generating matches") 
    raise InputError(description="ERROR: problem occurred when generating matches")
  finally:
    if conn:
      conn_pool.putconn(conn)
  
  return {}

# set winners for finished matches
def set_winners(winners):
  update_winner = '''
    UPDATE Matches
    SET winner = %s
    WHERE (matchId = %s)
  '''

  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      for winner in winners.items():
        cur.execute(update_winner, [winner[1], winner[0]])
      conn.commit()
  except:
    print("Problem occurred when updating winners") 
    raise InputError(description="Problem occurred when updating winners")
  finally:
    if conn:
      conn_pool.putconn(conn)

  return {}

# retrieves all matches for a tournament
def get_matches(tournamentId):
  get_tournament_matches = '''
    SELECT matchId, player1, player2, winner
    FROM Matches
    WHERE (tournamentId = %s)
  '''

  matches = []
  try: 
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(get_tournament_matches, [tournamentId])
      for res in cur.fetchall():
        matches.append({
          "matchId": res[0],
          "player1": res[1],
          "player2": res[2],
          "winner": res[3]
        })
  except:
    raise AccessError(description="ERROR: problem occurred when retrieving matches")
  finally:
    if conn:
      conn_pool.putconn(conn)

  return matches

# retrieves all matches for a given tournament for a particular round
def get_matches_for_round(tournamentId, round):
  get_tournament_matches = '''
    SELECT matchId, player1, player2
    FROM Matches
    WHERE (tournamentId = %s AND round = %s)
  '''

  matches = []
  try: 
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(get_tournament_matches, [tournamentId, round])
      for res in cur.fetchall():
        matches.append({
          "matchId": res[0],
          "player1": res[1],
          "player2": res[2]
        })
  except:
    raise AccessError(description="ERROR: problem occurred when retrieving matches")
  finally:
    if conn:
      conn_pool.putconn(conn)

  return matches

# sets tournament state to finished and updates the winner
def finish_tournament(tournamentId, winner):
  update_tournament_winner = '''
    UPDATE Tournaments
    SET state = 'FINISHED', winner = %s
    WHERE tournamentId = %s
  '''

  update_match_winner = '''
    UPDATE Matches
    SET winner = %s
    WHERE (matchId = %s)
  '''
  match_id = winner[0]
  player_name = winner[1]

  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(update_tournament_winner, [player_name, tournamentId])
      cur.execute(update_match_winner, [player_name, match_id])
      conn.commit()
  except TypeError:
    raise InputError(description="ERROR: problem occurred when setting the tournament winner")
  finally:
    if conn:
      conn_pool.putconn(conn)
  
  return {}

# removes player from given tournament
def remove_player_from_tournament(tournamentId, playerName):
  remove_player = '''
    DELETE FROM Players
    WHERE (tournamentId = %s AND playerName = %s)
  '''

  try: 
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(remove_player, [tournamentId, playerName])
      conn.commit()
  except:
    print("Could not remove player from tournament")
    raise InputError(description="Could not remove player from tournament")
  finally:
    if conn:
      conn_pool.putconn(conn)

  return {}

# retrieves the players with the most tournament wins (top 10)
def generate_leaderboard():
  get_tournament_winners = '''
    SELECT winner 
    FROM Tournaments
    WHERE winner != ''
  '''

  tournament_winners = []
  try: 
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(get_tournament_winners, [])
      res = cur.fetchall()
      for i in res:
        tournament_winners.append(i[0])
  except:
    raise InputError(description="Problem occurred when getting tournament winners")
  finally:
    if conn:
      conn_pool.putconn(conn)
  
  # count number of wins for each player
  leaderboard = {}
  for winner in tournament_winners:
    if winner in leaderboard:
      leaderboard[winner] += 1
    else:
      leaderboard[winner] = 1

  # sort players to find top 10
  sorted_top_ten_leaderboard = sorted(leaderboard.items(), key=lambda x:x[1], reverse=True)[:10]
  return sorted_top_ten_leaderboard





