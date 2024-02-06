from flask import Flask, request
from tournament import add_tournament
from flask_cors import CORS
from json import dumps

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/create/tournament', methods=['POST'])
def create_tournament():
    tournament_info = request.get_json()
    print(tournament_info["numRounds"])
    return dumps(add_tournament(
            tournament_info["name"], 
            tournament_info["desc"], 
            tournament_info["inviteCode"],
            tournament_info["numTeams"], 
            tournament_info["numRounds"]
        )
    )

CORS(app) 
