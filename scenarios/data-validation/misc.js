import ApiCommon from "../../api/requests/apiCommon";
import { loadClientDataJsonFile, loadClientDataFile, generateJsonCredentialsFromCsv } from "../../utils/test-data-reader";
import { AffiliateNetworks, EXCLUDED_NETWORKS_FROM_DATA_VALIDATION } from "../../data/consts/consts";
import { filterClientsDataSetByNetworkName } from "../../utils/helpers";

fixture("Misc");

test("Remove AT users", async (t) => {
    ApiCommon.login();
    await t.wait(2000);
    
    let userList = await ApiCommon.getUserList();
    console.log(userList.items.length);
    
    let userListAt = userList.items.filter((item) => item.email.includes('test.at'));
    console.log(userListAt.length);
    if (userListAt.length) {
        console.log(userListAt.map((user) => user.email));
    }
    
    userListAt.forEach(async (user) => {
        await ApiCommon.deleteUser(user.id);
    });
    
    await t.wait(5000);

    userList = await ApiCommon.getUserList();
    console.log(userList.items.length);
    
    userListAt = userList.items.filter((item) => item.email.includes('test.at'));
    console.log(userListAt.length); // should be 0 now
})
.meta('misc', 'clean');

test("Get information about clients", async (t) => {
    const clientsData = loadClientDataJsonFile();
    console.log('Client data entries=', clientsData.length);
    const clientsInSingleNetworkOnly = clientsData.filter( c => clientsData.filter(c2 => c2.id === c.id).length === 1);
    console.log('Clients in single network=', clientsInSingleNetworkOnly.length);
    const clientEntriesInMultipleNetworks = clientsData.filter( c => clientsData.filter(c2 => c2.id === c.id).length > 1);
    console.log('Client entries in multiple network=', clientEntriesInMultipleNetworks.length);
    let clientIds = clientEntriesInMultipleNetworks.map((client) => client.id);
    const uniqueClientIdsInMultipleNetworks = [...new Set(clientIds)];
    console.log("Unique clients in multiple networks=", uniqueClientIdsInMultipleNetworks.length);
    // const clientsInMultipleNetworks = clientsData.filter( c => clientsData.filter(c2 => c2.id === c.id).length > 1);
    // console.log('Clients in multiple network=', clientsInMultipleNetworks.length);
    const clientsSas = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.SAS);
    console.log('SAS=', clientsSas.length);
    const clientsCj = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.CJ);
    console.log('CJ=', clientsCj.length);
    const clientsImpact = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.IMPACT);
    console.log('Impact=', clientsImpact.length);
    const clientsAvantLink = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.AVANT_LINK);
    console.log('AvantLink=', clientsAvantLink.length);
    const clientsRakuten = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.RAKUTEN);
    console.log('Rakuten=', clientsRakuten.length);
    const clientsAwin = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.AWIN);
    console.log('Awin=', clientsAwin.length);
    const clientsLinkConnector = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.LINK_CONNECTOR);
    console.log('LinkConnector=', clientsLinkConnector.length);
    const clientsHasOffers = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.HAS_OFFERS);
    console.log('HasOffers=', clientsHasOffers.length);
    const clientsPepperJam = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.PEPPER_JAM);
    console.log('PepperJam=', clientsPepperJam.length);
    const clientsCommissionFactory = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.COMMISSION_FACTORY);
    console.log('CommissionFactory=', clientsCommissionFactory.length);
    // const clientIds = clientsData.map((client) => client.id);
    clientIds = clientsData.map((client) => client.id);
    const uniqueClientIds = [...new Set(clientIds)];
    console.log("Unique clients=", uniqueClientIds.length);
    clientIds = clientEntriesInMultipleNetworks.map((client) => client.id);
    const clientEntriesInExcludedNetworks = clientEntriesInMultipleNetworks.filter(client => EXCLUDED_NETWORKS_FROM_DATA_VALIDATION.includes(client.network));
    const clientIdsInExcludedNetworks = clientEntriesInExcludedNetworks.map(client => client.id);
    const uniqueClientIdsInExcludedNetworks = [...new Set(clientIdsInExcludedNetworks)];
    console.log("Unique clients (2+) in excluded (from data validation) networks=", uniqueClientIdsInExcludedNetworks.length);
    const uniqueClientIdsInSupportedNetworks = uniqueClientIdsInMultipleNetworks.filter(clientId => !uniqueClientIdsInExcludedNetworks.includes(clientId));
    console.log("Unique clients only in supported networks (2+)=", uniqueClientIdsInSupportedNetworks.length);
})
.meta('misc', 'info');

test('Regenerate JSON credentials file from CSV', async (t) => {
    await generateJsonCredentialsFromCsv();
    // const clientsData = await generateJsonCredentialsFromCsv();
    // console.log(clientsData);
})
.meta('misc', 'create-json-creds');