# Wetfish Captcha Requirements

This document outlines the requirements for the captcha project. The goal is to create simple interactive games that are used to verify a human is using Wetfish, preventing automated spam on the wiki and forums. Up until now reCaptcha v1 has been used on the wiki which is being discontinued at the end of March 2018. Instead of upgrading to reCaptcha v2 and training Google's AI to do image recognition, we've decided to make our own custom captcha solution.

The first captcha game will involve catching wet fish with a net, however developers are encouraged to come up with other simple captcha games and suggest them as issues in this repo.

## Wet Fish Catch
![Example Captcha](./captcha-example.png)

Users will be presented with a sentence explaining the challenge, a small pond filled with swimming fish of different sizes, and a net. When a user clicks on the net, the net follows their cursor around the page. When the net is covering a fish there will be an indicator that the user must continue covering the fish for a short period.

On each request a challenge will be randomly selected, and random starting positions, sizes, and patterns will be generated. Examples of possible challenges include:
 - Catch the biggest fish
 - Catch the smallest fish
 - Catch the striped fish


### Server-side

The server must generate randomized positions for fish and handle collision detection.

[More details coming soon]

### Client-side

The client side would be a simple interface that displays fish and a net.

[More details coming soon]
