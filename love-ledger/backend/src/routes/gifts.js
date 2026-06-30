import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/gifts
router.get('/', async (req, res) => {
  const userId = req.userId
  const { personId, status } = req.query

  const gifts = await prisma.gift.findMany({
    where: {
      userId,
      ...(personId ? { personId } : {}),
      ...(status ? { status } : {}),
    },
    include: { person: { select: { id: true, name: true } } },
    orderBy: { addedDate: 'desc' },
  })
  res.json(gifts)
})

// POST /api/gifts
router.post('/', async (req, res) => {
  const userId = req.userId
  const { personId, title, occasion, budget, purchaseLink, notes, status } = req.body

  const gift = await prisma.gift.create({
    data: {
      userId,
      personId,
      title,
      occasion,
      budget: budget ? parseFloat(budget) : null,
      purchaseLink,
      notes,
      status: status || 'Idea',
    },
    include: { person: { select: { id: true, name: true } } },
  })
  res.status(201).json(gift)
})

// PATCH /api/gifts/:id
router.patch('/:id', async (req, res) => {
  const updated = await prisma.gift.update({
    where: { id: req.params.id },
    data: req.body,
    include: { person: { select: { id: true, name: true } } },
  })
  res.json(updated)
})

// DELETE /api/gifts/:id
router.delete('/:id', async (req, res) => {
  await prisma.gift.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

export default router
