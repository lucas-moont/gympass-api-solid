import fastify from 'fastify'
import { appRoutes } from './http/routes/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if(error instanceof ZodError){
    reply.status(400).send({
      message: 'Validation error', 
      issues: error.format()
    })
  }

  if(env.NODE_ENV !== 'production'){
    console.log(error)
  }else{
    //TODO: Here we should log an external tool like DataDog/NewRelic/Sentry
  }

  reply.status(500).send({
    message: 'Internal server error.'
  })
})