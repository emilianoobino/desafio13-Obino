import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:9090');

//mongoose.connect(`mongodb+srv://chaval198678:tonyfunko@cluster0.6l6psjf.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0`)

describe("Testing sessions y cookies", () => {

    before(function () {
        this.cookie;
        this.mockUser = {
            first_name: "emiliano",
            last_name: "perez",
            email: "testEmail@prueba.com",
            age: 17,
            password: "123",
            role: 'admin'
        }
    })

     // Test_01
     it("Test Registro Usuario: Debe poder registrar correctamente un usuario",async function () {
        //Then
        const result = await requester.post('/api/sessions/register').send(this.mockUser)
        
        //Assert
        expect(result.status).to.equal(200);
    })

    //Test 2
    it("Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente.", async function () {
        // Given
        const mockLogin = {
            email: this.mockUser.email,
            password: this.mockUser.password
        }

        // Then
        const result = await requester.post('/api/sessions/login').send(mockLogin)
        
        const cookieResult = result.headers['set-cookie'][0]
        const cookieData = cookieResult.split("=")
        this.cookie = {
            name: cookieData[0],
            value: cookieData[1]
        }

        // Assert
        expect(result.statusCode).is.eqls(200)
        expect(this.cookie.name).to.be.ok.and.eql('connect.sid')
        expect(this.cookie.value).to.be.ok
    })

});
