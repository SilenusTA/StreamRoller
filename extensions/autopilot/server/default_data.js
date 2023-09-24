/**
 * Copyright (C) 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// these are defult triggers so the user has something to look at during startup.
const default_serverData = {
    __version__: "0.2.1",
    userPairings: {
        "pairings": [
            {
                "group": "Quiz_1",
                "trigger": {
                    "name": "Start Quiz",
                    "extension": "macros",
                    "channel": "AUTOPILOT_BE",
                    "messagetype": "trigger_startquiz",
                    "data": [],
                    "cooldown": "0"
                },
                "action": {
                    "name": "quizbotStartQuiz",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "action_QuizbotStartQuiz",
                    "data": []
                }
            },
            {
                "group": "Quiz_1",
                "trigger": {
                    "name": "TwitchChatChatMessageReceived",
                    "extension": "twitchchat",
                    "channel": "TWITCH_CHAT",
                    "messagetype": "trigger_ChatMessageReceived",
                    "data": [
                        {
                            "MATCHER_type": "1",
                            "messagetype": ""
                        },
                        {
                            "MATCHER_textMessage": "1",
                            "textMessage": ""
                        },
                        {
                            "MATCHER_sender": "1",
                            "sender": ""
                        },
                        {
                            "MATCHER_message": "3",
                            "message": "!answer"
                        },
                        {
                            "MATCHER_color": "1",
                            "color": ""
                        },
                        {
                            "MATCHER_firstmessage": "1",
                            "firstmessage": ""
                        },
                        {
                            "MATCHER_mod": "1",
                            "mod": ""
                        },
                        {
                            "MATCHER_subscriber": "1",
                            "subscriber": ""
                        },
                        {
                            "MATCHER_vip": "1",
                            "vip": ""
                        }
                    ],
                    "cooldown": "0"
                },
                "action": {
                    "name": "quizbotCheckAnswer",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "action_QuizbotCheckAnswer",
                    "data": [
                        {
                            "user": "%%sender%%"
                        },
                        {
                            "answer": "%%message%%"
                        }
                    ],
                    "paused": false
                }
            },
            {
                "group": "Quiz_1",
                "trigger": {
                    "name": "quizbotQuizStarted",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "trigger_QuizbotQuizStarted",
                    "data": [
                        {
                            "MATCHER_question": "1",
                            "question": ""
                        }
                    ],
                    "cooldown": "0"
                },
                "action": {
                    "name": "TwitchChatSendChatMessage",
                    "extension": "twitchchat",
                    "channel": "TWITCH_CHAT",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "account": "bot"
                        },
                        {
                            "message": "%%question%%"
                        }
                    ],
                    "paused": false
                }
            },
            {
                "group": "Quiz_1",
                "trigger": {
                    "name": "quizbotQuizTimeout",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "trigger_QuizbotQuizTimeout",
                    "data": [
                        {
                            "MATCHER_question": "1",
                            "question": ""
                        },
                        {
                            "MATCHER_answer": "1",
                            "answer": ""
                        }
                    ],
                    "cooldown": "0"
                },
                "action": {
                    "name": "TwitchChatSendChatMessage",
                    "extension": "twitchchat",
                    "channel": "TWITCH_CHAT",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "account": "bot"
                        },
                        {
                            "message": "No one seemed to have an answer for %%question%%. The correct answer was %%answer%%"
                        }
                    ],
                    "paused": false
                }
            },
            {
                "group": "Quiz_1",
                "trigger": {
                    "name": "quizbotQuizStopped",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "trigger_QuizbotQuizStopped",
                    "data": [
                        {
                            "MATCHER_question": "1",
                            "question": ""
                        },
                        {
                            "MATCHER_answer": "1",
                            "answer": ""
                        }
                    ],
                    "cooldown": "0"
                },
                "action": {
                    "name": "TwitchChatSendChatMessage",
                    "extension": "twitchchat",
                    "channel": "TWITCH_CHAT",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "account": "bot"
                        },
                        {
                            "message": "The answer to %%question%%. was %%answer%%"
                        }
                    ],
                    "paused": false
                }
            },
            {
                "group": "Quiz_1",
                "trigger": {
                    "name": "quizbotCorrectAnswer",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "trigger_CorrectAnswer",
                    "data": [
                        {
                            "MATCHER_user": "1",
                            "user": ""
                        },
                        {
                            "MATCHER_question": "1",
                            "question": ""
                        },
                        {
                            "MATCHER_answer": "1",
                            "answer": ""
                        }
                    ],
                    "cooldown": "0"
                },
                "action": {
                    "name": "TwitchChatSendChatMessage",
                    "extension": "twitchchat",
                    "channel": "TWITCH_CHAT",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "account": "bot"
                        },
                        {
                            "message": "@%%user%% \"%%answer%%\" is an incorrect answer for %%question%%"
                        }
                    ],
                    "paused": false
                }
            },
            {
                "group": "Quiz_1",
                "trigger": {
                    "name": "quizbotCorrectAnswer",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "trigger_CorrectAnswer",
                    "data": [
                        {
                            "MATCHER_user": "1",
                            "user": ""
                        },
                        {
                            "MATCHER_question": "1",
                            "question": ""
                        },
                        {
                            "MATCHER_answer": "1",
                            "answer": ""
                        }
                    ],
                    "cooldown": "0"
                },
                "action": {
                    "name": "TwitchChatSendChatMessage",
                    "extension": "twitchchat",
                    "channel": "TWITCH_CHAT",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "account": "bot"
                        },
                        {
                            "message": "@%%user%% \"%%answer%%\" is Correct. Well done."
                        }
                    ],
                    "paused": false
                }
            },
        ],
        "groups": [
            {
                "name": "Default"
            },
            {
                "name": "Quiz_1"
            }
        ],
        "macrotriggers": {
            "extensionname": "macros",
            "description": "Macros (dummy triggers)",
            "version": "0.2",
            "channel": "AUTOPILOT_BE",
            "triggers":
                [
                    {
                        "name": "Start Quiz",
                        "description": "Start the Quiz",
                        "displaytitle": "Triggers the Quiz to startup",
                        "messagetype": "trigger_startquiz",
                        "color": "",
                        "backgroundcolor": "",
                        "image": "medium-m.brands.png"
                    }
                ],
            "actions": []
        }
    }
}
export { default_serverData }