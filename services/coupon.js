import request from '../lib/request';

function getAll(userId) {
    return request({
        url: `users/${userId}/coupons`,
        method: 'GET'
    });
}

function store(objCoupon, userId) {
    return request({
        url: `users/${userId}/coupons`,
        method: "POST",
        data: objCoupon
    })
}

const CouponService = {
    getAll, store
}

export default CouponService;