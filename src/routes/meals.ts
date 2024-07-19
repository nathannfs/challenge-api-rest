/* eslint-disable camelcase */
import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals').where('session_id', sessionId).select()

      return { meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { meals }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const totalMeals = await knex('meals')
        .where('session_id', sessionId)
        .count('* as totalMeals')
        .first()

      const mealsInsideDiet = await knex('meals')
        .where('session_id', sessionId)
        .where('inside_diet', true)
        .count('* as mealsInsideDiet')
        .first()

      const mealsOutsideDiet = await knex('meals')
        .where('session_id', sessionId)
        .where('inside_diet', false)
        .count('* as mealsOutsideDiet')
        .first()

      const bestSequence = await knex('meals')
        .where('session_id', sessionId)
        .where('inside_diet', true)
        .orderBy('inside_diet', 'desc')
        .select()

      return {
        summary: {
          totalMeals,
          mealsInsideDiet,
          mealsOutsideDiet,
          bestSequence,
        },
      }
    },
  )

  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inside_diet: z.boolean(),
      created_at: z.string().default(new Date().toISOString()),
    })

    const { name, description, inside_diet, created_at } =
      createMealsBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      inside_diet,
      created_at,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        inside_diet: z.boolean(),
        created_at: z.string().default(new Date().toISOString()),
      })

      const { name, description, inside_diet, created_at } =
        createMealsBodySchema.parse(request.body)

      const { sessionId } = request.cookies

      await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .update({
          name,
          description,
          inside_diet,
          created_at,
        })

      return reply.status(201).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .delete()

      return reply.status(204).send()
    },
  )
}
