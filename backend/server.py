from json import dumps
from flask import Flask, request
from auth import authenticate_user, register_user
from user import User
from flask_login import LoginManager, login_required, login_user
from error import InputError
from tournament import add_players_to_tournament, add_tournament, create_matches, finish_tournament, generate_leaderboard, get_matches, get_matches_for_round, get_tournament, get_tournaments, remove_player_from_tournament, set_winners
from flask_cors import CORS
from tournament_states import States
from util import is_power_of_2

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
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/register', methods=['POST']) 
def register():
    data = request.get_json()
    return register_user(data["username"], data["password"], data["email"])

@app.route('/login', methods=['POST']) 
def login():
    data = request.get_json()
    user_id = authenticate_user(data["username"], data["password"])
    if user_id:
        user = User(user_id)
        login_user(user)
    return {}

@app.route('/tournament/create', methods=['POST'])
@login_required
def create_tournament():
    data = request.get_json()
    has_empty = any(i == "" for i in [data["name"], data["inviteCode"], data["state"]])
    
    # all given inputs should be non-empty (except for description)
    if has_empty:
        raise InputError(description="All fields should be non-empty to create a tournament")
    
    # a new tournament should be in a scheduled state only
    if data["state"] != States.SCHEDULED.name:
        raise InputError(description="Can only create a scheduled tournament")
    
    return {'tournamentId': add_tournament(data["name"], data["desc"], data["inviteCode"], data["state"])}

@app.route('/tournaments', methods=['GET'])
def view_tournaments():
    return {'tournaments': get_tournaments()}

@app.route('/tournament/<tournamentId>', methods=['GET'])
def view_tournament(tournamentId):
    return {'tournament': get_tournament(tournamentId)}

@app.route('/tournament/join', methods=['POST'])
def join_tournament():
    data = request.get_json()
    
    # all given inputs should be non-empty
    if not data["code"]:
        raise InputError(description="All fields should be non-empty to create a tournament")
    
    if not data["players"]:
        raise InputError(description="All fields should be non-empty to create a tournament")
    
    return add_players_to_tournament(data["code"], data["players"])

@app.route('/tournament/<tournamentId>/start', methods=['POST'])
@login_required
def start_tournament(tournamentId):
    data = request.get_json()

    if not tournamentId.isdigit():
        raise InputError(description="Invalid tournament id")
    
    if not isinstance(data["round"], int):
        raise InputError(description="Invalid round")
    
    if not is_power_of_2(len(data["players"])):
        raise InputError(description="Number of players must be a power of 2 to start")
    
    return create_matches(tournamentId, data["players"], data["round"])

@app.route('/tournament/<tournamentId>/next/round', methods=['POST'])
@login_required
def start_next_round(tournamentId):
    data = request.get_json()

    if not tournamentId.isdigit():
        raise InputError(description="Invalid tournament id")
    
    if not isinstance(data["round"], int):
        raise InputError(description="Invalid round")
    
    if not data["players"] or len(data["players"]) % 2 != 0:
        raise InputError(description="Every match must have a winner")
    
    set_winners(data["players"])
    return create_matches(tournamentId, data["players"], data["round"])

@app.route('/tournament/<tournamentId>/end', methods=['PUT'])
@login_required
def end_tournament(tournamentId):
    data = request.get_json()

    if not data["winner"]:
        raise InputError(description="Invalid winner - winner must not be empty")
    
    return finish_tournament(tournamentId, data["winner"])

@app.route('/tournament/<tournamentId>/matches', methods=['GET'])
def view_tournament_matches(tournamentId):
    return {"matches": get_matches(tournamentId)}

@app.route('/tournament/<tournamentId>/matches/<round>', methods=['GET'])
def view_tournament_matches_for_round(tournamentId, round):
    return {"matches": get_matches_for_round(tournamentId, round)}

@app.route('/tournament/<tournamentId>/remove/player', methods=['DELETE'])
@login_required
def remove_tournament_player(tournamentId):
    data = request.get_json()

    if not tournamentId.isdigit():
        raise InputError(description="Invalid tournament id")
    
    return remove_player_from_tournament(tournamentId, data["player"])

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    return {"leaderboard": generate_leaderboard()}

CORS(app) 
