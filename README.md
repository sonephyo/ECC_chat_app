# ECC Chat App

A real-time, end-to-end encrypted chat application built with Flask, Socket.IO, and React. This project aims to provide end to end encryption in order to create secure and private communication channels.

## Features

- 🔒 **End-to-End Encryption:** Messages are encrypted using a custom ECC implementation.
- 💬 **Real-Time Chat:** Built with Flask-SocketIO and React for instant messaging.
- 👥 **Private Rooms:** Users can create and join private chat rooms.
- ⚡ **Modern Frontend:** Built with React, TypeScript, TailwindCSS, Shadcn, Socket.io and React Router.
- 🐍 **Python Backend:** Flask API with flask-socketio for real-time communication.

---

## Project Structure

```
ECC_ChatApp/
│
├── backend/           # Flask backend with Socket.IO and ECC logic
│   ├── main.py        # Main Flask app and Socket.IO event handlers
│   ├── Message.py     # Message model/logic
│   ├── requirements.txt
│   └── .venv/         # Python virtual environment
│
├── frontend/          # React frontend
│   ├── app/           # Main app code (components, routes, etc.)
│   │   ├── components/
│   │   │   ├── PrivateMessaging/  # Chat room creation/joining
│   │   │   └── ui/                # Reusable UI components (Shadcn)
│   │   ├── routes/                # Route components (chat, home, etc.)
│   │   └── root.tsx               # App root
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── README.md           # (You are here)
└── logs.md             # Project logs/notes
```

---

## Getting Started

### Backend

1. **Install dependencies:**
    ```bash
    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```

2. **Run the server:**
    ```bash
    python3 main.py
    ```
    The backend will start on `http://localhost:5001`. (Note: please note backend URL for frontend)

### Frontend

1. **Install dependencies:**
    ```bash
    cd frontend
    echo 'VITE_BACKEND_URL=<YOUR_BACKEND_URL>' > .env
    npm install
    ```

2. **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` | \<Your Specified URL>.

---

## Technologies Used

### Backend

- Python, Flask, Flask-SocketIO
- CORS for cross-origin requests
- (Planned) Custom ECC implementation for encryption

### Frontend

- React, TypeScript, React Router
- TailwindCSS for styling
- socket.io-client for real-time communication

---

## ECC Implementation

This project will feature a custom implementation of Elliptic Curve Cryptography (ECC) for secure, end-to-end encrypted messaging. The ECC logic will be implemented from scratch in the backend and integrated into the chat workflow.

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

Let me know if you want to add usage examples, API details, or more about the ECC implementation!
