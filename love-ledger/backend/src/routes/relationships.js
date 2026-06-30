import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const relationships = await prisma.person.findMany({
    where: { userId: req.userId },
    include: {
      dates: { orderBy: { date: 'asc' } },
      _count: { select: { memories: true, gifts: true } },
    },
    orderBy: { name: 'asc' },
  })
  res.json(relationships)
})

router.get('/:id', async (req, res) => {
  const person = await prisma.person.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: {
      dates: { orderBy: { date: 'asc' } },
      memories: {
        orderBy: { date: 'desc' },
        include: { people: { select: { id: true, name: true } } },
      },
      gifts: { orderBy: { addedDate: 'desc' } },
    },
  })
  if (!person) return res.status(404).json({ error: 'Not found' })
  res.json(person)
})

router.post('/', async (req, res) => {
  const { name, relationship, birthday, anniversary, phone, email, favorites, sizes, loveProfile, notes } = req.body
  const person = await prisma.person.create({
    data: {
      userId: req.userId,
      name,
      relationship,
      birthday: birthday ? new Date(birthday) : null,
      anniversary: anniversary ? new Date(anniversary) : null,
      phone,
      email,
      favorites: favorites || {},
      sizes: sizes || {},
      loveProfile: loveProfile || {},
      notes,
    },
  })
  res.status(201).json(person)
})

router.patch('/:id', async (req, res) => {
  const existing = await prisma.person.findFirst({ where: { id: req.params.id, userId: req.userId } })
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const { birthday, anniversary, ...rest } = req.body
  const updated = await prisma.person.update({
    where: { id: req.params.id },
    data: {
      ...rest,
      ...(birthday !== undefined ? { birthday: birthday ? new Date(birthday) : null } : {}),
      ...(anniversary !== undefined ? { anniversary: anniversary ? new Date(anniversary) : null } : {}),
    },
  })
  res.json(updated)
})

router.delete('/:id', async (req, res) => {
  const existing = await prisma.person.findFirst({ where: { id: req.params.id, userId: req.userId } })
  if (!existing) return res.status(404).json({ error: 'Not found' })
  await prisma.person.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

export default router
