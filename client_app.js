/*
 * Requires a client app in Genesys Cloud with the following URL: https://localhost/?langTag={{pcLangTag}}&environment={{pcEnvironment}}
 */

// PureCloud OAuth information
const platformClient = require("platformClient");
const client = platformClient.ApiClient.instance;
const redirectUri = "https://localhost/";

// API instances
const usersApi = new platformClient.UsersApi();

// If we create a premium app, we will be able to create OAuth Client Ids ourselves
let clientIDs = {
  'mypurecloud.ie': '1db38a1e-2398-4435-91f6-d51493e17e23' // EMEA Billing
}

let clientApp = {};

// Will Authenticate through PureCloud and subscribe to User Conversation Notifications
clientApp.setup = function (pcEnv, langTag, html) {
  console.log('pcEnv:', pcEnv);
  console.log('langTag:', langTag);
  clientApp.langTag = langTag;

  // Authenticate via PureCloud
  client.setPersistSettings(true);
  client.setEnvironment(pcEnv);
  client.loginImplicitGrant(clientIDs[pcEnv] || clientIDs["mypurecloud.com"], redirectUri + html, { state: "state" })
    .then((data) => {
      console.log('Data:', data);
      $('#token').text(data.accessToken);

      // Get Details of current User and save to Client App
      return usersApi.getUsersMe();
    })
    .then((userMe) => {
      clientApp.userId = userMe.id;
    })
    .then(() => {
      console.log("Succesfully set-up Client App.");
    })
    .catch((e) => console.error(e));
};

export default clientApp;
