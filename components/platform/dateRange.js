import { Selector, t } from "testcafe";

export default class DateRange {
    constructor() {
        this.baseSelector = Selector('ap-date-filter');
        this.customStartDateInput = this.baseSelector.find('input[placeholder="Start Date"]');
        this.customEndDateInput = this.baseSelector.find('input[placeholder="End Date"]');
        this.applyButton = this.baseSelector.find('button').withText('Apply');
    }

    async setCustomDateRange({startDate, endDate}) {
        await t
            .typeText(this.customStartDateInput, startDate, { replace: true })
            .typeText(this.customEndDateInput, endDate, { replace: true });
    }

    async clickApply() {
        await t.click(this.applyButton);
    }

}