// lib/cors.js
import Cors from 'cors'
import initMiddleware from './init-middleware'

const allowedOrigins = [
  'http://103.106.104.34:3000',
  'http://990toeichadong.com',
  'https://990toeichadong.com'
]

const cors = initMiddleware(
  Cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)

export default cors
