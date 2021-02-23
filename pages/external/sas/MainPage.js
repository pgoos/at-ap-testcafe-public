import { Selector, t } from "testcafe";
import { TIMEOUT_COOKIE_MODAL_SEC } from "../../../data/consts/waits";
import { reloadPage, getCurrentUrl } from "../../../utils/helpers";

export default class SasMainPage {
    constructor() {
        this.baseSelector = Selector('#headerMenuMainMenuRow');
        this.reportsLink = this.baseSelector.find('#merchantReportMenuListItem');
        this.affiliateTimespanLink = Selector('a[href="/m-weeklysummary.cfm"]');
    };

    async closeItpModalIfPresent(timeout = TIMEOUT_COOKIE_MODAL_SEC) {
        const currentUrl = await getCurrentUrl();
        if (currentUrl.includes('itpStatus=0')) {
            const currentUrlWithItpModalOff = currentUrl.replace('itpStatus=0', 'itpStatus=1');
            await t.navigateTo(currentUrlWithItpModalOff);
        }
        // var timeoutCounter = timeout;
        // // const cookieSelector = Selector('#box').with({ visibilityCheck: true });
        // const itpModalSelector = Selector('#box');
        // // const cookieModal = cookieSelector.find('#cookieLogo').with({ visibilityCheck: true });
        
        // while((await !itpModalSelector.exists) && timeoutCounter > 0) {
        //     await t.wait(1000);
        //     console.log('waiting for modal...');
        //     timeoutCounter--;
        // }
        // if (await itpModalSelector.exists) {
        //     console.log('modal exists. Closing...');
        //     const currentUrl = await getCurrentUrl();
        //     console.log(currentUrl);
        //     const currentUrlWithItpModalOff = currentUrl.replace('itpStatus=0', 'itpStatus=1');
        //     console.log(currentUrlWithItpModalOff);
        //     await t.navigateTo(currentUrlWithItpModalOff);
        //     console.log('modal closed.');
        //     // reloadPage();
        //     // console.log('modal exists. Closing...');
        //     // const closeButton = await itpModalSelector.find('#closeX');
        //     // // console.log(await closeButton.exists);
        //     // // const closeButton = "";
        //     // reloadPage();
        //     // await t
        //     //     .hover(closeButton)
        //     //     .click(closeButton);
        //     // console.log('modal closed.')
        // }
    };

    async openReports() {
        await this.closeItpModalIfPresent();
        await t
            .click(this.reportsLink)
            .click(this.affiliateTimespanLink);
    };
}