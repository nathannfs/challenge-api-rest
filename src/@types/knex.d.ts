// eslint-disable-next-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: number
      inside_diet: boolean
      created_at: string
      session_id?: string
    }
  }
}
