from google import genai
from flask import jsonify

def ask_gemini(prompt):
    client = genai.Client()
    response = client.models.generate_content(
    model="gemini-3-flash-preview", contents=prompt
    )
    response = jsonify(response)
    return response

def prompt_builder(code, language, ):
    pass