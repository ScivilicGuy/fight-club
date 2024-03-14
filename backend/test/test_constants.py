from enum import Enum

class States(Enum):
  SCHEDULED="Scheduled"
  STARTED="Started"
  FINISHED="Finished"

DUMMY_USERNAME = 'whacko'
DUMMY_EMAIL = 'whacko@gmail.com'
DUMMY_PASSWORD = 'nutjob123'
DUMMY_INV_CODE = '0fwe03'

DELETE_TOURNAMENTS_TABLE = "DELETE FROM Tournaments" 
DELETE_USERS_TABLE = "DELETE FROM Users"
DELETE_LEADERBOARD_TABLE = "DELETE FROM TournamentWins"

INPUT_ERROR = 400
ACCESS_ERROR = 403
OK = 200




