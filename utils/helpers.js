import { getNetworkSampleSize } from "./test-data-reader";
import { t, ClientFunction, Selector } from "testcafe";
import { waits } from '../.testcaferc';
import PjResults from "../data/models/external/pj/results";
import { ExecutionMode } from "../data/consts/execution";
const csv = require('csvtojson')
const fs = require('fs')
const uuidv4 = require('uuid/v4');
var numeral = require('numeral');
var moment = require('moment');

export function filterClientsDataSetByNetworkName(dataSet, affiliateNetwork) {
    return dataSet.filter(client => client.network === affiliateNetwork);
}

export const limitClientsDataSet = (dataSet, affiliateNetwork, limit = getNetworkSampleSize(affiliateNetwork)) => {
    const executionMode = process.env.EXECUTION_MODE;
    
    if (executionMode === ExecutionMode.SAMPLE && dataSet.length > limit) {
        return dataSet.slice(0, limit);
    }

    return dataSet;
}

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const getRandomArrayIndex = (array) => getRandomInt(0, array.length - 1);

export const generateUniqueEmail = (email) => {
    const [part1, part2] = email.split("@");
    return `${part1}+${uuidv4()}@${part2}`;
}

// http://stackoverflow.com/questions/962802#962890
export const shuffle = (array) => {
    var tmp, current, top = array.length;
    if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }

    return array;
}

// eslint-disable-next-line no-undef
export const reloadPage = () => t.eval(() => window.location.reload(true));

export const getCurrentUrl = ClientFunction(() => window.location.href);

export const getSelectorByXpath = Selector((xpath) => {
    const iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null )
    const items = [];

    let item = iterator.iterateNext();

    while (item) {
        items.push(item);
        item = iterator.iterateNext();
    }

    return items;
});

export function formatPercentage(value) {
    return numeral(value).format('0.00%');
}

export function formatValue(value) {
    const out = numeral(value);
    
    return out.value();
}

export function formatValues(values) {
    const result = [];
    values.forEach((value) => {
        result.push(formatValue(value));
    })
    
    return result;
}

export const valueFloor = (value) => Math.floor(value);

export const valueRound = (value) => Math.round(value);

export const valueAbs = (value) => Math.abs(value);

export function formatDate(date) {
    return moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');
}

export async function parseCsvFile(filepath) {
    try {
        if (fs.existsSync(filepath)) {
            const data = await csv().fromFile(filepath);
            return data;
        }
    } catch(err) {
        throw new Error(err);
    }
}

export function removeFile(filepath) {
    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }
      } catch(err) {
        console.error(err);
      }
}

export function removeFiles(filepaths) {
    filepaths.forEach((filepath) => {
        removeFile(filepath);
    });
}

export async function parsePjCsvFile(filepath) {
    const data = await parseCsvFile(filepath);
    await t.expect(data).notEql(undefined, { timeout: waits.fileDownloadTimeout });
    
    removeFile(filepath);

    return new PjResults({
        impressions: data.reduce((sum, row) => sum + +row.impressions, 0),
        clicks: data.reduce((sum, row) => sum + +row.clicks, 0),
        revenue: data.reduce((sum, row) => sum + +row.revenue, 0),
        pubComm: data.reduce((sum, row) => sum + +row.commission_pub, 0),
        siteComm: data.reduce((sum, row) => sum + +row.commission_site, 0),
        trans: data.reduce((sum, row) => sum + +row.total_transaction_count, 0),
        convRate: undefined
    })
}

export const fileExists = (filepath) => {
    return fs.existsSync(filepath);
}

export const verifyDownload = async (filepath) => new Promise((resolve, reject) => {
    fs.watchFile(filepath, (curr, prev) => {
        if (fileExists(filepath)) {
            fs.unwatchFile(filepath);
            resolve(true);
        }
     });
});