from error import InputError
from db import conn_pool
from util import hash_password, isValidEmail

def register_user(username, password, email):
  add_user = '''
    INSERT INTO Users (username, password, email)
    VALUES (%s, %s, %s)
  '''

  if not isValidEmail(email):
    raise InputError(description="Invalid email")

  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(add_user, [username, hash_password(password), email])
  except:
    raise InputError(description="Problem occurred when registering user")
  finally:
    conn_pool.putconn(conn)

  return {}

def authenticate_user(username, password):
  check_user = '''
    SELECT userId
    FROM Users
    WHERE (username = %s AND password = %s)
  '''

  user_id = None
  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(check_user, [username, hash_password(password)])
      user_id = cur.fetchone()[0]
  except IndexError:
    raise InputError(description="Invalid username/password")
  except:
    raise InputError(description="Problem occurred when authenticating user")
  finally:
    conn_pool.putconn(conn)

  return user_id

def get_user_by_id(user_id):
  find_user = '''
    SELECT *
    FROM Users
    WHERE (userId = %s)
  ''' 

  user = None
  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(find_user, [user_id])
      user = cur.fetchone()[0]
  except IndexError:
    raise InputError(description="User does not exist")
  finally:
    conn_pool.putconn(conn)

  return user