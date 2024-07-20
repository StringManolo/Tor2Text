const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const { URL } = require('url');
const basicAuth = require('basic-auth');

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const serverAddress = "127.0.0.1";
const serverPort = 8525;

const execPromise = promisify(exec);
const run = async command => {
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr)
      return stderr;

    return stdout;
  } catch(error) {
    throw error;
  }
}

/* // Doing encodeURIComponent directly. 
const secureURL = url => {
  try {
    url = url.replace(/^\s+|\s+$/g, "").split(".").splice(1).join(".").trim();
    const parsedURL = new URL(url);

    return `${encodeURIComponent(parsedURL.protocol)}//${encodeURIComponent(parsedURL.host)}${encodeURIComponent(parsedURL.pathname)}${encodeURIComponent(parsedURL.search)}${encodeURIComponent(parsedURL.hash)}`;
  } catch (error) {
    return "";
  }
}
*/

const textToHtml = (text, originalURL) => {
  const parseReferences = (text) => {
    let references = '';
    let numOfReferences = 0;

    try {
      const refSection = text.split('References')[1];
      if (refSection) {
        references = refSection.split('\n').slice(1).join('\n').trim();
        numOfReferences = references.split('\n').length;
      }
    } catch (err) {
      // pass
    }

    return { references, numOfReferences };
  };

  const { references, numOfReferences } = parseReferences(text);

  // Lynx generate different outputs
  const hasHiddenLinks = text.includes('#[1]') ? 1 : 0; 

  let htmlText = text;
  if (numOfReferences > 0) {
    const auxRef = references.split('\n').map(line => line.trim());

    for (let i = 0; i < numOfReferences; ++i) {
      const refUrl = auxRef[i].replace(/^\d+\.\s*/, '').trim();
      htmlText = htmlText.replace(`[${i + 1 - hasHiddenLinks}]`, `<br><a href="http://${serverAddress}:${serverPort}/url/${encodeURIComponent(refUrl)}">PROXY LINK:</a>`);
    }
  }
  
  htmlText = htmlText.replace(/(\r\n|\n|\r)/g, '<br>');

  const textWithoutReferences = htmlText.substring(0, htmlText.lastIndexOf("References")).trim()
    .split('<br>').filter(line => !line.includes('#[1]')).join('<br>');

  let htmlTitle = "Tor2Text";
  let htmlURL = "for the requested website";
  try {
    htmlTitle += ` - ${new URL(originalURL).hostname}`;
    htmlURL = new URL(originalURL).href;
  } catch (e) {
    // pass
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="data:;base64,iVBORw0KGgo=">
  <title>${htmlTitle}</title>
  <meta name="theme-color" content="#ffffff">
</head>
<body>
  <section>
    <article id="title">
      <h1>Showing The URL ${htmlURL}</h1>
    </article>
    <article id="response">
      ${textWithoutReferences}
    </article>
  </section>
</body>
</html>`;
};




// Avoid LFI, RFI, Directory Listing, etc.
const forceProtocol = (url) => (!/^https?:\/\//i.test(url)) ? `https://${url}` : url;
   
const app = express();


//TODO: Just some Basic Auth to avoid random webpages making tor requests or mapping internal network

let username;
let password;

if (process.argv.length !== 6) {
  console.log("Auth is disbled. Add -u myUser -p myPassword to use Auth.");
}

const auth = (req, res, next) => {
  const p = process.argv;
  if (p.length === 6) {
    // Log here requests if u want
    // console.log("Auth requested");
    if (p[2] === "-p" || p[2] === "--password" || p[2] === "password") {
      password = p[3];
      username = p[5];
    } else {
      password = p[5];
      username = p[3];
    }

    if (!password || !username) {
      console.log("Auth is disbled. Add -u myUser -p myPassword to use Auth.");
      return next();
    }

    const user = basicAuth(req);

    if (user && user.name === username && user.pass === password) {
      return next();
    } else {
     res.set('WWW-Authenticate', 'Basic realm="example"');
     return res.status(401).send('Authentication required.');
    }
  } else {
    return next();
  }
}


app.get('/url/*', auth, async (req, res) => {
    // Prevent command injection
    const requestedUrl = req.params[0]?.replace(/'/g, "%27");

    let response = "";

    // TODO' Test Tor is installed (check bin)
    // TODO: Test Tor is running (check process)
    // TODO: Test Lynx is installed 
    // TODO: Test Lynx Works Fine
    // TODO: Test at least 1 Tor Random Address is reachable
    try {
      response = await run(`lynx -useragent='${userAgent}' -socks5_proxy=127.0.0.1:9050 --dump '${forceProtocol(requestedUrl)}' 2>/dev/null`);
      response = textToHtml(response, requestedUrl);
    } catch (err) {
      try {
        response = err.stderr;
      } catch(e) {
        response = err;
      }
    }

    res.send(response);
});



const getBaseDomain = url => {
  try {
    url = new URL(url);
    return `${url.protocol}//${url.hostname}`;
  } catch (e) {
    console.error('Invalid URL', e);
    return url?.href || url;
  }
}

app.get('/insecure/*', auth, async (req, res) => {
    // Prevent command injection
    const requestedUrl = req.params[0]?.replace(/'/g, "%27");

    let response = "";

    // TODO' Test Tor is installed (check bin)
    // TODO: Test Tor is running (check process)
    // TODO: Test Lynx is installed 
    // TODO: Test Lynx Works Fine
    // TODO: Test at least 1 Tor Random Address is reachable
    try {
      response = await run(`lynx -useragent='${userAgent}' -socks5_proxy=127.0.0.1:9050 --source '${forceProtocol(requestedUrl)}' 2>/dev/null`);
      const urlRegex = /(?:href|src)="(http[s]?:\/\/[^"]*)"/g;
      let updatedResponse = response.replace(urlRegex, (match, url) => {
        return match.replace(url, `http://${serverAddress}:${serverPort}/insecure/${url}`);
      });


      const relativeUrlRegex = /(?:href|src)="(\/[^"]*)"/g;
      updatedResponse = updatedResponse.replace(relativeUrlRegex, (match, relativeUrl) => {
        return match.replace(relativeUrl, `http://${serverAddress}:${serverPort}/insecure/${getBaseDomain(forceProtocol(requestedUrl))}${relativeUrl}`);
    });
  
      if (!/<base\s+href="[^"]*"/.test(updatedResponse)) {
        updatedResponse = updatedResponse.replace(
          /<\/head>/i,
          `<base href="http://${serverAddress}:${serverPort}/insecure/${forceProtocol(requestedUrl)}"></head>`
        );
      }

      response = updatedResponse;
    } catch (err) {
      try {
        response = err.stderr;
      } catch(e) {
        response = err;
      }
    }

    res.send(response);
});

app.listen(serverPort, serverAddress, () => {
    console.log(`Server URL: http://${serverAddress}:${serverPort}/url/`);
});

