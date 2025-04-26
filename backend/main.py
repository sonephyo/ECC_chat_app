from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

@app.route("/")
def hello():
    return "Hello, this is the Flask-SocketIO server."

@socketio.on("message")
def handle_message(data):
    print(f"Received message: {data}")
    emit("response", f"Server received: {data}", broadcast=True)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
