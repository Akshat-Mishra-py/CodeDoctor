from flask import Flask, render_template, request
from flask_caching import Cache
app = Flask(__name__)
cache = Cache(app)

CACHETIMEOUT = 3600
@app.route("/")
@cache.cached(CACHETIMEOUT)
def home():
    return render_template("home.html", theme="light")


if __name__ == "__main__":
    app.run(port=8000)