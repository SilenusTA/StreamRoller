# AutoPilot
Contents
- [Demo Extension](#demo-extension)
  - [Outgoing channel : "DEMOEXT_CHANNEL"](#outgoing-channel--demoext_channel)
  - [Description](#description)
  - [Features](#features)
    - [Standard Features](#standard-features)
    - [Extended features (working with adminpage extension)](#extended-features-working-with-adminpage-extension)
## Outgoing channel : "AUTOPILOT_CHANNEL"
## Description
This extension handleds triggers and actions in the system. Each extension shares its api via triggers and action it has available.
A trigger is sent on the extensions channel when something happens i.e. disord message sent, obs sceen changed, chat message received
An action is something you can requet from an extension i.e. send chat message, turn on light, check quiz answer.

extensions may also supply default sets of triggers and actions to be registered with the system. These will potentially require other extensions to work. ie the quizbot may have a default set of triggers that will setup the quizbot with the twitchchat extension.

