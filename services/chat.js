import request from '../lib/request';

function getMessages(serviceId) {
    return request({
        url: `chat/${serviceId}`,
        method: 'GET'
    });
}

function newMessage(objMessage) {
    return request({
        url: 'chat/new-message',
        method: "POST",
        data: objMessage
    })
}

const ChatService = {
    getMessages, newMessage
}

export default ChatService;