import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Button, Chip,
  Divider, IconButton, LinearProgress, Alert,
} from '@mui/material'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { api } from '../lib/api'
import {
  getDaysUntil, getUpcomingFromDates, normalizeGifts, normalizeMemories,
  normalizeDates, getAvatarColor, getInitials,
} from '../lib/utils'
import dayjs from 'dayjs'

const promptIcons = {
  CalendarToday: <CalendarTodayRoundedIcon sx={{ fontSize: 20 }} />,
  EmojiEvents: <EmojiEventsRoundedIcon sx={{ fontSize: 20 }} />,
  FavoriteBorder: <FavoriteBorderRoundedIcon sx={{ fontSize: 20 }} />,
  PersonOutline: <PersonOutlineRoundedIcon sx={{ fontSize: 20 }} />,
}

function DateBadge({ daysUntil }) {
  if (daysUntil === 0) return <Chip label="Today!" size="small" sx={{ bgcolor: '#FDECEA', color: '#C0392B', fontWeight: 700, fontSize: '0.72rem' }} />
  if (daysUntil === 1) return <Chip label="Tomorrow" size="small" sx={{ bgcolor: '#FDF6E8', color: '#C4973F', fontWeight: 700, fontSize: '0.72rem' }} />
  if (daysUntil <= 7) return <Chip label={`${daysUntil} days`} size="small" sx={{ bgcolor: '#FDF6E8', color: '#C4973F', fontWeight: 700, fontSize: '0.72rem' }} />
  return <Chip label={`${daysUntil} days`} size="small" sx={{ bgcolor: '#F0F9FF', color: '#0EA5E9', fontWeight: 600, fontSize: '0.72rem' }} />
}

function TypeIcon({ type }) {
  const icons = { Birthday: '🎂', Anniversary: '💍', Event: '📅', Graduation: '🎓', Medical: '🏥', Other: '📌' }
  return <span style={{ fontSize: '1.1rem' }}>{icons[type] || icons.Other}</span>
}

function computePrompts(upcomingDates, people, gifts) {
  const prompts = []

  // Urgent upcoming dates within 14 days
  upcomingDates.forEach((d) => {
    if (d.daysUntil <= 14) {
      prompts.push({
        id: `date-${d.id}`,
        type: 'urgency',
        icon: 'CalendarToday',
        color: '#C4973F',
        message: `${d.title} is in ${d.daysUntil} day${d.daysUntil !== 1 ? 's' : ''}.`,
        subtext: d.notes || `Don't forget to plan something special for ${d.personName}.`,
        personId: d.personId,
        actionLabel: 'View Profile',
      })
    }
  })

  // Upcoming birthday or anniversary with no active gift ideas
  upcomingDates
    .filter((d) => d.daysUntil <= 30 && ['Birthday', 'Anniversary'].includes(d.type))
    .forEach((d) => {
      const hasGift = gifts.some((g) => g.personId === d.personId && g.status !== 'Given')
      if (!hasGift) {
        prompts.push({
          id: `gift-gap-${d.id}`,
          type: 'gift',
          icon: 'EmojiEvents',
          color: '#10B981',
          message: `${d.personName}'s ${d.type} is in ${d.daysUntil} day${d.daysUntil !== 1 ? 's' : ''} — no gift ideas saved.`,
          subtext: 'Save a few ideas now before you forget.',
          personId: d.personId,
          actionLabel: 'Add Gift Idea',
          actionPath: '/app/gifts',
        })
      }
    })

  // Haven't reached out in 30+ days
  people
    .filter((p) => p.lastContact && dayjs().diff(dayjs(p.lastContact), 'day') > 30)
    .slice(0, 2)
    .forEach((p) => {
      const days = dayjs().diff(dayjs(p.lastContact), 'day')
      prompts.push({
        id: `contact-${p.id}`,
        type: 'contact',
        icon: 'PersonOutline',
        color: '#8B5CF6',
        message: `You haven't reached out to ${p.name.split(' ')[0]} in ${days} days.`,
        subtext: 'A quick message goes a long way.',
        personId: p.id,
        actionLabel: 'View Profile',
      })
    })

  return prompts.slice(0, 5)
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { user } = useUser()
  const [people, setPeople] = useState([])
  const [gifts, setGifts] = useState([])
  const [memories, setMemories] = useState([])
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dismissedPrompts, setDismissedPrompts] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const token = await getToken()
        const [p, g, m, d] = await Promise.all([
          api.relationships.list(token),
          api.gifts.list(token),
          api.memories.list(token),
          api.dates.list(token),
        ])
        if (!cancelled) {
          setPeople(p)
          setGifts(normalizeGifts(g))
          setMemories(normalizeMemories(m))
          setDates(d)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const upcomingDates = useMemo(() => getUpcomingFromDates(dates), [dates])
  const prompts = useMemo(() => computePrompts(upcomingDates, people, gifts), [upcomingDates, people, gifts])
  const visiblePrompts = prompts.filter((p) => !dismissedPrompts.includes(p.id))
  const activeGifts = gifts.filter((g) => g.status !== 'Given')
  const recentMemories = [...memories].sort((a, b) => dayjs(b.date).diff(dayjs(a.date))).slice(0, 3)

  const firstName = user?.firstName || 'there'

  const statCards = [
    { label: 'Relationships', value: people.length, icon: <PeopleRoundedIcon />, color: '#8B5CF6', lightColor: '#F5F3FF', path: '/app/relationships' },
    { label: 'Upcoming Dates', value: upcomingDates.length, icon: <CalendarTodayRoundedIcon />, color: '#C4973F', lightColor: '#FDF6E8', path: '/app/relationships' },
    { label: 'Saved Memories', value: memories.length, icon: <AutoStoriesRoundedIcon />, color: '#0EA5E9', lightColor: '#F0F9FF', path: '/app/memories' },
    { label: 'Gift Ideas', value: activeGifts.length, icon: <CardGiftcardRoundedIcon />, color: '#10B981', lightColor: '#ECFDF5', path: '/app/gifts' },
  ]

  if (loading) return <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />

  if (error) return (
    <Box sx={{ p: 4 }}>
      <Alert severity="error">Failed to load dashboard: {error}</Alert>
    </Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#1A1A2E', mb: 0.5 }}>
          Good morning, {firstName}.
        </Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '0.95rem' }}>
          {dayjs().format('dddd, MMMM D, YYYY')} · Here's what's on your radar.
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card onClick={() => navigate(stat.path)} sx={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', '&:hover': { transform: 'translateY(-1px)', boxShadow: 3 } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: '10px', bgcolor: stat.lightColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E', lineHeight: 1, mb: 0.5 }}>{stat.value}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          {/* Thoughtfulness Engine */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: '#FDF6E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4973F' }}>
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#1A1A2E', lineHeight: 1 }}>Thoughtfulness Engine</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Nudges to help you be intentional</Typography>
                </Box>
              </Box>

              {visiblePrompts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: '#9CA3AF' }}>
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 36, mb: 1, opacity: 0.5 }} />
                  <Typography>You're all caught up. Well done.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {visiblePrompts.map((prompt) => (
                    <Box key={prompt.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2.5, borderRadius: 2, bgcolor: '#FAFAF8', border: '1px solid #E8E3DA', position: 'relative' }}>
                      <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: `${prompt.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: prompt.color, flexShrink: 0 }}>
                        {promptIcons[prompt.icon]}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A2E', mb: 0.5 }}>{prompt.message}</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>{prompt.subtext}</Typography>
                        <Button size="small" onClick={() => navigate(prompt.actionPath || `/app/relationships/${prompt.personId}`)} endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
                          sx={{ mt: 1.5, color: prompt.color, p: 0, fontSize: '0.78rem', fontWeight: 600, minWidth: 0, '&:hover': { bgcolor: 'transparent', opacity: 0.8 } }}>
                          {prompt.actionLabel}
                        </Button>
                      </Box>
                      <IconButton size="small" onClick={() => setDismissedPrompts((prev) => [...prev, prompt.id])} sx={{ color: '#9CA3AF', flexShrink: 0, mt: -0.5, mr: -0.5 }}>
                        <CloseRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Recent Memories */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}>
                    <AutoStoriesRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#1A1A2E' }}>Recent Memories</Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />} onClick={() => navigate('/app/memories')} sx={{ color: '#6B7280', fontSize: '0.8rem' }}>
                  View all
                </Button>
              </Box>
              {recentMemories.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3, color: '#9CA3AF' }}>
                  <Typography sx={{ fontSize: '0.875rem' }}>No memories yet. Start saving moments.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {recentMemories.map((memory, i) => (
                    <Box key={memory.id}>
                      <Box onClick={() => navigate('/app/memories')} sx={{ display: 'flex', gap: 2, py: 2, cursor: 'pointer', '&:hover': { '& .memory-title': { color: '#C4973F' } } }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: '#F8F6F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📸</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography className="memory-title" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A2E', mb: 0.5, transition: 'color 0.15s' }}>{memory.title}</Typography>
                          <Typography sx={{ fontSize: '0.78rem', color: '#6B7280' }} noWrap>{memory.description?.substring(0, 75)}...</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF', mt: 0.5 }}>
                            {dayjs(memory.date).format('MMMM D, YYYY')} · {memory.personNames?.join(', ')}
                          </Typography>
                        </Box>
                      </Box>
                      {i < recentMemories.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          {/* Coming Up */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: '#FDF6E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4973F' }}>
                    <CalendarTodayRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#1A1A2E' }}>Coming Up</Typography>
                </Box>
                <Chip label="Next 60 days" size="small" sx={{ bgcolor: '#F8F6F1', color: '#6B7280', fontSize: '0.72rem' }} />
              </Box>
              {upcomingDates.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3, color: '#9CA3AF' }}>
                  <Typography sx={{ fontSize: '0.875rem' }}>No upcoming dates in the next 60 days.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {upcomingDates.slice(0, 6).map((date, i) => {
                    const person = people.find((p) => p.id === date.personId)
                    const color = person ? getAvatarColor(person.name) : '#6B7280'
                    const initials = person ? getInitials(person.name) : '?'
                    return (
                      <Box key={date.id}>
                        <Box onClick={() => navigate(`/app/relationships/${date.personId}`)} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, cursor: 'pointer', '&:hover': { '& .date-title': { color: '#C4973F' } } }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: color, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{initials}</Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TypeIcon type={date.type} />
                              <Typography className="date-title" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1A1A2E', transition: 'color 0.15s' }} noWrap>{date.title}</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{date.personName} · {dayjs(date.date).format('MMM D')}</Typography>
                          </Box>
                          <DateBadge daysUntil={date.daysUntil} />
                        </Box>
                        {i < Math.min(upcomingDates.length - 1, 5) && <Divider />}
                      </Box>
                    )
                  })}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Gift snapshot */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                    <CardGiftcardRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#1A1A2E' }}>Gift Tracker</Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />} onClick={() => navigate('/app/gifts')} sx={{ color: '#6B7280', fontSize: '0.8rem' }}>View all</Button>
              </Box>
              {activeGifts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3, color: '#9CA3AF' }}>
                  <Typography sx={{ fontSize: '0.875rem' }}>No gift ideas saved yet.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {activeGifts.slice(0, 4).map((gift, i) => (
                    <Box key={gift.id}>
                      <Box onClick={() => navigate('/app/gifts')} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, cursor: 'pointer' }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#F8F6F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>🎁</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1A1A2E' }} noWrap>{gift.title}</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{gift.personName} · {gift.occasion}</Typography>
                        </Box>
                        <Chip label={gift.status} size="small" sx={{ bgcolor: gift.status === 'Purchased' ? '#ECFDF5' : gift.status === 'Saved' ? '#F0F9FF' : '#F8F6F1', color: gift.status === 'Purchased' ? '#10B981' : gift.status === 'Saved' ? '#0EA5E9' : '#6B7280', fontWeight: 600, fontSize: '0.7rem' }} />
                      </Box>
                      {i < 3 && <Divider />}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* People row */}
      {people.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                    <PeopleRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#1A1A2E' }}>Your People</Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />} onClick={() => navigate('/app/relationships')} sx={{ color: '#6B7280', fontSize: '0.8rem' }}>View all</Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 1 }}>
                {people.map((person) => {
                  const color = getAvatarColor(person.name)
                  const initials = getInitials(person.name)
                  return (
                    <Box key={person.id} onClick={() => navigate(`/app/relationships/${person.id}`)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, cursor: 'pointer', flexShrink: 0, '&:hover': { '& .person-name': { color: '#C4973F' } } }}>
                      <Avatar sx={{ width: 56, height: 56, bgcolor: color, fontSize: '1rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>{initials}</Avatar>
                      <Typography className="person-name" sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1A1A2E', transition: 'color 0.15s', textAlign: 'center' }}>
                        {person.name.split(' ')[0]}
                      </Typography>
                      <Chip label={person.relationship} size="small" sx={{ bgcolor: `${color}15`, color, fontWeight: 600, fontSize: '0.65rem', height: 20 }} />
                    </Box>
                  )
                })}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  )
}
