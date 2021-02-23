import { t } from "testcafe";
import CjMainPage from "../../pages/external/cj/MainPage";
import CjReportsPage from "../../pages/external/cj/ReportsPage";
import roles from '../../data/consts/roles';

const {
    cj
} = roles;

export const getData = async ({
    dateRange,
    clientCredentials
}) => {
    const cjMainPage = new CjMainPage();
    const cjReportsPage = new CjReportsPage();

    await t.useRole(cj(clientCredentials.username, clientCredentials.password));

    await cjMainPage.openReports();
    await cjReportsPage.runReport(dateRange);

    const cjReportData = await cjReportsPage.getTableData();

    return cjReportData;
};
