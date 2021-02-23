import { Selector, t } from "testcafe";

export default class LeftNavigationBar {
    constructor(parentSelector) {
        this.baseSelector = parentSelector.find('div.leftNav');
        this.trackLink = this.baseSelector.find('.dijitTitlePaneTitleFocus')
        this.submenuItems = this.baseSelector.find('.menu-item a')
    }

    async expandTrackSubmenu() {
        if (await this.trackLink.hasAttribute('aria-pressed', 'false')) {
            await t.click(this.trackLink);
        }

        await t.expect(this.trackLink.hasAttribute('aria-pressed', 'true')).ok();
    }

    async clickPerformanceLink() {
        await t.click(this.submenuItems.withText('Performance'))
    }

    async openPerformanceReport() {
        await this.expandTrackSubmenu();
        await this.clickPerformanceLink();
    }
}