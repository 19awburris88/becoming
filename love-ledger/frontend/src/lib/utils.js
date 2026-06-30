import dayjs from 'dayjs'

export const getDaysUntil = (dateStr) => {
  const target = dayjs(dateStr)
  const today = dayjs()
  const thisYear = target.year(today.year())
  if (thisYear.isBefore(today, 'day')) {
    return thisYear.add(1, 'year').diff(today, 'day')
  }
  return thisYear.diff(today, 'day')
}

export const getRelationshipTypeColor = (type) => {
  const colors = {
    Wife: '#8B5CF6',
    Husband: '#8B5CF6',
    Partner: '#8B5CF6',
    Spouse: '#8B5CF6',
    Son: '#0EA5E9',
    Daughter: '#EC4899',
    Child: '#06B6D4',
    Mother: '#10B981',
    Father: '#10B981',
    Parent: '#10B981',
    Sibling: '#06B6D4',
    Brother: '#06B6D4',
    Sister: '#06B6D4',
    Friend: '#F59E0B',
    'Best Friend': '#F59E0B',
    Mentor: '#8B5CF6',
    Mentee: '#8B5CF6',
    'Extended Family': '#6B7280',
    Other: '#6B7280',
  }
  return colors[type] || '#6B7280'
}

export const getInitials = (name = '') => {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const getAvatarColor = (name = '') => {
  const colors = ['#8B5CF6', '#0EA5E9', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#EF4444', '#6366F1']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}

export const normalizeRelationship = (raw) => ({
  ...raw,
  initials: raw.initials || getInitials(raw.name),
  avatarColor: raw.avatarColor || getAvatarColor(raw.name),
  favorites: raw.favorites || {},
  sizes: raw.sizes || {},
  loveProfile: raw.loveProfile || {},
})

export const normalizeDates = (dates) =>
  dates.map((d) => ({ ...d, personName: d.person?.name || d.personName || '' }))

export const normalizeMemories = (memories) =>
  memories.map((m) => ({
    ...m,
    personIds: m.people?.map((p) => p.id) || m.personIds || [],
    personNames: m.people?.map((p) => p.name) || m.personNames || [],
  }))

export const normalizeGifts = (gifts) =>
  gifts.map((g) => ({ ...g, personName: g.person?.name || g.personName || '' }))

export const getUpcomingFromDates = (dates) =>
  normalizeDates(dates)
    .map((d) => ({ ...d, daysUntil: getDaysUntil(d.date) }))
    .filter((d) => d.daysUntil >= 0 && d.daysUntil <= 60)
    .sort((a, b) => a.daysUntil - b.daysUntil)
