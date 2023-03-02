from flask import Blueprint, jsonify, request
from utilities.mongo import Mongo, convert_cursors_to_list
from bson.objectid import ObjectId
from datetime import datetime, timezone
from utilities.misc import global_strftime
from utilities.lang import translate
from utilities.env import env
from flask_cors import cross_origin

chat_api = Blueprint("chat", __name__)


def has_messages_with_length_one(lst):
    for obj in lst:
        if "messages" in obj and len(obj["messages"]) == 1:
            return True
    return False


@chat_api.route("/new", methods=["POST"])
@cross_origin()
def chat_post_method():
    turbo = int(request.args.get('turbo', '0')) == 1
    lang = request.args.get("lang", env().get("BE_DEFAULT_LANG"))
    openai_api_key = (
        Mongo._config.find_one().get("openai_api_key", None)
        if Mongo._config.find_one()
        else None
    )
    if not openai_api_key:
        return jsonify({"error": "OPENAI.NO_API_KEY"}), 401
    try:
        chats = Mongo._chats.find(
            {}, {"usages": 0, "_id": 0, "created_at": 0, "title": 0}
        )
        if has_messages_with_length_one(list(chats)):
            return (
                jsonify({"error": "CHAT.CANNOT_CREATE_NEW_EMPTY_CHAT_EXISTING_ONE"}),
                500,
            )
        first_message = translate("backend.chat.welcome", lang)
        if turbo:
            first_message = translate("backend.chat.welcome_turbo", lang)
        date = str(datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
        chat_object = {
            "created_at": date,
            "title": "",
            "is_turbo": turbo,
            "messages": [
                {"to_exclude": True, "bot": first_message, "bot_datetime": date}
            ],
            "usage": {
                "total_tokens": 0,
                "total_tokens_prompt": 0,
                "total_tokens_completion": 0,
            },
        }

        Mongo._chats.insert_one(chat_object)
        return chat_get_method()
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chat_api.route("/load", methods=["GET"])
@cross_origin()
def chat_get_method():
    try:
        chat_cursor = Mongo._chats.find(
            {},
            {"messages": 0, "usages": 0},
        )
        chat_list = convert_cursors_to_list(chat_cursor)
        return jsonify({"data": {"chats": chat_list}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chat_api.route("/load/<string:id>", methods=["GET"])
@cross_origin()
def chat_single_get_method(id):
    try:
        chat_cursor = Mongo._chats.find_one(
            {"_id": ObjectId(id)},
        )
        if not chat_cursor:
            return jsonify({"error": "CHAT.NO_CHAT_FOUND"}), 404
        chat = {
            **chat_cursor,
            "messages": sorted(
                chat_cursor["messages"],
                key=lambda message: global_strftime(message["bot_datetime"]),
            ),
            "_id": str(chat_cursor["_id"]),
        }
        return jsonify({"data": {"chat": chat}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chat_api.route("/delete/<string:id>", methods=["DELETE"])
@cross_origin()
def chat_put_method(id):
    try:
        chat_cursor = Mongo._chats.find_one_and_delete(
            {"_id": ObjectId(id)},
            {"usages": 0},
        )
        if not chat_cursor:
            return jsonify({"error": "CHAT.NO_CHAT_FOUND"}), 404
        return jsonify({"msg": "OK"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
