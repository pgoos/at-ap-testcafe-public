export default class ClientData {
    constructor({
        clicks = undefined,
        conversionRate = undefined,
        aov = undefined,
        revenue = undefined,
        actions = undefined,
        publisherCommission = undefined,
        totalCost = undefined,
    }) {
        this.clicks = clicks;
        this.conversionRate = conversionRate;
        this.aov = aov;
        this.revenue = revenue;
        this.actions = actions;
        this.publisherCommission = publisherCommission;
        this.totalCost = totalCost;
    }
}