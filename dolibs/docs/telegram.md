* [telegram.sendMessage()](#telegramsendmessage)
* [telegram.validateToken()](#telegramvalidatetoken)



# telegram.sendMessage()

Check Telegram documentation to [Create a bot and Generating an authorization token](https://core.telegram.org/bots#6-botfather)

### Arguments

* $TELEGRAM_BOT_TOKEN telegram bot token
* $TELEGRAM_NOTIFICATION_ID user receiver telegram id
* $TELEGRAM_MESSAGE message content

### Exit codes

* **0**: Message is sent
* **1**: Error to send the message

### Example

```bash
sendMessage <TELEGRAM_BOT_TOKEN> <TELEGRAM_NOTIFICATION_ID> <TELEGRAM_MESSAGE>
```

# telegram.validateToken()

Validate if the token is valid

### Arguments

* $TELEGRAM_BOT_TOKEN telegram bot token

### Exit codes

* **0**: If token is valid
* **1**: If token is not valid

### Output on stdout

* Token is invalid.

### Example

```bash
validateToken <TELEGRAM_BOT_TOKEN>
```

