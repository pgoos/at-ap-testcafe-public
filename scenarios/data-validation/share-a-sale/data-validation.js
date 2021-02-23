import {
    loadClientDataFile,
    getClientPortals,
    loadClientDataJsonFile,
    getSettings
} from "../../../utils/test-data-reader";
import {
    filterClientsDataSetByNetworkName,
    shuffle,
    limitClientsDataSet,
    generateUniqueEmail,
    fileExists
} from "../../../utils/helpers";
import { AffiliateNetworks, DateRanges } from "../../../data/consts/consts";
import UserCredentials from "../../../data/models/user-credentials";
import roles from '../../../data/consts/roles';
import SasMainPage from "../../../pages/external/sas/MainPage";
import SasReportsPage from "../../../pages/external/sas/ReportsPage";
import { SasSignInPage } from "../../../pages/external/sas/SignInPage";
import ApiCommon, { postLogin } from "../../../api/requests/apiCommon";
import SignInPage from "../../../pages/platform/SignInPage";
import { DefaultNewUser } from "../../../data/consts/users";
import MainDashboardPage from "../../../pages/platform/MainDashboardPage";
import DateRange from "../../../data/models/dateRange";
import NewUser from "../../../data/models/newUser";
import ClientData from "../../../data/models/mainDashboard/clientData";
import * as sasSteps from "../../../steps/data-validation/sas";
import * as platformSteps from "../../../steps/data-validation/platform";

const dotenv = require('dotenv');
const {
    sas,
    basic
} = roles;

const sasLoginPage = new SasSignInPage();
const sasMainPage = new SasMainPage();
const sasReportsPage = new SasReportsPage();
const dashboardPage = new MainDashboardPage();

const clientsData = loadClientDataJsonFile();
const clientsInSingleNetworkOnly = clientsData.filter( c => clientsData.filter(c2 => c2.id === c.id).length === 1);
const clientsSas = filterClientsDataSetByNetworkName(clientsInSingleNetworkOnly, AffiliateNetworks.SAS);
const limitedDataSet = limitClientsDataSet(clientsSas, AffiliateNetworks.SAS);
const shuffledDataSet = shuffle(limitedDataSet);

fixture("Data validation - SAS")
    // .page(getClientPortals().SAS)
    .before(async (t) => {
        await dotenv.config();
        console.log(`Started run at ${new Date()}`);
    })
    .meta('network', 'sas');

shuffledDataSet.forEach((client) => {
// clientsSas.forEach((client) => {
    test(`Period - yesterday - ${client.name}`, async (t) => {
        const appliedDateRange = DateRanges.YESTERDAY;
        const clientList = [ Number(client.id) ];

        const externalData = await sasSteps.getData({
            dateRange: appliedDateRange,
            clientCredentials: new UserCredentials(client.username, client.pass)
        });
            
        const formattedExternalData = platformSteps.mapExternalDataToClientData({
            data: externalData,
            network: client.network
        })

        await ApiCommon.manageUserClients(t.ctx.userId, clientList);

        const mainDashboardData = await platformSteps.getMainDashboardData({ dateRange: appliedDateRange });
        const clientProfileData = await platformSteps.getClientProfileData({ dateRange: appliedDateRange });

        await platformSteps.verifyData({
            platformData: [
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
    .meta('network', 'sas')
    .meta('period', 'yesterday')
});

shuffledDataSet.forEach((client) => {
// clientsSas.forEach((client) => {
    test(`Period - last week - ${client.name}`, async (t) => {
        const appliedDateRange = DateRanges.LAST_WEEK;
        const clientList = [ Number(client.id) ];

        const externalData = await sasSteps.getData({
            dateRange: appliedDateRange,
            clientCredentials: new UserCredentials(client.username, client.pass)
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
    .meta('network', 'sas')
    .meta('period', 'last-week');
});

shuffledDataSet.forEach((client) => {
// clientsSas.forEach((client) => {
    test(`Period - last year - ${client.name}`, async (t) => {
        const appliedDateRange = DateRanges.LAST_YEAR;
        const clientList = [ Number(client.id) ];

        const externalData = await sasSteps.getData({
            dateRange: appliedDateRange,
            clientCredentials: new UserCredentials(client.username, client.pass)
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
    .meta('network', 'sas')
    .meta('period', 'last-year');
});