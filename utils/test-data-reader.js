import { SETTINGS_FILE, AffiliateNetworks, MAX_NETWORK_SIZE } from '../data/consts/consts';
import { NetworkSampleSize } from '../data/consts/execution';
import { fileExists } from './helpers';
const csv = require('csvtojson')
var fs = require('fs');

function parseJsonFile(filePath) {
    if (fileExists(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    return [];
}

export function writeJsonFile(jsonObject, outputJsonFile) {
    var json = JSON.stringify(jsonObject);
    
    fs.writeFile(outputJsonFile, json, 'utf8', function(error) {
            if (error) throw error;
            console.log('complete');
        });
}

export function loadClientDataJsonFile() {
    const settings = getSettings();
    const clientDataFile = settings.clientDataJsonFile;

    return parseJsonFile(clientDataFile);
}

export async function loadClientDataFile() {
    const settings = getSettings();
    const clientDataFile = settings.clientDataFile;
    const clientsData = await csv().fromFile(clientDataFile);

    return clientsData;
}

export async function generateJsonCredentialsFromCsv() {
    const settings = getSettings();
    const clientDataFile = settings.clientDataFile;
    const clientsData = await csv().fromFile(clientDataFile);

    writeJsonFile(clientsData, settings.clientDataJsonFile);

    // return loadClientDataJsonFile();
}

export function getClientPortals() {
    const settings = getSettings();
    
    return settings.clientPortals;
}

export function getSettings() {
    return parseJsonFile(SETTINGS_FILE);
}

export function getNetworkSampleSize(network) {
    let sampleSize;

    switch (network) {
        case AffiliateNetworks.CJ:
            sampleSize = NetworkSampleSize.CJ;
            break;
        case AffiliateNetworks.PEPPER_JAM:
            sampleSize = NetworkSampleSize.PJ;
            break;
        case AffiliateNetworks.RAKUTEN:
            sampleSize = NetworkSampleSize.RAKUTEN;
            break;
        case AffiliateNetworks.SAS:
            sampleSize = NetworkSampleSize.SAS;
            break;
        case 'multiple':
            sampleSize = NetworkSampleSize.MULTIPLE;
        default:
            sampleSize = MAX_NETWORK_SIZE;
    }

    return sampleSize;
}