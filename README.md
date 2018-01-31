# MiNotificador

POC notification manager for Coinigy.

## Goals ##

* set alerts
  - +/- targets
* reset alerts after hit
  - polling/websockets
  - resets the alert specific amount of times
* browser notifications
* smart alerts
  - only set an alert once thresholds are meet
    + i.e. "once it falls past X, alert me on the retracement at Y"
  - polling/websockets
* new coins on an exchange