from enum import Enum


class LlmType(Enum):
    OPENAI_API = 'openai'
    HUGGINGFACE_API = 'huggingface'
    VLLM_API = 'vllm'


class ContentItemType(Enum):
    PLAY_BOOK = 'playbooks'
    NEWS = 'news'


class ExpertType(Enum):
    APP = 'app'
    CATEGORY = 'category'
    FILE = 'file'


class LLMMode(Enum):
    PRIVATE = 'private'
    OPENAI = 'openai'
    ZYSEC = 'zysec-demo'
