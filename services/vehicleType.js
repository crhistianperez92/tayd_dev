import request from '../lib/request';

function getAll() {
    return request({
        url: 'vehicles-types',
        method: 'GET'
    });
}

function getVehicleType(id) {
    return request({
        url: `vehicles-types/${id}`,
        method: 'GET'
    })
}

const VehicleTypeService = {
    getAll, getVehicleType
}

export default VehicleTypeService;