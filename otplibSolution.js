const axios = require('axios');
const base64 = require('base-64');
const utf8 = require('utf8');
const { totp } = require('otplib');

require('dotenv').config()

const reqJSON = {
    github_url: process.env.REPO_URL,
    contact_email: process.env.EMAIL
}
const stringData = JSON.stringify(reqJSON);

const URL = process.env.SUBMISSION_URL;
const sharedSecret = reqJSON.contact_email + process.env.SECRET;

totp.options = { digits: 10, algorithm: "sha512" , epoch: Date.now()}

const myTotp = totp.generate(sharedSecret);
const isValid = totp.check(myTotp, sharedSecret);

console.log("Token Info:", {myTotp, isValid});

const authStringUTF = reqJSON.contact_email + ":" + myTotp;
const bytes = utf8.encode(authStringUTF);
const encoded = base64.encode(bytes);

console.log("encoded:", encoded);

const createReq = async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic " + encoded
            }
        };

        console.log("Making req", {URL, reqJSON, config});

        const res = await axios.post(URL, stringData, config);
        console.log("sent data",res.data);
    } 
    catch (err) {
        console.error(err.response.data);
    }
};

// createReq();