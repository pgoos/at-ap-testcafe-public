export default class PjResults {
    constructor({
        impressions,
        clicks,
        revenue,
        pubComm,
        siteComm,
        trans,
        convRate,
    }) {
        this.impressions = impressions;
        this.clicks = clicks;
        this.revenue = revenue;
        this.pubComm = pubComm;
        this.siteComm = siteComm;
        this.trans = trans;
        this.convRate = convRate;
    }
}

export class PjPublisherResults {
    constructor({
        impressions,
        clicks,
        convRate,
        epc,
        sales,
        leads,
        revenue,
        transCount,
        pubComm,
        siteComm,
        siteBonus,
        pubBonus
    }) {
        this.impressions = impressions;
        this.clicks = clicks;
        this.convRate = convRate;
        this.sales = sales;
        this.leads = leads;
        this.revenue = revenue;
        this.pubComm = pubComm;
        this.siteComm = siteComm;
        this.transCount = transCount;
        this.epc = epc;
        this.siteBonus = siteBonus;
        this.pubBonus = pubBonus;
    }
}