import socketio

sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode='asgi')


def create_socket_app(app):
    socket_app = socketio.ASGIApp(sio)
    app.mount("/", socket_app)


@sio.event
async def connect(sid, environ):
    print("New Client Connected: ", sid)


@sio.event
async def disconnect(sid):
    print("Client Disconnected: ", sid)
