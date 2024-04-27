const qs = require("qs");
const axios = require("axios");


class Functions_related_to_google_authentication{
  // 1. This function will return google-auth-token
  static getGoogleOAuthTokens = async ({code, google_redirect_uri}) => {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: google_redirect_uri,
      grant_type: 'authorization_code'
    }
    
    try{
      const res = await axios.post(url, qs.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      });
      
      return res.data;
    }catch(error){
      console.log(error)
      console.error(`[ ${error}, "Error from functions-related-to-google-auth.js => Failed to fetch google Oauth Tokens" ]`);
    }; 
  }; // End of function getGoogleOAuthTokens
  
  
  
  // This function will return google-user object
  static getGoogleUser = async ({id_token, access_token}) => {
    try{
      const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
        headers:{
         Authorization: `Bearer ${id_token}`
        }
      });
      
      return res.data;
    }catch(error){
      console.log(error);
      console.log(error, "Error fetching Google user")
    }
  }; // End of function getGoogleUser
  
}; // End of class Functions_related_to_google_authentication

module.exports = Functions_related_to_google_authentication;