import { Selector, t } from "testcafe";
import { DateRanges } from "../../../data/consts/consts";
import DateRange from "../../../data/models/dateRange";
import SasResults from "../../../data/models/external/sas/results";
import { getSelectorByXpath, formatValues, valueRound } from "../../../utils/helpers";
import { SALES_DATA_COLUMNS_W_TRANSACTIONS } from "../../../data/consts/sas";
import { waits } from '../../../.testcaferc';

export default class SasReportsPage {
    constructor() {
        this.mainContent = Selector('.contentMain-defaultContentBox');
        this.mainMenu = Selector('.content-main-menu');
        this.mainDateFields = this.mainMenu.find('.sas-datefield-input');
        this.startDate = this.mainMenu.find('input').withAttribute('name', 'datestart');
        this.endDate = this.mainMenu.find('input').withAttribute('name', 'dateend');
        this.popupDateRangeMenu = Selector('.sas-daterangemenu-body');
        this.startDateSelector = this.popupDateRangeMenu.find('div').find('.sas-combo-input').nth(0);
        this.endDateSelector = this.popupDateRangeMenu.find('div').find('.sas-combo-input').nth(1);
        this.startDateSelectItems = Selector('.sas-combo-list').withText('start of week').find('.sas-combo-list-item');
        this.endDateSelectItems = Selector('.sas-combo-list').withText('end of last week').find('.sas-combo-list-item');
        this.selectListItems = Selector('.sas-combo-list-item');
        this.filterButton = this.mainMenu.find('button').withText('Filter');
        this.dataTable = this.mainContent.find('#rptTimespan');
        this.dataTableHeaderColumns = getSelectorByXpath('//thead/tr/td[not(@style="display:none" or @style="display: none;")]');
        this.dataTableTotalsColumns = getSelectorByXpath('//tfoot/tr/td[not(@style="display:none" or @style="display: none;")]');
        this.columnManagerButton = this.mainContent.find('button.columnManagerToggle')
        this.columnManagerItems = this.mainContent.find('.column-manager-body div.col-mgr-item').with({ visibilityCheck: true });
        this.columnManagerSalesData = this.columnManagerItems.find('label').withText('Sales Data');
        this.columnManagerTransactions = this.columnManagerItems.find('label').withText('Transactions');
    }

    async clickMainDateFields() {
        await t.click(this.mainDateFields.nth(1));
    }

    async getStartDate() {
        const date = await this.startDate.value;
        
        return date;
    }

    async getEndDate() {
        const date = await this.endDate.value;
        
        return date;
    }

    async selectStartDate(value) {
        await t
            .click(this.startDateSelector)
            .click(this.startDateSelectItems.withText(value));
    }

    async selectEndDate(value) {
        await t
            .click(this.endDateSelector)
            .click(this.endDateSelectItems.withText(value));
    }

    async clickFilterButton() {
        await t.click(this.filterButton);
    }

    async showSalesData() {
        await t
            .click(this.columnManagerButton)
            .click(this.columnManagerSalesData);
        
        if (!(await this.columnManagerTransactions.checked)) {
            await t.click(this.columnManagerTransactions);
        }
        
        await this.verifyDataTableColumns(SALES_DATA_COLUMNS_W_TRANSACTIONS);
    }

    async loadTableHeaders() {
        let tableColumns = [];
        for (var i = 0; i < await this.dataTableHeaderColumns.count; i++) {
            tableColumns.push((await this.dataTableHeaderColumns.nth(i).textContent).trim());
        }

        return tableColumns;
    }
    
    async verifyDataTableColumns(requiredColumnList, maxAttempts = waits.table.maxAttempts, timeout = waits.table.timeout) {
        let tableColumns = await this.loadTableHeaders();

        for (let i = 0; i < maxAttempts; i += 1) {
            if (tableColumns.join() == requiredColumnList.join()) { // checks if arrays are equal
              break;
            }
            await t.wait(timeout);
            
            tableColumns = await this.loadTableHeaders();
        }

        // // check if every required column is a part of actual columns
        // await t.expect(requiredColumnList.every(column => tableColumns.indexOf(column) > -1)).ok(`Not all expected columns were loaded. Expected: ${requiredColumnList}, actual: ${this.tableColumns}`);
        await t.expect(tableColumns).eql(requiredColumnList,`Not all expected columns were loaded. Expected: ${requiredColumnList}, actual: ${tableColumns}`);
    }

    async selectReportPeriod(period) {
        await this.clickMainDateFields();

        switch (period) {
            case DateRanges.LAST_MONTH:
            case DateRanges.ONE_MONTH:
                await this.selectStartDate('last month');
                await this.selectEndDate('end of last month');
                break;
            case DateRanges.LAST_WEEK:    
            case DateRanges.ONE_WEEK:
                await this.selectStartDate('last week');
                await this.selectEndDate('end of last week');
                break;
            case DateRanges.SIX_MONTHS:
                await this.selectStartDate('last quarter');
                await this.selectEndDate('end of last quarter');
                break;
            case DateRanges.LAST_YEAR:    
            case DateRanges.YEAR:
                await this.selectStartDate('last year');
                await this.selectEndDate('end of last year');
                break;
            case DateRanges.YESTERDAY:
                await this.selectStartDate('yesterday');
                await this.selectEndDate('yesterday');
                break;
            default:
                await this.selectStartDate('yesterday');
                await this.selectEndDate('yesterday');
        }

        await this.clickFilterButton();
        
        return new DateRange({
            startDate: await this.getStartDate(),
            endDate: await this.getEndDate(),
        });
    }

    async getTableData() {
        let tableData = [];
        for (var i = 0; i < await this.dataTableTotalsColumns.count; i++) {
            tableData.push((await this.dataTableTotalsColumns.nth(i).textContent).trim());
        }
        tableData = formatValues(tableData);
        
        return new SasResults({
            clicks: tableData[1],
            transactions : tableData[2],
            sales: tableData[3],
            grossSales: tableData[4],
            voids: tableData[5],
            netSales: tableData[6],
            commissions: tableData[7],
            conversion: tableData[8],
            averageOrder: tableData[9],
        })
    }
};