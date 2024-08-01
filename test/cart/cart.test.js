import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:9090')

describe("Test Carts", () => { 
    describe("Testing Carts Api", () => {

        //Test 1
        it("Crear Carrito: El API POST /api/carts debe crear un nuevo carrito correctamente", async () => {
            // Given
            const cartMock = {
                id: 1234,
                products: [
                    {
                        "product": "65ed5a133a890cee080fc502",
                        "quantity": 3,
                        "_id": "65f881834e66b126e9887c77"
                    }
                ]
            }

            // Then
            const { body, statusCode } = await requester.post("/api/carts").send(cartMock)
            // console.log(result);

            // Assert
            expect(statusCode).to.eql(201)
            expect(body).to.have.property('message').that.includes('Se ha creado un nuevo carrito con id');
            
        })
    })
})
