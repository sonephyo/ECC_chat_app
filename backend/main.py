from datetime import datetime
from flask import Flask, request
from flask_socketio import SocketIO, emit, send
from flask_cors import CORS
from models.Message import Message
from flask_socketio import join_room, leave_room

from collections import defaultdict

# Temporary Database
private_rooms = {}
private_room_publicKeys = {}
messages = defaultdict(list)
li = [0]

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="eventlet",
)


@app.route("/chat-groups")
def get_chat_groups():
    return {"rooms": list(private_rooms.keys())}


# WebSocket Endpoints
@socketio.on("connect")
def on_connect():
    print("Client connected:", request.sid)


@socketio.on("disconnect")
def handle_disconnect():
    print(f"User {request.sid} disconnected.")


def generate_room_code():
    li[0] += 1
    return str(li[0])


@socketio.on("create_room")
def handle_create_room(data):
    username = data["username"]
    room_code = generate_room_code()

    private_rooms[room_code] = [request.sid]
    private_room_publicKeys[room_code] = {}
    join_room(room_code)
    new_message = Message(
        username="System",
        content=username + " created the room.",
        timestamp=datetime.now().isoformat(),
        encrypted=False,
    )
    messages[room_code].append(new_message)

    emit("room_created", {"room_code": room_code})

    emit("recieve_message", {"messages": Message.serialize_list(messages[room_code])})
    print(f"{username} created room {room_code}")


@socketio.on("join_room")
def handle_join_room(data):
    username = data["username"]
    room_code = data["room_code"]

    if room_code in private_rooms:
        if request.sid in private_rooms[room_code]:
            print(f"{username} (sid: {request.sid}) already in room {room_code}")
            emit("user_joined", {"username": username}, to=request.sid)
            return
        if len(private_rooms[room_code]) == 2:
            emit("error", {"message": "The room is full."})
            return
        private_rooms[room_code].append(request.sid)
        join_room(room_code)
        emit("user_joined", {"username": username}, to=room_code)
        messages[room_code].append(
            Message(
                username="System",
                content=username + " joined the room. ",
                timestamp=datetime.now().isoformat(),
                encrypted=False,
            )
        )
        emit(
            "recieve_message",
            {"messages": Message.serialize_list(messages[room_code])},
            to=room_code,
        )
    else:
        emit("error", {"message": "Invalid room code"})
    print(private_rooms)


@socketio.on("leave_room")
def handle_leave_room(data):
    username = data["username"]
    room_code = data["room_code"]

    if room_code in private_rooms:
        leave_room(room_code)
        private_rooms[room_code].remove(request.sid)
        del private_room_publicKeys[room_code][username]
        if len(private_rooms[room_code]) == 0:
            del private_rooms[room_code]
            del private_room_publicKeys[room_code]

        messages[room_code].append(
            Message(
                username="System",
                content=username + " left the room. ",
                timestamp=datetime.now().isoformat(),
                encrypted=False,
            )
        )

        emit("other_user_left", {"username": username}, to=room_code)
        emit(
            "recieve_message",
            {"messages": Message.serialize_list(messages[room_code])},
            to=room_code,
        )
        print(username, "left the room", room_code)


@socketio.on("send_public_key")
def handle_public_key(data):
    x = data["x"]
    y = data["y"]
    username = data["username"]
    room_code = data["room_code"]

    if room_code not in private_room_publicKeys:
        return
    if (
        room_code in private_room_publicKeys
        and username in private_room_publicKeys[room_code]
    ):
        return

    private_room_publicKeys[room_code][username] = {"x": x, "y": y}
    print("for starting communication", private_room_publicKeys[room_code])
    if len(private_room_publicKeys[room_code]) == 2:
        emit("ready_for_comm", private_room_publicKeys[room_code], to=room_code)


@socketio.on("send_message")
def handle_send_message(data):
    username = data["username"]
    room_code = data["room_code"]
    message = data["message"]

    if request.sid not in private_rooms[room_code]:
        emit("error", {"message": "User should not be sending message here"})

    messages[room_code].append(
        Message(
            username=username,
            content=message,
            timestamp=datetime.now().isoformat(),
            encrypted=True,
        )
    )

    print(messages)

    emit(
        "recieve_message",
        {"messages": Message.serialize_list(messages[room_code])},
        to=room_code,
    )


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
