RC5.8.7.23 — participant vote acknowledgement and result consistency
- Prevent duplicate acknowledgement requests while the first write is pending.
- Check an existing acknowledgement before sending another write.
- On write failure, verify whether acknowledgement already exists.
- Persist finalBallots on vote/current at storyteller tally, and use that snapshot on RESULT screens.
- Preserve existing vote clock, screen transition and Firebase rules.
- Tests: node --check vote.js / app.js, ZIP integrity. Live Firebase/multi-device verification is still required.
