import pytest
from db import conn_pool
from api_calls import create_tournament
from tournament_states import States

DUMMY_INV_CODE = '0'
DELETE_TOURNAMENTS_TABLE = "DELETE FROM tournaments" 
DELETE_PLAYERS_TABLE = "DELETE FROM players"

# clears table before and after test
@pytest.fixture
def db_conn():
    conn = conn_pool()
    if not conn:
        print("Failed to connect to database.")
        assert False
    with conn.cursor() as cur:
        cur.execute(DELETE_PLAYERS_TABLE)
        cur.execute(DELETE_TOURNAMENTS_TABLE)
        conn.commit()

        yield cur

        # teardown
        cur.execute(DELETE_PLAYERS_TABLE)
        cur.execute(DELETE_TOURNAMENTS_TABLE)
        conn.commit()
    conn_pool.putconn(conn)

# tournament data must be in order name, desc, invite_code, num_teams, format
@pytest.fixture
def base_tournament():
    return dict(
        name="Test",
        desc="Test",
        inviteCode=DUMMY_INV_CODE,
        state=States.SCHEDULED,
        round=1
    )

@pytest.fixture
def multiple_tournaments(base_tournament):
    return (
        base_tournament, 
        dict(
            name="Test1", 
            desc="", 
            inviteCode=DUMMY_INV_CODE,
            state=States.SCHEDULED,
            round=1
        ),
        dict(
            name="Test2",
            desc="",
            inviteCode=DUMMY_INV_CODE,
            state=States.SCHEDULED,
            round=1
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
