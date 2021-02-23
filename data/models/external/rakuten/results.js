export default class RakutenResults {
    constructor({
        impressions,
        clicks,
        clickThroughRate,
        orders,
        ordersPerClick,
        items,
        cancelledItems,
        netItems,
        netItemsPerOrder,
        sales,
        averageOrderValue,
        totalCommission,
    }) {
        this.impressions = impressions;
        this.clicks = clicks;
        this.clickThroughRate = clickThroughRate;
        this.orders = orders;
        this.ordersPerClick = ordersPerClick;
        this.items = items;
        this.cancelledItems = cancelledItems;
        this.netItems = netItems;
        this.netItemsPerOrder = netItemsPerOrder;
        this.sales = sales;
        this.averageOrderValue = averageOrderValue;
        this.totalCommission = totalCommission;
    }
}
