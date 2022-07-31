import request from '../lib/request';

function storeDocuments(objDocument) {
    return request({
        url: 'users/upload_document',
        method: 'POST',
        data: objDocument
    });
}

function firstLoginTayder(userId) {
    return request({
        url: `users/first-login-tayder/${userId}`,
        method: 'GET'
    })
}

const UserService = {
    storeDocuments, firstLoginTayder
}

export default UserService;