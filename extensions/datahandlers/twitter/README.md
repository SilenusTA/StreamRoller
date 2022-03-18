# Twitter
Contents
- [Twitter](#twitter)
  - [Outgoing channel : "TWITTER_CHANNEL"](#outgoing-channel--twitter_channel)
  - [Authorization fields](#authorization-fields)
      - [Field 1](#field-1)
      - [Field 2](#field-2)
      - [Field 3](#field-3)
      - [Field 4](#field-4)
  - [Current features](#current-features)
  - [Sending messages](#sending-messages)
## Outgoing channel : "TWITTER_CHANNEL"
## Authorization fields
#### Field 1
- Name: twitterAPIkey 
- Value: API key
#### Field 2
- Name: twitterAPISecret
- Value: API key secret

#### Field 3
- Name: twitterAccessToken
- Value: Access Token

#### Field 4
- Name: TwitterAccessTokenSecret
- Value: Access Token Secret

## Current features
Curently the twitter extension only allows posting of messages to twitter. It will be upgraded at some point to receive messages and send them out on the channel when I get time to do it.
## Sending messages
Send an extension message of type "PostTweet" to the "twitter" extension with the data field containing the message to be posted.