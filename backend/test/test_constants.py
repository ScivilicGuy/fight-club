from enum import Enum

class States(Enum):
  SCHEDULED="Scheduled"
  STARTED="Started"
  FINISHED="Finished"
  
DUMMY_USERNAME = 'whacko'
DUMMY_EMAIL = 'whacko@gmail.com'
DUMMY_PASSWORD = 'nutjob123'
DUMMY_INV_CODE = '0fwe03'
DELETE_TOURNAMENTS_TABLE = "DELETE FROM tournaments" 
DELETE_PLAYERS_TABLE = "DELETE FROM players"
BASE_TOURNAMENT_INFO = dict(
  name="Test",
  desc="Test",
  inviteCode=DUMMY_INV_CODE,
  state=States.SCHEDULED,
  round=1,
  winner='',
  creator=DUMMY_USERNAME,
  isPrivate=False,
  players=[]
)



