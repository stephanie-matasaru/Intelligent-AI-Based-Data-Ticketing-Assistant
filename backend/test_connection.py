# test_connection.py
import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

def test_connection():
    client = AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_MODEL_KEY"),
        api_version="2025-04-01-preview"
    )

    print("Client created. Sending test message...")

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "user", "content": "Say hello in one word."}
        ],
        max_completion_tokens=50
    )

    print("Response:", response.choices[0].message.content)
    print("Model used:", response.model)
    print("Tokens used:", response.usage.total_tokens)

if __name__ == "__main__":
    test_connection()