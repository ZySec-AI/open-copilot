from typing import List

from openai import OpenAI
import json

from app.core.config import config
from app.socket import sio
from app.utils.app_enums import LLMMode
from app.core.logging import LoggerConfig

logger = LoggerConfig(__name__).get_logger()


class LLMService:
    def __init__(self, model_name):
        self.model_name = model_name
        self.app_base = None

        if config.mode == LLMMode.ZYSEC.value:
            self.llm = OpenAI(
                    base_url=config.vllm_api_base,
                    api_key=config.openai_api_key,
                )
        elif config.mode == LLMMode.PRIVATE.value:
            print(f'Private mode requires base_url and secret_key: {config.private_base_url}, {config.private_secret_key}, {config.private_model}')
            if not (config.private_base_url and config.private_secret_key and config.private_model):
                raise ValueError('Private mode requires base_url and secret_key')
            self.llm = OpenAI(
                base_url=config.private_base_url,
                api_key=config.private_secret_key,
            )
            self.model_name = config.private_model
        else:
            self.llm = OpenAI(
                api_key=config.private_open_ai_key,
            )

    @staticmethod
    def __get_messages(prompt: str) -> List[dict]:
        return [{'content': prompt, 'role': 'user'}]

    def load_model(self, prompt: str):
        response = self.llm.chat.completions.create(
            model=self.model_name, messages=self.__get_messages(prompt),
            )
        return json.loads(response.json())['choices'][0]['message']['content']

    @staticmethod
    def convert_to_dicts(data: list):
        return [dict(item) for item in data]

    @staticmethod
    def add_retrievals(data: list, retrieval_messages: list, prompt: str):
        for item in data:
            if item['role'] == 'user':
                item['content'] = f'''{prompt}\n\n**Please provide the context needed for your query below,
        and then ask your question:**

    *Context:* {''.join(retrieval_messages)}

    *Your Question:* {item['content']}'''
                break
        return data

    @sio.event
    async def retrieve_openai_response(
            self, conversation_data: list, stream: bool = True,
            user_id: str = None, retrieval_messages: list = None,
            prompt: str = ''
    ):
        self.app_base = config.vllm_api_base

        messages = self.convert_to_dicts(conversation_data)
        if retrieval_messages:
            messages = self.add_retrievals(messages, retrieval_messages, prompt)

        print(messages)
        response = self.llm.chat.completions.create(
            model=self.model_name,
            messages=messages,
            stream=stream
        )
        if stream:
            await self.process_and_respond(response, user_id)
            return None
        else:
            return json.loads(response.json())

    @staticmethod
    async def process_and_respond(response, user_id: str):
        for part in response:
            if part.choices and part.choices[0].delta.content:
                content = part.choices[0].delta.content
                print("Emitting:", content)  # Debug print to confirm data is correct
                await sio.emit(user_id, content)
