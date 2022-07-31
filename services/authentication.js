import request from '../lib/request';

function login(user) {
    return request({
        url: 'auth/login',
        method: 'POST',
        data: user
    });
}

function signup(user) {
    return request({
        url: 'auth/signup',
        method: 'POST',
        data: user
    });
}

function sendVerificationCode(data) {
    return request({
        url: 'auth/send-verification',
        method: 'POST',
        data: data
    });
}

function confirmVerificationCode(data) {
    return request({
        url: 'auth/confirm-verification',
        method: 'POST',
        data: data
    });
}

const AuthenticationService = {
    login, signup, sendVerificationCode, confirmVerificationCode
}

export default AuthenticationService;