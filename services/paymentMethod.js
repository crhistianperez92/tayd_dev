import request from '../lib/request';

function get(id) {
    return request({
        url: `payment-methods/${id}`,
        method: 'GET'
    });
}

function list(id) {
    return request({
        url: `payment-methods/user-cards/${id}`,
        method: 'GET'
    });
}

function store(objPaymentMethod) {
    return request({
        url: 'payment-methods',
        method: 'POST',
        data: objPaymentMethod
    });
}

function getPredeterminedSource(id) {
    return request({
        url: `payment-methods/user-predetermined/${id}`,
        method: 'GET'
    })
}

function setPredeterminedSource(id) {
    return request({
        url: `payment-methods/predetermined/${id}`,
        method: 'GET'
    })
}

const PaymentMethodService = {
    get, list, store, setPredeterminedSource, getPredeterminedSource
}

export default PaymentMethodService;