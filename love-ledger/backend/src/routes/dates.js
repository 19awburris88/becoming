import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/dates — all dates for user (optionally filter by personId)
router.get('/', async (req, res) => {
  const userId = req.userId
  const { personId } = req.query

  const dates = await prisma.importantDate.findMany({
    where: {
      person: { userId },
      ...(personId ? { personId } : {}),
    },
    include: { person: { select: { name: true } } },
    orderBy: { date: 'asc' },
  })
  res.json(dates)
})

// POST /api/dates
router.post('/', async (req, res) => {
  const userId = req.userId
  const { personId, title, date, type, reminderDays, notes } = req.body

  const person = await prisma.person.findFirst({ where: { id: personId, userId } })
  if (!person) return res.status(404).json({ error: 'Person not found' })

  const importantDate = await prisma.importantDate.create({
    data: {
      personId,
      title,
      date: new Date(date),
      type,
      reminderDays: reminderDays || [7],
      notes,
    },
  })
  res.status(201).json(importantDate)
})

// PATCH /api/dates/:id
router.patch('/:id', async (req, res) => {
  const updated = await prisma.importantDate.update({
    where: { id: req.params.id },
    data: req.body,
  })
  res.json(updated)
})

// DELETE /api/dates/:id
router.delete('/:id', async (req, res) => {
  await prisma.importantDate.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

export default router
