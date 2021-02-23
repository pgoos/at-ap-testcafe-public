import { t } from "testcafe";

export default class NavigationBar {
    constructor(parentSelector) {
        this.baseSelector = parentSelector.find('nav.navbar');
        // this.reportsLink = this.baseSelector.find('span.navbar-menu--title').withText('Reports');
        this.reportsLink = this.baseSelector.find('span.navbar-menu--title').nth(3);    // localization issue
        // this.reportsPerformanceLink = this.baseSelector.find('.dropdown.open .menu-item').withText('Performance');
        this.reportsPerformanceLink = this.baseSelector.find('.dropdown.open .menu-item').nth(0);
    }

    async openPerformanceReport() {
        await t
            .click(this.reportsLink)
            .click(this.reportsPerformanceLink);
    }
}