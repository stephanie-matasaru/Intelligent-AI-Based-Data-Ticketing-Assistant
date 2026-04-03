import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

def get_ai_client():
    return AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_AI"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version="2024-10-21"
    )