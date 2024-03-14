import pytest
from test_db import conn_pool
from api_calls import create_tournament, login, register
from test_constants import DUMMY_INV_CODE, DELETE_PLAYERS_TABLE, DELETE_TOURNAMENTS_TABLE, DUMMY_USERNAME, DUMMY_EMAIL, DUMMY_PASSWORD, States

# clears table before and after test
@pytest.fixture
def db_conn():
    conn = conn_pool.getconn()
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

# register + login user
@pytest.fixture
def register_login_user():
    register(DUMMY_USERNAME, DUMMY_PASSWORD, DUMMY_EMAIL)
    res = login(DUMMY_USERNAME, DUMMY_PASSWORD)
    return res.body["access_token"]

# tournament data must be in this order
@pytest.fixture
def base_tournament():
    return dict(
        name="Test",
        desc="Test",
        inviteCode=DUMMY_INV_CODE,
        state=States.SCHEDULED.value,
        creator=DUMMY_USERNAME,
        isPrivate=False
    )

# full tournament dict
@pytest.fixture
def base_tournament_res():
    return dict(
        name="Test",
        desc="Test",
        inviteCode=DUMMY_INV_CODE,
        state=States.SCHEDULED.value,
        round=1,
        winner=None,
        creator=DUMMY_USERNAME,
        isPrivate=False,
        players=[]
    )

@pytest.fixture
def multiple_tournaments(base_tournament):
    return (
        base_tournament, 
        dict(
            name="Test1", 
            desc="", 
            inviteCode=DUMMY_INV_CODE,
            state=States.SCHEDULED.value,
            creator=DUMMY_USERNAME,
            isPrivate=False
        ),
        dict(
            name="Test2",
            desc="",
            inviteCode=DUMMY_INV_CODE,
            state=States.SCHEDULED.value,
            creator=DUMMY_USERNAME,
            isPrivate=False
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
