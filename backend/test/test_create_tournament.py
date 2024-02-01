import pytest
import requests
import configparser

config = configparser.ConfigParser()
config.read("config.ini")
CONFIG = config["DEFAULT"]

@pytest.fixture
def base_tournament():
    return ["Test", "Test", 4, 2] 

def _get_url(route):
    if route[0] != "/":
        route = "/" + route
    return f"http://localhost:{CONFIG["FrontendPort"]}" + route

def _create_tournament(name, desc, num_teams, num_rounds):
    return requests.post(
        _get_url("/create/tournament"),
        json=dict(
            name=name,
            desc=desc,
            numTeams=num_teams,
            numRounds=num_rounds
        )
    )

def test_create_tournament(base_tournament):
    res = _create_tournament(*base_tournament)    
    assert res.status_code == 200
    assert type(res.json()["tournamentId"]) == int
