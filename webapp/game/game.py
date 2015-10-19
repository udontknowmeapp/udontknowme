import random

from questions_list import QUESTIONS_LIST


class Player(object):
    """
    Represents a player
    """

    def __init__(self, name):
        self.name = name
        self.points = 0


class Answer(object):
    """
    A response from a player
    """

    def __init__(self, player, answer):
        self.player = player
        self.answer = answer


class Question(object):
    """
    TODO
    """

    def __init__(self, question, about_player, players, points_for_tricking, points_for_guessing_correctly):
        self.question = question
        self.about_player = about_player
        self.players = []
        self.points_for_tricking = points_for_tricking
        self.points_for_guessing_correctly = points_for_guessing_correctly
        self.answers = []
        self.guesses = {}

    def add_answer(self, player, answer):
        answer_obj = Answer(player, answer)
        self.answers.append(answer_obj)
        self.guesses[answer_obj] = []

    def add_guess(self, player, answer):
        answer_obj = filter(lambda answer_in: answer_in.answer == answer, self.answers)[0]
        if answer_obj.player is not player:  # players can't guess their answer
            self.guesses[answer_obj].append(player)

    def num_guesses(self):
        count = 0
        for guess_bunch in self.guesses.values():
            count += len(guess_bunch)
        return count

    def answers_list(self):
        return [
            (answer.answer, answer.player)
            for answer in self.answers
        ]

    def who_guessed_what(self):
        answer_by_about_player = filter(lambda x: x.player is self.about_player, self.answers)[0]
        answers = [
            [answer.player.name, answer.answer, [player.name for player in self.guesses[answer]]]
            for answer in filter(lambda x: x.player is not self.about_player, self.answers)
        ]
        answers.sort(key=lambda x: len(x[1])) # sort by the number of people who guessed
        # make the answer from the about player last
        answers.append(
            [answer_by_about_player.player.name, answer_by_about_player.answer, [player.name for player in self.guesses[answer_by_about_player]]]
        )
        return answers

    def award_points(self):
        for answer in self.guesses:
            if answer.player is self.about_player:
                for player_who_guessed_correctly in self.guesses[answer]:  # award points to these players
                    player_who_guessed_correctly.points += self.points_for_guessing_correctly
                answer.player.points += self.points_for_guessing_correctly * len(self.guesses[answer])
            else:  # these answers were tricks, only award the trickster
                answer.player.points += self.points_for_tricking * len(self.guesses[answer])


class Game(object):
    """
    State Machine For Our Game
    """

    def __init__(self):
        self.players = []
        self.questions = []
        self.question_index = -1

    @property
    def current_question(self):
        return self.questions[self.question_index]

    def add_player(self, player):
        player_obj = Player(player)
        self.players.append(player_obj)

    def add_players(self, players):
        for player in players:
            player_obj = Player(player)
            self.add_player(player_obj)

    def get_player_by_name(self, player_name):
        """Return a player object from a player name"""
        return filter(lambda player: player.name == player_name, self.players)[0]

    def setup_questions(self):
        # setup each rounds questions and who they will be asked to
        random.shuffle(QUESTIONS_LIST)
        self.questions = [
            Question(QUESTIONS_LIST.pop(), player, self.players, 500, 1000)
            for player in self.players + self.players  # we're letting every player have 2 questions about them
        ]

    def go_to_next_question(self):
        self.question_index += 1
        try:
            return self.questions[self.question_index]
        except IndexError:  # game OVER
            return None

    def players_sorted_by_points(self):
        return sorted(
            self.players,
            key=lambda player: player.points,
            reverse=True
        )
