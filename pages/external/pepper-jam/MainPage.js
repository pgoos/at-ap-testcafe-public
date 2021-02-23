import { Selector, t } from "testcafe";
import LeftNavigationBar from "../../../components/external/pepper-jam/LeftNavigationBar";

export default class PjMainPage {
    constructor() {
        this.baseSelector = Selector('.claro.eean');
        this.leftNavigationBar = new LeftNavigationBar(this.baseSelector);
        this.pageContent = this.baseSelector.find('#contents');
        this.pageTitle = this.pageContent.find('.content_page_title');
        this.multipleClientListContent = this.pageContent.find('#mainMCLReportContent');
        this.clientsCollection = this.multipleClientListContent.find('table a');
    };

    async getPageTitle() {
        let title;
        for (var i = 0; i < await this.pageTitle.count; i++) {
            title = await this.pageTitle.nth(i).textContent;
            if (title !== "") {
                return title;
            }
        }
        return title;
    }
    
    async openClientDashboard(clientName) {
        await t.click(this.clientsCollection.withText(clientName));
    }

    async openReports(clientName) {
        if (await this.getPageTitle() === 'Available Accounts') {
            await this.openClientDashboard(clientName);
        }
        
        await this.leftNavigationBar.openPerformanceReport();
    };
}