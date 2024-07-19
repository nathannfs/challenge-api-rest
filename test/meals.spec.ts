import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal.', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'New name',
        description: 'New description',
        inside_diet: true,
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'New name',
      description: 'New description',
      inside_diet: true,
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies!)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'New name',
        description: 'New description',
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'New name',
      description: 'New description',
      inside_diet: true,
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies!)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies!)
      .expect(200)

    expect(getMealResponse.body.meals).toEqual(
      expect.objectContaining({
        name: 'New name',
        description: 'New description',
      }),
    )
  })

  it('should be able to update a specific meal', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'New name',
      description: 'New description',
      inside_diet: true,
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies!)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies!)
      .send({
        name: 'New name modified',
        description: 'New description modified',
        inside_diet: true,
        created_at: '2022-01-01T00:00:00.000Z',
      })
      .expect(201)

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies!)
      .expect(200)

    expect(getMealResponse.body.meals).toEqual(
      expect.objectContaining({
        name: 'New name modified',
        description: 'New description modified',
      }),
    )
  })
})
