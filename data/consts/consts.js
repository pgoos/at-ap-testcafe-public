import DateRange from "../models/dateRange";
import DateGenerator from "../../utils/date-generator";

export const SETTINGS_FILE = './config/settings.json';

export const AffiliateNetworks = {
    SAS: "ShareASale",
    IMPACT: "Impact",
    CJ: "CJ",
    AVANT_LINK: "Avant Link",
    HAS_OFFERS: "HasOffers",
    PEPPER_JAM: "Pepper jam",
    RAKUTEN: "Rakuten",
    AWIN: "Awin",
    LINK_CONNECTOR: "Link connector",
    COMMISSION_FACTORY: "Commission Factory",
};

export const DateRanges = {
    YESTERDAY: DateGenerator.getYesterday(),
    ONE_WEEK: DateGenerator.getLastWeek(),
    LAST_WEEK: DateGenerator.getLastWeek(),
    ONE_MONTH: DateGenerator.getLastMonth(),
    LAST_MONTH: DateGenerator.getLastMonth(),
    SIX_MONTHS: "six_months",
    YEAR: "year",
    LAST_YEAR: DateGenerator.getLastYear(),
}

export const RAKUTEN_REPORT_NAME = 'Revenue Report by Day and publisher';

export const EXCLUDED_NETWORKS_FROM_DATA_VALIDATION = [
    AffiliateNetworks.AVANT_LINK,
    AffiliateNetworks.HAS_OFFERS,
    AffiliateNetworks.AWIN,
    AffiliateNetworks.LINK_CONNECTOR,
    AffiliateNetworks.COMMISSION_FACTORY,
    AffiliateNetworks.IMPACT
];

export const MAX_NETWORK_SIZE = 100000;