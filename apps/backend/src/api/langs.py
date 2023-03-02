from flask import Blueprint, jsonify
from glob import glob
from flask_cors import cross_origin
from utilities.env import env
from json import load

langs_api = Blueprint("langs", __name__)


@langs_api.route("/load", methods=["GET"])
@cross_origin()
def openai_get_method():
    try:
        lang_json_paths = glob(f'{env().get("BE_PATH")}/statics/langs/*.json')
        translations = {}
        for lang_path in lang_json_paths:
            with open(lang_path, 'r') as json_file:
                json_lang_file = load(json_file)
                lang = lang_path.split('/')[-1].replace('.json', '')
                translations[lang] = {'translation': json_lang_file.get('frontend', {})}
        return jsonify({"data": {"translations": translations}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
