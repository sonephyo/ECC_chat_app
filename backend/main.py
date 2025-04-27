from flask import Flask, request
from flask_socketio import SocketIO, emit, send
from flask_cors import CORS

from flask_socketio import join_room, leave_room

from collections import defaultdict

private_rooms = {}
messages = defaultdict(list)
# Create a private room
li = [0]

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")


@app.route("/chat-groups")
def get_chat_groups():
    return {"rooms": list(private_rooms.keys())}


@socketio.on("connect")
def on_connect():
    print("Client connected:", request.sid)


@socketio.on("disconnect")
def handle_disconnect():
    print(f"User {request.sid} disconnected.")


## All listeners
"""
- create_room
- join_room
- leave_room
- send_message
"""


def generate_room_code():
    li[0] += 1
    return str(li[0])


@socketio.on("create_room")
def handle_create_room(data):
    username = data["username"]
    room_code = generate_room_code()

    private_rooms[room_code] = [request.sid]
    join_room(room_code)

    emit("room_created", {"room_code": room_code})
    print(f"{username} created room {room_code}")


# Joining a private room and leaving


@socketio.on("join_room")
def handle_join_room(data):
    username = data["username"]
    room_code = data["room_code"]

    if room_code in private_rooms:
        if len(private_rooms[room_code]) > 2:
            emit("error", {"message": "The room is full."})
        private_rooms[room_code].append(request.sid)
        join_room(room_code)
        emit("user_joined", {room_code: username}, to=room_code)
    else:
        emit("error", {"message": "Invalid room code"})
    print(private_rooms)


# @socketio.on("leave_room")
# def handle_leave_room(data):
#     username = data["username"]
#     room_code = data["room_code"]

#     if room_code in private_rooms:
#         leave_room(room_code)
#         private_rooms[room_code].remove(request.sid)
#         if len(private_rooms[room_code] == 0):
#             del private_rooms[room_code]
#         emit("user_left", {"username": username}, to=room_code)


# handle message send
# @socketio.on("send_message")
# def handle_send_message(data):
#     room_code = data["room_code"]
#     message = data["message"]

#     emit("recieve_message", {"message": message}, to=room_code)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
