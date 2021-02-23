import {
    loadClientDataJsonFile, getClientPortals, getSettings
} from "../../../utils/test-data-reader";
import {
    filterClientsDataSetByNetworkName,
    shuffle,
    limitClientsDataSet,
    generateUniqueEmail,
    formatValue,
    valueRound,
    formatPercentage,
    fileExists
} from "../../../utils/helpers";
import { AffiliateNetworks, EXCLUDED_NETWORKS_FROM_DATA_VALIDATION, DateRanges } from "../../../data/consts/consts";
import UserCredentials from "../../../data/models/user-credentials";
import ApiCommon from "../../../api/requests/apiCommon";
import { DefaultNewUser } from "../../../data/consts/users";
import NewUser from "../../../data/models/newUser";
import ClientData from "../../../data/models/mainDashboard/clientData";
import * as cjSteps from "../../../steps/data-validation/cj";
import * as sasSteps from "../../../steps/data-validation/sas";
import * as pjSteps from "../../../steps/data-validation/pj";
import * as rakutenSteps from "../../../steps/data-validation/rakuten";
import * as platformSteps from "../../../steps/data-validation/platform";

const dotenv = require('dotenv');

const clientsData = loadClientDataJsonFile();
const clientEntriesInMultipleNetworks = clientsData.filter( c => clientsData.filter(c2 => c2.id === c.id).length > 1);
const clientIds = clientEntriesInMultipleNetworks.map((client) => client.id);
const uniqueClientIdsInMultipleNetworks = [...new Set(clientIds)];
const clientEntriesInExcludedNetworks = clientEntriesInMultipleNetworks.filter(client => EXCLUDED_NETWORKS_FROM_DATA_VALIDATION.includes(client.network));
const clientIdsInExcludedNetworks = clientEntriesInExcludedNetworks.map(client => client.id);
const uniqueClientIdsInExcludedNetworks = [...new Set(clientIdsInExcludedNetworks)];
const uniqueClientIdsInSupportedNetworks = uniqueClientIdsInMultipleNetworks.filter(clientId => !uniqueClientIdsInExcludedNetworks.includes(clientId));
const limitedUniqueClientIds = limitClientsDataSet(uniqueClientIdsInSupportedNetworks, 'multiple');
const shuffledUniqueClientIds = shuffle(limitedUniqueClientIds);

fixture("Data validation - Clients in multiple networks (SAS/CJ/PJ/Rakuten)")
    .before(async (t) => {
        await dotenv.config();
    })
    .meta('network', 'multiple');

shuffledUniqueClientIds.forEach((clientId) => {
// uniqueClientIdsInSupportedNetworks.forEach((clientId) => {
    const clientName = [...new Set(clientEntriesInMultipleNetworks.filter(client => client.id === clientId).map(client => client.name))].join("");
    const clientList = [ Number(clientId) ];

    test(`Period - last year - ${clientName}`, async (t) => {
        const appliedDateRange = DateRanges.LAST_YEAR;
        let externalData;
        let formattedExternalDataArray = [];

        // await clientEntriesInMultipleNetworks.filter(client => client.id === clientId).forEach(async (client) => {
        const allEntriesForSingleClient = clientEntriesInMultipleNetworks.filter(client => client.id === clientId);
        for (const client of allEntriesForSingleClient) {
            const credentials = new UserCredentials(client.username, client.pass);

            switch (client.network) {
                case AffiliateNetworks.SAS:
                    externalData = await sasSteps.getData({
                        dateRange: appliedDateRange,
                        clientCredentials: credentials
                    });
                    break;
                case AffiliateNetworks.RAKUTEN:
                    externalData = await rakutenSteps.getData({
                        dateRange: appliedDateRange,
                        clientCredentials: credentials
                    });
                    break;
                case AffiliateNetworks.PEPPER_JAM:
                    externalData = await pjSteps.getData({
                        dateRange: appliedDateRange,
                        clientCredentials: credentials,
                        clientName: client.name
                    });
                    break;
                case AffiliateNetworks.CJ:
                    externalData = await cjSteps.getData({
                        dateRange: appliedDateRange,
                        clientCredentials: credentials
                    });
                    break;
                default:
                    throw new Error(`Network ${client.network} is not supported for data validation.`);
            }
            
            const formattedExternalData = platformSteps.mapExternalDataToClientData({
                data: externalData,
                network: client.network
            })

            formattedExternalDataArray.push(formattedExternalData);
        }
        
        await ApiCommon.manageUserClients(t.ctx.userId, clientList);

        const mainDashboardData = await platformSteps.getMainDashboardData({ dateRange: appliedDateRange });
        const clientProfileData = await platformSteps.getClientProfileData({ dateRange: appliedDateRange });

        const totalExternalRevenue = formattedExternalDataArray.reduce((sum, currentElem) => sum = sum + +currentElem.revenue, 0);
        const totalExternalClicks = formattedExternalDataArray.reduce((sum, currentElem) => sum = sum + +currentElem.clicks, 0);
        const totalExternalActions = formattedExternalDataArray.reduce((sum, currentElem) => sum = sum + +currentElem.actions, 0);
        const totalExternalPublisherCommission = formattedExternalDataArray.reduce((sum, currentElem) => sum = sum + +currentElem.publisherCommission, 0);
        const totalExternalTotalCost = formattedExternalDataArray.reduce((sum, currentElem) => sum = sum + +currentElem.totalCost, 0);

        const totalFormattedExternalData = new ClientData({
            clicks: totalExternalClicks,
            conversionRate: formatPercentage(totalExternalActions / totalExternalClicks),
            aov: formatValue(totalExternalRevenue / totalExternalActions),
            revenue: totalExternalRevenue,
            actions: totalExternalActions,
            publisherCommission: totalExternalPublisherCommission,
            totalCost: totalExternalTotalCost,
        });

        // console.log(totalFormattedExternalData);

        await platformSteps.verifyData({
            platformDataArray: [
                mainDashboardData.primaryRange,
                clientProfileData
            ],
            externalData: totalFormattedExternalData,
            dateRange: appliedDateRange
        })
        
    })
    .before(async (t) => {
        await ApiCommon.login();
        await t.wait(1000);

        const randomEmail = generateUniqueEmail(DefaultNewUser.EMAIL);
        t.ctx.newUser = new NewUser({ email: randomEmail });
        const createdUserResponse = await ApiCommon.createUser(t.ctx.newUser);
        t.ctx.userId = createdUserResponse.id;
    })
    .after(async (t) => {
        await ApiCommon.deleteUser(t.ctx.userId);
    })
    .meta('network', 'multiple')
    .meta('period', 'last-year');
});