from enum import Enum


class LLMModel(str, Enum):
    LLAMA = "llama3.2"

    QWEN = "qwen3"

    DEEPSEEK = "deepseek-r1"

    GEMMA = "gemma3"