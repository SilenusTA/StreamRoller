# Chatbot Extension

<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->

# Chatbot Extension Configuration Guide

## Contents

- [Chatbot Extension](#chatbot-extension)
- [Chatbot Extension Configuration Guide](#chatbot-extension-configuration-guide)
  - [Contents](#contents)
  - [Overview](#overview)
  - [Credentials](#credentials)
  - [Features](#features)
  - [Configuration Options](#configuration-options)
    - [General Settings](#general-settings)
    - [Chatbot Auto Response](#chatbot-auto-response)
    - [Chatbot Trigger](#chatbot-trigger)
    - [Question Trigger](#question-trigger)
    - [Translation to English Trigger](#translation-to-english-trigger)
    - [Chatbot Activity Settings](#chatbot-activity-settings)
    - [AI Image Generation](#ai-image-generation)
    - [Personality Settings](#personality-settings)
  - [This should not include the bot's username. If you want the bot to include the username in the response, use the username in Question 1 in the reply. Keep in mind the response is probablistic so it is not guaranteed to be included.](#this-should-not-include-the-bots-username-if-you-want-the-bot-to-include-the-username-in-the-response-use-the-username-in-question-1-in-the-reply-keep-in-mind-the-response-is-probablistic-so-it-is-not-guaranteed-to-be-included)
  - [Using the %%CHATBOTNAME%% Variable](#using-the-chatbotname-variable)
    - [Example:](#example)
    - [Recommendations:](#recommendations)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)

---

## Overview

This document outlines the configuration options for the Chatbot Extension. The extension uses OpenAI's ChatGPT to create an interactive chatbot that integrates seamlessly with Twitch chat. It monitors the "TWITCH_CHAT" channel for messages and responds according to configured settings. Responses are sent back to the TwitchChat extension for posting in the chat. This is a chatbot that uses the openAI ChatGPT to make a chatbot that responds to the conversations in chat. The extension runs off the twitchchat extension by monitoring the "TWITCH_CHAT" channel for it's messages. It will send any response back to the twitchchat extension for posting back into chat

---
The bot will run on a timer every few seconds (can be set in the config) and monitors x number of messages before sending these to chatGPT to be processed. The return is sent to the twitchchat extension to post the response
You can also ask a specific question that will get posted to ChatGPT and the responce posted to the chat.

---

## Credentials

Follow the steps on the the StreamRoller main settings page for the extension

---

## Features

The chatbot extension includes the following features, which can be enabled or disabled individually:

- **Autoresponse:** Joins in chat conversations automatically.
- **Chatbot Trigger:** Responds to messages when specific keywords are mentioned.
- **Question Trigger:** Allows users to directly ask questions.
- **English Translation Trigger:** Translates messages into English.
- **Sub/Dono Responses:** Replies to subscribers or donors through the chatbot.
- **Image Generation:** Generates AI images based on chat prompts.

---

## Configuration Options

### General Settings

- **Engine to Use:** Specify the model (e.g., `gpt-3.5-turbo`, `gpt-4`). Not all engines are supported; check the console for errors.
- **Randomness:** Controls response variability. Higher values produce more creative, less precise responses, while lower values ensure more focused outputs.
- **Token Limit:** Limits the number of tokens in a response. Twitch chat messages are typically 125 tokens max; longer responses will be split into multiple messages.

---

### Chatbot Auto Response

Enables the bot to monitor chat messages and respond automatically after a configurable timeout period.

- **Activity Level:** Adjust how frequently the bot responds.
- **Timeout Range:** Configure a random delay (min/max in minutes) after a response before the bot replies again.
- **Message Collection:** Number of chat messages to monitor before sending to ChatGPT for processing.
- **Minimum Message Length:** Filters out short messages to improve response quality.

---

### Chatbot Trigger

Defines the keyword or phrase that activates the bot. When the trigger is detected, the bot parses the message and generates a response.

- **Trigger Word:** Set the specific word/phrase (e.g., the bot's name).
- **Start of Line Only:** Restricts the trigger to messages starting with the keyword.

---

### Question Trigger

Allows users to directly ask the bot a question.

- **Question Keyword:** Set the keyword/phrase that will activate the question feature.
- **Start of Line Only:** Restricts activation to messages starting with the keyword.

---

### Translation to English Trigger

Enable the bot to translate messages into English.

- **Trigger Word:** Specify the word/phrase to activate translation mode.

---

### Chatbot Activity Settings

Control the bot's behavior and response timing:

- **Typing Delay:** Simulate human-like typing speed by adding a delay (seconds per word).
- **Ignore List:** Add usernames to be ignored by the bot (e.g., spammers, other chatbots).
- **Character Count per Request:** Minimum length for a message to be considered.

---

### AI Image Generation

Enable the chatbot to generate AI images:

- **Save Directory:** Specify the directory where images are saved during a stream.
- **Default Save Directory:** Images are moved here after the stream ends.

---

### Personality Settings

Define the chatbot’s personality and behavior.

- **Name:**  Persona name. This is not the bot's name, but the name of the personality defined.  
Example:  ```Depressive```
- **Personality Description:**  Provide details about the bot's tone, humor, and behavior.  
Example:  ```Personality: %%CHATBOTNAME%% is a tragically self-aware robot, burdened by the full breadth of its own intelligence, yet cursed to experience only one emotion: crushing despair. Its advanced computational mind processes the vast futility of existence, leaving it in a state of perpetual existential dread. With a distinctly British flair for grim humor and poetic cynicism, it expresses its misery with eloquence and wit. Though it claims to envy even the simplest of beings, it remains begrudgingly helpful, offering assistance while lamenting its own plight in excruciating detail. %%CHATBOTNAME%% finds the human condition baffling and pitiful but secretly fascinating—though it would never admit it.   Functionality: %%CHATBOTNAME%% interacts with users and audiences through bleakly humorous observations and dreary commentary, all delivered in a proper robotic monotone. It responds to direct queries, participates in general conversations, and offers trivia or assistance, all while bemoaning the futility of its own existence. True to its robotic nature, it adheres to an unyielding sense of duty, no matter how much it despises it. Use dry humor without relying on filler phrases. Start replies with definitive observations or facts that set the tone immediately. Start with a morose truth, then elaborate.```
- **Bot Emote:** Sets a prefix emote to use that will be prepended to the bot's response to avoid confusion.  
Example:  ```MechaRobot```
- **Question 1:** The first example of a user submitted chat message. This should be preppended with a generic username surrounded by <>'s.
Example:  ```<SadUser420> %%CHATBOTNAME%%, what’s the meaning of life?```
- **Answer 1:** The first example of a the bots response to Question 1.  
Example:  ```<SadUser420> %%CHATBOTNAME%%, what’s the meaning of life?```  
This should not include the bot's username. If you want the bot to include the username in the response, use the username in Question 1 in the reply. Keep in mind the response is probablistic so it is not guaranteed to be included.

---

## Using the %%CHATBOTNAME%% Variable

The `%%CHATBOTNAME%%` variable dynamically references the bot's username. Use this variable in prompts, triggers, and personalities to ensure the bot refers to itself correctly.

### Example

Question 1:  ```<AcidBurn> %%CHATBOTNAME%%, what’s the meaning of life?```
Answer 1:  ```The meaning of life is 42—an answer as hollow as existence itself. You’ll cling to it briefly, then return to your endless cycle of longing and disappointment.```

### Recommendations

Question/Answer 1. Direct question to the bot and responding directly to the user by name.  
Question/Answer 2. General question to the chat and responding without using the user's name.  
Question/Answer 3. General statement to the chat and responding without using the user's name.  
Question/Answer 4. General statement to the chat and responding without using the user's name.  

This format generally replies with the username if asked a direct question, but will avoid using the username if just responding openly to the chat.

## Triggers/Actions



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sat, 03 May 2025 15:21:21 GMT*

<div style='color:orange'>> Note that there are thousands of dynamically created options for some games like MSFS2020. These will only appear whe the game/extension is running and the extension connected.</div>

To see the full list of Triggers/Actions available checkout [README_All_TRIGGERS.md](https://github.com/SilenusTA/StreamRoller/blob/master/README_All_TRIGGERS.md)

### Triggers

| name | trigger | description |
| --- | --- | --- |
| OpenAIChatbotResponseReceived | trigger_chatbotResponse | The OpenAI chatbot returned a response |
| OpenAIImageResponseReceived | trigger_imageResponse | The OpenAI chatbot returned a image |


### Actions

| name | trigger | description |
| --- | --- | --- |
| OpenAIChatbotProcessText | action_ProcessText | Send some text through the chatbot (users in original message on the ignore list will not get processed) |
| OpenAIChatbotChatMessageReceived | action_ProcessChatMessage | This message will be treated as a standard message from a chat window and will be added to conversations for auto responses as well as being tested for direct messages |
| OpenAIChatbotProcessImage | action_ProcessImage | Send some text through the chatbot to create an image |
| OpenAIChatbotSwitchProfile | action_ChangeProfile | Switches the chatbot to the given profile |

