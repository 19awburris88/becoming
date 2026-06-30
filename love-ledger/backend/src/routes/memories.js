import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/memories
router.get('/', async (req, res) => {
  const userId = req.userId
  const { personId } = req.query

  const memories = await prisma.memory.findMany({
    where: {
      userId,
      ...(personId
        ? { people: { some: { id: personId } } }
        : {}),
    },
    include: {
      people: { select: { id: true, name: true } },
    },
    orderBy: { date: 'desc' },
  })
  res.json(memories)
})

// POST /api/memories
router.post('/', async (req, res) => {
  const userId = req.userId
  const { title, date, description, personIds, tags, photos } = req.body

  const memory = await prisma.memory.create({
    data: {
      userId,
      title,
      date: new Date(date),
      description,
      tags: tags || [],
      photos: photos || [],
      people: {
        connect: personIds.map((id) => ({ id })),
      },
    },
    include: { people: { select: { id: true, name: true } } },
  })
  res.status(201).json(memory)
})

// PATCH /api/memories/:id
router.patch('/:id', async (req, res) => {
  const { personIds, ...data } = req.body
  const updated = await prisma.memory.update({
    where: { id: req.params.id },
    data: {
      ...data,
      ...(personIds
        ? { people: { set: personIds.map((id) => ({ id })) } }
        : {}),
    },
    include: { people: { select: { id: true, name: true } } },
  })
  res.json(updated)
})

// DELETE /api/memories/:id
router.delete('/:id', async (req, res) => {
  await prisma.memory.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

export default router
