from dotenv import dotenv_values
from os import getcwd
from os import environ
from pathlib import Path


config = {}


def env():
    return config


def init_env():
    global config
    env_to_load = environ.get("BE_ENV", 'development')
    config = {**dotenv_values(f"{getcwd()}/envs/.env.{env_to_load}")}
    config["BE_PATH"] = f"{getcwd()}"
