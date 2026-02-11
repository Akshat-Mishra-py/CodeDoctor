from google import genai
import json


def ask_gemini(prompt: str) -> dict:
    """Call Gemini and return a plain Python dict representing the response.

    This avoids returning Flask response objects so the caller can build
    cards or other UI elements from the raw data.
    """
    client = genai.Client()
    try:
        # If caller passed a dict, convert to JSON string for the model input
        if isinstance(prompt, dict):
            contents = json.dumps(prompt)
        else:
            contents = str(prompt)

        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=contents
        )
    except Exception as e:
        return {"error": "request_failed", "message": str(e)}

    # Try to convert the SDK response to a plain dict.
    try:
        if hasattr(response, "to_dict"):
            return response.to_dict()
        if isinstance(response, dict):
            return response
        # Fallback: attempt JSON round-trip using __dict__ if available
        try:
            return json.loads(json.dumps(response, default=lambda o: getattr(o, "__dict__", str(o))))
        except Exception:
            return {"raw": str(response)}
    except Exception as e:
        return {"error": "serialization_failed", "message": str(e)}


def prompt_builder(code: str, language: str, **kwargs) -> dict:
    """Build a prompt payload as a plain dict.

    Returns a dict containing the code, language, optional kwargs and
    the base prompt text loaded from ./prompt.txt (if present).
    """
    prompt = {"Code": code, "Language": language}
    if kwargs:
        # merge all provided kwargs into the prompt under a single key
        prompt["options"] = kwargs

    try:
        with open("./prompt.txt", "r", encoding="utf-8") as f:
            prompt_text = f.read()
    except FileNotFoundError:
        prompt_text = ""

    prompt["prompt"] = prompt_text
    return prompt