RC5.8.7.22 - real participant ballot consistency repair
- Periodically reconcile ballot snapshots with Firebase so storyteller/participants show the same authoritative votes.
- On RESULT screen, do not use local optimistic YES marks; show server-confirmed ballots only.
- Avoid submitting at the last 400 ms of a five-second vote slot.
- Keep clock animation, stage transitions, acknowledgement and Firebase rules unchanged.
Testing: ST + two real participants, vote each once, compare marks/count on all screens, confirm all three and return to day.
