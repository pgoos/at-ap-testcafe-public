import { t } from "testcafe";
import roles from '../../data/consts/roles';
import RakutenMainPage from "../../pages/external/rakuten/MainPage";
import RakutenReportsPage from "../../pages/external/rakuten/ReportsPage";
import { RakutenSignInPage } from "../../pages/external/rakuten/SignInPage";
import { getClientPortals } from "../../utils/test-data-reader";

const {
    rakuten
} = roles;

export const getData = async ({
    dateRange,
    clientCredentials
}) => {
    const rakutenMainPage = new RakutenMainPage();
    const rakutenReportsPage = new RakutenReportsPage();
    const rakutenSignInPage = new RakutenSignInPage();

    // await t.useRole(rakuten(clientCredentials.username, clientCredentials.password));
    await t.navigateTo(getClientPortals().Rakuten);
    await rakutenSignInPage.signIn(clientCredentials);

    await rakutenMainPage.openReports();
    await rakutenReportsPage.runReport(dateRange);

    const reportData = await rakutenReportsPage.getTableData();
    
    await rakutenMainPage.logout();

    return reportData;
};
