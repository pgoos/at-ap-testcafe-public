import { executionEnv } from "../../utils/envs";

const defaultUrls = {
    start: {
        dev: '<dev>',
        staging: '<staging>'
    },
    api: {
        dev: '<dev api>',
        staging: '<staging api>'
    }
};

const getEnvBasedUrl = (env, url) => {
    if (env === 'dev') {
        return url.dev;
    }
    
    return url.staging;
}

export const startUrl = getEnvBasedUrl(executionEnv, defaultUrls.start);
export const apiUrl = getEnvBasedUrl(executionEnv, defaultUrls.api);