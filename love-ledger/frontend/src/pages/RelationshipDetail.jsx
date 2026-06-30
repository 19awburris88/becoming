import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Button, Chip, Divider,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select,
  FormControl, InputLabel, IconButton, LinearProgress, Alert, Tab, Tabs,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { api } from '../lib/api'
import { getDaysUntil, getRelationshipTypeColor, getAvatarColor, getInitials } from '../lib/utils'
import dayjs from 'dayjs'

const DATE_TYPES = ['Birthday', 'Anniversary', 'Event', 'Graduation', 'Medical', 'Other']
const GIFT_STATUSES = ['Idea', 'Saved', 'Purchased', 'Wrapped', 'Given']
const OCCASIONS = ['Birthday', 'Anniversary', 'Christmas', "Valentine's Day", "Mother's Day", "Father's Day", 'Graduation', 'Just Because', 'Other']
const LOVE_LANGUAGES = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch']

const RELATIONSHIP_TYPES = [
  'Spouse', 'Wife', 'Husband', 'Partner',
  'Son', 'Daughter', 'Child',
  'Mother', 'Father', 'Parent',
  'Sibling', 'Brother', 'Sister',
  'Friend', 'Best Friend',
  'Mentor', 'Mentee', 'Extended Family', 'Other',
]

function SectionLabel({ children }) {
  return (
    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', mt: 3, mb: 1.5 }}>
      {children}
    </Typography>
  )
}

function EditPersonDialog({ open, onClose, person, onSave }) {
  const { getToken } = useAuth()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (person) {
      const lp = person.loveProfile || {}
      const fav = person.favorites || {}
      const sz = person.sizes || {}
      setForm({
        name: person.name || '',
        relationship: person.relationship || '',
        birthday: person.birthday ? dayjs(person.birthday).format('YYYY-MM-DD') : '',
        anniversary: person.anniversary ? dayjs(person.anniversary).format('YYYY-MM-DD') : '',
        phone: person.phone || '',
        email: person.email || '',
        notes: person.notes || '',
        loveLanguage: lp.loveLanguage || '',
        personality: lp.personality || '',
        communication: lp.communication || '',
        favFood: fav.food || '',
        favColor: fav.color || '',
        favMovie: fav.movie || '',
        favBook: fav.book || '',
        favHobby: fav.hobby || '',
        favMusic: fav.music || '',
        sizeShirt: sz.shirt || '',
        sizePants: sz.pants || '',
        sizeShoe: sz.shoe || '',
        sizeDress: sz.dress || '',
      })
    }
  }, [person])

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const {
        loveLanguage, personality, communication,
        favFood, favColor, favMovie, favBook, favHobby, favMusic,
        sizeShirt, sizePants, sizeShoe, sizeDress,
        ...basic
      } = form
      const updated = await api.relationships.update(person.id, {
        ...basic,
        loveProfile: { loveLanguage, personality, communication },
        favorites: { food: favFood, color: favColor, movie: favMovie, book: favBook, hobby: favHobby, music: favMusic },
        sizes: { shirt: sizeShirt, pants: sizePants, shoe: sizeShoe, dress: sizeDress },
      }, token)
      onSave(updated)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const f = (key) => ({ value: form[key] || '', onChange: (e) => setForm({ ...form, [key]: e.target.value }) })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { maxHeight: '90vh' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Edit Profile</Typography>
        <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <SectionLabel>Basic Info</SectionLabel>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField label="Full name" fullWidth {...f('name')} /></Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Relationship</InputLabel>
              <Select value={form.relationship || ''} label="Relationship" onChange={(e) => setForm({ ...form, relationship: e.target.value })}>
                {RELATIONSHIP_TYPES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}><TextField label="Birthday" type="date" fullWidth {...f('birthday')} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Anniversary" type="date" fullWidth {...f('anniversary')} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Phone" fullWidth {...f('phone')} /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Email" fullWidth {...f('email')} /></Grid>
        </Grid>

        <SectionLabel>Love Profile</SectionLabel>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Love Language</InputLabel>
              <Select value={form.loveLanguage || ''} label="Love Language" onChange={(e) => setForm({ ...form, loveLanguage: e.target.value })}>
                <MenuItem value=""><em>Not set</em></MenuItem>
                {LOVE_LANGUAGES.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}><TextField label="Personality" fullWidth {...f('personality')} placeholder="e.g. INFJ, introvert…" /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Communication style" fullWidth {...f('communication')} placeholder="e.g. Direct, needs space…" /></Grid>
        </Grid>

        <SectionLabel>Favorites</SectionLabel>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}><TextField label="Food" fullWidth {...f('favFood')} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Color" fullWidth {...f('favColor')} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Hobby" fullWidth {...f('favHobby')} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Movie" fullWidth {...f('favMovie')} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Book" fullWidth {...f('favBook')} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Music" fullWidth {...f('favMusic')} /></Grid>
        </Grid>

        <SectionLabel>Sizes</SectionLabel>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}><TextField label="Shirt" fullWidth {...f('sizeShirt')} /></Grid>
          <Grid item xs={6} sm={3}><TextField label="Pants" fullWidth {...f('sizePants')} /></Grid>
          <Grid item xs={6} sm={3}><TextField label="Shoe" fullWidth {...f('sizeShoe')} /></Grid>
          <Grid item xs={6} sm={3}><TextField label="Dress" fullWidth {...f('sizeDress')} /></Grid>
        </Grid>

        <SectionLabel>Notes</SectionLabel>
        <TextField label="Notes" fullWidth multiline rows={3} {...f('notes')} placeholder="Anything else to remember…" />
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!form.name || saving} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function DeletePersonDialog({ open, onClose, person, onConfirm }) {
  const [deleting, setDeleting] = useState(false)
  const handleConfirm = async () => {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Delete {person?.name?.split(' ')[0]}?</Typography>
        <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
          This will permanently delete <strong>{person?.name}</strong> along with all their important dates, gift ideas, and linked memories. This cannot be undone.
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280' }}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm} disabled={deleting} sx={{ bgcolor: '#C0392B', '&:hover': { bgcolor: '#A93226' } }}>
          {deleting ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function AddDateDialog({ open, onClose, personId, onAdd }) {
  const { getToken } = useAuth()
  const [form, setForm] = useState({ title: '', date: '', type: 'Birthday', notes: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const newDate = await api.dates.create({ ...form, personId }, token)
      onAdd(newDate)
      onClose()
      setForm({ title: '', date: '', type: 'Birthday', notes: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Add Important Date</Typography>
        <IconButton onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Title" fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Sarah's Birthday" />
          <TextField label="Date" type="date" fullWidth value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={form.type} label="Type" onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {DATE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Notes" fullWidth value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any context..." multiline rows={2} />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!form.title || !form.date || saving} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
          {saving ? 'Saving…' : 'Add Date'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function AddGiftDialog({ open, onClose, personId, onAdd }) {
  const { getToken } = useAuth()
  const [form, setForm] = useState({ title: '', occasion: '', budget: '', purchaseLink: '', notes: '', status: 'Idea' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const newGift = await api.gifts.create({ ...form, personId, budget: form.budget ? parseFloat(form.budget) : null }, token)
      onAdd(newGift)
      onClose()
      setForm({ title: '', occasion: '', budget: '', purchaseLink: '', notes: '', status: 'Idea' })
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
            <InputLabel>Occasion</InputLabel>
            <Select value={form.occasion} label="Occasion" onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
              {OCCASIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Budget" fullWidth value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} type="number" placeholder="$" />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {GIFT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField label="Notes" fullWidth multiline rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!form.title || !form.occasion || saving} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
          {saving ? 'Saving…' : 'Add Gift Idea'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const giftStatusColors = {
  Idea: { bg: '#F8F6F1', color: '#6B7280' },
  Saved: { bg: '#F0F9FF', color: '#0EA5E9' },
  Purchased: { bg: '#ECFDF5', color: '#10B981' },
  Wrapped: { bg: '#F5F3FF', color: '#8B5CF6' },
  Given: { bg: '#F3F4F6', color: '#9CA3AF' },
}

export default function RelationshipDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const [deletePersonOpen, setDeletePersonOpen] = useState(false)
  const [addDateOpen, setAddDateOpen] = useState(false)
  const [addGiftOpen, setAddGiftOpen] = useState(false)
  const [contactLogged, setContactLogged] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const token = await getToken()
        const data = await api.relationships.get(id, token)
        if (!cancelled) setPerson(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  const handleLogContact = async () => {
    try {
      const token = await getToken()
      const updated = await api.relationships.update(id, { lastContact: new Date().toISOString() }, token)
      setPerson((prev) => ({ ...prev, lastContact: updated.lastContact }))
      setContactLogged(true)
      setTimeout(() => setContactLogged(false), 2500)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeletePerson = async () => {
    const token = await getToken()
    await api.relationships.delete(id, token)
    navigate('/app/relationships')
  }

  const handleDeleteDate = async (dateId) => {
    setPerson((prev) => ({ ...prev, dates: prev.dates.filter((d) => d.id !== dateId) }))
    try {
      const token = await getToken()
      await api.dates.delete(dateId, token)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteGift = async (giftId) => {
    setPerson((prev) => ({ ...prev, gifts: prev.gifts.filter((g) => g.id !== giftId) }))
    try {
      const token = await getToken()
      await api.gifts.delete(giftId, token)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">Failed to load profile: {error}</Alert></Box>
  if (!person) return null

  const color = getAvatarColor(person.name)
  const initials = getInitials(person.name)
  const typeColor = getRelationshipTypeColor(person.relationship)
  const lp = person.loveProfile || {}
  const fav = person.favorites || {}
  const sizes = person.sizes || {}
  const memories = person.memories || []
  const gifts = person.gifts || []
  const dates = person.dates || []

  const InfoRow = ({ label, value }) =>
    value ? (
      <Box sx={{ display: 'flex', gap: 2, py: 1.5, borderBottom: '1px solid #F0EDE5' }}>
        <Typography sx={{ fontSize: '0.82rem', color: '#9CA3AF', width: 140, flexShrink: 0 }}>{label}</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>{value}</Typography>
      </Box>
    ) : null

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/app/relationships')} sx={{ color: '#6B7280', mb: 3, pl: 0, '&:hover': { bgcolor: 'transparent', color: '#1C2B3A' } }}>
        All Relationships
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: color, fontSize: '1.75rem', fontWeight: 700, flexShrink: 0 }}>{initials}</Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ color: '#1A1A2E' }}>{person.name}</Typography>
                <Chip label={person.relationship} sx={{ bgcolor: `${typeColor}15`, color: typeColor, fontWeight: 700, fontSize: '0.8rem' }} />
              </Box>
              {person.birthday && <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', mb: 0.5 }}>🎂 Birthday: {dayjs(person.birthday).format('MMMM D, YYYY')} · {getDaysUntil(person.birthday)} days away</Typography>}
              {person.anniversary && <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', mb: 0.5 }}>💍 Anniversary: {dayjs(person.anniversary).format('MMMM D, YYYY')}</Typography>}
              {person.lastContact && (
                <Typography sx={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                  Last contact: {dayjs(person.lastContact).format('MMMM D, YYYY')}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0, flexWrap: 'wrap' }}>
              <Button
                startIcon={contactLogged ? <CheckRoundedIcon sx={{ fontSize: 16 }} /> : <PhoneRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={handleLogContact}
                sx={{
                  border: '1px solid',
                  borderColor: contactLogged ? '#A7F3D0' : '#E8E3DA',
                  color: contactLogged ? '#10B981' : '#6B7280',
                  bgcolor: contactLogged ? '#ECFDF5' : 'transparent',
                  fontSize: '0.82rem',
                  '&:hover': { borderColor: contactLogged ? '#A7F3D0' : '#1C2B3A', bgcolor: contactLogged ? '#ECFDF5' : '#F8F6F1', color: contactLogged ? '#10B981' : '#1C2B3A' },
                }}
              >
                {contactLogged ? 'Logged!' : 'Log Contact'}
              </Button>
              <Button startIcon={<EditRoundedIcon />} onClick={() => setEditOpen(true)} sx={{ border: '1px solid #E8E3DA', color: '#6B7280', '&:hover': { borderColor: '#1C2B3A', color: '#1C2B3A', bgcolor: '#F8F6F1' } }}>
                Edit
              </Button>
              <IconButton onClick={() => setDeletePersonOpen(true)} sx={{ border: '1px solid #E8E3DA', color: '#9CA3AF', borderRadius: 1, '&:hover': { borderColor: '#FDECEA', color: '#C0392B', bgcolor: '#FFF5F5' } }}>
                <DeleteRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: '1px solid #E8E3DA', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280', minHeight: 48 }, '& .Mui-selected': { color: '#1C2B3A' }, '& .MuiTabs-indicator': { bgcolor: '#C4973F' } }}>
          <Tab label="Profile" />
          <Tab label={`Dates (${dates.length})`} />
          <Tab label={`Memories (${memories.length})`} />
          <Tab label={`Gifts (${gifts.length})`} />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#1A1A2E', mb: 2, fontSize: '0.95rem', fontWeight: 700 }}>Contact</Typography>
                <InfoRow label="Phone" value={person.phone} />
                <InfoRow label="Email" value={person.email} />
              </CardContent>
            </Card>
            {person.notes && (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#1A1A2E', mb: 2, fontSize: '0.95rem', fontWeight: 700 }}>Notes</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>{person.notes}</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {(lp.loveLanguage || lp.personality || lp.communication) && (
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#1A1A2E', mb: 2, fontSize: '0.95rem', fontWeight: 700 }}>Love Profile</Typography>
                  <InfoRow label="Love Language" value={lp.loveLanguage} />
                  <InfoRow label="Personality" value={lp.personality} />
                  <InfoRow label="Communication" value={lp.communication} />
                </CardContent>
              </Card>
            )}
            {Object.keys(fav).some((k) => fav[k]) && (
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#1A1A2E', mb: 2, fontSize: '0.95rem', fontWeight: 700 }}>Favorites</Typography>
                  <InfoRow label="Food" value={fav.food} />
                  <InfoRow label="Color" value={fav.color} />
                  <InfoRow label="Movie" value={fav.movie} />
                  <InfoRow label="Book" value={fav.book} />
                  <InfoRow label="Hobby" value={fav.hobby} />
                  <InfoRow label="Music" value={fav.music} />
                </CardContent>
              </Card>
            )}
            {Object.keys(sizes).some((k) => sizes[k]) && (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: '#1A1A2E', mb: 2, fontSize: '0.95rem', fontWeight: 700 }}>Sizes</Typography>
                  <InfoRow label="Shirt" value={sizes.shirt} />
                  <InfoRow label="Pants" value={sizes.pants} />
                  <InfoRow label="Shoe" value={sizes.shoe} />
                  <InfoRow label="Dress" value={sizes.dress} />
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddDateOpen(true)} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
              Add Date
            </Button>
          </Box>
          {dates.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10, color: '#9CA3AF' }}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
              <Typography>No important dates saved yet.</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {dates.map((d) => {
                const days = getDaysUntil(d.date)
                return (
                  <Grid item xs={12} sm={6} key={d.id}>
                    <Card>
                      <CardContent sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#FDF6E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                          {d.type === 'Birthday' ? '🎂' : d.type === 'Anniversary' ? '💍' : d.type === 'Graduation' ? '🎓' : '📅'}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>{d.title}</Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', mb: 1 }}>{dayjs(d.date).format('MMMM D, YYYY')} · {d.type}</Typography>
                          <Chip label={days === 0 ? 'Today!' : `${days} days away`} size="small" sx={{ bgcolor: days <= 14 ? '#FDF6E8' : '#F8F6F1', color: days <= 14 ? '#C4973F' : '#6B7280', fontWeight: 600, fontSize: '0.7rem' }} />
                          {d.notes && <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF', mt: 1 }}>{d.notes}</Typography>}
                        </Box>
                        <IconButton size="small" onClick={() => handleDeleteDate(d.id)} sx={{ color: '#9CA3AF', flexShrink: 0, mt: -0.5, mr: -0.5, '&:hover': { color: '#C0392B', bgcolor: '#FFF5F5' } }}>
                          <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Box>
      )}

      {tab === 2 && (
        <Box>
          {memories.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10, color: '#9CA3AF' }}>
              <AutoStoriesRoundedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
              <Typography>No memories saved with {person.name.split(' ')[0]} yet.</Typography>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {memories.map((memory) => (
                <Grid item xs={12} sm={6} md={4} key={memory.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography sx={{ fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>{memory.title}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF', mb: 1.5 }}>{dayjs(memory.date).format('MMMM D, YYYY')}</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: '"Lora", Georgia, serif' }}>
                        {memory.description}
                      </Typography>
                      {(memory.tags || []).length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.75, mt: 2, flexWrap: 'wrap' }}>
                          {memory.tags.slice(0, 3).map((tag) => <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#F8F6F1', color: '#6B7280', fontSize: '0.7rem', height: 22 }} />)}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {tab === 3 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setAddGiftOpen(true)} sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' } }}>
              Add Gift Idea
            </Button>
          </Box>
          {gifts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10, color: '#9CA3AF' }}>
              <CardGiftcardRoundedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
              <Typography>No gift ideas saved for {person.name.split(' ')[0]} yet.</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {gifts.map((gift) => {
                const cfg = giftStatusColors[gift.status] || giftStatusColors.Idea
                return (
                  <Grid item xs={12} sm={6} key={gift.id}>
                    <Card>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700, color: '#1A1A2E' }}>{gift.title}</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', mt: 0.5 }}>{gift.occasion}{gift.budget ? ` · $${gift.budget}` : ''}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, ml: 1 }}>
                            <Chip label={gift.status} size="small" sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 600, fontSize: '0.7rem' }} />
                            <IconButton size="small" onClick={() => handleDeleteGift(gift.id)} sx={{ color: '#9CA3AF', '&:hover': { color: '#C0392B', bgcolor: '#FFF5F5' } }}>
                              <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                        {gift.notes && <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{gift.notes}</Typography>}
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}
        </Box>
      )}

      <EditPersonDialog open={editOpen} onClose={() => setEditOpen(false)} person={person} onSave={(updated) => setPerson((prev) => ({ ...prev, ...updated }))} />
      <DeletePersonDialog open={deletePersonOpen} onClose={() => setDeletePersonOpen(false)} person={person} onConfirm={handleDeletePerson} />
      <AddDateDialog open={addDateOpen} onClose={() => setAddDateOpen(false)} personId={id} onAdd={(d) => setPerson((prev) => ({ ...prev, dates: [...(prev.dates || []), d] }))} />
      <AddGiftDialog open={addGiftOpen} onClose={() => setAddGiftOpen(false)} personId={id} onAdd={(g) => setPerson((prev) => ({ ...prev, gifts: [g, ...(prev.gifts || [])] }))} />
    </Box>
  )
}
