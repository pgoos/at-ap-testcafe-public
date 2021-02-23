import { Selector, t } from "testcafe";
import { waits } from '../../../.testcaferc';
import NavigationBar from "../../../components/external/cj/NavigationBar";

export default class CjMainPage {
    constructor() {
        this.baseSelector = Selector('#whole-page');
        this.navigationBar = new NavigationBar(this.baseSelector);
        this.popup = Selector('#pendo-guide-container');
        this.closePopupButton = this.popup.find('button._pendo-close-guide');
    };

    async closePopupIfPresent(maxAttempts = waits.modal.maxAttempts, timeout = waits.modal.timeout) {
        for (let i = 0; i < maxAttempts; i += 1) {
            if (await this.popup.exists) {
                await t.click(this.closePopupButton);
                
                return;
            }
        
            await t.wait(timeout);
        }
    }

    async openReports() {
        await this.closePopupIfPresent();

        await this.navigationBar.openPerformanceReport();
    };
}