import { Selector, t } from "testcafe";
import { waits } from '../../.testcaferc';
import DateRange from "../../components/platform/dateRange";
import ExpandedClientData from "../../data/models/mainDashboard/expandedClientData";
import ClientData from "../../data/models/mainDashboard/clientData";
import { formatValues, valueRound, valueAbs, formatPercentage } from "../../utils/helpers";

export default class MainDashboardPage {
    constructor() {
        this.clientListSelector = Selector('ap-client-list');
        this.dateFilterButton = this.clientListSelector.find('mat-icon');
        this.clientListTable = this.clientListSelector.find('table')
        this.tableRows = this.clientListTable.find('tbody tr');
        this.expandedClientData = this.clientListTable.find('tbody tr table');
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
        
        throw new Error('Could not get client data within specified time.');
    }

    async applyDateFilter(dateRange) {
        await t.click(this.dateFilterButton);
        
        const dateRangeComponent = new DateRange();
        await dateRangeComponent.setCustomDateRange(dateRange);
        await dateRangeComponent.clickApply();

        await this.waitForDataLoaded();
    }

    async expandFirstClientData() {
        await t.click(this.tableRows.nth(0).find('td').nth(0).find('div'), { offsetX: 20 });

        const primaryRangeDataColumns = await this.expandedClientData.find('tbody tr').nth(0).find('td');
        const comparativeRangeDataColumns = await this.expandedClientData.find('tbody tr').nth(1).find('td');
        const totalDataColumns = await this.expandedClientData.find('tfoot tr').nth(0).find('td');

        let primaryRangeData = [];
        let comparativeRangeData = [];
        let totalData = [];
        for (var i = 1; i < await primaryRangeDataColumns.count; i++) {
            primaryRangeData.push((await primaryRangeDataColumns.nth(i).textContent).trim());
            comparativeRangeData.push((await comparativeRangeDataColumns.nth(i).textContent).trim());
            totalData.push((await totalDataColumns.nth(i).textContent).trim());
        }
        primaryRangeData = formatValues(primaryRangeData);
        comparativeRangeData = formatValues(comparativeRangeData);
        totalData = formatValues(totalData);

        return new ExpandedClientData({
            primaryRange: new ClientData({
                clicks: primaryRangeData[0],
                conversionRate: formatPercentage(primaryRangeData[1]),
                aov: valueRound(primaryRangeData[2]),
                revenue: valueRound(primaryRangeData[3]),
            }),
            comparativeRange: new ClientData({
                clicks: comparativeRangeData[0],
                conversionRate: formatPercentage(comparativeRangeData[1]),
                aov: valueRound(comparativeRangeData[2]),
                revenue: valueRound(comparativeRangeData[3]),
            }),
            total: new ClientData({
                clicks: totalData[0],
                conversionRate: formatPercentage(totalData[1]),
                aov: valueRound(totalData[2]),
                revenue: valueRound(totalData[3]),
            })
        })
    }

    async openFirstClientProfilePage() {
        await t.click(this.tableRows.nth(0).find('td').nth(0).find('div a'));
    }

    async verifyData(mainDashboardData, externalPortalData, dateRange) {
        if (externalPortalData.clicks !== undefined) {
            await t.expect(mainDashboardData.clicks).eql(externalPortalData.clicks, 
                `Mismatch (clicks), ${dateRange.startDate}-${dateRange.endDate}: external=${externalPortalData.clicks}, BI platform=${mainDashboardData.clicks}`);
        }
        
        if (externalPortalData.conversionRate !== undefined) {
            await t.expect(mainDashboardData.conversionRate).eql(externalPortalData.conversionRate, 
                `Mismatch (conversion rate), ${dateRange.startDate}-${dateRange.endDate}: external=${externalPortalData.conversionRate}, BI platform=${mainDashboardData.conversionRate}`)
        }

        if (externalPortalData.aov !== undefined) {
            await t.expect(mainDashboardData.aov).eql(externalPortalData.aov, 
                `Mismatch (AOV), ${dateRange.startDate}-${dateRange.endDate}: external=${externalPortalData.aov}, BI platform=${mainDashboardData.aov}`);
        }

        if (externalPortalData.revenue !== undefined) {
            await t.expect(valueAbs(mainDashboardData.revenue - externalPortalData.revenue)).lte(1, 
                `Mismatch (Revenue), ${dateRange.startDate}-${dateRange.endDate}: external=${externalPortalData.revenue}, BI platform=${mainDashboardData.revenue}`);
        }
    }
}