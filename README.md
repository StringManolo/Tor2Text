# Tor2Text

View .onion or regular webpages in your normal browser without revealing your real IP or browser data. No browser configuration required. Compatible with all browsers.  
  
[![Tor2Text](https://img.youtube.com/vi/HNmHtUO6tF4/hqdefault.jpg)](https://www.youtube.com/watch?v=HNmHtUO6tF4)
  
### Why?

- Use Tor on any browser with zero configuration.
- Avoid using Tor Browser, especially on Android, where changing the user-agent is not possible.
- Access .onion domains or any other sites with zero security risk.
- Avoid browser fingerprinting using methods like audio beacons, font rendering, cache poisoning, etc.
- This software is open-source and runs only on your device. It does not use any external servers. You can review the code.

### Usage

#### For Everyone

Simply append the URL after the proxy address:

```http
http://127.0.0.1:8525/url/https://example.com
```

You can use your regular browser, curl, wget, etc.

#### For Experts

There is also an `/insecure/` endpoint. This endpoint allows remote pages to track you in exchange for loading more content than using the `/url/` endpoint.

### Installation

1. Install Git.
2. Clone the repository using `git clone`.
3. Navigate to the Tor2Text folder.
4. Install Lynx.
5. Install Tor.
6. Start Tor.
   - If you need instructions, check the [specifics for your OS here](https://github.com/StringManolo/Tor2Text/#system-specifics).

#### Node

1. Complete the six installation steps above.
2. Install Node.js.
3. Install npm.
4. Navigate to the `node_version` folder.
5. Run `npm install`.
6. Start the application with `node index.js`.
7. Access the URL in your browser. For example:
   - `http://127.0.0.1:8525/url/https://example.com`

#### Other Languages

Not yet available.

### Features

- Basic Authentication

### Notice

- The software has been tested on Termux and should work on any Linux distribution. If it doesn't, please open an issue, and I will address it.

### System Specifics

#### Install on Termux Proot-Distro Alpine Linux

##### For Termux Only

```bash
pkg install proot-distro
proot-distro install alpine
proot-distro login --isolated alpine
```

##### For Alpine Linux in Proot

```bash
apk add git lynx tor nodejs npm
git clone https://github.com/stringmanolo/Tor2Text
cd Tor2Text
tor &
clear
cd node_version
npm install
# You can change the user and password as needed
node index.js -u user -p password
# You can also run it without authentication
# node index.js
# Open in your browser -> http://127.0.0.1:8525/url/https://example.com
# Replace example.com with the webpage you want to visit, including .onion URLs
```

