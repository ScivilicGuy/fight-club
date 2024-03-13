from flask_login import UserMixin
from auth import get_user_by_id  

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

    @staticmethod
    def get(user_id):
        user_data = get_user_by_id(user_id)
        print(user_data)
        if not user_data:
            return None
        return User(user_data['id'])  
