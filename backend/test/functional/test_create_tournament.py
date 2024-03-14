from api_calls import view_tournaments, view_tournament, create_tournament
from test_helpers import dict_equals

TOURNAMENT_CREATION_FIELDS = ["name", "desc", "inviteCode", "state", "round", "winner", "creator", "isPrivate"]

"""
GIVEN an unauthorised user (no access token)
WHEN the '/create/tournament' route is requested (POST)
THEN check that the response is not valid (AccessError/403)
"""
def test_unauthorised_create_tournament(base_tournament, db_conn):
    _ = db_conn

    # must be logged in to create tournament
    res = create_tournament(None, **base_tournament)    
    assert res.status_code == 403

"""
GIVEN a logged in user (access token)
WHEN the '/create/tournament' route is requested (POST)
THEN check that the response is valid and that the tournament is added to db
"""
def test_create_tournament(base_tournament, db_conn, register_login_user, base_tournament_res):
    _ = db_conn

    # login user and get access token
    access_token = register_login_user

    # create tournament should return tournamentId as int
    res = create_tournament(access_token, **base_tournament) 
    assert res.status_code == 200   

    id = res.body["tournamentId"]
    assert type(id) == int

    # check tournament is stored in db
    tournaments = view_tournaments().body.get("tournaments")
    assert len(tournaments) == 1

    # check tournament page has correct info
    tournament = view_tournament(id).body.get("tournament")
    assert tournament == base_tournament_res

"""
GIVEN a logged in user (access token)
WHEN the '/create/tournament' route is requested (POST) multiple times
THEN check that the response is valid and that the tournaments are added to db
"""
def test_create_multiple_tournaments(multiple_tournaments, db_conn, register_login_user):
    _ = db_conn

    access_token = register_login_user
    resps = []
    for t in multiple_tournaments:
        resps.append(create_tournament(access_token, **t))

    tournaments = view_tournaments().body.get("tournaments")
    assert len(tournaments) == len(multiple_tournaments)

    for i, res in enumerate(resps):
        id = res.body["tournamentId"]
        tournament_res = view_tournament(id).body.get("tournament")
        for field in multiple_tournaments[i].keys():
            assert multiple_tournaments[i][field] == tournament_res[field]
        assert tournament_res.get("players") == []
