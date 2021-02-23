import { Selector, t } from "testcafe";
import { waits } from '../../.testcaferc';
import { formatValues, formatPercentage, valueRound } from "../../utils/helpers";
import ClientData from "../../data/models/mainDashboard/clientData";
import DateRange from "../../components/platform/dateRange";

export default class ClientProfilePage {
    constructor() {
        this.baseSelector = Selector('ap-root');
        this.profileStatistics = this.baseSelector.find('ap-profile-statistics');
        this.profileStatisticsDateFilterButton = this.profileStatistics.find('ap-date-range button');
        this.profileStatisticsHeaderFields = this.profileStatistics.find('mat-tab-header div.mat-tab-label-content');
        this.loadingSpinner = Selector('mat-spinner.mat-progress-spinner');
    }

    async waitForDataLoaded(maxAttempts = waits.report.maxAttempts, timeout = waits.report.timeout) {
        await t.wait(500);

        for (let i = 0; i < maxAttempts; i += 1) {
            if (!(await this.loadingSpinner.exists)) {
                await t.wait(500);

                return;
            }
        
            await t.wait(timeout);
        }
        
        throw new Error('Could not get client profile data within specified time.');
    }

    async applyDateFilter(dateRange) {
        await t.click(this.profileStatisticsDateFilterButton);
        
        const dateRangeComponent = new DateRange();
        await dateRangeComponent.setCustomDateRange(dateRange);
        await dateRangeComponent.clickApply();

        await this.waitForDataLoaded();
    }

    async getTableData() {
        let tableData = [];

        for (var i = 0; i < await this.profileStatisticsHeaderFields.count; i++) {
            tableData.push(await this.profileStatisticsHeaderFields.nth(i).find('span.tab-text').textContent);
        }

        tableData = formatValues(tableData);

        return new ClientData({
            clicks: tableData[0],
            actions: tableData[1],
            publisherCommission: valueRound(tableData[2]),
            revenue: valueRound(tableData[3]),
            totalCost: valueRound(tableData[4]),
            conversionRate: formatPercentage(tableData[5])
        })
    }
}