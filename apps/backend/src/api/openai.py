from flask import Blueprint, jsonify, request
from utilities.mongo import Mongo
from utilities.openai import init, validate
from flask_cors import cross_origin

openai_api = Blueprint("openai", __name__)


@openai_api.route("/init", methods=["POST"])
@cross_origin()
def openai_post_method():
    api_key = request.get_json()["api_key"]
    try:
        init(api_key)
        if not validate():
            raise Exception('OPENAI.API_KEY_ERROR')
        Mongo._config.update_one({'id': 'config'}, {"$set": {"openai_api_key": api_key}})
        return jsonify({"msg": "OK"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@openai_api.route("/reset", methods=["DELETE"])
@cross_origin()
def openai_delete_method():
    try:
        Mongo._config.update_one({'id': 'config'}, {"$set": {"openai_api_key": None}})
        return jsonify({"msg": "OK"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@openai_api.route("/check", methods=["GET"])
@cross_origin()
def openai_get_method():
    try:
        config = Mongo._config.find_one({'id': 'config'})
        if config.get("openai_api_key", None):
            init(config["openai_api_key"])
            if not validate():
                raise Exception('OPENAI.API_KEY_ERROR')
        else:
            raise Exception("OPENAI.NO_API_KEY")
        return jsonify({"msg": "OK"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
