import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import {
  Box, Typography, Card, CardContent, Avatar, Button, Chip, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem, Select,
  FormControl, InputLabel, Divider, IconButton, LinearProgress, Alert,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { api } from '../lib/api'
import { normalizeMemories, getAvatarColor, getInitials } from '../lib/utils'
import dayjs from 'dayjs'

function AddMemoryDialog({ open, onClose, people, onAdd }) {
  const { getToken } = useAuth()
  const [form, setForm] = useState({ title: '', date: '', description: '', personIds: [], tags: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      const newMemory = await api.memories.create({ ...form, tags }, token)
      onAdd(newMemory)
      onClose()
      setForm({ title: '', date: '', description: '', personIds: [], tags: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Save a Memory</Typography>
        <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Title" fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Beach trip — Galveston" />
          <TextField label="Date" type="date" fullWidth value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth>
            <InputLabel>People</InputLabel>
            <Select multiple value={form.personIds} label="People" onChange={(e) => setForm({ ...form, personIds: e.target.value })}
              renderValue={(selected) => selected.map((id) => people.find((p) => p.id === id)?.name.split(' ')[0]).join(', ')}>
              {people.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Description" fullWidth multiline rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What happened? What made it special?" />
          <TextField label="Tags" fullWidth value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Family, Vacation, Milestone (comma separated)" />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!form.title || !form.description || saving} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
          {saving ? 'Saving…' : 'Save Memory'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function MemoryDetailDialog({ memory, people, open, onClose, onDelete, onUpdate }) {
  const { getToken } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (memory) {
      setForm({
        title: memory.title,
        date: dayjs(memory.date).format('YYYY-MM-DD'),
        description: memory.description,
        personIds: memory.personIds || [],
        tags: (memory.tags || []).join(', '),
      })
      setEditing(false)
      setConfirmDelete(false)
    }
  }, [memory])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      const updated = await api.memories.update(memory.id, { ...form, tags }, token)
      onUpdate(updated)
      setEditing(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const token = await getToken()
      await api.memories.delete(memory.id, token)
      onDelete(memory.id)
      onClose()
    } catch (err) {
      console.error(err)
      setDeleting(false)
    }
  }

  if (!memory) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {editing ? 'Edit Memory' : 'Memory'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {!editing && (
            <>
              <IconButton size="small" onClick={() => setEditing(true)} sx={{ color: '#6B7280' }}>
                <EditRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => setConfirmDelete(true)} sx={{ color: '#9CA3AF', '&:hover': { color: '#C0392B' } }}>
                <DeleteRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </>
          )}
          <IconButton size="small" onClick={onClose}><CloseRoundedIcon /></IconButton>
        </Box>
      </DialogTitle>
      <Divider />

      {confirmDelete ? (
        <>
          <DialogContent sx={{ pt: 3 }}>
            <Typography sx={{ fontWeight: 600, color: '#1A1A2E', mb: 1 }}>Delete this memory?</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
              "{memory.title}" will be permanently deleted. This cannot be undone.
            </Typography>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button onClick={() => setConfirmDelete(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
            <Button variant="contained" onClick={handleDelete} disabled={deleting} sx={{ bgcolor: '#C0392B', '&:hover': { bgcolor: '#A93226' } }}>
              {deleting ? 'Deleting…' : 'Delete Memory'}
            </Button>
          </DialogActions>
        </>
      ) : editing ? (
        <>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField label="Title" fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <TextField label="Date" type="date" fullWidth value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
              <FormControl fullWidth>
                <InputLabel>People</InputLabel>
                <Select multiple value={form.personIds} label="People" onChange={(e) => setForm({ ...form, personIds: e.target.value })}
                  renderValue={(selected) => selected.map((id) => people.find((p) => p.id === id)?.name.split(' ')[0]).join(', ')}>
                  {people.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Description" fullWidth multiline rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <TextField label="Tags" fullWidth value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Comma separated" />
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button onClick={() => setEditing(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogActions>
        </>
      ) : (
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#F8F6F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>📸</Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '1.1rem', lineHeight: 1.3 }}>{memory.title}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#9CA3AF', mt: 0.5 }}>{dayjs(memory.date).format('MMMM D, YYYY')}</Typography>
            </Box>
          </Box>

          <Typography sx={{ fontSize: '0.925rem', color: '#374151', lineHeight: 1.8, mb: 3, fontFamily: '"Lora", Georgia, serif' }}>
            {memory.description}
          </Typography>

          {(memory.personIds || []).length > 0 && (
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>With</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(memory.personIds || []).map((pid) => {
                  const person = people.find((p) => p.id === pid)
                  if (!person) return null
                  return (
                    <Box key={pid} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.75, bgcolor: '#F8F6F1', borderRadius: 10, border: '1px solid #E8E3DA' }}>
                      <Avatar sx={{ width: 20, height: 20, bgcolor: getAvatarColor(person.name), fontSize: '0.55rem', fontWeight: 700 }}>{getInitials(person.name)}</Avatar>
                      <Typography sx={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>{person.name.split(' ')[0]}</Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )}

          {(memory.tags || []).length > 0 && (
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {memory.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#F8F6F1', color: '#6B7280', fontSize: '0.75rem', height: 26 }} />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
      )}
    </Dialog>
  )
}

function MemoryCard({ memory, people, onClick }) {
  return (
    <Card onClick={onClick} sx={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', '&:hover': { transform: 'translateY(-1px)', boxShadow: 3 } }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '1rem', mb: 0.5, lineHeight: 1.3 }}>{memory.title}</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{dayjs(memory.date).format('MMMM D, YYYY')}</Typography>
          </Box>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#F8F6F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📸</Box>
        </Box>
        <Typography sx={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, mb: 2.5, fontFamily: '"Lora", Georgia, serif', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {memory.description}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {(memory.tags || []).slice(0, 3).map((tag) => (
              <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#F8F6F1', color: '#6B7280', fontSize: '0.7rem', height: 22 }} />
            ))}
          </Box>
          <Box sx={{ display: 'flex' }}>
            {(memory.personIds || []).slice(0, 3).map((pid) => {
              const person = people.find((p) => p.id === pid)
              if (!person) return null
              return (
                <Avatar key={pid} sx={{ width: 26, height: 26, bgcolor: getAvatarColor(person.name), fontSize: '0.6rem', fontWeight: 700, border: '2px solid white', ml: -0.5 }}>
                  {getInitials(person.name)}
                </Avatar>
              )
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function MemoryVault() {
  const { getToken } = useAuth()
  const [memories, setMemories] = useState([])
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterPerson, setFilterPerson] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const token = await getToken()
        const [m, p] = await Promise.all([api.memories.list(token), api.relationships.list(token)])
        if (!cancelled) {
          setMemories(normalizeMemories(m))
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

  const handleDeleteMemory = (id) => {
    setMemories((prev) => prev.filter((m) => m.id !== id))
  }

  const handleUpdateMemory = (updated) => {
    const norm = normalizeMemories([updated])[0]
    setMemories((prev) => prev.map((m) => m.id === norm.id ? norm : m))
    setSelectedMemory(norm)
  }

  const filtered = memories.filter((m) => {
    const q = search.toLowerCase()
    const matchSearch = m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || (m.tags || []).some((t) => t.toLowerCase().includes(q))
    const matchPerson = filterPerson === 'all' || (m.personIds || []).includes(filterPerson)
    return matchSearch && matchPerson
  })

  const sorted = [...filtered].sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
  const grouped = sorted.reduce((acc, m) => {
    const year = dayjs(m.date).format('YYYY')
    if (!acc[year]) acc[year] = []
    acc[year].push(m)
    return acc
  }, {})

  if (loading) return <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#1A1A2E', mb: 0.5 }}>Memory Vault</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '0.95rem' }}>{memories.length} memories saved · Your life's highlight reel.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' }, flexShrink: 0 }}>
          Save Memory
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>Failed to load memories: {error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, description, or tag..." size="small" sx={{ flex: 1, minWidth: 260 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: '#9CA3AF', fontSize: 20 }} /></InputAdornment> }} />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)} displayEmpty startAdornment={<FilterListRoundedIcon sx={{ mr: 1, fontSize: 18, color: '#9CA3AF' }} />}>
            <MenuItem value="all">All People</MenuItem>
            {people.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {memories.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 12, color: '#9CA3AF' }}>
          <AutoStoriesRoundedIcon sx={{ fontSize: 56, mb: 2, opacity: 0.3 }} />
          <Typography variant="h6" sx={{ mb: 1, color: '#1A1A2E' }}>Start saving memories.</Typography>
          <Typography sx={{ fontSize: '0.9rem', mb: 4 }}>Capture meaningful moments as they happen.</Typography>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddOpen(true)} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
            Save Your First Memory
          </Button>
        </Box>
      ) : sorted.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, color: '#9CA3AF' }}>
          <Typography>No memories match your search.</Typography>
        </Box>
      ) : (
        Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a)).map(([year, yearMemories]) => (
          <Box key={year} sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{year}</Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: '#E8E3DA' }} />
              <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{yearMemories.length} memor{yearMemories.length !== 1 ? 'ies' : 'y'}</Typography>
            </Box>
            <Grid container spacing={2.5}>
              {yearMemories.map((memory) => (
                <Grid item xs={12} sm={6} md={4} key={memory.id}>
                  <MemoryCard memory={memory} people={people} onClick={() => setSelectedMemory(memory)} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}

      <AddMemoryDialog open={addOpen} onClose={() => setAddOpen(false)} people={people} onAdd={(m) => setMemories((prev) => [normalizeMemories([m])[0], ...prev])} />

      <MemoryDetailDialog
        memory={selectedMemory}
        people={people}
        open={Boolean(selectedMemory)}
        onClose={() => setSelectedMemory(null)}
        onDelete={handleDeleteMemory}
        onUpdate={handleUpdateMemory}
      />
    </Box>
  )
}
