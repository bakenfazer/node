/**
 * 1. Get accounts with over 100GB of Data ingested
 * 2. Create an event for each account with relevant details and insert into NRDB
 */

var axios = require('axios')

let data = [];

const getAccounts = async () => {

  // Define variables
  const uri = 'https://api.newrelic.com/graphql'
  const myAccountId = '[INSERT ACCOUNT ID]';
  const myAPIKey = $secure.WTC_KEY;
  const maxHitRatioLimit = '0.8'
  const nrqlQuery = "SELECT consumingAccountId, consumingAccountName FROM \
    (select sum(GigabytesIngested) as GBI from NrConsumption \
    WHERE productLine = 'DataPlatform' AND consumingAccountId IS NOT NULL LIMIT max facet consumingAccountId, consumingAccountName) \
    where GBI > 1 since 30 days ago"
  const acct_id_options = {
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
  accountData = await axios.post(uri, acct_id_options).then(response => {
    if (response.statusCode != 200) throw new Error('Expected a 200 OK response')
    return response.data.results[0];
  }).catch(function (error) {
    console.log(error);
    return null
  });

  return accountData
}


const insertEvents = async (accountData) => {

  console.log(accountData)

  const headers = {
    "content-type": "application/json",
    "API-key": "[INSERT API KEY]"
  };

  data.forEach(async obj => {
    const endpoint = "https://insights-collector.newrelic.com/v1/accounts/" + accountData.consumingAccountId + "/events";
    await axios.post(endpoint, accountData, headers)
  })

}


getAccounts.then((accountData) => insertEvents(accountData)).catch(err => console.error(err))




// var result = body

// //log the contents of the results[0] array
// console.log(result);
// // console.log(typeof result.data.customerAdministration.organizations.items);  

// var keys = Object.keys(result.data.actor.account.nrql.results)
// for (var i = 0; i < keys.length; i++) {
//   var key = keys[i];
//   console.log(result.data.actor.account.nrql.results[key].consumingAccountId);
//   console.log(result.data.actor.account.nrql.results[key].consumingAccountName);
//   var id = result.data.actor.account.nrql.results[key].consumingAccountId;
//   var name = result.data.actor.account.nrql.results[key].consumingAccountName;
// };