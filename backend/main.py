from flask import Flask, request
from flask_socketio import SocketIO, emit, send
from flask_cors import CORS

from flask_socketio import join_room, leave_room

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")


@app.route("/")
def hello():
    return "Hello, this is the Flask-SocketIO server."


@socketio.on("connect")
def on_connect():
    print("Client connected:", request.sid)


@socketio.on("disconnect")
def handle_disconnect():
    print(f"User {request.sid} disconnected.")


chat_history = {}


@socketio.on("join")
def on_join(data):
    username = data["username"]
    room = data["room"]
    join_room(room)
    send(username + " has entered the room.", to=room)

    if room in chat_history:
        for message in chat_history[room]:
            emit("receive_message", {"message": message}, to=request.sid)


@socketio.on("leave")
def on_leave(data):
    username = data["username"]
    room = data["room"]
    leave_room(room)
    send(username + " has left the room.", to=room)


@socketio.on("send_message")
def handle_send_message(data):
    message = data["message"]
    room = data["room"]
    if room not in chat_history:
        chat_history[room] = []
    chat_history[room].append(message)

    emit("receive_message", {"message": message}, to=room, broadcast=True)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
