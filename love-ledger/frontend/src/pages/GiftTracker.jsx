import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Button, Chip, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Select, FormControl, InputLabel, Divider, IconButton, Menu, LinearProgress, Alert,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import { api } from '../lib/api'
import { normalizeGifts, getAvatarColor, getInitials } from '../lib/utils'

const STATUSES = ['Idea', 'Saved', 'Purchased', 'Wrapped', 'Given']
const OCCASIONS = ["Birthday", "Anniversary", "Christmas", "Valentine's Day", "Mother's Day", "Father's Day", "Graduation", "Just Because", "Other"]

const statusConfig = {
  Idea: { bg: '#F8F6F1', text: '#6B7280', border: '#E8E3DA', dot: '#9CA3AF' },
  Saved: { bg: '#F0F9FF', text: '#0EA5E9', border: '#BAE6FD', dot: '#0EA5E9' },
  Purchased: { bg: '#ECFDF5', text: '#10B981', border: '#A7F3D0', dot: '#10B981' },
  Wrapped: { bg: '#F5F3FF', text: '#8B5CF6', border: '#DDD6FE', dot: '#8B5CF6' },
  Given: { bg: '#F3F4F6', text: '#9CA3AF', border: '#E5E7EB', dot: '#D1D5DB' },
}

function AddGiftDialog({ open, onClose, people, onAdd }) {
  const { getToken } = useAuth()
  const [form, setForm] = useState({ title: '', personId: '', occasion: '', budget: '', purchaseLink: '', notes: '', status: 'Idea' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const newGift = await api.gifts.create({ ...form, budget: form.budget ? parseFloat(form.budget) : null }, token)
      onAdd(newGift)
      onClose()
      setForm({ title: '', personId: '', occasion: '', budget: '', purchaseLink: '', notes: '', status: 'Idea' })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Add Gift Idea</Typography>
        <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Gift idea" fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <FormControl fullWidth>
            <InputLabel>For who</InputLabel>
            <Select value={form.personId} label="For who" onChange={(e) => setForm({ ...form, personId: e.target.value })}>
              {people.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Occasion</InputLabel>
            <Select value={form.occasion} label="Occasion" onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
              {OCCASIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Budget" fullWidth value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="$" type="number" />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField label="Purchase link" fullWidth value={form.purchaseLink} onChange={(e) => setForm({ ...form, purchaseLink: e.target.value })} placeholder="https://..." />
          <TextField label="Notes" fullWidth multiline rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Size, color, any details..." />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!form.title || !form.personId || saving} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
          {saving ? 'Saving…' : 'Save Gift Idea'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function GiftCard({ gift, people, onStatusChange, onDelete }) {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const person = people.find((p) => p.id === gift.personId)
  const config = statusConfig[gift.status] || statusConfig.Idea

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Chip label={gift.status} size="small" sx={{ bgcolor: config.bg, color: config.text, border: `1px solid ${config.border}`, fontWeight: 600, fontSize: '0.72rem' }} />
          <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ color: '#9CA3AF', mt: -0.5, mr: -0.5 }}>
            <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)} PaperProps={{ sx: { boxShadow: 4, borderRadius: 2, minWidth: 160 } }}>
            {STATUSES.filter((s) => s !== gift.status).map((s) => (
              <MenuItem key={s} onClick={() => { onStatusChange(gift.id, s); setMenuAnchor(null) }} sx={{ fontSize: '0.875rem' }}>
                Mark as {s}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => { onDelete(gift.id); setMenuAnchor(null) }} sx={{ fontSize: '0.875rem', color: '#C0392B' }}>Delete</MenuItem>
          </Menu>
        </Box>

        <Typography sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '0.95rem', mb: 1.5, lineHeight: 1.4 }}>{gift.title}</Typography>
        {gift.notes && <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.6, mb: 2 }}>{gift.notes}</Typography>}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {person && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Avatar sx={{ width: 22, height: 22, bgcolor: getAvatarColor(person.name), fontSize: '0.55rem', fontWeight: 700 }}>{getInitials(person.name)}</Avatar>
              <Typography sx={{ fontSize: '0.78rem', color: '#6B7280' }}>{person.name.split(' ')[0]}</Typography>
            </Box>
          )}
          <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF' }}>·</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{gift.occasion}</Typography>
          {gift.budget && (
            <>
              <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF' }}>·</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>${gift.budget}</Typography>
            </>
          )}
        </Box>

        {gift.purchaseLink && (
          <Button size="small" startIcon={<LinkRoundedIcon sx={{ fontSize: 14 }} />} onClick={() => window.open(gift.purchaseLink, '_blank')} sx={{ mt: 1.5, color: '#0EA5E9', p: 0, fontSize: '0.75rem', '&:hover': { bgcolor: 'transparent', opacity: 0.7 } }}>
            View link
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function KanbanColumn({ status, items, people, onStatusChange, onDelete }) {
  const config = statusConfig[status]
  return (
    <Box sx={{ minWidth: 260, flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: `2px solid ${config.border}` }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: config.dot }} />
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>{status}</Typography>
        <Chip label={items.length} size="small" sx={{ bgcolor: config.bg, color: config.text, fontWeight: 700, fontSize: '0.7rem', height: 20, ml: 'auto' }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((gift) => <GiftCard key={gift.id} gift={gift} people={people} onStatusChange={onStatusChange} onDelete={onDelete} />)}
        {items.length === 0 && <Box sx={{ p: 3, textAlign: 'center', color: '#9CA3AF', border: '1px dashed #E8E3DA', borderRadius: 2 }}><Typography sx={{ fontSize: '0.8rem' }}>No gifts here</Typography></Box>}
      </Box>
    </Box>
  )
}

export default function GiftTracker() {
  const { getToken } = useAuth()
  const [gifts, setGifts] = useState([])
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterPerson, setFilterPerson] = useState('all')
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const token = await getToken()
        const [g, p] = await Promise.all([api.gifts.list(token), api.relationships.list(token)])
        if (!cancelled) {
          setGifts(normalizeGifts(g))
          setPeople(p)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const handleStatusChange = async (id, status) => {
    setGifts((prev) => prev.map((g) => g.id === id ? { ...g, status } : g))
    try {
      const token = await getToken()
      await api.gifts.update(id, { status }, token)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteGift = async (id) => {
    setGifts((prev) => prev.filter((g) => g.id !== id))
    try {
      const token = await getToken()
      await api.gifts.delete(id, token)
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = gifts.filter((g) => {
    const q = search.toLowerCase()
    const matchSearch = g.title.toLowerCase().includes(q) || (g.personName || '').toLowerCase().includes(q) || g.occasion.toLowerCase().includes(q)
    const matchPerson = filterPerson === 'all' || g.personId === filterPerson
    return matchSearch && matchPerson
  })

  const byStatus = STATUSES.reduce((acc, s) => { acc[s] = filtered.filter((g) => g.status === s); return acc }, {})
  const totalBudget = filtered.filter((g) => ['Idea', 'Saved', 'Purchased', 'Wrapped'].includes(g.status)).reduce((sum, g) => sum + (g.budget || 0), 0)

  if (loading) return <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1A1A2E', mb: 0.5 }}>Gift Tracker</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '0.95rem' }}>
            {gifts.filter((g) => g.status !== 'Given').length} active ideas · Never scramble for a gift again.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' }, flexShrink: 0 }}>
          Add Gift Idea
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>Failed to load gifts: {error}</Alert>}

      {/* Summary badges */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {STATUSES.slice(0, 4).map((s) => {
          const count = gifts.filter((g) => g.status === s).length
          const config = statusConfig[s]
          return (
            <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.5, bgcolor: config.bg, border: `1px solid ${config.border}`, borderRadius: 2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: config.dot }} />
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: config.text }}>{count} {s}</Typography>
            </Box>
          )
        })}
        {totalBudget > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, py: 1.5, bgcolor: '#F8F6F1', border: '1px solid #E8E3DA', borderRadius: 2, ml: 'auto' }}>
            <Typography sx={{ fontSize: '0.82rem', color: '#6B7280' }}>Total budgeted:</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A1A2E' }}>${totalBudget.toLocaleString()}</Typography>
          </Box>
        )}
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search gifts..." size="small" sx={{ flex: 1, minWidth: 220 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: '#9CA3AF', fontSize: 20 }} /></InputAdornment> }} />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)} displayEmpty startAdornment={<FilterListRoundedIcon sx={{ mr: 1, fontSize: 18, color: '#9CA3AF' }} />}>
            <MenuItem value="all">All People</MenuItem>
            {people.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {gifts.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 12, color: '#9CA3AF' }}>
          <CardGiftcardRoundedIcon sx={{ fontSize: 56, mb: 2, opacity: 0.3 }} />
          <Typography variant="h6" sx={{ mb: 1, color: '#1A1A2E' }}>Start saving gift ideas.</Typography>
          <Typography sx={{ fontSize: '0.9rem', mb: 4 }}>Save ideas the moment inspiration strikes. Never scramble last minute.</Typography>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
            Add Your First Gift Idea
          </Button>
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto', pb: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, minWidth: 1000 }}>
            {STATUSES.map((s) => <KanbanColumn key={s} status={s} items={byStatus[s]} people={people} onStatusChange={handleStatusChange} onDelete={handleDeleteGift} />)}
          </Box>
        </Box>
      )}

      <AddGiftDialog open={addOpen} onClose={() => setAddOpen(false)} people={people} onAdd={(g) => setGifts((prev) => [normalizeGifts([g])[0], ...prev])} />
    </Box>
  )
}
