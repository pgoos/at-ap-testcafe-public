import { t } from "testcafe";
import roles from '../../data/consts/roles';
import SasMainPage from "../../pages/external/sas/MainPage";
import SasReportsPage from "../../pages/external/sas/ReportsPage";

const {
    sas
} = roles;

export const getData = async ({
    dateRange,
    clientCredentials
}) => {
    const sasMainPage = new SasMainPage();
    const sasReportsPage = new SasReportsPage();

    await t.useRole(sas(clientCredentials.username, clientCredentials.password));

    await sasMainPage.openReports();
    
    // const appliedDateRange = await sasReportsPage.selectReportPeriod(dateRange);
    await sasReportsPage.selectReportPeriod(dateRange);
    await sasReportsPage.showSalesData();

    const sasReportData = await sasReportsPage.getTableData();

    return sasReportData;
    // return { sasReportData, appliedDateRange };
};
