import supertest from "supertest";
import { expect } from "chai";
import cartModel from "../src/models/cart.model.js";
import productModel from "../src/models/product.model.js";

const requester = supertest("http://localhost:3000");

describe("Testing de App e-Commerce", () => {

    let productId;

    before(async function () {
        await productModel.deleteMany({});
        await cartModel.deleteMany({});
    });

    describe("Test modulo Products", () => {

        it("El endpoint POST /api/products crea un producto correctamente", async () => {
            // Crea un producto
            const productMock = {
                title: "Papas Fritas",
                description: "Papas fritas Lays x 150 grs.",
                code: 54874,
                price: 1500,
                status: true,
                stock: 25,
                category: "Snack",
                owner: "emi@gmail.com",
                thumbnails: [],
            };

            const result = await requester.post("/api/products/testing").send(productMock);
            
            // Almacenar el _id del producto creado
            productId = result.body.result._id;
            
            // Verifica que la creación del producto fue exitosa
            expect(result.status).to.equal(200);
            expect(result.body.status).to.equal("success");
            expect(result.body.result).to.have.property("_id");
        });

        it("El endpoint GET /api/products devuelve array de productos", async () => {
            const result = await requester.get("/api/products/");
            
            // Se verifica que devuelva status 200 y un array
            expect(result.status).to.equal(200);
            expect(result.body.status).to.equal("success");
            expect(result.body.products.docs).to.be.an("array");
        });

        it("El endpoint GET /api/products/:pid devuelve objeto de producto", async () => {
            // productId se inicializa cuando se crea el producto en el test anterior
            const result = await requester.get(`/api/products/${productId}`);
            
            // Se verifica que devuelva status 200 y un objeto
            expect(result.status).to.equal(200);
            expect(result.body.status).to.equal("success");
            expect(result.body.product).to.be.an("object");
        });
    });
});



