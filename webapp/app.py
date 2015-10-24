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
        print("Message from: {}. Message: {}".format(self, message))
        message_dict = json.loads(message)
        response = UDONTKNOWME.read_message(message_dict)
        print("Game State: {}".format(UDONTKNOWME.current_state))
        for client in CONNECTED_CLIENTS:
            client.write_message(response)

    def on_close(self):
        print("WebSocket closed by: {}".format(self))
        CONNECTED_CLIENTS.remove(self)


def check_if_timer_is_over():
    if UDONTKNOWME.timer_over is True:
        message = {
            'player_type': 'system',
            'message': 'timer_over',
        }
        response = UDONTKNOWME.read_message(message)
        for client in CONNECTED_CLIENTS:
            client.write_message(response)


class UDKMAppHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')


urls = [
    (r"/play", UDKMWebSocket),
    (r"/assets/(.*)", tornado.web.StaticFileHandler, {'path': settings.WEB_STATIC_PATH}),
    (r"/.*", UDKMAppHandler),  # TODO there has to be a better way...
]

application = tornado.web.Application(
    urls,
    debug=settings.DEBUG,
    template_path=settings.WEB_TEMPLATE_PATH
)


if __name__ == "__main__":
    application.listen(settings.PORT)
    timer_callback = tornado.ioloop.PeriodicCallback(
        check_if_timer_is_over,  # callback
        1000, # call every milliseconds
    )
    timer_callback.start()
    tornado.ioloop.IOLoop.current().start()
