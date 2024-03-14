import string
from src.error import AccessError, InputError
from src.util import create_random_pairs
from src.db import conn_pool
from src.tournament_states import States

# Creates a tournament in the database with given inputs
# tournamentId field is auto-generated (serial) and the winner field is set to empty string
# Errors can occur if any inputs are empty (they must all exist)
def add_tournament(name: string, desc: string, inviteCode: string, state: string, creator: string, isPrivate: bool):
  insert_tournament = '''
    INSERT INTO Tournaments (name, description, inviteCode, state, creator, isPrivate)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING tournamentId
  '''

  tournamentId = -1
  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(insert_tournament, [name, desc, inviteCode, state, creator, isPrivate])
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
          'winner': tournament[6],
          'creator': tournament[7],
          'isPrivate': tournament[8]
        })
  except:
    print("ERROR: problem occurred when retrieving all tournament info")
    raise AccessError("ERROR: problem occurred when retrieving all tournament info")
  finally: 
    if conn:
      conn_pool.putconn(conn)

  return tournaments

def get_public_tournaments():
  retrieve_public_tournaments = '''
    SELECT * 
    FROM Tournaments
    WHERE isPrivate = FALSE
  '''

  publicTournaments = []

  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(retrieve_public_tournaments, [])
      for tournament in cur.fetchall():
        publicTournaments.append({
          'id': tournament[0],
          'name': tournament[1],
          'desc': tournament[2],
          'inviteCode': tournament[3],
          'state': tournament[4],
          'round': tournament[5],
          'winner': tournament[6],
          'creator': tournament[7],
          'isPrivate': tournament[8]
        })
  except:
    print("ERROR: problem occurred when retrieving all tournament info")
    raise AccessError("ERROR: problem occurred when retrieving all tournament info")
  finally: 
    if conn:
      conn_pool.putconn(conn)

  return publicTournaments

# Returns a list of tournaments that the given user has joined
def get_joined_tournaments(user: string):
  retrieve_joined_tournaments = '''
    SELECT (t.tournamentId, name, description, inviteCode, state, round, winner) 
    FROM Tournaments t JOIN Players p ON (t.tournamentId = p.tournamentId)
    WHERE (p.playerName = %s)
  '''

  joined_tournaments = []
  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(retrieve_joined_tournaments, [user])
      for tournament in cur.fetchall():
        joined_tournaments.append({
          'id': tournament[0],
          'name': tournament[1],
          'desc': tournament[2],
          'inviteCode': tournament[3],
          'state': tournament[4],
          'round': tournament[5],
          'winner': tournament[6]
        })
  finally: 
    if conn:
      conn_pool.putconn(conn)

  return joined_tournaments

# retrieves all tournaments that given user has created
def get_created_tournaments(user: string):
  retrieve_tournaments_created_by_user = '''
    SELECT * 
    FROM Tournaments
    WHERE creator = %s
  '''

  tournaments_created_by_user = []
  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(retrieve_tournaments_created_by_user, [user])
      for tournament in cur.fetchall():
        tournaments_created_by_user.append({
          'id': tournament[0],
          'name': tournament[1],
          'desc': tournament[2],
          'inviteCode': tournament[3],
          'state': tournament[4],
          'round': tournament[5],
          'winner': tournament[6],
          'creator': tournament[7],
          'isPrivate': tournament[8]
        })
  except:
    raise AccessError("ERROR: problem occurred when retrieving all info related to tournaments created by user")
  finally: 
    if conn:
      conn_pool.putconn(conn)

  return tournaments_created_by_user


# retrieve data for a select tournament (including players that have joined it)
# returns a dictionary
# error occurs if tournament does not exist
def get_tournament(tournamentId):
  retrieve_tournament = '''
    SELECT name, description, inviteCode, state, round, winner, creator, isPrivate
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
        'creator': res[6],
        'isPrivate': res[7],
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

# adds players to a given tournament (identified by input code)
# errors occur if the tournament has already started/finished
# or the player has already joined a separate tournament
# or the code is invalid
def add_players_to_tournament(code: string, players: list):
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
      if state == States.SCHEDULED.value:
        cur.execute(count_existing_players, [tournamentId])
        if cur.fetchone()[0] < 16:
          for player in players:
            cur.execute(add_player, [player, tournamentId])
          conn.commit()
  except TypeError:
    raise InputError(description="Invalid code")
  except:
    raise InputError(description="Cannot join same tournament twice")
  finally: 
    if conn:
      conn_pool.putconn(conn)
  
  if state != States.SCHEDULED.value:
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
    SELECT matchId, player1, player2, winner, round
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
          "winner": res[3],
          "round": res[4]
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

  exists_on_leaderboard = '''
    SELECT wins 
    FROM TournamentWins
    WHERE (playerName = %s)
  '''

  insert_into_leaderboard = '''
    INSERT INTO TournamentWins (playerName, wins)
    VALUES (%s, 1)
  '''

  update_leaderboard = '''
    UPDATE TournamentWins
    SET wins = %s
    WHERE (playerName = %s)
  '''
  
  match_id = winner[0]
  player_name = winner[1]

  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(update_tournament_winner, [player_name, tournamentId])
      cur.execute(update_match_winner, [player_name, match_id])
      cur.execute(exists_on_leaderboard, [player_name])
      res = cur.fetchone()
      if res:
        # player already on leaderboard
        wins = res[0]
        cur.execute(update_leaderboard, [wins+1, player_name])
      else:
        # player not on leaderboard
        cur.execute(insert_into_leaderboard, [player_name])
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
  get_top_ten = '''
    SELECT playerName 
    FROM TournamentWins
    ORDER BY wins DESC
    LIMIT 10
  '''

  top_ten_players = []
  try: 
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(get_top_ten, [])
      res = cur.fetchall()
      for i in res:
        top_ten_players.append(i[0])
  except:
    raise InputError(description="Problem occurred when getting tournament winners")
  finally:
    if conn:
      conn_pool.putconn(conn)

  return top_ten_players





