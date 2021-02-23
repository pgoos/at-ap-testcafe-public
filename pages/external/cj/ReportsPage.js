import { Selector, t } from "testcafe";
import { waits } from '../../../.testcaferc';
import DateRange from "../../../data/models/dateRange";
import { DateRanges } from "../../../data/consts/consts";
import CjResults from "../../../data/models/external/cj/results";
import { formatValues, valueRound } from "../../../utils/helpers";

export default class CjReportsPage {
    constructor() {
        this.baseSelector = Selector('#whole-page');
        this.dateRangeSelector = this.baseSelector.find('#s2id_performanceReportDateDaySelect');
        this.dateRangeOptions = Selector('#select2-results-2 .select2-result-label');
        this.dateRangeYesterday = this.dateRangeOptions.nth(2);
        this.dateRangeCustom = this.dateRangeOptions.nth(0);
        this.dateRangeLastMonth = this.dateRangeOptions.nth(6);
        this.dateRangeLastYear = this.dateRangeOptions.nth(8);
        // this.dateRangeYesterday = this.dateRangeOptions.withText('Yesterday');
        // this.dateRangeCustom = this.dateRangeOptions.withText('Custom');
        // this.dateRangeLastMonth = this.dateRangeOptions.withText('Last Month');
        // this.dateRangeLastYear = this.dateRangeOptions.withText('Last Year');
        this.dateRangeStartDate = this.baseSelector.find('#performanceStartDate');
        this.dateRangeEndDate = this.baseSelector.find('#performanceEndDate');
        this.runReportButton = this.baseSelector.find('#performanceReportRunButton');
        this.performanceReportTable = this.baseSelector.find('#performanceReportHolder');
        this.pagesInfo = this.performanceReportTable.find('span.pages');
        this.maxPage = this.pagesInfo.find('.max_page').with({ visibilityCheck: true });
        this.chooseColumnsButton = this.baseSelector.find('#performanceReportColumnChooserButton');
        this.chooseColumnsSelector = Selector('div.columnChooser');
        this.chooseColumnsAll = this.chooseColumnsSelector.find('#chooseColumnAll');
        // this.chooseColumnsSaveButton = this.chooseColumnsSelector.parent().find('button').withText('Save');
        this.chooseColumnsSaveButton = this.chooseColumnsSelector.parent().find('button').nth(1);
        this.dataTableTotalsColumns = this.performanceReportTable.find('thead tr.reportHeaderTotalRow th')
    }

    async getStartDate() {
        const startDate = await this.dateRangeStartDate.value;

        return startDate;
    }

    async getEndDate() {
        const endDate = await this.dateRangeEndDate.value;

        return endDate;
    }

    async chooseAllColumns() {
        await t
            .click(this.chooseColumnsButton)
            .click(this.chooseColumnsAll)
            .click(this.chooseColumnsSaveButton);

    }
    async clickRunReport() {
        await t.click(this.runReportButton);
    }

    async runReport(period) {
        await this.chooseAllColumns();

        await t.click(this.dateRangeSelector);
        // await t.expect(this.dateRangeOptions.exists).ok();

        switch (period) {
            case DateRanges.LAST_MONTH:
            case DateRanges.ONE_MONTH:
                await t.click(this.dateRangeLastMonth);
                break;
            case DateRanges.LAST_YEAR:
                await t.click(this.dateRangeLastYear);
                break;
            case DateRanges.YESTERDAY:
                await t.click(this.dateRangeYesterday);
                break;
            default:
                throw new Error(`Period ${period.startDate} - ${period.endDate} is not implemented.`)
        }

        await this.clickRunReport();
        await this.waitForReportLoaded();

        // return new DateRange({
        //     startDate: await this.getStartDate(),
        //     endDate: await this.getEndDate()
        // })
    }

    async waitForReportLoaded(maxAttempts = waits.report.maxAttempts, timeout = waits.report.timeout) {
        for (let i = 0; i < maxAttempts; i += 1) {
            if (await this.maxPage.exists) {
                return;
            }
        
            await t.wait(timeout);
        }
        
        throw new Error('Could not get CJ performance report data within specified time.');
    }

    async getTableData() {
        let tableData = [];
        for (var i = 0; i < await this.dataTableTotalsColumns.count; i++) {
            tableData.push((await this.dataTableTotalsColumns.nth(i).textContent).trim());
        }
        tableData = formatValues(tableData);
        
        return new CjResults({
            publisherCommission: tableData[1],
            cjFee: tableData[2],
            totalCommission: tableData[3],
            saleAmount: tableData[4],
            sales: tableData[5],
            leads: tableData[6],
            items: tableData[7],
            clicks: tableData[8],
            impressions: tableData[9]
        })
    }
}