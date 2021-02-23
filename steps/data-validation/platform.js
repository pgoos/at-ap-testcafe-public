import { t } from "testcafe";
import roles from '../../data/consts/roles';
import MainDashboardPage from "../../pages/platform/MainDashboardPage";
import { AffiliateNetworks } from "../../data/consts/consts";
import ClientData from "../../data/models/mainDashboard/clientData";
import { valueAbs, formatPercentage, valueRound, formatValue, getCurrentUrl } from "../../utils/helpers";
import ClientProfilePage from "../../pages/platform/ClientProfilePage";
import urls from "../../data/consts/urls";

const {
    basic
} = roles;

export const getMainDashboardData = async ({
    dateRange
}) => {
    const dashboardPage = new MainDashboardPage();

    await t.useRole(basic(t.ctx.newUser.email, t.ctx.newUser.password));

    await dashboardPage.applyDateFilter(dateRange);
    const clientData = await dashboardPage.expandFirstClientData();

    return clientData;
};

export const getClientProfileData = async ({
    dateRange
}) => {
    const dashboardPage = new MainDashboardPage();
    const clientProfilePage = new ClientProfilePage();

    const currentUrl = await getCurrentUrl();

    if (!(currentUrl === urls.platform.dashboard)) {
        await t.useRole(basic(t.ctx.newUser.email, t.ctx.newUser.password));
    }

    await dashboardPage.openFirstClientProfilePage();
    
    await clientProfilePage.applyDateFilter(dateRange);
    const data = await clientProfilePage.getTableData();
    
    return data;
};

export const mapExternalDataToClientData = ({
    data,
    network
}) => {
    let outputData;

    switch (network) {
        case AffiliateNetworks.CJ:
            outputData = new ClientData({
                clicks: data.clicks,
                revenue: valueRound(data.saleAmount),
                actions: data.sales,
                publisherCommission: valueRound(data.publisherCommission),
                totalCost: valueRound(data.totalCommission),
            })
            break;
        case AffiliateNetworks.PEPPER_JAM:
            outputData = new ClientData({
                clicks: data.clicks,
                conversionRate: formatPercentage(data.convRate),
                revenue: valueRound(data.revenue),
                actions: data.sales,
                publisherCommission: valueRound(data.pubComm),
                totalCost: valueRound(data.pubComm + data.siteComm),
            });
            break;
        case AffiliateNetworks.RAKUTEN:
            outputData = new ClientData({
                clicks: data.clicks,
                conversionRate: formatPercentage(data.ordersPerClick),
                aov: valueRound(data.averageOrderValue),
                revenue: valueRound(data.sales),
                actions: data.orders,
            });
            break;
        case AffiliateNetworks.SAS:
            outputData = new ClientData({
                clicks: data.clicks,
                conversionRate: formatPercentage(data.conversion),
                revenue: valueRound(data.netSales),
                actions: data.transactions,
                publisherCommission: valueRound(data.commissions),
            })
            break;
        default:
            throw new Error(`Network ${network} is not supported.`);
    }

    return outputData;
}

export const verifyData = async ({
    platformDataArray,
    externalData,
    dateRange,
}) => {
    for (var platformData of platformDataArray) {
        if (externalData.clicks !== undefined && platformData.clicks !== undefined) {
            await t.expect(platformData.clicks).eql(externalData.clicks, 
                `Mismatch (clicks), ${dateRange.startDate}-${dateRange.endDate}: external=${externalData.clicks}, BI platform=${platformData.clicks}`);
        }
        
        if (externalData.conversionRate !== undefined && platformData.conversionRate !== undefined) {
            await t.expect(platformData.conversionRate).eql(externalData.conversionRate, 
                `Mismatch (conversion rate), ${dateRange.startDate}-${dateRange.endDate}: external=${externalData.conversionRate}, BI platform=${platformData.conversionRate}`)
        }

        if (externalData.aov !== undefined && platformData.aov !== undefined) {
            await t.expect(valueAbs(platformData.aov - externalData.aov)).lte(1, 
                `Mismatch (AOV), ${dateRange.startDate}-${dateRange.endDate}: external=${externalData.aov}, BI platform=${platformData.aov}`);
        }

        if (externalData.revenue !== undefined && platformData.revenue !== undefined) {
            await t.expect(valueAbs(platformData.revenue - externalData.revenue)).lte(1, 
                `Mismatch (Revenue), ${dateRange.startDate}-${dateRange.endDate}: external=${externalData.revenue}, BI platform=${platformData.revenue}`);
        }

        // ------- additional validation for the client profile data not available on the main dashboard --------
        if (externalData.actions !== undefined && platformData.actions !== undefined) {
            await t.expect(platformData.actions).eql(externalData.actions, 
                `Mismatch (Actions), ${dateRange.startDate}-${dateRange.endDate}: external=${externalData.actions}, BI platform=${platformData.actions}`);
        }

        if (externalData.publisherCommission !== undefined && platformData.publisherCommission !== undefined) {
            await t.expect(valueAbs(platformData.publisherCommission - externalData.publisherCommission)).lte(1, 
                `Mismatch (Publisher Commission), ${dateRange.startDate}-${dateRange.endDate}: external=${externalData.publisherCommission}, BI platform=${platformData.publisherCommission}`);
        }

        if (externalData.totalCost !== undefined && platformData.totalCost !== undefined) {
            await t.expect(valueAbs(platformData.totalCost - externalData.totalCost)).lte(1, 
                `Mismatch (Total Cost), ${dateRange.startDate}-${dateRange.endDate}: external=${externalData.totalCost}, BI platform=${platformData.totalCost}`);
        }
    }
};
