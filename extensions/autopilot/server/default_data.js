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

// these are default triggers so the user has something to look at during startup.
const default_serverData = {
    "__version__": "0.2.3",
    "userPairings": {
        "pairings": [
            {
                "pairingTitle": "",
                "group": "Quiz_1",
                "trigger": {
                    "name": "Quiz",
                    "extension": "macros",
                    "channel": "AUTOPILOT_BE",
                    "messagetype": "trigger_Quiz",
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
                            "type": ""
                        },
                        {
                            "MATCHER_htmlMessage": "1",
                            "htmlMessage": ""
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
                            "platform": "twitch"
                        },
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
                            "platform": "twitch"
                        },
                        {
                            "account": "bot"
                        },
                        {
                            "message": "Quiz timeout: The correct answer was %%answer%%"
                        }
                    ],
                    "paused": false
                },
                "pairingTitle": ""
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
                            "platform": "twitch"
                        },
                        {
                            "account": "bot"
                        },
                        {
                            "message": "Quiz Stopped: The answer was %%answer%%"
                        }
                    ],
                    "paused": false
                },
                "pairingTitle": ""
            },
            {
                "group": "Quiz_1",
                "trigger": {
                    "name": "quizbotIncorrectAnswer",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "trigger_QuizbotIncorrectAnswer",
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
                            "platform": "twitch"
                        },
                        {
                            "account": "bot"
                        },
                        {
                            "message": "@%%user%% \"%%answer%%\" was incorrect"
                        }
                    ],
                    "paused": false
                },
                "pairingTitle": ""
            },
            {
                "group": "Quiz_1",
                "trigger": {
                    "name": "quizbotCorrectAnswer",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "trigger_QuizbotCorrectAnswer",
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
                            "platform": "twitch"
                        },
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
            {
                "pairingTitle": "",
                "group": "Kick_Quizbot_1",
                "trigger": {
                    "name": "Quiz",
                    "extension": "macros",
                    "channel": "AUTOPILOT_BE",
                    "messagetype": "trigger_Quiz",
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
                "group": "Kick_Quizbot_1",
                "trigger": {
                    "name": "TwitchChatChatMessageReceived",
                    "extension": "twitchchat",
                    "channel": "TWITCH_CHAT",
                    "messagetype": "trigger_ChatMessageReceived",
                    "data": [
                        {
                            "MATCHER_type": "1",
                            "type": ""
                        },
                        {
                            "MATCHER_htmlMessage": "1",
                            "htmlMessage": ""
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
                "group": "Kick_Quizbot_1",
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
                    "name": "KickChatSendChatMessage",
                    "extension": "kick",
                    "channel": "KICK_CHANNEL",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "platform": "twitch"
                        },
                        {
                            "triggerActionRef": "2"
                        },
                        {
                            "account": ""
                        },
                        {
                            "message": "%%question%%"
                        }
                    ]
                }
            },
            {
                "group": "Kick_Quizbot_1",
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
                    "name": "KickChatSendChatMessage",
                    "extension": "kick",
                    "channel": "KICK_CHANNEL",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "platform": "twitch"
                        },
                        {
                            "triggerActionRef": "2"
                        },
                        {
                            "account": ""
                        },
                        {
                            "message": "Quiz timeout: The correct answer was %%answer%%"
                        }
                    ]
                },
                "pairingTitle": ""
            },
            {
                "group": "Kick_Quizbot_1",
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
                    "name": "KickChatSendChatMessage",
                    "extension": "kick",
                    "channel": "KICK_CHANNEL",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "platform": "twitch"
                        },
                        {
                            "triggerActionRef": "2"
                        },
                        {
                            "account": ""
                        },
                        {
                            "message": "Quiz Stopped: The answer was %%answer%%"
                        }
                    ]
                },
                "pairingTitle": ""
            },
            {
                "group": "Kick_Quizbot_1",
                "trigger": {
                    "name": "quizbotIncorrectAnswer",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "trigger_QuizbotIncorrectAnswer",
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
                    "name": "KickChatSendChatMessage",
                    "extension": "kick",
                    "channel": "KICK_CHANNEL",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "platform": "twitch"
                        },
                        {
                            "triggerActionRef": "2"
                        },
                        {
                            "account": ""
                        },
                        {
                            "message": "@%%user%% \"%%answer%%\" was incorrect"
                        }
                    ]
                },
                "pairingTitle": ""
            },
            {
                "group": "Kick_Quizbot_1",
                "trigger": {
                    "name": "quizbotCorrectAnswer",
                    "extension": "quizbot",
                    "channel": "QUIZBOT_CHANNEL",
                    "messagetype": "trigger_QuizbotCorrectAnswer",
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
                    "name": "KickChatSendChatMessage",
                    "extension": "kick",
                    "channel": "KICK_CHANNEL",
                    "messagetype": "action_SendChatMessage",
                    "data": [
                        {
                            "platform": "twitch"
                        },
                        {
                            "triggerActionRef": "2"
                        },
                        {
                            "account": ""
                        },
                        {
                            "message": "@%%user%% \"%%answer%%\" is Correct. Well done."
                        }
                    ]
                }
            },
            {
                "pairingTitle": "Handle kick messages from chatbot",
                "group": "KickChatBot_1",
                "trigger": {
                    "name": "Kick message received",
                    "extension": "kick",
                    "channel": "KICK_CHANNEL",
                    "messagetype": "trigger_ChatMessageReceived",
                    "data": [
                        {
                            "MATCHER_type": "1",
                            "type": ""
                        },
                        {
                            "MATCHER_platform": "1",
                            "platform": "kick"
                        },
                        {
                            "MATCHER_htmlMessage": "1",
                            "htmlMessage": ""
                        },
                        {
                            "MATCHER_safeMessage": "1",
                            "safeMessage": ""
                        },
                        {
                            "MATCHER_message": "1",
                            "message": ""
                        },
                        {
                            "MATCHER_sender": "1",
                            "sender": ""
                        },
                        {
                            "MATCHER_id": "1",
                            "id": ""
                        },
                        {
                            "MATCHER_messagetype": "1",
                            "messagetype": ""
                        },
                        {
                            "MATCHER_timestamp": "1",
                            "timestamp": ""
                        },
                        {
                            "MATCHER_senderId": "1",
                            "senderId": ""
                        },
                        {
                            "MATCHER_userRoles": "1",
                            "userRoles": ""
                        },
                        {
                            "MATCHER_senderBadges": "1",
                            "senderBadges": ""
                        },
                        {
                            "MATCHER_color": "1",
                            "color": ""
                        },
                        {
                            "MATCHER_emotes": "1",
                            "emotes": ""
                        },
                        {
                            "MATCHER_triggerActionRef": "1",
                            "triggerActionRef": ""
                        }
                    ],
                    "cooldown": "0"
                },
                "action": {
                    "name": "OpenAIChatbotChatMessageReceived",
                    "extension": "chatbot",
                    "channel": "CHATBOT_CHANNEL",
                    "messagetype": "action_ProcessChatMessage",
                    "data": [
                        {
                            "platform": "%%platform%%"
                        },
                        {
                            "sender": "%%sender%%"
                        },
                        {
                            "message": "%%message%%"
                        },
                        {
                            "triggerActionRef": "%%triggerActionRef%%"
                        },
                        {
                            "engine": ""
                        },
                        {
                            "temperature": ""
                        },
                        {
                            "maxtokens": ""
                        }
                    ]
                }
            }
        ],
        "groups": [
            {
                "name": "Default"
            },
            {
                "name": "Quiz_1"
            },
            {
                "name": "KickChatBot_1"
            },
            {
                "name": "Kick_Quizbot_1"
            }
        ],
        "macrotriggers": {
            "extensionname": "macros",
            "description": "Macros (dummy triggers)",
            "version": "0.2",
            "channel": "AUTOPILOT_BE",
            "triggers": [
                {
                    "name": "Quiz",
                    "description": "Starts/Restarts Quiz",
                    "displaytitle": "Quiz",
                    "extensionname": "autopilot",
                    "messagetype": "trigger_Quiz",
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
