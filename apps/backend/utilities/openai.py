import openai
from utilities.lang import translate


def ask_question(question, chat_log=None, engine="davinci", max_tokens=64, lang="it"):
    prompt = f"\n\nDomanda: {question}\nRisposta:"

    if len(chat_log) > 0:
        chat_log_str = "\n".join(chat_log[-5:])
        prompt = f"{chat_log_str}\n\n{translate('backend.chat.question', lang)}: {question}\n{translate('backend.chat.answer', lang)}:"

    completions = openai.Completion.create(
        engine=engine,
        prompt=prompt,
        max_tokens=max_tokens,
        n=1,
        stop=None,
        temperature=0.7,
    )

    message = completions.choices[0].text.strip()
    total_usage = completions["usage"]["total_tokens"]
    usage_prompt = completions["usage"]["prompt_tokens"]
    usage_completion = completions["usage"]["completion_tokens"]
    return message, total_usage, usage_prompt, usage_completion


def find_system(lst, key, value):
    for i, dic in enumerate(lst):
        if dic[key] == value:
            return i
    return -1


def ask_question_turbo(question, chat_log=[], engine="gpt-3.5-turbo"):
    prompt = [
        {
            "role": "user",
            "content": question,
        }
    ]
    if len(chat_log) > 0:
        system_message = chat_log[find_system(chat_log, "role", "system")]
        chat_log = chat_log[-9:]
        if system_message:
            chat_log = [system_message] + chat_log

    messages = chat_log + prompt


    completions = openai.ChatCompletion.create(
        model=engine,
        messages=messages,
        n=1,
        stop=None,
        temperature=0.7,
    )

    message = completions.choices[0]["message"]["content"]
    total_usage = completions["usage"]["total_tokens"]
    usage_prompt = completions["usage"]["prompt_tokens"]
    usage_completion = completions["usage"]["completion_tokens"]
    return message, total_usage, usage_prompt, usage_completion


def remove_exclusion(elem):
    if not elem.get("to_exclude", False):
        return elem


def parse_chat_log(elem, lang):
    return f"{translate('backend.chat.question', lang)}: {elem['user']}\{translate('backend.chat.answer', lang)}: {elem['bot']}"


def parse_chat_log_turbo(elem):
    to_return = (
        [
            {"role": "user", "content": elem["user"]},
            {"role": "assistant", "content": elem["bot"]},
        ]
        if not elem.get("is_context", False)
        else [{"role": "system", "content": elem["user"]}]
    )
    return to_return


def init(api_key):
    openai.api_key = api_key


def validate():
    try:
        openai.Model.list()
        return True
    except:
        return False


def ask(user_input, chat, lang):
    chat_log = list(
        map(
            lambda message_filtered: parse_chat_log(message_filtered, lang),
            filter(lambda message: remove_exclusion(message), chat),
        )
    )
    response, total_usage, usage_prompt, usage_completion = ask_question(
        user_input, chat_log, engine="text-davinci-003", max_tokens=2400, lang=lang
    )
    return response, total_usage, usage_prompt, usage_completion


def ask_turbo(user_input, chat):
    chat_log = list(
        filter(lambda message: remove_exclusion(message), chat),
    )
    new_chat_log = []
    for elem in chat_log:
        for single_elem in parse_chat_log_turbo(elem):
            new_chat_log = new_chat_log + [single_elem]

    response, total_usage, usage_prompt, usage_completion = ask_question_turbo(
        user_input, new_chat_log, engine="gpt-3.5-turbo"
    )
    return response, total_usage, usage_prompt, usage_completion
