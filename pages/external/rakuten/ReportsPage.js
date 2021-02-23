import { Selector, t } from "testcafe";
import { waits } from '../../../.testcaferc';
import { formatValues, formatDate } from "../../../utils/helpers";
import { RAKUTEN_REPORT_NAME } from "../../../data/consts/consts";
import RakutenResults from "../../../data/models/external/rakuten/results";

export default class RakutenReportsPage {
    constructor() {
        this.period = undefined;
        this.baseSelector = Selector('body.reports');
        this.reportingLink = Selector('div.Card a').withText('Reporting');
        this.chooseReportDropdown = this.baseSelector.find('button').withText('Choose Report');
        this.searchReportsInput = this.baseSelector.find('div.dropdown-menu input[placeholder="Search Reports"]')
        this.iframe = Selector('#reporting-ui');
        this.reportsSelector = this.baseSelector.find('div.options');
        this.reportListGroups = this.reportsSelector.find('div.group-label').filter('div:not(.ng-hide)');
        this.reportList = this.reportsSelector.find('div.option span');
        this.datePicker = this.baseSelector.find('manage-report span.single-date');
        this.startDateInput = this.baseSelector.find('div.start-date');
        this.endDateInput = this.baseSelector.find('div.end-date');
        this.calendarDays = this.baseSelector.find('table.ui-datepicker-calendar > tbody td').filter('td:not(.ui-datepicker-unselectable)');
        this.calendarMonthSelect = this.baseSelector.find('select.ui-datepicker-month');
        this.calendarMonthOptions = this.calendarMonthSelect.find('option');
        this.calendarYearSelect = this.baseSelector.find('select.ui-datepicker-year');
        this.calendarYearOptions = this.calendarYearSelect.find('option');
        this.applyButton = this.baseSelector.find('button.apply');
        this.viewReportButton = this.baseSelector.find('button.view-report');
        this.summaryDataCards = this.baseSelector.find('div.owl-wrapper div.card-detail');
    }

    async openReportingLink() {
        await t.click(this.reportingLink);

    }

    async searchReport(reportName = RAKUTEN_REPORT_NAME) {
        await t
            .click(this.chooseReportDropdown)
            .typeText(this.searchReportsInput, reportName);
    }

    async clickReport(reportName) {
        for (var i = 0; i < await this.reportListGroups.count; i++) {
            if (!(await this.reportListGroups.nth(i).hasClass('expanded'))) {
                await t.click(this.reportListGroups);
            }
        }
        await t.click(this.reportList.withText(reportName));
    }

    async openReport(reportName = RAKUTEN_REPORT_NAME) {
        await this.searchReport(reportName);

        await this.clickReport(reportName);
    }


    async clickDatePicker() {
        await t.click(this.datePicker);
    }

    async setDay(day) {
        await t.click(this.calendarDays.withExactText(day));
    }

    async setMonth(month) {
        const monthString = String(Number(month) - 1);
        if (await this.calendarMonthSelect.value !== monthString) {
            await t
                .click(this.calendarMonthSelect)
                .click(this.calendarMonthOptions.withAttribute('value', monthString));
        }
    }

    async setYear(year) {
        if (await this.calendarYearSelect.value !== year) {
            await t
                .click(this.calendarYearSelect)
                .click(this.calendarYearOptions.withAttribute('value', year));
        }
    }

    async clickStartDatePicker() {
        await t.click(this.startDateInput);
    }
    
    async clickEndDatePicker() {
        await t.click(this.endDateInput);
    }

    async setStartDate(date) {
        const [month, day, year] = date.split('/');
        await this.clickDatePicker();

        await this.clickStartDatePicker();

        await this.setYear(year);
        await this.setMonth(month);
        await this.setDay(day);
    }

    async setEndDate(date) {
        const [month, day, year] = date.split('/');
        if (!(await this.endDateInput.exists)) {
            await this.clickDatePicker();
        }

        await this.clickEndDatePicker();

        await this.setYear(year);
        await this.setMonth(month);
        await this.setDay(day);
    }

    async clickApply() {
        await t.click(this.applyButton);
    }

    async clickViewReport() {
        await t.click(this.viewReportButton);
    }

    async waitForReportLoaded(maxAttempts = waits.report.maxAttempts, timeout = waits.report.timeout) {
        // const loadingChartSelector = this.baseSelector.find('div.table-loading.loading');
        const loadingChartSelector = this.baseSelector.find('dl.loading');
        
        await t.wait(500);

        for (let i = 0; i < maxAttempts; i += 1) {
            if (!(await loadingChartSelector.exists)) {
                await t.wait(500);

                return;
            }
        
            await t.wait(timeout);
        }
        
        throw new Error('Could not get performance report data within specified time.');
    }

    async runReport(period) {
        this.period = period;
        
        await this.openReportingLink();
        
        await t.switchToIframe(this.iframe);

        await this.openReport(RAKUTEN_REPORT_NAME);

        await this.setStartDate(period.startDate);
        await this.setEndDate(period.endDate);

        await this.clickApply();

        await this.clickViewReport();

        await this.waitForReportLoaded();
        
        await t.switchToMainWindow();
    }

    async getTableData() {
        let tableData = [];
        
        await t.switchToIframe(this.iframe);
        
        await t.wait(500);

        for (var i = 0; i < await this.summaryDataCards.count; i++) {
            tableData.push((await this.summaryDataCards.nth(i).find('div').textContent).trim());
        }
        tableData = formatValues(tableData);
        
        await t.switchToMainWindow();

        return new RakutenResults({
            impressions: tableData[0],
            clicks: tableData[1],
            clickThroughRate: tableData[2],
            orders: tableData[3],
            ordersPerClick: tableData[4],
            items: tableData[5],
            cancelledItems: tableData[6],
            netItems: tableData[7],
            netItemsPerOrder: tableData[8],
            sales: tableData[9],
            averageOrderValue: tableData[10],
            totalCommission: tableData[11]
        });
    }
}