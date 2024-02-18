def dict_equals(d1, d2, *keys):
    """Returns true if d1 == d2 for all keys specified"""

    for k in keys:
        if k not in d1 or k not in d2 or d1[k] != d2[k]:
            return False
    return True
