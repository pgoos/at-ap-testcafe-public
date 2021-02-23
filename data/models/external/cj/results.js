export default class CjResults {
    constructor({
        publisherCommission,
        cjFee,
        totalCommission,
        saleAmount,
        sales,
        leads,
        items,
        clicks,
        impressions,
    }) {
        this.publisherCommission = publisherCommission;
        this.cjFee = cjFee;
        this.totalCommission = totalCommission;
        this.saleAmount = saleAmount;
        this.sales = sales;
        this.leads = leads;
        this.items = items;
        this.clicks = clicks;
        this.impressions = impressions;
    }
}