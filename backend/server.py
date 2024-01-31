from json import dumps
from flask import Flask, request
from tournament import add_tournament


app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/create/tournament', methods=['POST'])
def create_tournament():
    tournament_info = request.json()
    return dumps(add_tournament(tournament_info["name"], tournament_info["description"], tournament_info["num_teams"], tournament_info["num_rounds"]))

