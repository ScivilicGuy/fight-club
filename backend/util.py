import hashlib
import random
import re

def pop_random(lst):
    idx = random.randrange(0, len(lst))
    return lst.pop(idx)

def create_random_pairs(input_list):
  pairs = []
  while len(input_list) > 1:
    rand1 = pop_random(input_list)
    rand2 = pop_random(input_list)
    pair = (rand1, rand2)
    pairs.append(pair)

  return pairs

def is_power_of_2(n):
  return (n & (n-1) == 0) and n > 1

def hash_password(password):
  password_bytes = password.encode('utf-8')
  hash_object = hashlib.sha256(password_bytes)
  return hash_object.hexdigest()
 
# Define a function for
# for validating an Email
def isValidEmail(email):
  regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
  # pass the regular expression
  # and the string into the fullmatch() method
  return re.fullmatch(regex, email)