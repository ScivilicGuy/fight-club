from flask import Flask, request
from tournament import add_team_to_tournament, add_tournament, create_matches, finish_tournament, get_matches, get_matches_for_round, get_tournament, get_tournaments, remove_player_from_tournament
from flask_cors import CORS

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/tournament/create', methods=['POST'])
def create_tournament():
    tournament_info = request.get_json()
    return {'tournamentId': (add_tournament(
            tournament_info["name"], 
            tournament_info["desc"], 
            tournament_info["inviteCode"],
            tournament_info["state"], 
            tournament_info["round"]
        )
    )}

@app.route('/tournaments', methods=['GET'])
def view_tournaments():
    return {'tournaments': get_tournaments()}

@app.route('/tournament/<tournamentId>', methods=['GET'])
def view_tournament(tournamentId):
    return {'tournament': get_tournament(tournamentId)}

@app.route('/tournament/join', methods=['POST'])
def join_tournament():
    join_info = request.get_json()
    return {add_team_to_tournament(
        join_info["code"],
        join_info["playerName"]
    )}

@app.route('/tournament/<tournamentId>/start', methods=['POST'])
def start_tournament(tournamentId):
    players_info = request.get_json()
    create_matches(tournamentId, players_info["players"], 1)
    return {}

@app.route('/tournament/<tournamentId>/end', methods=['PUT'])
def end_tournament(tournamentId):
    data = request.get_json()
    finish_tournament(tournamentId, data["winner"])
    return {}

@app.route('/tournament/<tournamentId>/next/round', methods=['POST'])
def start_next_round(tournamentId):
    matches_info = request.get_json()
    create_matches(tournamentId, matches_info["players"], matches_info["round"])
    return {}

@app.route('/tournament/<tournamentId>/matches', methods=['GET'])
def view_tournament_matches(tournamentId):
    return {"matches": get_matches(tournamentId)}

@app.route('/tournament/<tournamentId>/matches/<round>', methods=['GET'])
def view_tournament_matches_for_round(tournamentId, round):
    return {"matches": get_matches_for_round(tournamentId, round)}

@app.route('/tournament/<tournamentId>/remove/player', methods=['DELETE'])
def remove_tournament_player(tournamentId):
    player_info = request.get_json()
    remove_player_from_tournament(tournamentId, player_info["name"])
    return {}

CORS(app) 
