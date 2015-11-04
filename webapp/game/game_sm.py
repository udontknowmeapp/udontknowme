import datetime

from game import Game


class GameStateMachine(object):
    """
    The state machine that takes incomming messages and moves the state properly.
    """

    TIMER_LENGTH = 31  # seconds

    def __init__(self):
        self.game = Game()
        self.states = self.states()
        self.current_state = 'lobby'
        self.timer = None

    def timer_over(self):
        """
            Return None if there is no timer set
            Return True if the timer that was set previously is over
            Return False if the timer that was set previously is not over
        """
        if self.timer:
            if (datetime.datetime.utcnow() - datetime.timedelta(seconds=self.TIMER_LENGTH)) > self.timer:
                self.timer = None
                return True
            else:
                return False
        else:
            return None

    def seconds_left_in_timer(self):
        if self.timer:
            return max(
                0,
                self.TIMER_LENGTH - (datetime.datetime.utcnow() - self.timer).seconds
            )
        else:
            return 0

    def states(self):
        return {
            'lobby': self.state_lobby,
            'intro': self.state_intro,
            'question_ask': self.state_question_ask,
            'question_guess': self.state_question_guess,
            'show_results': self.state_show_results,
            'show_points': self.state_show_points,
        }

    def new_game(self):
        self.game = Game()  # new game
        self.current_state = 'lobby'  # STATE CHANGE
        message = self.blank_message()
        message['state'] = self.current_state
        message['data']['message'] = 'new_game'
        message['data']['players'] = []
        return message

    def blank_message(self):
        """
        All messages will be in this format
        """
        return {
            'state': '',
            'data': {
                'message': None,
                'timer': None,
            },
        }

    def error_message(self, error):
        message = self.blank_message()
        message['state'] = 'error'
        message['data']['error'] = error
        return message

    def read_message(self, message_dict):
        """
            Message should be a dictionary. For player:
            {
                'player_type': 'console' or 'player'
                'player_name': 'name of player' or None,
                'message': 'message',
            }
        """
        # make sure the message has proper attributes
        if sorted(['player_type', 'player_name', 'message']) == sorted(message_dict.keys()):
            player_type = message_dict['player_type']
            player_name = message_dict['player_name']
            message = message_dict['message']
        else:
            return self.message_format_error('Improperly Formatted Message')
        if message == 'identify':
            return self.identify(player_type, player_name, message=message)
        if message == 'new_game':
            return self.new_game()
        else:
            return self.states[self.current_state](player_type=player_type, player_name=player_name, message=message)

    def identify(self, player_type, player_name, message):
        if player_type == 'console':
            return self.states[self.current_state]()
        elif player_type == 'player':
            if self.current_state == 'lobby':
                # let the user register for the game
                return self.states[self.current_state](player_type=player_type, player_name=player_name, message=message)
            else:
                # check if the user is in this game. If she is, pass the current state, else send an error
                if player_name in [player.name for player in self.game.players]:
                    return self.states[self.current_state]()
                else:
                    return self.error_message('The game has already started. No new players can join')
        else:
            return self.message_format_error('Bad Player Type')

    def state_lobby(self, **kwargs):
        # The only job of the lobby is to add players to the game (if the player_type is 'player')
        if kwargs and kwargs['player_type'] == 'player':
            # add this player to the lobby
            if kwargs['player_name'] not in [player.name for player in self.game.players]:
                self.game.add_player(kwargs['player_name'])
            # check if the user has requested for the game to start
            if kwargs['message'] == 'start':
                self.current_state = 'intro'  # STATE CHANGE
                return self.states[self.current_state]()
        message = self.blank_message()
        message['state'] = self.current_state
        message['data']['players'] = [player.name for player in self.game.players]  # this is mostly for the console
        return message

    def state_intro(self, **kwargs):
        # the only message we want to do anything with here is from the conso
        if kwargs and kwargs['player_type'] == 'console':
            if kwargs['message'] == 'intro_complete':
                self.game.setup_questions()  # set the game up
                self.game.go_to_next_question()
                self.current_state = 'question_ask'  # STATE CHANGE
                return self.states[self.current_state]()
        message = self.blank_message()
        message['state'] = self.current_state
        return message

    def state_question_ask(self, **kwargs):
        question = self.game.current_question
        if kwargs and kwargs['player_type'] == 'system':  # the system is telling us the timer is up
            if kwargs['message'] == 'timer_over':
                self.current_state = 'question_guess'  # STATE CHANGE
                return self.states[self.current_state]()
        # TODO this is async code. We shouldn't allow the user to submit after the timer was set and it's timer_over is True
        elif kwargs and kwargs['player_type'] == 'player':  # at this point we're just waiting on players
            player = self.game.get_player_by_name(kwargs['player_name'])
            question.add_answer(player, kwargs['message'])
            if player is question.about_player:
                self.timer = datetime.datetime.utcnow()
            if len(question.answers) == len(self.game.players):
                self.current_state = 'question_guess'  # STATE CHANGE
                self.timer = datetime.datetime.utcnow()
                return self.states[self.current_state]()
        message = self.blank_message()
        message['state'] = self.current_state
        message['data']['about'] = question.about_player.name
        message['data']['question'] = question.question
        message['data']['submitted_answers'] = [answer.player.name for answer in question.answers]
        message['data']['timer'] = self.seconds_left_in_timer()
        return message

    def state_question_guess(self, **kwargs):
        question = self.game.current_question
        if kwargs and kwargs['player_type'] == 'system':  # the system is telling us the timer is up
            if kwargs['message'] == 'timer_over':
                question.award_points()
                self.current_state = 'show_results'  # STATE CHANGE
                return self.states[self.current_state]()
        # This is async code. We shouldn't allow th euser to submit after the timr was set and it's timer_over is True
        elif kwargs and kwargs['player_type'] == 'player':  # at this point we're just waiting on players
            player = self.game.get_player_by_name(kwargs['player_name'])
            question.add_guess(player, kwargs['message'])
            if question.num_guesses() == len(self.game.players) - 1:  # because the user it's about doesn't guess
                self.timer = None
                question.award_points()
                self.current_state = 'show_results'  # STATE CHANGE
                return self.states[self.current_state]()
        message = self.blank_message()
        message['state'] = self.current_state
        message['data']['timer'] = self.seconds_left_in_timer()
        message['data']['answers'] = [
            {
                'answer': answer_string,
                'players': [answer.player.name for answer in filter(lambda answer: answer.answer == answer_string, question.answers)],  # in case multiple users put the same answer
            }
            for answer_string in set([answer.answer for answer in question.answers])  # keep the answer strings unique
        ]
        # TODO THIS IS CRAY
        message['data']['submitted_guesses'] = []
        for player_array in question.guesses.values():
            for player in player_array:
                message['data']['submitted_guesses'].append(player.name)
        return message

    def state_show_results(self, **kwargs):
        question = self.game.current_question
        if kwargs and kwargs['player_type'] == 'console':  # at this point we're just waiting on the console to say it's done
            if kwargs['message'] == 'results_complete':
                self.current_state = 'show_points'  # STATE CHANGE
                return self.states[self.current_state]()
        message = self.blank_message()
        message['state'] = self.current_state
        message['data']['answers'] = [
            {
                'answer': result[1],
                'guessed': result[2],
                'wrote': [result[0]],  # TODO this needs to be fixed if 2 users "wrote" the same thing....
                'truth': False,
            }
            for result in question.who_guessed_what()
        ]
        message['data']['answers'][-1]['truth'] = True
        return message

    def state_show_points(self, **kwargs):
        if kwargs and kwargs['player_type'] == 'console':  # at this point we're just waiting on the console to say it's done
            if kwargs['message'] == 'points_complete':
                self.current_state = 'question_ask'  # STATE CHANGE
                self.game.go_to_next_question()
                return self.states[self.current_state]()
        message = self.blank_message()
        message['state'] = self.current_state
        message['data']['points'] = [
            {
                'player': player.name,
                'points': player.points,
            }
            for player in self.game.players_sorted_by_points()
        ]
        return message
