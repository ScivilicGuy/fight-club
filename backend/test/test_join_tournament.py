from api_calls import view_tournament, join_tournament
from conftest import DUMMY_INV_CODE

def test_join_tournament(single_tournament_setup):
    id = single_tournament_setup
    res = join_tournament(DUMMY_INV_CODE, "Player")
    
    assert res.status_code == 200
    assert res.body == {}

    players = view_tournament(id).body.get("tournament").get("players")
    assert len(players) == 1
    assert players[0] == "Player"
