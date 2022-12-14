import request from 'supertest'
import { app } from './app'

describe('Authenticate Routes', () => {
  describe('POST /authenticate', () => {
    test('should return 200 when request authenticate on success', async () => {
      await request(app)
        .post('/api/authenticate')
        .send({
          email: 'teste@email.com',
          password: '123456789'
        })
        .expect(200)
    })
  })
})
