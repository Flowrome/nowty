# Nowty

## What is Nowty

Nowty is a chatbot based on OpenAI APIs (ChatGPT), that let you self host your own chatbot using your api key.

## Why should i self host

The main purpose of Nowty is to provide an alternative to ChatGPT when it's down or to test the limits of OpenAI APIs

## Docker

You can use the `docker-compose.yaml` file to self host it, the project consist in a Frontend made with React and Vite, a Backend made with Flask and Python, and a self hosted MongoDB image.
Download the repository and run inside the root of the project:

- `docker compose up -d --build`

Here's the `docker-compose.yaml` content:
```yaml
version: '3.9'
services:
  nowty_db:
    image: mongo:4.4.19
    restart: unless-stopped
    ports:
      - 27018:27018
    environment:
      MONGO_INITDB_ROOT_USERNAME: <YOUR_DB_USERNAME *Required>
      MONGO_INITDB_ROOT_PASSWORD: <YOUR_DB_PASSWORD *Required>
    volumes:
      - /path/to/your/db/volume:/data/db #if you want to persist your datas
    command: mongod --port 27018 --auth
  nowty_be:
    build:
      context: ./apps/backend
      dockerfile: dockerfile
      args:
        OV_BE_DB_USER: <YOUR_DB_USERNAME *Required>
        OV_BE_DB_PASSWORD: <YOUR_DB_PASSWORD *Required>
        # OV_BE_DB_PORT: 27018
        # OV_BE_DB_HOST: nowty_db
        # OV_BE_HOST: nowty_be
        # OV_BE_PORT: 4538
        # OV_BE_DEFAULT_LANG: en
    ports:
      - 4538:4538
    depends_on:
      - nowty_db
    restart: unless-stopped
  nowty_fe:
    build:
      context: ./apps/frontend
      dockerfile: dockerfile
      args:
        OV_FE_API_BASEURL: http://<YOUR_MACHINE_IP/DOMAIN *Required>:4538/api
        # OV_FE_HOST: 0.0.0.0
        # OV_FE_PORT: 4537
        # OV_FE_DEFAULT_LANG: en
    ports:
      - 4537:4537
    depends_on:
      - nowty_be
    restart: unless-stopped
```


## Which APIs are implemented

- ChatCompletion (model: [gpt-3.5-turbo](https://platform.openai.com/docs/guides/chat/chat-completions-beta))
  - This is the newest APIs from OpenAI, it can be used as a full alternative to ChatGPT
  - What it can do?
    - Can be used as a chatbot for answering to complex question
    - Has basically the same knowledge of ChatGPT
  - What it can't do?
    - It's moderated and it's a beta
- Completion (model: [text-davinci-003](https://platform.openai.com/examples/default-qa))
  - This is the API used for answering to
  - What it can do?
    - Can be used as a chatbot for answering to complex question
    - It's not moderated
  - What it can't do?
    - It costs a little bit more and it could reach the token limit

## Translation files

You can find the translation files under `apps/backend/statics/langs/*.json`, you can also add your language by providing your json file and put in the folder with the language short name like `apps/backend/statics/langs/fr.json`.
The frontend application should use the browser language, if nothing has been found it will rely on the `OV_FE_DEFAULT_LANG` you set in the `docker-compose.yaml` file args
