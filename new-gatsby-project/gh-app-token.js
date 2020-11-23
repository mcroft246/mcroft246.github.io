// Helper code to get GITHUB_TOKEN using private key from GitHub app
// Following environment variables required:

// GH_PEM: set to the private key for th GitHub App
// ISSUER_ID: replace with the ID of your github app
// INSTALLATION_ID:

// ToDo: lookup the installation id

const jsonwebtoken = require('jsonwebtoken');
const request = require('request');
const PEM = process.env.GH_PEM;
const APP_ID = process.env.APP_ID;
const INSTALLATION_ID = process.env.INSTALLATION_ID //

function generateJwtToken(issuerId) {
  return jsonwebtoken.sign(
    {
      iat: Math.floor(new Date() / 1000),
      exp: Math.floor(new Date() / 1000) + 600,
      iss: issuerId,
    },
    PEM,
    { algorithm: 'RS256' },
  );
}

function generateAccessToken(jwt, installationId) {
  request.post({
    url: 'https://api.github.com/app/installations/' + installationId + '/access_tokens',
    headers: {
         'Authorization': 'Bearer ' + jwt,
         'User-Agent': 'node'
    },
  },
    (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      // console.log(`statusCode: ${res.statusCode}`)
      console.log(JSON.parse(body).token);
    }
  )
}

jwtToken = generateJwtToken(APP_ID);
generateAccessToken(jwtToken, INSTALLATION_ID);
