import { Selector, t } from "testcafe";

export default class TopNavigationBar {
    constructor() {
        this.baseSelector = Selector('.Header__links');
        this.reportsLink = this.baseSelector.find('a[href="/Advertiser/Reports/landing.php"]');
        this.logoutLink = this.baseSelector.find('a[href="/Advertiser/Authenticate/Dashboard/logout.php"]');
    }

    async openReports() {
        await t.click(this.reportsLink);
    }

    async logout() {
        await t.click(this.logoutLink);
    }
}