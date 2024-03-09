import random

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