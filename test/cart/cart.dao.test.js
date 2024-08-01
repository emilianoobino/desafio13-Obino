import mongoose from "mongoose";
import chai from "chai";
import { createCartService, getCartsService } from "../../src/repositories/cart.repository.js";

mongoose.connect(`mongodb+srv://chaval198678:tonyfunko@cluster0.6l6psjf.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0`)

const expect = chai.expect;

describe('Testing Carts Service', () => {

    before(async function () {
        this.timeout(5000); // Incrementa el tiempo de espera si es necesario
        await mongoose.connection.once('open', () => {
            console.log('Connected to MongoDB');
        });
    });

    beforeEach(async function () {
        this.timeout(5000);
        await mongoose.connection.collections.carts.drop();
    });

    //Test 1
    it('El servicio debe devolver los carts en formato de arreglo.', async function () {
        // Given
        let emptyArray = [];

        // Then
        const result = await getCartsService();

        // Assert 
        console.log(result);
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });

    //Test 2
    it('El service debe agregar un cart correctamente a la BD.', async function () {
        //Given 
        const cart = {
            products: [],
            id: 345
        }
        //Then
        const result = await createCartService(cart);
        console.log(result)
        //Assert 
        expect(result._id).to.be.ok;
    });
});