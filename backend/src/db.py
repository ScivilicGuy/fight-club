from psycopg2 import pool
from backend.src.config import load_config

""" Connect to the PostgreSQL database server """
# connecting to the PostgreSQL server
config = load_config()
print("Creating connection pool")
conn_pool = pool.ThreadedConnectionPool(5, 20, **config)
