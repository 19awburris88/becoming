import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Divider, IconButton, useMediaQuery, useTheme, Menu, MenuItem,
  BottomNavigation, BottomNavigationAction, Paper, Tooltip,
} from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'

const DRAWER_WIDTH = 256

const navItems = [
  { label: 'Dashboard', icon: <HomeRoundedIcon />, path: '/app/dashboard' },
  { label: 'Relationships', icon: <PeopleRoundedIcon />, path: '/app/relationships' },
  { label: 'Memory Vault', icon: <AutoStoriesRoundedIcon />, path: '/app/memories' },
  { label: 'Gift Tracker', icon: <CardGiftcardRoundedIcon />, path: '/app/gifts' },
]

const PAGE_TITLES = {
  '/app/dashboard': 'Dashboard',
  '/app/relationships': 'Relationships',
  '/app/memories': 'Memory Vault',
  '/app/gifts': 'Gift Tracker',
  '/app/settings': 'Settings',
}

function SidebarContent({ onNavigate }) {
  const location = useLocation()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [menuAnchor, setMenuAnchor] = useState(null)

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.emailAddresses?.[0]?.emailAddress || 'You'
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase()
    : '?'

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1C2B3A', color: 'white' }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 3.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#C4973F', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.08)' } }}>
          <FavoriteRoundedIcon sx={{ fontSize: 18, color: 'white' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'white', letterSpacing: '-0.02em' }}>Love Ledger</Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* Nav */}
      <Box sx={{ flex: 1, px: 1.5, py: 2, overflowY: 'auto' }}>
        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', px: 1.5, mb: 1.5 }}>
          Navigation
        </Typography>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <ListItem key={item.path} disablePadding>
                <Tooltip title={item.label} placement="right" arrow disableHoverListener>
                  <ListItemButton onClick={() => onNavigate(item.path)}
                    sx={{
                      borderRadius: '9px', py: 1.2, px: 1.5,
                      bgcolor: active ? 'rgba(196,151,63,0.14)' : 'transparent',
                      transition: 'background-color 0.15s',
                      '&:hover': { bgcolor: active ? 'rgba(196,151,63,0.2)' : 'rgba(255,255,255,0.07)' },
                    }}>
                    <ListItemIcon sx={{ minWidth: 36, color: active ? '#C4973F' : 'rgba(255,255,255,0.45)', transition: 'color 0.15s' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400, color: active ? '#fff' : 'rgba(255,255,255,0.55)', transition: 'color 0.15s' }}
                    />
                    {active && <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: '#C4973F', ml: 1, flexShrink: 0 }} />}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          })}
        </List>

        <Box sx={{ mt: 3 }}>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 2 }} />
          <ListItemButton onClick={() => onNavigate('/app/relationships')}
            sx={{ borderRadius: '9px', py: 1.25, px: 1.5, border: '1px dashed rgba(196,151,63,0.35)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(196,151,63,0.1)', borderColor: 'rgba(196,151,63,0.65)', transform: 'translateX(2px)' } }}>
            <ListItemIcon sx={{ minWidth: 36, color: '#C4973F' }}>
              <AddCircleOutlineRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Add Person" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#C4973F' }} />
          </ListItemButton>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* Settings + User */}
      <Box sx={{ px: 1.5, py: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <ListItemButton onClick={() => onNavigate('/app/settings')}
          sx={{ borderRadius: '9px', py: 1.25, px: 1.5, bgcolor: isActive('/app/settings') ? 'rgba(196,151,63,0.14)' : 'transparent', transition: 'background-color 0.15s', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' } }}>
          <ListItemIcon sx={{ minWidth: 36, color: isActive('/app/settings') ? '#C4973F' : 'rgba(255,255,255,0.45)' }}>
            <SettingsRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.875rem', color: isActive('/app/settings') ? 'white' : 'rgba(255,255,255,0.55)' }} />
        </ListItemButton>

        <Box onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1.5, mt: 0.5, borderRadius: '9px', bgcolor: 'rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background-color 0.15s', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <Avatar src={user?.imageUrl} sx={{ width: 34, height: 34, bgcolor: '#C4973F', fontSize: '0.8rem', fontWeight: 700 }}>{initials}</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white' }} noWrap>{displayName}</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>Pro Plan</Typography>
          </Box>
        </Box>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}
          PaperProps={{ sx: { boxShadow: 4, borderRadius: 2, minWidth: 180 } }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <MenuItem onClick={() => { onNavigate('/app/settings'); setMenuAnchor(null) }} sx={{ fontSize: '0.875rem', gap: 1.5 }}>
            <PersonRoundedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
            Profile Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { signOut(); setMenuAnchor(null) }} sx={{ fontSize: '0.875rem', color: '#C0392B', gap: 1.5 }}>
            <LogoutRoundedIcon sx={{ fontSize: 18 }} />
            Sign out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (path) => {
    navigate(path)
    if (isMobile) setMobileOpen(false)
  }

  const pageTitle = Object.entries(PAGE_TITLES).find(([key]) => location.pathname.startsWith(key))?.[1] || 'Love Ledger'

  const bottomNavValue = navItems.find((item) => location.pathname.startsWith(item.path))?.path || false

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box component="nav" sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}>
          <Box sx={{ width: DRAWER_WIDTH, height: '100vh', position: 'fixed', top: 0, left: 0, overflowY: 'auto' }}>
            <SidebarContent onNavigate={handleNavigate} />
          </Box>
        </Box>
      )}

      {/* Mobile sidebar drawer */}
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
          <SidebarContent onNavigate={handleNavigate} />
        </Drawer>
      )}

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column', pb: isMobile ? 7 : 0 }}>
        {/* Mobile top bar */}
        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.5, bgcolor: '#1C2B3A', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white', p: 0.75 }}>
              <MenuRoundedIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: '#C4973F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FavoriteRoundedIcon sx={{ fontSize: 14, color: 'white' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>{pageTitle}</Typography>
            </Box>
          </Box>
        )}

        <Outlet />
      </Box>

      {/* Mobile bottom nav */}
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, borderTop: '1px solid #E8E3DA', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }} elevation={0}>
          <BottomNavigation value={bottomNavValue} onChange={(_, path) => navigate(path)}
            sx={{ bgcolor: 'white', height: 58, '& .MuiBottomNavigationAction-root': { minWidth: 0, py: 1, color: '#9CA3AF', transition: 'color 0.15s' }, '& .Mui-selected': { color: '#1C2B3A' }, '& .MuiBottomNavigationAction-label': { fontSize: '0.68rem !important', fontWeight: 600, mt: 0.25 } }}>
            {navItems.map((item) => (
              <BottomNavigationAction key={item.path} label={item.label === 'Memory Vault' ? 'Memories' : item.label === 'Gift Tracker' ? 'Gifts' : item.label} value={item.path} icon={item.icon} />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  )
}
