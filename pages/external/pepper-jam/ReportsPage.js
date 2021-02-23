import { Selector, t } from "testcafe";
import { waits } from '../../../.testcaferc';
import DateRange from "../../../data/models/dateRange";
import { DateRanges } from "../../../data/consts/consts";
import { formatValues, valueRound, formatDate, verifyDownload, fileExists } from "../../../utils/helpers";
import { REPORT_TABLE_COLUMNS } from "../../../data/consts/pj";
import PjResults from "../../../data/models/external/pj/results";
import moment from "moment";

const downloadsFolder = require('downloads-folder');

export default class PjReportsPage {
    constructor() {
        this.period = undefined;
        this.baseSelector = Selector('.claro.eean');
        this.exactRangeRadio = this.baseSelector.find('#dijit_form_RadioButton_1');
        this.startDateInput = this.baseSelector.find('#dijit_form_DateTextBox_0');
        this.endDateInput = this.baseSelector.find('#dijit_form_DateTextBox_1');
        this.applyButton = this.baseSelector.find('#dijit_form_Button_1');
        this.manageColumnsButton = this.baseSelector.find('#reportManageColumnsBtn');
        this.manageColumnsDialog = this.baseSelector.find('#dijit_Dialog_1');
        this.manageColumnsOptions = this.manageColumnsDialog.find('input[type="checkbox"]');
        this.manageColumnsApplyButton = this.manageColumnsDialog.find('#dijit_form_Button_5_label');
        this.performanceReportTable = this.baseSelector.find('div.performance-report');
        this.totalsRow = this.performanceReportTable.find('.dojoxGridMasterView');
        // this.totalsRow = this.performanceReportTable.find('.dojoxGridMasterView').nth(1).find('table').nth(1).find('tr');
        this.totalsRowColumns = this.totalsRow.find('td');
        this.exportButton = this.baseSelector.find('#export_dropdown_btn');
        this.downloadCsvButton = this.baseSelector.find('#export-csv_text');
        this.publisherPerformanceLink = this.baseSelector.find('a').withText('Publisher Performance');
    }

    async clickPublisherPerformance() {
        await t.click(this.publisherPerformanceLink);
    }
    async downloadCsv() {
        await t
            .click(this.exportButton)
            .hover(this.downloadCsvButton)
            .click(this.downloadCsvButton);

        // await t
        //     .click(this.exportButton)   // download twice to be sure the first download completed.
        //     .click(this.downloadCsvButton);
        
        const formattedStartDate = formatDate(this.period.startDate);
        const formattedEndDate = formatDate(this.period.endDate);

        const filename = `performance_data_${formattedStartDate}_${formattedEndDate}.csv` 

        // for (let i = 0; i < 60; i += 1) {
        //     if (fileExists(filename)) {
        //         console.log('file downloaded.')
                
        //         return downloadsFolder() + '/' + filename;
        //     }
            
        //     console.log('file not downloaded');
        //     await t.wait(500);
        // }
        
        // throw new Error(`Could not download file '${filename}'`);
        // await t.expect(fileExists(filename)).ok(`Could not download file '${filename}'`, { timeout: waits.fileDownloadTimeout });
        // console.log('file downloaded.')

        return downloadsFolder() + '/' + filename;
    }

    async selectExactRange() {
        if (!(await this.exactRangeRadio.checked)) {
            await t.click(this.exactRangeRadio);
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

    async clickApply() {
        await t.click(this.applyButton);
    }

    async selectAllNeededColumns() {
        await t.click(this.manageColumnsButton);

        REPORT_TABLE_COLUMNS.forEach(async (column) => {
            const columnSelector = await this.manageColumnsOptions.withText(column);    
            if (!columnSelector.checked) {
                await t.click(columnSelector);
            }
        })

        await t.click(this.manageColumnsApplyButton);
    }

    async waitForReportChartLoaded(maxAttempts = waits.report.maxAttempts, timeout = waits.report.timeout) {
        const loadingChartSelector = Selector('div.highcharts-loading');
        
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

        await this.waitForReportChartLoaded();

        await this.selectAllNeededColumns();

        await this.setStartDate(period.startDate);
        await this.setEndDate(period.endDate);

        await this.clickApply();

        await this.waitForReportChartLoaded();
    }

    async getTableData() {
        let tableData = [];
        // console.log(await this.performanceReportTable.exists);
        // await t.expect(this.totalsRow.exists).ok();
        for (var i = 0; i < await this.totalsRowColumns.count; i++) {
            tableData.push((await this.totalsRowColumns.nth(i).textContent).trim());
        }
        tableData = formatValues(tableData);
        
        return new PjResults({
            impressions: tableData[1],
            clicks: tableData[2],
            revenue: tableData[3],
            pubComm: tableData[4],
            siteComm: tableData[5],
            trans: tableData[6],
            convRate: tableData[7]
        })
    }
}