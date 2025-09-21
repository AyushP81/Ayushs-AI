

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").lower()

    # Simple rule-based responses
    if "hello" in user_message:
        reply = "Hey Ayush! 👋 Welcome to your AI."
    elif "how are you" in user_message:
        reply = "I'm doing great, thanks for asking! 😃"
    elif "bye" in user_message:
        reply = "Goodbye Ayush! 👋"
    elif "who made you" in user_message:
        reply = "I was created by Ayush Padaruth, the legend himself! 🚀"
    else:
        reply = "Hmm 🤔 I don’t know that yet. Ayush can teach me more!"

    return jsonify({"response": reply})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
