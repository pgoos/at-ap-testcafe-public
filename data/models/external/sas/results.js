export default class SasResults {
    constructor({
        clicks,
        transactions,
        sales,
        grossSales,
        voids,
        netSales,
        commissions,
        conversion,
        averageOrder,
    }) {
        this.clicks = clicks;
        this.transactions = transactions;
        this.sales = sales;
        this.grossSales = grossSales;
        this.voids = voids;
        this.netSales = netSales;
        this.commissions = commissions;
        this.conversion = conversion;
        this.averageOrder = averageOrder;
    }
}