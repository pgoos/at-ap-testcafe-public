import { Selector, t } from "testcafe";
import TopNavigationBar from "../../../components/external/rakuten/TopNavigationBar";

export default class RakutenMainPage {
    constructor() {
        this.topNavigationBar = new TopNavigationBar(this.baseSelector);
    };

    async openReports() {
        await this.topNavigationBar.openReports();
    };

    async logout() {
        await this.topNavigationBar.logout();
    }
}