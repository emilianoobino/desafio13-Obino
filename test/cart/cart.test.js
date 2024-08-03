import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:3000");

describe("Test modulo Carts", () => {  
        
    let cartId; // Variable para almacenar el _id del carrito
    let productId = "id_del_producto"; // Asegúrate de definir esto con un valor válido para los tests

    //1.- Creamos un carrito
    it("El endpoint POST /api/carts/ crea un Cart", async () => {
        const result = await requester.post("/api/carts/");
        
        expect(result.statusCode).to.be.equal(200);
        expect(result.body.cart).to.haveOwnProperty("_id");
        // Almacenar el _id del carrito creado
        cartId = result.body.cart._id;
    });

    //2.- Agregamos un Producto al carrito
    it("El endpoint POST /api/carts/:cartId/product/:productId agrega un producto al carrito", async () => {
        // Se verifica que cartId esté definido antes de usarlo
        expect(cartId).to.not.be.undefined;

        const bodyCart = {
            quantity: 2
        };
       
        const result = await requester.post(`/api/carts/${cartId}/product/${productId}`).send(bodyCart);
        
        expect(result.statusCode).to.be.equal(200);
        expect(result.body.status).to.be.equal("success");
    });

    //3.- Obtenemos todos los carritos
    it("El endpoint GET /api/carts/ obtiene todos los carritos", async () => {
        const result = await requester.get("/api/carts/");
        
        expect(result.statusCode).to.be.equal(200);
        expect(result.body.carts).to.be.an('array');
    });
});

