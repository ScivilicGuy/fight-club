from flask import Flask, request
from tournament import add_team_to_tournament, add_tournament, get_tournament, get_tournaments
from flask_cors import CORS
from json import dumps

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
            tournament_info["numTeams"], 
            tournament_info["format"]
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
    add_team_to_tournament(
        join_info["code"],
        join_info["playerName"]
    )
    return {}

CORS(app) 
