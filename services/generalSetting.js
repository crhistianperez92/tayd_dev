import request from '../lib/request';

function getAll() {
    return request({
        url: 'general-settings/list',
        method: 'GET'
    });
}

function getByKey(key) {
    return request({
        url: `general-settings/key/${key}`,
        method: 'GET'
    });
}

const GeneralSettingService = {
    getAll, getByKey
}

export default GeneralSettingService;