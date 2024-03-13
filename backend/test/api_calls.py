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

def _process_res(method, route, json={}):
    res = method(_get_url(route), json=json)
    return TestResponse(res.status_code, res.json())

def view_tournaments():
    return _process_res(requests.get, "/tournaments")

def view_tournament(tournamentId):
    return _process_res(requests.get, f"/tournament/{tournamentId}")

def create_tournament(name, desc, inviteCode, state, round):
    return _process_res(
        requests.post, 
        "/tournament/create",
        json=dict(
            name=name,
            desc=desc,
            inviteCode=inviteCode,
            state=state,
            round=round
        )
    )

def join_tournament(code, players):
    return _process_res(
        requests.post,
        "/tournament/join",
        json=dict(
            code=code,
            players=players
        )
    )
