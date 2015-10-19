import random
import string
import unittest

from game import Game, Player


class TestUDontKnowMe(unittest.TestCase):
    def setUp(self):
        self.brian = Player("Brian")
        self.billy = Player("Billy")
        self.john = Player("John")
        self.jordan = Player("Jordan")
        self.rob = Player("Rob")
        self.all_players = [self.brian, self.billy, self.john, self.jordan, self.rob]  # convenience attribute
        self.udontknowme = Game()

    def test_add_player(self):
        self.udontknowme.add_player(self.brian)
        self.assertTrue(len(self.udontknowme.players) == 1)
        self.assertTrue(self.udontknowme.players[0] is self.brian)
        self.udontknowme.add_player(self.jordan)
        self.assertTrue(len(self.udontknowme.players) == 2)
        self.assertTrue(self.udontknowme.players[1] is self.jordan)

    def test_add_players(self):
        self.udontknowme.add_players([self.brian, self.billy])
        self.assertTrue(len(self.udontknowme.players) == 2)
        self.assertTrue(self.udontknowme.players[0] is self.brian)
        self.assertTrue(self.udontknowme.players[1] is self.billy)

    def test_setup_questions(self):
        self.udontknowme.add_players(self.all_players)
        self.udontknowme.setup_questions()
        self.assertEqual(len(self.udontknowme.questions), 10)  # 2 questions per person
        for player in self.all_players:
            self.assertEqual(
                len(filter(lambda question: question.about_player is player, self.udontknowme.questions)),
                2
            )

    def test_get_next_question(self):
        self.udontknowme.add_players(self.all_players)
        self.udontknowme.setup_questions()
        questions = []
        while True:
            question = self.udontknowme.go_to_next_question()
            if question is not None:
                questions.append(question)
            else:
                break  # make sure we eventually get through all our questions and return None
        self.assertEqual(
            len(questions),
            10
        )

    def test_question_add_answer_and_add_guess_and_num_guesses_and_award_points(self):
        """ This should probably be in a TestQuestion(TestCase) class but I'm being lazy..."""
        self.udontknowme.add_players(self.all_players)
        self.udontknowme.setup_questions()
        question = self.udontknowme.go_to_next_question()
        about_player = question.about_player
        other_players = filter(lambda player: player is not about_player, self.all_players)
        question.add_answer(
            about_player,
            ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
        )
        for other_player in other_players:
            # http://stackoverflow.com/a/2257449/211496
            random_string = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
            question.add_answer(other_player, random_string)
        self.assertTrue(
            len(question.answers),
            5,
        )
        self.assertTrue(
            len(question.guesses.keys()),
            5,
        )
        # about_player will get other_players[0] and other_players[1] to guess them
        # about_player = 2000 pts
        # other_players[0] = 1000 pts
        # other_players[1] = 1000 pts
        question.add_guess(
            other_players[0], filter(lambda answer: answer.player is about_player, question.answers)[0].answer
        )
        question.add_guess(
            other_players[1], filter(lambda answer: answer.player is about_player, question.answers)[0].answer
        )
        # other_players[0] will get other_players[2] to guess them
        # other_players[0] = 1500 pts
        question.add_guess(
            other_players[2], filter(lambda answer: answer.player is other_players[0], question.answers)[0].answer
        )
        # other_players[2] will get other_players[3] to guess them
        # other_players[2] = 500 pts
        question.add_guess(
            other_players[3], filter(lambda answer: answer.player is other_players[2], question.answers)[0].answer
        )
        self.assertTrue(
            question.num_guesses(),
            4,
        )
        question.award_points()
        # make sure the players have the right pts
        self.assertEqual(
            about_player.points,
            2000,
        )
        self.assertEqual(
            other_players[0].points,
            1500,
        )
        self.assertEqual(
            other_players[1].points,
            1000,
        )
        self.assertEqual(
            other_players[2].points,
            500,
        )
        self.assertEqual(
            other_players[3].points,
            0,
        )

    def test_full_game(self):
        self.udontknowme.add_players(self.all_players)
        self.udontknowme.setup_questions()
        while True:
            question = self.udontknowme.go_to_next_question()
            if question is not None:
                about_player = question.about_player
                other_players = filter(lambda player: player is not about_player, self.all_players)
                question.add_answer(about_player, "brains")
                for other_player in other_players:
                    # http://stackoverflow.com/a/2257449/211496
                    random_string = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
                    question.add_answer(other_player, random_string)
                # about_player will get other_players[0] and other_players[1] to guess them
                # about_player = 2000 pts
                # other_players[0] = 1000 pts
                # other_players[1] = 1000 pts
                question.add_guess(
                    other_players[0], filter(lambda answer: answer.player is about_player, question.answers)[0].answer
                )
                question.add_guess(
                    other_players[1], filter(lambda answer: answer.player is about_player, question.answers)[0].answer
                )
                # other_players[0] will get other_players[2] to guess them
                # other_players[0] = 1500 pts
                question.add_guess(
                    other_players[2], filter(lambda answer: answer.player is other_players[0], question.answers)[0].answer
                )
                # other_players[2] will get other_players[3] to guess them
                # other_players[2] = 500 pts
                question.add_guess(
                    other_players[3], filter(lambda answer: answer.player is other_players[2], question.answers)[0].answer
                )
                question.award_points()
            else:
                break
        # GAME IS OVER
        # TODO - Are these numbers correct? Just did a print to get the values and assumed it worked....
        self.assertEqual(
            self.brian.points,
            16000,
        )
        self.assertEqual(
            self.udontknowme.players_sorted_by_points()[0],
            self.brian,
        )
        self.assertEqual(
            self.billy.points,
            13000,
        )
        self.assertEqual(
            self.udontknowme.players_sorted_by_points()[1],
            self.billy,
        )
        self.assertEqual(
            self.john.points,
            10000,
        )
        self.assertEqual(
            self.udontknowme.players_sorted_by_points()[2],
            self.john,
        )
        self.assertEqual(
            self.jordan.points,
            7000,
        )
        self.assertEqual(
            self.udontknowme.players_sorted_by_points()[3],
            self.jordan,
        )
        self.assertEqual(
            self.rob.points,
            4000,
        )
        self.assertEqual(
            self.udontknowme.players_sorted_by_points()[4],
            self.rob,
        )


if __name__ == '__main__':
    unittest.main()
