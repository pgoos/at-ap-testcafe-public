import {
    loadClientDataFile,
    getClientPortals,
    writeJsonFile
} from "../../../utils/test-data-reader";
import {
    filterClientsDataSetByNetworkName,
    shuffle,
    limitClientsDataSet
} from "../../../utils/helpers";
import { AffiliateNetworks, DateRanges } from "../../../data/consts/consts";
import UserCredentials from "../../../data/models/user-credentials";
import roles from '../../../data/consts/roles';
import SasMainPage from "../../../pages/external/sas/MainPage";
import SasReportsPage from "../../../pages/external/sas/ReportsPage";
import { SasSignInPage } from "../../../pages/external/sas/SignInPage";
import ApiCommon, { postLogin } from "../../../api/requests/apiCommon";
import SignInPage from "../../../pages/platform/SignInPage";
import { NewUser } from "../../../data/consts/users";
import MainDashboardPage from "../../../pages/platform/MainDashboardPage";
import DateRange from "../../../data/models/dateRange";

const dotenv = require('dotenv');
const {
    sas,
    basic
} = roles;

const sasLoginPage = new SasSignInPage();
const sasMainPage = new SasMainPage();
const sasReportsPage = new SasReportsPage();
const dashboardPage = new MainDashboardPage();
// const api = new ApiCommon();

fixture("Data validation - SAS")
    // .page(getClientPortals().SAS)
    .before(async (t) => {
        await dotenv.config();
    });

    test("Period - yesterday", async (t) => {
        // console.log(process.env);
        const clientsData = await loadClientDataFile();
        
        const clientsSas = filterClientsDataSetByNetworkName(clientsData, AffiliateNetworks.SAS);
        // console.log(clientsSas.length);

        const limitedDataSet = limitClientsDataSet(clientsSas);
        // console.log(limitedDataSet);
        
        // console.log('---- shuffle:')
        const shuffledDataSet = shuffle(limitedDataSet);
        // console.log(shuffledDataSet);

        const client1 = shuffledDataSet[0];
        console.log(client1);
        const clientId = client1.id;
        const clientList = [ Number(clientId) ];

        // const credentials = new UserCredentials(client1.username, client1.pass);
        // // const credentials = new UserCredentials('john-angelscup', 'AdPurp1234');    // itp modal
        // await sasLoginPage.signIn(credentials.username, credentials.password);
        // await t.useRole(sas(credentials.username, credentials.password));

        // await sasMainPage.openReports();
        // const appliedDateRange = await sasReportsPage.selectReportPeriod(DateRanges.YESTERDAY);
        // console.log(appliedDateRange);
        
        // const sasTableData = await sasReportsPage.getTableData();
        // console.log(sasTableData);
        
        await ApiCommon.login();
        await t.wait(1000);
        // const createdUserResponse = await ApiCommon.createUser();
        // await ApiCommon.manageUserClients(createdUserResponse.id, clientList);
        console.log(await ApiCommon.manageUserClients(123, clientList));

        await t.useRole(basic(NewUser.EMAIL, NewUser.PASSWORD));

        const dateRangeTmp = new DateRange({
            startDate: '12/08/2019',
            endDate: '12/08/2019'
        })
        await dashboardPage.applyDateFilter(dateRangeTmp);
        // await dashboardPage.applyDateFilter(appliedDateRange);
        const mainDashboardClientData = await dashboardPage.expandFirstClientData();
        console.log(mainDashboardClientData);
        // await ApiCommon.deleteUser(createdUserResponse.id);
        await t.wait(3000);
    });
