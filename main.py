from flask import Flask, render_template, request, redirect, jsonify, url_for
from flask_caching import Cache
from geminiAPICall import ask_gemini, prompt_builder

app = Flask(__name__)
cache = Cache(app)

CACHETIMEOUT = 3600
@app.route("/")
@cache.cached(CACHETIMEOUT)
def home():
    return render_template("home.html", theme="dark")

@app.route("/profile", methods = ["POST"])
def profile():
    response = None
    prompt = None
    if request.method == "POST":
        response = request.get_json()
        prompt = prompt_builder(response["code"], response["language"])

    # response = ask_gemini(prompt)
    # TODO: complete the generation of prompt and response 
    return "hello"
    # return jsonify({"redirect_url" : "/waiting"})





if __name__ == "__main__":
    app.run(port=8000, debug=True)