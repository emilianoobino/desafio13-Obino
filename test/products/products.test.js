import { expect } from 'chai';
import supertest from 'supertest';

//const expect = chai.expect;
const requester = supertest('http://localhost:9090')


describe("Test Products", () => {

    describe("Testing Api Products", ()=> {

        //Test 1: crear un nuevo producto
        it("Crear Producto: El API POST /api/products debe crear un nuevo producto correctamente", async () => {
            //Given
            const productMock = {
                owner: "admin",
                title: "Vestido negro Guess",
                description: "Vestido con cuello cruzado y con tela brillante",
                code: "VNB_G_02",
                price: 900,
                stock: 2,
                category: "vestido",
                thumbnail: ""
            }

            
            

            //Then
            const result = await requester.post("/api/products")
                //.set('Cookie', [`session=${encodeURIComponent(JSON.stringify(sessionData))}`])  
                .field('title', productMock.title)
                .field('description', productMock.description)
                .field('code', productMock.code)
                .field('price', productMock.price)
                .field('stock', productMock.stock)
                .field('category', productMock.category)
                .attach('files', './test/files/vestidoNegro-G.jpeg')
                .field('owner', productMock.owner);

            //Assert
            expect(result.statusCode).to.eql(201);
        })

        //test 2
        it("Creamos producto sin algun parámetro: El API POST /api/products debe retornar un estado HTTP de 400", async () => {
            //Given
            const productMock = {
                owner: "admin",
                title: "Vestido negro Guess",
                description: "Vestido con cuello cruzado y con tela brillante",
                code: "VNB_G_02",
                price: 900,
                stock: 2
            }

            // Then
            const result = await requester.post("/api/products")
                  
                .field('title', productMock.title)
                .field('description', productMock.description)
                .field('code', productMock.code)
                .field('price', productMock.price)
                .field('stock', productMock.stock)
                .attach('files', './test/files/vestidoNegro-G.jpeg')
                .field('owner', productMock.owner);

            //Assert
            expect(result.statusCode).is.eql(400)
            expect(result.body).to.have.property('status', 'error');
            expect(result. body).to.have.property('msg', '¡Oh oh! No se han completado todos los campos requeridos.');
        })

    })

})

