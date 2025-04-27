<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
 # Quizbot Extension
Contents
- [Quizbot Extension](#quizbot-extension)
  - [Outgoing channel : "QUIZBOT\_CHANNEL"](#outgoing-channel--quizbot_channel)
  - [Description](#description)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)
## Outgoing channel : "QUIZBOT_CHANNEL"
## Description
Quizbot will ask questions and check answers

The extension runs on triggers so these will need adding for the bot to do anything. 
An example set of triggers for twitch chat can be seen in the image below.

<img src="https://raw.githubusercontent.com/SilenusTA/StreamRoller/refs/heads/master/extensions/quizbot/exampletriggers.png" title="example quzbot triggers" alt="example quzbot triggers">

## Triggers/Actions


Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sun, 27 Apr 2025 17:21:17 GMT*
                        

<div style='color:red'>
                        > Note that there are thousands of dynamically created options for some games like MSFS2020. These will only appear whe the game/extension is running and the extension connected.
                        To see the full list of Triggers/Actions available checkout [README_All_TRIGGERS.md](https://github.com/SilenusTA/StreamRoller/blob/master/README_All_TRIGGERS.md)</div>

### Triggers

| name | trigger | description |
| --- | --- | --- |
| quizbotQuizStarted | trigger_QuizbotQuizStarted | Quiz was started, restarted or a new question was asked |
| quizbotQuizStopped | trigger_QuizbotQuizStopped | Quiz was stopped |
| quizbotQuizTimeout | trigger_QuizbotQuizTimeout | Quiz Question timedout |
| quizbotIncorrectAnswer | trigger_QuizbotIncorrectAnswer | Someone provided an incorrect answer |
| quizbotCorrectAnswer | trigger_QuizbotCorrectAnswer | Someone answered the quiz question correctly |

### Actions

| name | trigger | description |
| --- | --- | --- |
| quizbotStartQuiz | action_QuizbotStartQuiz | Start, restart or skip current question |
| quizbotStopQuiz | action_QuizbotStopQuiz | Stop the Quiz |
| quizbotCheckAnswer | action_QuizbotCheckAnswer | Check if answer is correct (including chat tag, ie !answer |
