const { productsMock, filteredProductsMock } = require("./products");
const sinon = require("sinon");

const getAllStub = sinon.stub();
const tagQuery = { tags: { $in: ["expensive"] }};

getAllStub.withArgs("products").resolves(productsMock);
getAllStub.withArgs("products",tagQuery).resolves(filteredProductsMock("expensive"));


const createStub = sinon.stub().resolves("345534");

class MongoLibMock {
    getAll(collection,query){
        return getAllStub(collection,query);
    }

    create(collection,data){
        return createStub(collection,data);
    }
}

module.exports = {
    getAllStub,
    createStub,
    MongoLibMock
}
