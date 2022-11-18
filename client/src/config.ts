// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'l6q81a4e81'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-ywmr35qco00i0lnb.us.auth0.com',            // Auth0 domain
  clientId: 'r9tBWetvNFN3c4pwuK1O7brt1mA9sgTU',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
