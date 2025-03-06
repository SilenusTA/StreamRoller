<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->

# Twitter

Contents

- [Twitter](#twitter)
  - [Outgoing channel : "TWITTER\_CHANNEL"](#outgoing-channel--twitter_channel)
  - [Authorization fields](#authorization-fields)
    - [Field 1](#field-1)
    - [Field 2](#field-2)
    - [Field 3](#field-3)
    - [Field 4](#field-4)
  - [Current features](#current-features)
  - [Sending messages](#sending-messages)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)
## Outgoing channel : "TWITTER_CHANNEL"

## Authorization fields

### Field 1

- Name: twitterAPIkey
- Value: API key

### Field 2

- Name: twitterAPISecret
- Value: API key secret

### Field 3

- Name: twitterAccessToken
- Value: Access Token

### Field 4

- Name: TwitterAccessTokenSecret
- Value: Access Token Secret

## Current features

Curently the twitter extension only allows posting of messages to twitter. It will be upgraded at some point to receive messages and send them out on the channel when I get time to do it.

## Sending messages

Send an extension message of type "PostTweet" to the "twitter" extension with the data field containing the message to be posted.

## Triggers/Actions



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Thu, 06 Mar 2025 01:18:59 GMT*

### Triggers

| name | trigger | description |
| --- | --- | --- |


### Actions

| name | trigger | description |
| --- | --- | --- |
| TwitterPostTweet | action_PostTweet | Post a message to twtter |

