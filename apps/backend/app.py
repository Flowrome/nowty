from flask import Flask, Blueprint
from flask_cors import CORS
from utilities.env import init_env, env
from utilities.lang import init_langs

init_env()
init_langs()

from src.api.chat import chat_api
from src.api.openai import openai_api
from src.api.message import message_api
from src.api.langs import langs_api

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
app.config["DEBUG"] = env().get("BE_ENV") != "production"

api = Blueprint("api", __name__)


@api.route("/", methods=["GET"])
def test_get_method():
    return f'<h1>Local API Ready with enviroment: {env().get("BE_ENV")}'


app.register_blueprint(api, url_prefix="/api")
app.register_blueprint(chat_api, url_prefix="/api/chat")
app.register_blueprint(openai_api, url_prefix="/api/openai")
app.register_blueprint(message_api, url_prefix="/api/message")
app.register_blueprint(langs_api, url_prefix="/api/langs")
if env().get("BE_ENV") != "production":
    app.run(
        host=env().get("BE_HOST", "0.0.0.0"),
        port=int(env().get("BE_PORT", "3001")),
    )
