from api_calls import view_tournaments, view_tournament, create_tournament
from test_helpers import dict_equals

TOURNAMENT_CREATION_FIELDS = ["name", "desc", "inviteCode", "numTeams", "format"]

# currently a white box test, probably should use the api to test instead
def test_create_tournament(base_tournament, db_conn):
    _ = db_conn

    res = create_tournament(**base_tournament)    
    assert res.status_code == 200
    id = res.body["tournamentId"]
    assert type(id) == int

    tournaments = view_tournaments().body.get("tournaments")
    assert len(tournaments) == 1

    # this doubles up as a basic test of view_tournament
    tournament = view_tournament(id).body.get("tournament")
    assert dict_equals(tournament, base_tournament, *TOURNAMENT_CREATION_FIELDS)
    assert tournament.get("players") == []
    
def test_create_multiple_tournaments(multiple_tournaments, db_conn):
    _ = db_conn

    resps = []
    for t in multiple_tournaments:
        resps.append(create_tournament(**t))

    tournaments = view_tournaments().body.get("tournaments")
    assert len(tournaments) == len(multiple_tournaments)

    for i, res in enumerate(resps):
        id = res.body["tournamentId"]
        tournament = view_tournament(id).body.get("tournament")
        assert dict_equals(tournament, multiple_tournaments[i], *TOURNAMENT_CREATION_FIELDS)
        assert tournament.get("players") == []
