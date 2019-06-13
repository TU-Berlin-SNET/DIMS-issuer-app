import axios from 'axios';
import * as Constants from "./Constants"

//Some API Rest Calls will come here
/* POST /api/credentialoffer
 {
	"recipientDid": "{{prover_issuer_pairwise_did}}",
	"credDefId": "{{cred_def_id}}"
}
*/
export async function sendCredentialOffer(recipientDid, credDefId){
    var headers = {
     'Content-Type': 'application/json',
     'Authorization': localStorage.getItem("token") 
    }
    var payload = {
      'recipientDid': recipientDid,
      'credDefId': credDefId
   }
    axios.post(Constants.apiBaseUrl + 'credentialoffer' ,payload, {headers: headers}).then(function (response) {
     console.log(response);
     console.log(response.status);
     if (response.status === 201) {
       alert("credential request successfully sent")
     }
   }).catch(function (error) {
   alert(error);
   alert(JSON.stringify(payload))
   console.log(error);
   });
   
   }

   export async function listCredDefs(self){
    var headers = {
      'Authorization': localStorage.getItem("token")
    }
    await axios.get(Constants.apiBaseUrl + "credentialdef", {headers: headers}).then(function (response) {
      console.log(response);
      console.log(response.status);
      console.log(response.data);
      if (response.status === 200) {
        let credDefs = response.data.map((credDef) => {
          return(
            {label: credDef.data.tag, value: credDef.credDefId}
          )
        }
        )
        self.setState({credentialDefinitions: credDefs})
      }
    }).catch(function (error) {
      alert(error);
      console.log(error);
    });
  }

  export function generateSeed(length = 32) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }