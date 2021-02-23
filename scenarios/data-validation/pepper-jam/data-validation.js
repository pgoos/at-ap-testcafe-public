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
import * as pjSteps from "../../../steps/data-validation/pj";
import * as platformSteps from "../../../steps/data-validation/platform";

const dotenv = require('dotenv');

ApiCommon.loginSync()
    .then((response) => console.log(response))
    .catch(err => console.log("Axios err: ", err))
const clients = ApiCommon.getPipelines();
console.log(clients);
const clientsData = loadClientDataJsonFile();
const clientsInSingleNetworkOnly = clientsData.filter( c => clientsData.filter(c2 => c2.id === c.id).length === 1);
const clientsPepperJam = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.PEPPER_JAM);
const limitedDataSet = limitClientsDataSet(clientsPepperJam, AffiliateNetworks.PEPPER_JAM);
const shuffledDataSet = shuffle(limitedDataSet);

fixture("Data validation - Pepper Jam")
    .before(async (t) => {
        await dotenv.config();
        console.log(`Started run at ${new Date()}`);
    })
    .meta('network', 'pj');

shuffledDataSet.forEach((client) => {
// clientsPepperJam.forEach((client) => {
    test(`Period - yesterday - ${client.name}`, async (t) => {
        const appliedDateRange = DateRanges.YESTERDAY;
        const clientList = [ Number(client.id) ];

        const credentials = new UserCredentials(client.username, client.pass);

        const externalData = await pjSteps.getData({
            dateRange: appliedDateRange,
            clientCredentials: credentials,
            clientName: client.name
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
    .meta('network', 'pj')
    .meta('period', 'yesterday');
});

shuffledDataSet.forEach((client) => {
// clientsPepperJam.forEach((client) => {
    test(`Period - last week - ${client.name}`, async (t) => {
        const appliedDateRange = DateRanges.LAST_WEEK;
        const clientList = [ Number(client.id) ];

        const credentials = new UserCredentials(client.username, client.pass);

        const externalData = await pjSteps.getData({
            dateRange: appliedDateRange,
            clientCredentials: credentials,
            clientName: client.name
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
    .meta('network', 'pj')
    .meta('period', 'last-week');
});

shuffledDataSet.forEach((client) => {
// clientsPepperJam.forEach((client) => {
    test(`Period - last month - ${client.name}`, async (t) => {
        const appliedDateRange = DateRanges.LAST_MONTH;
        const clientList = [ Number(client.id) ];

        const credentials = new UserCredentials(client.username, client.pass);

        const externalData = await pjSteps.getData({
            dateRange: appliedDateRange,
            clientCredentials: credentials,
            clientName: client.name
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
    .meta('network', 'pj')
    .meta('period', 'last-month');
});

shuffledDataSet.forEach((client) => {
// clientsPepperJam.forEach((client) => {
    test(`Period - last year - ${client.name}`, async (t) => {
        const appliedDateRange = DateRanges.LAST_YEAR;
        const clientList = [ Number(client.id) ];

        const credentials = new UserCredentials(client.username, client.pass);

        const externalData = await pjSteps.getData({
            dateRange: appliedDateRange,
            clientCredentials: credentials,
            clientName: client.name
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
    .meta('network', 'pj')
    .meta('period', 'last-year');
});

