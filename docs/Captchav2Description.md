# Captcha v2
The Wetfish Captcha v2 is an opensource captcha solution designed to replace google's recaptcha service for all wetfish related services, as well as provide a convenient option for third parties to wetfish to do the same.

One primary goal is to provide flexible token based authentication to prevent bots from interacting with any given service or web-form. The flexibility in this context is to give a framework for many styles of captchas while remaining implementation agnostic, unlike captcha v1 which requires the host to be using php on their back-end for dynamic web pages, and to a lesser significance, javascript on their front-end.

The other, perhaps more significant goal is to get the captcha in the form of an easily to installable and updatable package to minimize maintenance and human error while also making the project more accessible. 

## API Endpoint
This is the single, central API endpoint for all wetfish services making use of the captcha. Its function is to generate challenges and manage clients by tracking which server (or group of servers) they are using, the client ID and IP address, and their corresponding tokens which are earned through the successful completion of challenges. Tokens are valid for only a certain period of time before a new one must be generated, this period of time is determined by configuration of the per-service application, which will tell the endpoint exactly how long to keep the token valid for.

**Technologies used:**
- nginx
- golang


## Per-Service Application
Each Wetfish service making use of the captcha will have a registered application to interact with the endpoint. This application tracks nothing and simply allows or disallows web-form submissions by passing the information held by the client, such as the client ID, client IP address, and token, to the endpoint and checking if it the endpoint says it is still valid for that client. It will also have a unique, secret, application ID with which to make requests of the captcha endpoint. 

**Technologies used:**
- golang


## Client Captcha
The captcha, which is served by the endpoint, presents an interactive, game-like challenge which can produce many unique tokens. The client has no way of knowing if the token it generates will be valid until it is recognized and validated by the endpoint. Each challenge can produce only one token and is unique every time. There may be multiple possibilites for how a challenge is presented, for example, the challenge may be similar to the captcha v1 fish game, or it could be another kind of game entirely.

**Technologies used:**
- javascript
- json web tokens