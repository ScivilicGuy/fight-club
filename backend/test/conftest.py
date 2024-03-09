import pytest
from connect import connect
from api_calls import create_tournament

DUMMY_INV_CODE = '0'
DELETE_TOURNAMENTS_TABLE = "DELETE FROM tournaments" 
DELETE_PLAYERS_TABLE = "DELETE FROM players"

# clears table before and after test
@pytest.fixture
def db_conn():
    conn = connect()
    if not conn:
        print("Failed to connect to database.")
        assert False
    cur = conn.cursor()
    cur.execute(DELETE_PLAYERS_TABLE)
    cur.execute(DELETE_TOURNAMENTS_TABLE)
    conn.commit()

    yield cur

    # teardown
    cur.execute(DELETE_PLAYERS_TABLE)
    cur.execute(DELETE_TOURNAMENTS_TABLE)
    conn.commit()
    cur.close()
    conn.close()

# tournament data must be in order name, desc, invite_code, num_teams, format
@pytest.fixture
def base_tournament():
    return dict(
        name="Test",
        desc="Test",
        inviteCode=DUMMY_INV_CODE,
        numTeams=4,
        format="Test"
    )

@pytest.fixture
def multiple_tournaments(base_tournament):
    return (
        base_tournament, 
        dict(
            name="Test1", 
            desc="", 
            inviteCode=DUMMY_INV_CODE,
            numTeams=8,
            format="Round Robin"
        ),
        dict(
            name="Test2",
            desc="",
            inviteCode=DUMMY_INV_CODE,
            numTeams=8,
            format="Knockout"
        )
    )

@pytest.fixture
def single_tournament_setup(base_tournament, db_conn):
    _ = db_conn
    return create_tournament(**base_tournament).body.get("tournamentId")

@pytest.fixture
def multi_tournaments_setup(multiple_tournaments, db_conn):
    _ = db_conn

    ids = []
    for t in multiple_tournaments:
        id = create_tournament(**t).body.get("tournamentId")
        ids.append(id)

    return ids
