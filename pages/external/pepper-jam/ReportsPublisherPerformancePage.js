import { Selector, t } from "testcafe";
import { waits } from '../../../.testcaferc';
import DateRange from "../../../data/models/dateRange";
import { DateRanges } from "../../../data/consts/consts";
import { formatValues, valueRound, formatDate, verifyDownload, fileExists } from "../../../utils/helpers";
import { REPORT_TABLE_COLUMNS } from "../../../data/consts/pj";
import PjResults, { PjPublisherResults } from "../../../data/models/external/pj/results";
import moment from "moment";

const downloadsFolder = require('downloads-folder');

export default class PjReportsPublisherPerformancePage {
    constructor() {
        this.period = undefined;
        this.baseSelector = Selector('.claro.eean');
        this.customRangeRadio = this.baseSelector.find('#exactRangeButton');
        this.startDateInput = this.baseSelector.find('#exactRange #startdate');
        this.endDateInput = this.baseSelector.find('#exactRange #enddate');
        this.generateReportButton = this.baseSelector.find('input.generateReportButton');
        this.reportTable = this.baseSelector.find('#mainReportContainer');
        this.reportHeadersSelector = this.reportTable.find('table thead th');
        this.reportHeaders = [];
        this.totalsRow = this.reportTable.find('table tfoot tr').nth(1);
        this.totalsRowColumns = this.totalsRow.find('td');
        this.optionalColumnsButton = this.baseSelector.find('input.optionalColumnsButton');
        this.optionalColumns = this.baseSelector.find('#dijit_Dialog_0 input[type="checkbox"]')
        this.optionalColumnsApplyButton = this.baseSelector.find('#dijit_Dialog_0 input[type="button"][name="Apply"]')
        this.noResultsAlert = this.reportTable.find('.alert-message');
    }

    async getReportHeaders() {
        if (this.reportHeaders.length === 0) {
            for (var i = 0; i < await this.reportHeadersSelector.count; i++) {
                this.reportHeaders.push((await this.reportHeadersSelector.nth(i).textContent).trim());
            }
        }

        return this.reportHeaders;
    }

    async selectAllColumns(maxAttempts = waits.modal.maxAttempts, timeout = waits.modal.timeout) {
        for (let i = 0; i < maxAttempts; i += 1) {
            if (await this.optionalColumnsButton.exists) {
                break;
            }

            await t.wait(timeout);
        }
        
        if (!(await this.optionalColumnsButton.exists)) {
            return false;
        }
        
        await t.click(this.optionalColumnsButton);

        for (var i = 0; i < await this.optionalColumns.count; i++) {
            if (!(await this.optionalColumns.nth(i).checked)) {
                await t.click(this.optionalColumns.nth(i));
            }
        }

        await t.click(this.optionalColumnsApplyButton);
        
        await this.waitForReportChartLoaded();
        
        return true;
    }
    async selectExactRange() {
        if (!(await this.customRangeRadio.checked)) {
            await t.click(this.customRangeRadio);
        }
    }

    async setStartDate(date) {
        await this.selectExactRange();

        await t.typeText(this.startDateInput, date, { replace: true });
    }

    async setEndDate(date) {
        await this.selectExactRange();

        await t.typeText(this.endDateInput, date, { replace: true });
    }

    async clickGenerateReport() {
        await t.click(this.generateReportButton);
    }

    async waitForReportChartLoaded(maxAttempts = waits.report.maxAttempts, timeout = waits.report.timeout) {
        const loadingChartSelector = this.reportTable.find('img[src="/images/reportLoader.gif"]');
        
        await t.wait(500);

        for (let i = 0; i < maxAttempts; i += 1) {
            if (!(await loadingChartSelector.exists)) {
                await t.wait(500);

                return;
            }
        
            await t.wait(timeout);
        }
        
        throw new Error('Could not get Publisher Performance report data within specified time.');
    }

    async runReport(period) {
        this.period = period;

        await this.waitForReportChartLoaded();

        await this.clickGenerateReport();
        
        await this.waitForReportChartLoaded();

        const allColumnsSelected = await this.selectAllColumns();

        await this.setStartDate(period.startDate);
        await this.setEndDate(period.endDate);

        await this.clickGenerateReport();

        await this.waitForReportChartLoaded();

        if (!allColumnsSelected) {
            await this.selectAllColumns();
        }
    }

    async mapDataToHeader(data, headerToSearchFor) {
        if (this.reportHeaders.indexOf(headerToSearchFor) !== -1) {
            return data[this.reportHeaders.indexOf(headerToSearchFor) - 3]
        }

        return undefined;
    }

    async getTableData() {
        await t.wait(500);
        
        if (await this.noResultsAlert.exists) {
            return new PjPublisherResults({
                impressions: 0,
                clicks: 0,
                convRate: 0,
                epc: 0,
                sales: 0,
                leads: 0,
                revenue: 0,
                transCount: 0,
                siteComm: 0,
                pubComm: 0,
                siteBonus: 0,
                pubBonus: 0
            })
        }
        
        let tableData = [];
        // console.log(await this.performanceReportTable.exists);
        // await t.expect(this.totalsRow.exists).ok();
        for (var i = 0; i < await this.totalsRowColumns.count; i++) {
            tableData.push((await this.totalsRowColumns.nth(i).textContent).trim());
        }
        tableData = formatValues(tableData);
        await this.getReportHeaders();

        return new PjPublisherResults({
            impressions: await this.mapDataToHeader(tableData, 'Impressions'),
            clicks: await this.mapDataToHeader(tableData, 'Clicks'),
            convRate: await this.mapDataToHeader(tableData, 'Conv Rate'),
            epc: await this.mapDataToHeader(tableData, 'EPC'),
            sales: await this.mapDataToHeader(tableData, 'Sales'),
            leads: await this.mapDataToHeader(tableData, 'Leads'),
            revenue: await this.mapDataToHeader(tableData, 'Revenue'),
            transCount: await this.mapDataToHeader(tableData, 'Trans. Count'),
            siteComm: await this.mapDataToHeader(tableData, 'Site Comm.'),
            pubComm: await this.mapDataToHeader(tableData, 'Pub Comm.'),
            siteBonus: await this.mapDataToHeader(tableData, 'Site Bonus'),
            pubBonus: await this.mapDataToHeader(tableData, 'Pub Bonus'),
        })
    }
}