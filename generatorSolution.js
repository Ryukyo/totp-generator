const axios = require('axios');
const base64 = require('base-64');
const utf8 = require('utf8');
const hotpTotpGenerator = require('hotp-totp-generator');

require('dotenv').config()

const ReqJSON = {
  github_url: process.env.REPO_URL,
  contact_email: process.env.EMAIL,
};

const stringData = JSON.stringify(ReqJSON);
const URL = process.env.SUBMISSION_URL;
const sharedSecret = ReqJSON.contact_email + process.env.SECRET;

const MyTOTP = hotpTotpGenerator.totp({
  key: sharedSecret,
  T0: 0,
  X: 30,
  algorithm: 'sha512',
  digits: 10,
});

console.log("Token Info:", MyTOTP);

const authStringUTF = ReqJSON.contact_email + ':' + MyTOTP;
const bytes = utf8.encode(authStringUTF);
const encoded = base64.encode(bytes);

console.log("encoded:", encoded);

const createReq = async () => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
         Authorization: 'Basic ' + encoded,
      },
    };

    console.log('Making request', { URL, ReqJSON, config });

    const response = await axios.post(URL, stringData, config);
    console.log(response.data);
  } catch (err) {
    console.error(err.response.data);
  }
};

// createReq();