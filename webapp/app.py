import json

import tornado.ioloop
import tornado.web
import tornado.websocket

from game.game_sm import GameStateMachine
import settings


UDONTKNOWME = GameStateMachine()
CONNECTED_CLIENTS = []


class UDKMWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("WebSocket opened by: {}".format(self))
        CONNECTED_CLIENTS.append(self)

    def on_message(self, message):
        print("Message from: {}".format(self))
        message_dict = json.loads(message)
        response = UDONTKNOWME.read_message(message_dict)
        print("Game State: {}".format(UDONTKNOWME.current_state))
        for client in CONNECTED_CLIENTS:
            client.write_message(response)

    def on_close(self):
        print("WebSocket closed by: {}".format(self))
        CONNECTED_CLIENTS.remove(self)


class UDKMAppHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')


urls = [
    (r"/play", UDKMWebSocket),
    (r"/", UDKMAppHandler),
    (r"/assets/(.*)", tornado.web.StaticFileHandler, {'path': settings.WEB_STATIC_PATH}),
]

application = tornado.web.Application(
    urls,
    debug=settings.DEBUG,
    template_path=settings.WEB_TEMPLATE_PATH
)


if __name__ == "__main__":
    application.listen(settings.PORT)
    tornado.ioloop.IOLoop.current().start()
