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

Note: The location these files are stored should match the 'root' file path in your website's nginx configuration. 
(i.e. /etc/nginx/conf.d/'your website'.conf for CentOS 7)

### NGINX Setup
Assuming the rest of your website is already configured for nginx, adding the following block to your server's config will enable your site to run the php necessary for the captcha.

```
    location ~ \.php$ {
        include fastcgi.conf;
        fastcgi_pass   127.0.0.1:9000;
        include        fastcgi_params;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    }

```

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

### Detecting captcha success
Upon a successful completion of the captcha by a user, the 'captchaSuccess' session variable will be set to TRUE. You can use your own php logic to watch for this and react accordingly (i.e. allow a form submission, sing happy birthday, etc).
