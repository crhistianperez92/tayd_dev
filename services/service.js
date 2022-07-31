import request from '../lib/request';

function get(id) {
    return request({
        url: `properties/${id}`,
        method: 'GET'
    });
}

function listScheduled(id) {
    return request({
        url: `services/list-scheduled/${id}`,
        method: 'GET'
    });
}

function listTayderScheduled(id) {
    return request({
        url: `services/list-tayder-scheduled/${id}`,
        method: 'GET'
    });
}

function listHistory(id) {
    return request({
        url: `services/list-history/${id}`,
        method: 'GET'
    });
}

function listTayderHistory(id) {
    return request({
        url: `services/list-tayder-history/${id}`,
        method: 'GET'
    });
}

function getUserEarnings(id) {
    return request({
        url: `services/earnings/${id}`,
        method: 'GET'
    });
}

function store(objService) {
    return request({
        url: 'services',
        method: 'POST',
        data: objService
    });
}

function getUserPaymentMethods(id) {
    return request({
        url: `properties/user/${id}`,
        method: 'GET'
    });
}

function acceptService(objService) {
    return request({
        url: 'services/accept',
        method: 'POST',
        data: objService
    });
}

function startService(objService) {
    return request({
        url: 'services/start',
        method: 'POST',
        data: objService
    });
}

function finishService(objService) {
    return request({
        url: 'services/finish',
        method: 'POST',
        data: objService
    });
}

function cancelService(objCancel) {
    return request({
        url: 'services/cancel',
        method: 'POST',
        data: objCancel
    });
}

function rateService(objRate) {
    return request({
        url: 'services/rate-service',
        method: 'POST',
        data: objRate
    })
}

const ServicesService = {
    get,
    store,
    acceptService,
    startService,
    finishService,
    cancelService,
    rateService,
    getUserPaymentMethods,
    getUserEarnings,
    listTayderHistory,
    listTayderScheduled,
    listScheduled,
    listHistory,
}

export default ServicesService;