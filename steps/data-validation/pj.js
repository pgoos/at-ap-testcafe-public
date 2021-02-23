import { t } from "testcafe";
import roles from '../../data/consts/roles';
import PjMainPage from "../../pages/external/pepper-jam/MainPage";
import PjReportsPage from "../../pages/external/pepper-jam/ReportsPage";
import PjReportsPublisherPerformancePage from "../../pages/external/pepper-jam/ReportsPublisherPerformancePage";

const {
    pepperJam
} = roles;

export const getData = async ({
    dateRange,
    clientCredentials,
    clientName
}) => {
    const pjMainPage = new PjMainPage();
    const pjReportsPage = new PjReportsPage();
    const pjReportsPubPerfPage = new PjReportsPublisherPerformancePage();

    await t.useRole(pepperJam(clientCredentials.username, clientCredentials.password));

    await pjMainPage.openReports(clientName);
    await pjReportsPage.clickPublisherPerformance();
    await pjReportsPubPerfPage.runReport(dateRange);
    
    const reportData = await pjReportsPubPerfPage.getTableData();
    
    return reportData;
};
