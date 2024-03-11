from psycopg2 import pool
from config import load_config

""" Connect to the PostgreSQL database server """
# connecting to the PostgreSQL server
config = load_config()
conn_pool = pool.ThreadedConnectionPool(5, 20, **config)
