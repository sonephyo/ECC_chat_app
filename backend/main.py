from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = "asdfasdf"
CORS(app, resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/http-call")
def http_call():
    data = {"data": "This text was fetched using an HTTP call to server on render"}
    return jsonify(data)

@socketio.on("connect")
def connected():
    print(request.sid)
    print("Client is connected")
    emit("connect", {"data":f"id: {request.sid is connected}"})


@socketio.on("data")
def handle_message(data):
    print("data from the frontend: ",str(data))
    emit("data", {"data": data, "id": request.sid}, broadcast=True)
    
@socketio.on("disconnect")
def disconnected():
    print("User disconnected")
    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)
    
if __name__ == '__main__':
    socketio.run(app, debug=True)
    
    