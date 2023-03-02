from utilities.env import env
from glob import glob
from json import load
from benedict import benedict


config = benedict({})


def lang():
    return config


def translate(path, lang='it', default=None):
    to_return = path
    if default:
        to_return = default
    walker = config[lang]
    if path in walker:
        to_return = walker[path]
    return to_return


def init_langs():
    global config
    langs_to_load = list(
        glob(f'{env().get("BE_PATH")}/statics/langs/*.json'))
    for path in langs_to_load:
        with open(path, 'r') as json_file:
            json_lang_file = load(json_file)
            lang = path.split('/')[-1].replace('.json', '')
            config[lang] = json_lang_file
