# Getting Started Guide
This document details the necessary steps to setting up and using the Wetfish Captcha as a page element on your website.

## Initial setup procedure

### Required software
To run the captcha you will need:
* Git
* PHP 7 or greater
* PHP-GD
* NGINX (this has not yet been tested on Apache, though it should work just as well)

### Downloading the captcha
Simply go to the location the files for your website are stored (i.e. /var/www) and run: 
```
$ git clone https://github.com/wetfish/captcha.git
```
This will download all the files necessary to run the captcha into their correct places.

### Web Server Setup
Assuming the rest of your website is already up and configured, you may still need to configure your website to use php for the captcha to run.

### Adding the captcha element to a webpage
At the top of the webpage's HTML file, simply add:
```html
<script type="text/javascript" src="captcha.js"></script>
```
Your <body> tag should look something like this:
```html
<body onload="captcha()">
```

Then on the place in the page you would like the captcha add:
```html
<div id="captcha"></div>
```
The script will look for this block and insert the captcha into it.

All together it should look something like this
```html
<html>
<meta name="viewport" content="width=435, initial-scale=1.0">
<script type="text/javascript" src="captcha.js"></script>
<body onload="captcha()">
    <div id="captcha"></div>
</body>
</html>
```

### Detecting captcha success
Upon a successful completion of the captcha by a user, the 'captchaSuccess' session variable will be set to TRUE. You can use your own php logic to watch for this and react accordingly (i.e. allow a form submission, sing happy birthday, etc).
