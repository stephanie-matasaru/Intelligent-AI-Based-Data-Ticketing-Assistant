import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

def get_ai_client():
    return AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_MODEL_KEY"),
        api_version="2025-04-01-preview"
    )