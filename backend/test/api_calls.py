import requests
import configparser

config = configparser.ConfigParser()
config.read("config.ini")

HOST=f"http://localhost:{config['DEFAULT']['FrontendPort']}"

def _get_url(route):
    if route[0] != "/":
        route = "/" + route
    return HOST + route

class TestResponse:
    def __init__(self, status_code, body):
        self.status_code = status_code
        self.body = body

def _process_res(method, route, headers={}, json={}):
    res = method(_get_url(route), json=json, headers=headers)
    return TestResponse(res.status_code, res.json())

def login(username, password):
    return _process_res(
        requests.post,
        "/login",
        json=dict(
            username=username,
            password=password
        )
    )

def register(username, password, email):
    return _process_res(
        requests.post,
        "/register",
        json=dict(
            username=username,
            password=password,
            email=email
        )
    )

def view_tournaments():
    return _process_res(requests.get, "/tournaments")

def view_tournament(tournamentId):
    return _process_res(requests.get, f"/tournament/{tournamentId}")

def create_tournament(accessToken, name, desc, inviteCode, state, creator, isPrivate):
    return _process_res(
        requests.post, 
        "/tournament/create",
        {'Authorization': f'Bearer {accessToken}'},
        json=dict(
            name=name,
            desc=desc,
            inviteCode=inviteCode,
            state=state,
            round=1,
            creator=creator,
            isPrivate=isPrivate
        )
    )

def join_tournament(accessToken, code, players):
    return _process_res(
        requests.post,
        "/tournament/join",
        {'Authorization': f'Bearer {accessToken}'},
        json=dict(
            code=code,
            players=players
        )
    )
