from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html", theme="light")


if __name__ == "__main__":
    app.run(port=8000)