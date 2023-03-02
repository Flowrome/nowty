from utilities.env import env
from pymongo import MongoClient


class MongoInstance:
    def __init__(self):
        host = env().get("BE_DB_HOST")
        port = int(env().get("BE_DB_PORT"))
        db = env().get("BE_DB_NAME")
        password = env().get("BE_DB_PASSWORD")
        user = env().get("BE_DB_USER")
        auth_uri = f''
        if password and user:
            auth_uri = f'{user}:{password}@'
        mongo_uri = f'mongodb://{auth_uri}{host}:{port}/admin'
        self._client = MongoClient(mongo_uri)
        self._db = self._client[db]
        self._config = self._db[f"config_{env().get('BE_ENV')}"]
        if not self._config.find_one({'id': 'config'}):
            self._config.insert_one({'id': 'config'})
        self._chats = self._db["chats"]
        pass


def convert_cursors_to_list(cursors):
    collection_list = []
    for cursor in cursors:
        new_elem = {**cursor, "_id": str(cursor["_id"])}
        collection_list.append(new_elem)
    return collection_list


Mongo = MongoInstance()
