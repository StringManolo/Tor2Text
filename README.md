# Tor2Text
View .Onion or regular Webpages In Your Normal Browser Without revealing your real IP or data about your browser. No browser configuration. Compatible With All Browsers.

[![Tor2Text](https://img.youtube.com/vi/HNmHtUO6tF4/hqdefault.jpg)](https://www.youtube.com/watch?v=HNmHtUO6tF4)



### WHY?
- Use Tor on any browser with zero configuration.
- Avoid Tor Browser, specially in Android where you are unable to even change the user-agent
- Use .onion domains or any other with 0 risk to security
- Avoid fingerprint using weird tricks like audio beacons, font rendering, cache poisoning, etc.
- This software is open source and run only on your device, it does not use any external servers. You can check the code. 


### Usage

##### For everybody
Just type the url after the proxy one:  
http://127.0.0.1:8525/url/https://example.com  
You can use your regular browser, curl, wget, ...
  
##### For Experts
There is also an /insecure endpoint. This endpoints allow remote pages to track you in exchange of loading more content than using the /url endpoint

### Install
1. Install Git
2. Download the repo using git clone
3. Go to the Tor2Text folder
4. Install Lynx
5. Install Tor
6. Run Tor
*. If you don't know how, check the specifics for your OS clicking [HERE](javascript:void(0))


#### Node
1. Do the 6 Install steps
2. Install Node
3. Install npm
4. Go to node_version folder
5. Run npm install
6. Run node index.js
7. Type the url in the browser, Example:  
  - http://127.0.0.1:8525/url/https://example.com

#### Other languages
Not yet


### Features
- Basic Auth


### NOTICE
- The software was tested on Termux. It should work on any Linux distro too. If it dosn't just open an issue and i'll fix it. 


### System Specifics
#### Install on Termux Proot-Distro Alpine Linux
##### For Termux Only
```bash
pkg install proot-distro
proot-distro install alpine
proot-distro login --isolated alpine
```

##### For Alpine Linux in proot
```bash
apk add git lynx tor nodejs npm
git clone https://github.com/stringmanolo/Tor2Text
cd Tor2Text
tor &
clear
cd node_version
npm install
# You can change user and password for whatever you like
node index.js -u user -p password
# You can also run it without Auth 
# node index.js
# Open in your browser -> http://127.0.0.1:8525/url/https://example.com
# You can change example.com for the webpage you want to visit, .onion urls too
```
