import request from '../lib/request';
import env from '../lib/enviroment';
import axios from 'axios';

function get(id) {
    return request({
        url: `properties/${id}`,
        method: 'GET'
    });
}

function store(property) {
    return request({
        url: 'properties',
        method: 'POST',
        data: property
    });
}

function getUserProperties(id) {
    return request({
        url: `properties/user/${id}`,
        method: 'GET'
    });
}

function setPredeterminedProperty(id) {
    return request({
        url: `properties/predetermined/${id}`,
        method: 'GET'
    })
}

function getPredeterminedProperty(id) {
    return request({
        url: `properties/user-predetermined/${id}`,
        method: 'GET'
    });
}

function getMapAddress(coords) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${env.MAPS_API_KEY}`)
        .then(response => {
            return response.data;
        })
        .catch(error => Promise.reject(error.response || error.message));
}

const PropertyService = {
    get, store, getUserProperties, setPredeterminedProperty, getPredeterminedProperty, getMapAddress
}

export default PropertyService;