from flask import Flask, render_template, request, redirect, jsonify, url_for
from flask_caching import Cache
from geminiAPICall import ask_gemini, prompt_builder
import os


app = Flask(__name__)
cache = Cache(app)

CACHETIMEOUT = 3600
@app.route("/")
@cache.cached(CACHETIMEOUT)
def home():
    return render_template("home.html", theme="dark")

@app.route("/profile", methods = ["POST"])
def profile():
    global prompt, response, inputCode
    inputCode = request.get_json()
    prompt = prompt_builder(inputCode["code"], inputCode["language"], improveCode = True, )
    prompt=str(prompt)
    response = ask_gemini(prompt)

    # TODO: complete the generation of prompt and response 
    # return redirect("/results")
    print("redirecting")
    return jsonify({"redirect_url" : "/results"})

@app.route("/results")
def result():
    # Build a robust context for the template from the stored `inputCode` and `response`.
    original_code = ""
    language = ""
    if isinstance(inputCode, dict):
        original_code = inputCode.get("code", "")
        language = inputCode.get("language", "")

    corrected_code = ""
    try:
        parsed_response = (response["candidates"][0]["content"]["parts"][0]["text"])
    except Exception as e:
        print(e)
        print(response)
        exit()

    
    parsed_response = parsed_response.removeprefix("[")
    parsed_response = parsed_response.removesuffix("]")
    parsed_response = parsed_response.split("‽")
    language = parsed_response[0]
    corrected_code = parsed_response[1]
    brief_explaination = parsed_response[2]
    optional_improvements = parsed_response[3]

    return render_template(
        "results.html",
        theme="dark",
        inputCode=inputCode,
        original_code=original_code,
        corrected_code=corrected_code,
        language=language,
        explaination=brief_explaination,
        improvements = optional_improvements,
    )




if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
