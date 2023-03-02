from flask import Blueprint, jsonify, request
from utilities.mongo import Mongo
from datetime import datetime, timezone
from src.api.chat import chat_single_get_method
from bson.objectid import ObjectId
from utilities.openai import ask, ask_turbo
from utilities.env import env
from flask_cors import cross_origin
from utilities.lang import translate

message_api = Blueprint("message", __name__)


@message_api.route("/send/<string:chat_id>", methods=["POST"])
@cross_origin()
def message_post_method(chat_id):
    turbo = int(request.args.get("turbo", "0")) == 1
    lang = request.args.get("lang", env().get("BE_DEFAULT_LANG"))
    openai_api_key = (
        Mongo._config.find_one().get("openai_api_key", None)
        if Mongo._config.find_one()
        else None
    )
    if not openai_api_key:
        return jsonify({"error": "OPENAI.NO_API_KEY"}), 401
    try:
        message = request.get_json()["message"]
        date = str(datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
        message_object = {"user": message, "user_datetime": date}
        chat_cursor = Mongo._chats.find_one(
            {"_id": ObjectId(chat_id)},
        )
        if not chat_cursor:
            return jsonify({"error": "CHAT.NO_CHAT_FOUND"}), 404
        response, total_usage, usage_prompt, usage_completion = "", 0, 0, 0
        if turbo:
            set_context = request.get_json().get("set_context", False)
            if set_context and len(chat_cursor["messages"]) < 2:
                message_object["is_context"] = True
                message_object["bot"] = translate("backend.chat.setted_context")
            else:
                response, total_usage, usage_prompt, usage_completion = ask_turbo(
                    message, chat_cursor["messages"]
                )
                message_object["bot"] = response
        else:
            response, total_usage, usage_prompt, usage_completion = ask(
                message, chat_cursor["messages"], lang
            )
            message_object["bot"] = response
        date = str(datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
        message_object["bot_datetime"] = date
        messages = chat_cursor["messages"] + [message_object]
        usages = chat_cursor["usage"]
        to_update_usage = {
            "total_tokens": usages["total_tokens"] + total_usage,
            "total_tokens_prompt": usages["total_tokens_prompt"] + usage_prompt,
            "total_tokens_completion": usages["total_tokens_completion"]
            + usage_completion,
        }
        title = chat_cursor["title"]
        if title == "":
            title = messages[1]["user"]
        Mongo._chats.update_one(
            {"_id": ObjectId(chat_id)},
            {"$set": {"messages": messages, "usage": to_update_usage, "title": title}},
        )
        return chat_single_get_method(chat_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
