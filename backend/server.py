from json import dumps
from flask import Flask, request
from tournament import add_team_to_tournament, add_tournament, create_matches, finish_tournament, get_matches, get_matches_for_round, get_tournament, get_tournaments, remove_player_from_tournament
from flask_cors import CORS

def defaultHandler(err):
    try:
        response = err.get_response()
        response.data = dumps({
            'code': err.code,
            'name': 'System Error',
            'message': err.description
        })
        response.content_type = 'application/json'
        return response
    except:
        raise Exception(str(err)) from err
    
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['TRAP_HTTP_EXCEPTIONS'] = True
app.register_error_handler(Exception, defaultHandler)

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
    data = request.get_json()
    return add_team_to_tournament(data["code"], data["playerName"])

@app.route('/tournament/<tournamentId>/start', methods=['POST'])
def start_tournament(tournamentId):
    data = request.get_json()
    create_matches(tournamentId, data["players"], data["round"])
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
