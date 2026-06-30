import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Button, Chip,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Select, FormControl, InputLabel, Divider, IconButton, LinearProgress, Alert,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { api } from '../lib/api'
import { getDaysUntil, getRelationshipTypeColor, getAvatarColor, getInitials, normalizeRelationship } from '../lib/utils'
import dayjs from 'dayjs'

const RELATIONSHIP_TYPES = [
  'Spouse', 'Wife', 'Husband', 'Partner',
  'Son', 'Daughter', 'Child',
  'Mother', 'Father', 'Parent',
  'Sibling', 'Brother', 'Sister',
  'Friend', 'Best Friend',
  'Mentor', 'Mentee', 'Extended Family', 'Other',
]

function AddPersonDialog({ open, onClose, onAdd }) {
  const { getToken } = useAuth()
  const [form, setForm] = useState({ name: '', relationship: '', birthday: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const newPerson = await api.relationships.create(form, token)
      onAdd(newPerson)
      onClose()
      setForm({ name: '', relationship: '', birthday: '', email: '', phone: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Add Someone</Typography>
        <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Full name" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sarah Johnson" />
          <FormControl fullWidth>
            <InputLabel>Relationship type</InputLabel>
            <Select value={form.relationship} label="Relationship type" onChange={(e) => setForm({ ...form, relationship: e.target.value })}>
              {RELATIONSHIP_TYPES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Birthday" type="date" fullWidth value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} InputLabelProps={{ shrink: true }} />
          <TextField label="Email" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Optional" />
          <TextField label="Phone" fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!form.name || !form.relationship || saving} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
          {saving ? 'Saving…' : 'Add Person'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function PersonCard({ person }) {
  const navigate = useNavigate()
  const color = getAvatarColor(person.name)
  const initials = getInitials(person.name)
  const typeColor = getRelationshipTypeColor(person.relationship)
  const lp = person.loveProfile || {}

  const nextBirthday = person.birthday ? getDaysUntil(person.birthday) : null
  const nextAnniversary = person.anniversary ? getDaysUntil(person.anniversary) : null
  const nearestDate = [
    nextBirthday !== null ? { label: 'Birthday', days: nextBirthday } : null,
    nextAnniversary !== null ? { label: 'Anniversary', days: nextAnniversary } : null,
  ].filter(Boolean).sort((a, b) => a.days - b.days)[0]

  return (
    <Card onClick={() => navigate(`/app/relationships/${person.id}`)} sx={{ height: '100%', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 2.5 }}>
          <Avatar sx={{ width: 60, height: 60, bgcolor: color, fontSize: '1.1rem', fontWeight: 700, mb: 1.5 }}>{initials}</Avatar>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', mb: 0.75, lineHeight: 1.3 }}>{person.name}</Typography>
          <Chip label={person.relationship} size="small" sx={{ bgcolor: `${typeColor}15`, color: typeColor, fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {person.birthday && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', width: 72, flexShrink: 0 }}>Birthday</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{dayjs(person.birthday).format('MMMM D')}</Typography>
            </Box>
          )}
          {lp.loveLanguage && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', width: 72, flexShrink: 0 }}>Love Lang.</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }} noWrap>{lp.loveLanguage}</Typography>
            </Box>
          )}
          {person.lastContact && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', width: 72, flexShrink: 0 }}>Last seen</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{dayjs(person.lastContact).format('MMM D')}</Typography>
            </Box>
          )}
        </Box>

        {nearestDate && (
          <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 1.5, bgcolor: nearestDate.days <= 14 ? '#FDF6E8' : '#F8F6F1', border: '1px solid', borderColor: nearestDate.days <= 14 ? '#F0DFB0' : '#E8E3DA' }}>
            <CalendarTodayRoundedIcon sx={{ fontSize: 14, color: nearestDate.days <= 14 ? '#C4973F' : '#9CA3AF' }} />
            <Typography sx={{ fontSize: '0.78rem', color: nearestDate.days <= 14 ? '#C4973F' : '#6B7280', fontWeight: nearestDate.days <= 14 ? 600 : 400 }}>
              {nearestDate.label} in {nearestDate.days} day{nearestDate.days !== 1 ? 's' : ''}
            </Typography>
          </Box>
        )}

        <Button fullWidth endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />} sx={{ mt: 2.5, color: '#6B7280', border: '1px solid #E8E3DA', fontSize: '0.8rem', '&:hover': { borderColor: '#1C2B3A', color: '#1C2B3A', bgcolor: '#F8F6F1' } }}>
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}

export default function Relationships() {
  const { getToken } = useAuth()
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const token = await getToken()
        const data = await api.relationships.list(token)
        if (!cancelled) setPeople(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const FAMILY = ['Wife', 'Husband', 'Son', 'Daughter', 'Child', 'Mother', 'Father', 'Parent', 'Sibling', 'Brother', 'Sister', 'Extended Family']
  const FRIENDS = ['Friend', 'Best Friend']
  const PARTNER = ['Wife', 'Husband', 'Partner', 'Spouse']

  const filtered = people.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(q) || p.relationship.toLowerCase().includes(q)
    const matchFilter =
      filter === 'All' ||
      (filter === 'Family' && FAMILY.includes(p.relationship)) ||
      (filter === 'Friends' && FRIENDS.includes(p.relationship)) ||
      (filter === 'Partner' && PARTNER.includes(p.relationship))
    return matchSearch && matchFilter
  })

  if (loading) return <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1A1A2E', mb: 0.5 }}>Relationships</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '0.95rem' }}>
            {people.length} {people.length === 1 ? 'person' : 'people'} · The ones who matter most.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' }, flexShrink: 0 }}>
          Add Person
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>Failed to load relationships: {error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or relationship..." size="small" sx={{ flex: 1, minWidth: 240 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: '#9CA3AF', fontSize: 20 }} /></InputAdornment> }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['All', 'Family', 'Friends', 'Partner'].map((f) => (
            <Button key={f} onClick={() => setFilter(f)} size="small" sx={{ px: 2, bgcolor: filter === f ? '#1C2B3A' : '#F8F6F1', color: filter === f ? 'white' : '#6B7280', border: '1px solid', borderColor: filter === f ? '#1C2B3A' : '#E8E3DA', '&:hover': { bgcolor: filter === f ? '#2D3F52' : '#F0EDE5' } }}>
              {f}
            </Button>
          ))}
        </Box>
      </Box>

      {people.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 12, color: '#9CA3AF' }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#1A1A2E' }}>Add the people who matter most.</Typography>
          <Typography sx={{ fontSize: '0.9rem', mb: 4 }}>Start with your spouse, kids, parents, and close friends.</Typography>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
            Add Your First Person
          </Button>
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, color: '#9CA3AF' }}>
          <Typography>No results for "{search}"</Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((person) => (
            <Grid item xs={12} sm={6} md={4} key={person.id}>
              <PersonCard person={person} />
            </Grid>
          ))}
        </Grid>
      )}

      <AddPersonDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={(p) => setPeople((prev) => [...prev, p])} />
    </Box>
  )
}
