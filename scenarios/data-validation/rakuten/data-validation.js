import {
    loadClientDataJsonFile
} from "../../../utils/test-data-reader";
import {
    filterClientsDataSetByNetworkName,
    shuffle,
    limitClientsDataSet,
    generateUniqueEmail,
} from "../../../utils/helpers";
import { AffiliateNetworks, DateRanges } from "../../../data/consts/consts";
import UserCredentials from "../../../data/models/user-credentials";
import ApiCommon from "../../../api/requests/apiCommon";
import { DefaultNewUser } from "../../../data/consts/users";
import NewUser from "../../../data/models/newUser";
import * as rakutenSteps from "../../../steps/data-validation/rakuten";
import * as platformSteps from "../../../steps/data-validation/platform";

const dotenv = require('dotenv');

const clientsData = loadClientDataJsonFile();
const clientsInSingleNetworkOnly = clientsData.filter( c => clientsData.filter(c2 => c2.id === c.id).length === 1);
const clientsRakuten = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.RAKUTEN);
// const clientsRakuten = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.RAKUTEN).filter(client => client.id === "293");
const limitedDataSet = limitClientsDataSet(clientsRakuten, AffiliateNetworks.RAKUTEN);
const shuffledDataSet = shuffle(limitedDataSet);

fixture("Data validation - Rakuten")
    .before(async (t) => {
        await dotenv.config();
        console.log(`Started run at ${new Date()}`);
    })
    // .after(async (t) => {
    // })
    .meta('network', 'rakuten');

shuffledDataSet.forEach((client) => {
// clientsRakuten.forEach((client) => {
    test(`Period - yesterday - ${client.name}`, async (t) => {
        const appliedDateRange = DateRanges.YESTERDAY;
        const clientList = [ Number(client.id) ];

        const credentials = new UserCredentials(client.username, client.pass);

        const externalData = await rakutenSteps.getData({
            dateRange: appliedDateRange,
            clientCredentials: credentials
        });
            
        const formattedExternalData = platformSteps.mapExternalDataToClientData({
            data: externalData,
            network: client.network
        });

        await ApiCommon.manageUserClients(t.ctx.userId, clientList);

        const mainDashboardData = await platformSteps.getMainDashboardData({ dateRange: appliedDateRange });
        const clientProfileData = await platformSteps.getClientProfileData({ dateRange: appliedDateRange });

        await platformSteps.verifyData({
            platformDataArray: [
                mainDashboardData.primaryRange,
                clientProfileData
            ],
            externalData: formattedExternalData,
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
    .meta('network', 'rakuten')
    .meta('period', 'yesterday');
});

shuffledDataSet.forEach((client) => {
// clientsRakuten.forEach((client) => {
    test(`Period - last year - ${client.name}`, async (t) => {
        const appliedDateRange = DateRanges.LAST_YEAR;
        const clientList = [ Number(client.id) ];

        const credentials = new UserCredentials(client.username, client.pass);

        const externalData = await rakutenSteps.getData({
            dateRange: appliedDateRange,
            clientCredentials: credentials
        });
            
        const formattedExternalData = platformSteps.mapExternalDataToClientData({
            data: externalData,
            network: client.network
        })

        await ApiCommon.manageUserClients(t.ctx.userId, clientList);

        const mainDashboardData = await platformSteps.getMainDashboardData({ dateRange: appliedDateRange });
        const clientProfileData = await platformSteps.getClientProfileData({ dateRange: appliedDateRange });

        await platformSteps.verifyData({
            platformDataArray: [
                mainDashboardData.primaryRange,
                clientProfileData
            ],
            externalData: formattedExternalData,
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
    .meta('network', 'rakuten')
    .meta('period', 'last-year');
});