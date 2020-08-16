const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Profile', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it('should list incidents', async () => {
        const responseId = await request(app)
        .post('/ongs'). 
        send({
            name: "APAD",
	        email: "contato@apad.com",
	        whatsapp: "47000000000",
	        city: "Rio do Sul",
	        uf: "SC"
        });

        await request(app)
        .post('/incidents')
        .set('authorization', responseId.body.id)
        .send({
            title: "Caso 7",
	        description: "Detalhes do caso 7",
	        value: 120
        });

        const incidents = await request(app)
        .get('/profile')
        .set('authorization', responseId.body.id);

        expect(incidents).not.toBeNull();
    });
});