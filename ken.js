/**
 * 1. Get accounts with over 100GB of Data ingested
 * 2. Create an event for each account with relevant details and insert into NRDB
 */

var assert = require('assert');
var axios = require('axios')

const uri = 'https://api.newrelic.com/graphql'

const postHeaders = {
    headers: {
        'Example1' : 1, 
        'Example2' : '2'
    }
}

const getAccounts = () => {

    // Define variables
    const myAccountId = '';
    const myAPIKey = $secure.WTC_KEY;
    const maxHitRatioLimit = '0.8'
    const nrqlQuery = "SELECT consumingAccountId, consumingAccountName FROM \
    (select sum(GigabytesIngested) as GBI from NrConsumption \
    WHERE productLine = 'DataPlatform' AND consumingAccountId IS NOT NULL LIMIT max facet consumingAccountId, consumingAccountName) \
    where GBI > 1 since 30 days ago"
    const acct_id_options  = {
        headers: {
          'API-key': myAPIKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query getNrqlResults($accountId: Int!, $nrql: Nrql!) {
              actor {
                account(id: $accountId) {
                  nrql(query: $nrql) {
                    results
                  }
                }
              }
            }
          `,
          variables: {
            accountId: Number(myAccountId),
            nrql: nrqlQuery,
          },
        }),
      };

      // Get Accounts
    axios.post(postURL, postHeaders).then(response => {
        assert.equal(response.statusCode, 200, 'Expected a 200 OK response'); 
        var result = body
   
        //log the contents of the results[0] array
        console.log(result);
       // console.log(typeof result.data.customerAdministration.organizations.items);  
       
    var keys = Object.keys(result.data.actor.account.nrql.results)
    for(var i = 0; i < keys.length; i++) 
    {
      var key = keys[i];
      console.log(result.data.actor.account.nrql.results[key].consumingAccountId);
      console.log(result.data.actor.account.nrql.results[key].consumingAccountName);
    var id = result.data.actor.account.nrql.results[key].consumingAccountId;
    var name = result.data.actor.account.nrql.results[key].consumingAccountName;
    };
      })
      .catch(function (error) {
        console.log(error);
      });
}


const insertEvents = (accounts) => {
}


const main = () => getAccounts.then((accounts) => insertEvents(accounts)).catch()

main()



//GetAcctId()
function PutEvent() {
const endpoint = "https://insights-collector.newrelic.com/v1/accounts//events";
const headers = {
	"content-type": "application/json",
    "API-key": ""
};
const fields = {
    "eventType": "Billing",
    "id": "12345678",
    "name": "test account name"
};

const response = axios({
  url: endpoint,
  method: 'post',
  headers: headers,
  data: fields
});

console.log(response.data); // data
console.log(response.errors); // errors if any/*function createEvent() {
}

PutEvent()