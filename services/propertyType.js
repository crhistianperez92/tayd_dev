import request from '../lib/request';

function getAll() {
    return request({
        url: 'properties-types',
        method: 'GET'
    });
}

function getPropertyType(id) {
    return request({
        url: `properties-types/${id}`,
        method: 'GET'
    })
}

const PropertyTypeService = {
    getAll, getPropertyType
}

export default PropertyTypeService;