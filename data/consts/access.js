import { executionEnv } from "../../utils/envs";

const defaultUrls = {
    start: {
        dev: 'http://23.22.120.132',
        staging: 'http://3.226.60.41'
    },
    api: {
        dev: 'http://ec2-3-91-239-16.compute-1.amazonaws.com:3000/',
        staging: 'http://ec2-18-206-35-253.compute-1.amazonaws.com:3000/'
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