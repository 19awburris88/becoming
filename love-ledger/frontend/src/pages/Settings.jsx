import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Chip,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'

function SectionCard({ icon, title, children }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '9px',
              bgcolor: '#F8F6F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#374151',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ color: '#1A1A2E', fontSize: '1rem' }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  )
}

function SettingRow({ label, description, control }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, gap: 3, borderBottom: '1px solid #F3F0EA' }}>
      <Box>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A1A2E', mb: 0.25 }}>
          {label}
        </Typography>
        {description && (
          <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{description}</Typography>
        )}
      </Box>
      <Box sx={{ flexShrink: 0 }}>{control}</Box>
    </Box>
  )
}

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    firstName: 'Austin',
    lastName: 'Johnson',
    email: '19awburris88@gmail.com',
    timezone: 'America/Chicago',
  })

  const [notifications, setNotifications] = useState({
    emailBirthdays: true,
    emailAnniversaries: true,
    emailEvents: true,
    emailWeeklySummary: true,
    smsEnabled: false,
    browserPush: false,
    defaultReminder: '7',
  })

  const [privacy, setPrivacy] = useState({
    dataExport: false,
    deleteAccount: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 760, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#1A1A2E', mb: 0.5 }}>
          Settings
        </Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '0.95rem' }}>
          Manage your account and notification preferences.
        </Typography>
      </Box>

      {saved && (
        <Alert
          severity="success"
          icon={<CheckRoundedIcon />}
          sx={{ mb: 3, bgcolor: '#ECFDF5', color: '#2D7A4F', border: '1px solid #A7F3D0' }}
        >
          Settings saved successfully.
        </Alert>
      )}

      {/* Profile */}
      <SectionCard icon={<PersonRoundedIcon />} title="Profile">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, pb: 3, borderBottom: '1px solid #F3F0EA' }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: '#C4973F',
              fontSize: '1.3rem',
              fontWeight: 700,
            }}
          >
            AJ
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>Austin Johnson</Typography>
            <Chip label="Pro Plan" size="small" sx={{ bgcolor: '#FDF6E8', color: '#C4973F', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #F0DFB0' }} />
          </Box>
          <Button variant="outlined" size="small" sx={{ ml: 'auto', borderColor: '#E8E3DA', color: '#374151' }}>
            Change Photo
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First name"
              fullWidth
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last name"
              fullWidth
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              size="small"
              type="email"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Timezone</InputLabel>
              <Select
                value={profile.timezone}
                label="Timezone"
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              >
                {[
                  { value: 'America/New_York', label: 'Eastern Time (ET)' },
                  { value: 'America/Chicago', label: 'Central Time (CT)' },
                  { value: 'America/Denver', label: 'Mountain Time (MT)' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                ].map((tz) => (
                  <MenuItem key={tz.value} value={tz.value}>{tz.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Notifications */}
      <SectionCard icon={<NotificationsRoundedIcon />} title="Notifications">
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
          Email Reminders
        </Typography>
        <SettingRow
          label="Birthdays"
          description="Receive email reminders before birthdays"
          control={
            <Switch
              checked={notifications.emailBirthdays}
              onChange={(e) => setNotifications({ ...notifications, emailBirthdays: e.target.checked })}
              sx={{ '& .MuiSwitch-thumb': { bgcolor: '#1C2B3A' }, '& .Mui-checked .MuiSwitch-thumb': { bgcolor: '#1C2B3A' } }}
            />
          }
        />
        <SettingRow
          label="Anniversaries"
          description="Receive email reminders before anniversaries"
          control={
            <Switch
              checked={notifications.emailAnniversaries}
              onChange={(e) => setNotifications({ ...notifications, emailAnniversaries: e.target.checked })}
            />
          }
        />
        <SettingRow
          label="Events & Milestones"
          description="Reminders for custom important dates"
          control={
            <Switch
              checked={notifications.emailEvents}
              onChange={(e) => setNotifications({ ...notifications, emailEvents: e.target.checked })}
            />
          }
        />
        <SettingRow
          label="Weekly Summary"
          description="A weekly digest of upcoming dates and nudges"
          control={
            <Switch
              checked={notifications.emailWeeklySummary}
              onChange={(e) => setNotifications({ ...notifications, emailWeeklySummary: e.target.checked })}
            />
          }
        />

        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
            Other Channels
          </Typography>
          <SettingRow
            label="SMS Notifications"
            description="Text message reminders (Pro plan)"
            control={
              <Switch
                checked={notifications.smsEnabled}
                onChange={(e) => setNotifications({ ...notifications, smsEnabled: e.target.checked })}
              />
            }
          />
          <SettingRow
            label="Browser Push"
            description="Push notifications in your browser"
            control={
              <Switch
                checked={notifications.browserPush}
                onChange={(e) => setNotifications({ ...notifications, browserPush: e.target.checked })}
              />
            }
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 2 }}>
            Default Reminder Lead Time
          </Typography>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Remind me this far ahead</InputLabel>
            <Select
              value={notifications.defaultReminder}
              label="Remind me this far ahead"
              onChange={(e) => setNotifications({ ...notifications, defaultReminder: e.target.value })}
            >
              <MenuItem value="1">1 day before</MenuItem>
              <MenuItem value="3">3 days before</MenuItem>
              <MenuItem value="7">1 week before</MenuItem>
              <MenuItem value="14">2 weeks before</MenuItem>
              <MenuItem value="30">1 month before</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </SectionCard>

      {/* Subscription */}
      <SectionCard icon={<CreditCardRoundedIcon />} title="Subscription">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, p: 2.5, bgcolor: '#FDF6E8', borderRadius: 2, border: '1px solid #F0DFB0' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#1A1A2E', mb: 0.25 }}>Pro Plan</Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#6B7280' }}>$9/month · Unlimited relationships, all features</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>$9</Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF' }}>/month</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" size="small" sx={{ borderColor: '#E8E3DA', color: '#374151' }}>
            Manage Billing
          </Button>
          <Button variant="outlined" size="small" sx={{ borderColor: '#F0DFB0', color: '#C4973F' }}>
            Upgrade to Family Plan
          </Button>
        </Box>
      </SectionCard>

      {/* Security */}
      <SectionCard icon={<LockRoundedIcon />} title="Security & Privacy">
        <SettingRow
          label="Change Password"
          description="Update your account password"
          control={<Button size="small" variant="outlined" sx={{ borderColor: '#E8E3DA', color: '#374151' }}>Change</Button>}
        />
        <SettingRow
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          control={<Button size="small" variant="outlined" sx={{ borderColor: '#E8E3DA', color: '#374151' }}>Enable</Button>}
        />
        <SettingRow
          label="Export Data"
          description="Download a copy of all your relationship data"
          control={<Button size="small" variant="outlined" sx={{ borderColor: '#E8E3DA', color: '#374151' }}>Export</Button>}
        />
        <SettingRow
          label="Delete Account"
          description="Permanently delete your account and all data"
          control={<Button size="small" variant="outlined" sx={{ borderColor: '#FDECEA', color: '#C0392B' }}>Delete</Button>}
        />
      </SectionCard>

      {/* Save button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button sx={{ color: '#6B7280' }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ bgcolor: '#1C2B3A', '&:hover': { bgcolor: '#2D3F52' }, px: 4 }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  )
}
