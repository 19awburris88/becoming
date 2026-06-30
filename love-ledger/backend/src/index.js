import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { clerkMiddleware } from '@clerk/express'

import relationshipsRouter from './routes/relationships.js'
import datesRouter from './routes/dates.js'
import memoriesRouter from './routes/memories.js'
import giftsRouter from './routes/gifts.js'
import { requireAuth } from './middleware/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())
app.use(morgan('dev'))
app.use(clerkMiddleware())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/relationships', requireAuth, relationshipsRouter)
app.use('/api/dates', requireAuth, datesRouter)
app.use('/api/memories', requireAuth, memoriesRouter)
app.use('/api/gifts', requireAuth, giftsRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Love Ledger API running on port ${PORT}`)
})
