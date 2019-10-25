import axios from 'axios';
import * as Constants from "./Constants"
const mongoDBBaseUrl = Constants.mongoDBBaseUrl;
const apiBaseUrl = Constants.apiBaseUrl;


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
       alert("Credential offer successfully sent!")
     }
   }).catch(function (error) {
   //alert(error);
   //alert(JSON.stringify(payload))
   console.log(error);
   });
   
   }

   export function getRole(){
      return(localStorage.getItem('role'))
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
          let attributes = Object.keys(credDef.data.value.primary.r).filter(elem => elem !== 'master_secret')

          return(
            {label: credDef.data.tag, value: credDef.credDefId, attributes: attributes}
          )
        }
        )
        self.setState({credentialDefinitions: credDefs})
      }
    }).catch(function (error) {
      //alert(error);
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

 export function compareDates(a,b){
  return new Date(b.createdAt) - new Date(a.createdAt);
}

export   function  checkLogin(self){

  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }
  axios.get(apiBaseUrl + "user/me" , {headers: headers}).then((response) => {

  }).catch((error)=> {
    console.log('logout')
    localStorage.clear()
    self.props.history.push("/");

  })
}


  




export function redirectToLogin(self){
  if(localStorage.getItem('token') === null){
  self.props.history.push("/");
}
}




export function getModel(modelName){
  var self = this;
  var rawModel = {};
  var model ={};
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }
  axios.get(mongoDBBaseUrl + "models" , {headers}).then(function (response) {
          if (response.status === 200) {
              console.log(response.data)
              
              for(let model_name in response.data){
                  console.log(model_name)
                  if(model_name === modelName){
                      rawModel = response.data[model_name]
                      for(let attr in rawModel){
                        if(attr !== 'createdAt' && attr !== 'updatedAt' && attr !== 'did' && attr !== 'meta' && attr!== 'picture'){
                          model[attr] = rawModel[attr]
                        }
                      }

                      for(let attribute in  model){
                          model[attribute] = "";
                      }
 
                  }
              }
              console.log(model)
              return model
          }
      }).catch(function (error) {
      console.log(error);
  });
}   