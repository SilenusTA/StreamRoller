# Chatbot Extension (under construction)
Contents
- [Chatbot Extension (under construction)](#chatbot-extension-under-construction)
  - [Outgoing channel : "None"](#outgoing-channel--none)
  - [Description](#description)
  - [Features](#features)
## Outgoing channel : "None"
## Description
This is a chatbot that uses the openAI ChatGPT to make a chatbot that responds to the conversations in chat. 
The extension runs off the twitchchat extension by monitoring the "TWITCH_CHAT" channel for it's messages

## Features
The bot will run on a timer every few seconds (can be set in the config) and monitors x number of messages before sending these to chatGPT to be processed. The return is sent to the twitchchat extension to post the response
You can also ask a specific question that will get posted to ChatGPT and the responce posted to the chat.

