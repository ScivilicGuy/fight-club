from error import InputError
from db import conn_pool
from util import hash_password, isValidEmail

def register_user(username, password, email):
  check_for_duplicate_data = '''
    SELECT username
    FROM Users
    WHERE (username = %s OR email = %s)
  '''

  add_user = '''
    INSERT INTO Users (username, password, email)
    VALUES (%s, %s, %s)
  '''

  if not isValidEmail(email):
    raise InputError(description="Invalid email")
  
  if len(password) < 6:
    raise InputError(description="Password must be at least 6 characters")

  try:
    conn = conn_pool.getconn()
    with conn.cursor() as cur:
      cur.execute(check_for_duplicate_data, [username, email])
      res = cur.fetchone()
      if res:
        if username == res[0]:
          raise InputError(description="This username already exists")
        else:
          raise InputError(description="This email address already exists")
      else:
        cur.execute(add_user, [username, hash_password(password), email])
        conn.commit()
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
  except TypeError:
    raise InputError(description="Invalid username/password")
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
  except TypeError:
    raise InputError(description="User does not exist")
  finally:
    conn_pool.putconn(conn)

  return user