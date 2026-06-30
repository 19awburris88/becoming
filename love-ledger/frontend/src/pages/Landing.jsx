import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Container, Typography, Grid, Card, CardContent, Chip, Divider,
  Drawer, IconButton, List, ListItemButton, ListItemText, useMediaQuery, useTheme,
} from '@mui/material'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { useInView } from '../hooks/useInView'

/* ── Scroll-triggered fade/slide ─────────────────────────────────────── */
function FadeIn({ children, delay = 0, direction = 'up', sx = {} }) {
  const [ref, inView] = useInView()
  const transforms = {
    up: 'translateY(28px)',
    left: 'translateX(-28px)',
    right: 'translateX(28px)',
    none: 'none',
  }
  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : transforms[direction],
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

/* ── Feature card data ───────────────────────────────────────────────── */
const features = [
  { icon: <PeopleRoundedIcon sx={{ fontSize: 26 }} />, title: 'Relationship Profiles', description: 'Store everything — favorites, sizes, love languages, personality notes, and private observations. All in one place.', color: '#8B5CF6', light: '#F5F3FF' },
  { icon: <NotificationsActiveRoundedIcon sx={{ fontSize: 26 }} />, title: 'Important Dates', description: 'Never miss a birthday, anniversary, or milestone. Set reminders 1, 2, or 4 weeks out. Always be ready.', color: '#C4973F', light: '#FDF6E8' },
  { icon: <AutoStoriesRoundedIcon sx={{ fontSize: 26 }} />, title: 'Memory Vault', description: 'Capture meaningful moments as they happen. Build a timeline of memories you can revisit for years to come.', color: '#0EA5E9', light: '#F0F9FF' },
  { icon: <CardGiftcardRoundedIcon sx={{ fontSize: 26 }} />, title: 'Gift Tracker', description: 'Save gift ideas the moment inspiration strikes. Track status from idea to given. Never scramble last minute.', color: '#10B981', light: '#ECFDF5' },
  { icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 26 }} />, title: 'Thoughtfulness Engine', description: 'Get intelligent nudges that help you be intentional — not just reminded. Know what to do, when, and why.', color: '#EF4444', light: '#FEF2F2' },
  { icon: <LockRoundedIcon sx={{ fontSize: 26 }} />, title: 'Private by Design', description: 'Your relationship data is yours alone. End-to-end encrypted, never shared, never sold. Built for trust.', color: '#1C2B3A', light: '#F0EDE5' },
]

const steps = [
  { number: '01', title: 'Add the people who matter', description: "Create profiles for your spouse, kids, parents, and close friends. Start with the basics and build over time." },
  { number: '02', title: 'Build their profile as you go', description: "Add favorites, notes, dates, and memories whenever something comes up. It takes 30 seconds. You'll thank yourself later." },
  { number: '03', title: 'Stay intentional with smart nudges', description: "Love Ledger surfaces the right information at the right time — so you show up prepared, thoughtful, and present." },
]

const testimonials = [
  { quote: "I used to completely forget our anniversary plans until the week before. Now I'm planning months out, I know exactly what she wants, and I actually look forward to it. Sarah has noticed.", name: 'Michael T.', role: 'Husband & Father, Dallas TX', initial: 'MT' },
  { quote: "I take care of my aging mother and this app has been a game changer. I track her medications, what she needs, her appointments. It helps me show up for her the way she showed up for me.", name: 'Denise R.', role: 'Adult Daughter, Atlanta GA', initial: 'DR' },
  { quote: "My relationships are my most important assets. I run a CRM for my business. Why didn't I have one for the people I actually love? Love Ledger fills that gap.", name: 'James K.', role: 'Entrepreneur, Houston TX', initial: 'JK' },
]

const pricingPlans = [
  { name: 'Starter', price: 'Free', period: '', description: 'For individuals getting started.', features: ['Up to 3 relationships', 'Basic profiles', 'Important dates', 'Email reminders'], cta: 'Get started free', highlighted: false },
  { name: 'Pro', price: '$9', period: '/mo', description: 'For intentional people who want more.', features: ['Unlimited relationships', 'Full profiles with all fields', 'Memory Vault with photos', 'Gift Tracker', 'Thoughtfulness Engine', 'SMS reminders'], cta: 'Start free trial', highlighted: true },
  { name: 'Family', price: '$19', period: '/mo', description: 'Shared access for couples.', features: ['Everything in Pro', '2 user accounts', 'Shared relationship profiles', 'Shared gift tracking', 'Priority support'], cta: 'Start free trial', highlighted: false },
]

/* ── Navbar ──────────────────────────────────────────────────────────── */
function NavBar({ onNavigate }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ]

  const scrollTo = (href) => {
    setDrawerOpen(false)
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      onNavigate(href)
    }
  }

  return (
    <>
      <Box sx={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        bgcolor: scrolled ? 'rgba(28,43,58,0.98)' : 'rgba(28,43,58,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.2)' : 'none',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.75 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: '#C4973F', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.08)' } }}>
                <FavoriteRoundedIcon sx={{ fontSize: 17, color: 'white' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'white', letterSpacing: '-0.02em' }}>Love Ledger</Typography>
            </Box>

            {/* Desktop links */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {navLinks.map((link) => (
                  <Button key={link.label} onClick={() => scrollTo(link.href)}
                    sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', px: 1.5, position: 'relative', overflow: 'hidden',
                      '&::after': { content: '""', position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: 0, height: 1.5, bgcolor: '#C4973F', transition: 'width 0.25s ease', borderRadius: 1 },
                      '&:hover': { color: 'white', bgcolor: 'transparent', '&::after': { width: '60%' } },
                    }}>
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <Button onClick={() => onNavigate('/app/dashboard')}
                  sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.07)' } }}>
                  Sign in
                </Button>
              )}
              <Button onClick={() => onNavigate('/app/dashboard')} variant="contained"
                sx={{ bgcolor: '#C4973F', color: 'white', fontSize: '0.875rem', px: 2.5, py: 1,
                  transition: 'all 0.2s', '&:hover': { bgcolor: '#D4A857', transform: 'translateY(-1px)', boxShadow: '0 4px 16px rgba(196,151,63,0.4)' } }}>
                Get started
              </Button>
              {isMobile && (
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white', ml: 0.5 }}>
                  <MenuRoundedIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mobile nav drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: '#1C2B3A', border: 'none' } }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '7px', bgcolor: '#C4973F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FavoriteRoundedIcon sx={{ fontSize: 15, color: 'white' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Love Ledger</Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <List disablePadding sx={{ mb: 4 }}>
            {navLinks.map((link) => (
              <ListItemButton key={link.label} onClick={() => scrollTo(link.href)} sx={{ borderRadius: 2, mb: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' } }}>
                <ListItemText primary={link.label} primaryTypographyProps={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500 }} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button fullWidth onClick={() => { setDrawerOpen(false); onNavigate('/app/dashboard') }}
              sx={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)' } }}>
              Sign in
            </Button>
            <Button fullWidth variant="contained" onClick={() => { setDrawerOpen(false); onNavigate('/app/dashboard') }}
              sx={{ bgcolor: '#C4973F', '&:hover': { bgcolor: '#D4A857' } }}>
              Get started free
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

/* ── Main ────────────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate()

  return (
    <Box sx={{ bgcolor: '#F8F6F1', overflowX: 'hidden' }}>
      <NavBar onNavigate={navigate} />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: '#1C2B3A', minHeight: '100vh', display: 'flex', alignItems: 'center', pt: 10, pb: 10, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 40%, rgba(196,151,63,0.1) 0%, transparent 55%), radial-gradient(ellipse at 15% 80%, rgba(139,92,246,0.07) 0%, transparent 50%), radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 40%)' }} />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ opacity: 0, animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards', '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'none' } } }}>
                <Chip label="Personal Relationship System" size="small"
                  sx={{ bgcolor: 'rgba(196,151,63,0.15)', color: '#C4973F', border: '1px solid rgba(196,151,63,0.3)', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.03em', mb: 3 }} />
                <Typography variant="h1"
                  sx={{ fontSize: { xs: '2.75rem', sm: '3.5rem', md: '3.75rem', lg: '4.25rem' }, color: 'white', mb: 3, fontFamily: '"Lora", Georgia, serif', fontWeight: 700, lineHeight: 1.07 }}>
                  The CRM for the<br />people you{' '}
                  <Box component="span" sx={{ color: '#C4973F', fontStyle: 'italic' }}>love.</Box>
                </Typography>
                <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: 'rgba(255,255,255,0.65)', mb: 5, lineHeight: 1.75, maxWidth: 480 }}>
                  Never forget a birthday, always find the right gift, and stay intentional with the relationships that matter most. Love Ledger is your private system for remembering everything.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="contained" size="large" onClick={() => navigate('/app/dashboard')}
                    sx={{ bgcolor: '#C4973F', color: 'white', px: 4, py: 1.75, fontSize: '1rem', transition: 'all 0.2s',
                      '&:hover': { bgcolor: '#D4A857', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(196,151,63,0.4)' } }}>
                    Start for free
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} endIcon={<ArrowForwardRoundedIcon />}
                    sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)', px: 3.5, py: 1.75, fontSize: '1rem',
                      transition: 'all 0.2s', '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.07)', color: 'white' } }}>
                    See how it works
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 5, flexWrap: 'wrap' }}>
                  {['Free to start', 'No credit card', 'Private & secure'].map((label) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <CheckRoundedIcon sx={{ fontSize: 16, color: '#C4973F' }} />
                      <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Hero mock UI */}
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', pl: 4, opacity: 0, animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s forwards' }}>
                <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: 3, boxShadow: '0 24px 64px rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>SJ</Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '1rem' }}>Sarah Johnson</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>Wife</Typography>
                    </Box>
                    <Chip label="Anniversary in 2 days" size="small" sx={{ ml: 'auto', bgcolor: '#FDF6E8', color: '#C4973F', fontWeight: 600, fontSize: '0.72rem', border: '1px solid #F0DFB0' }} />
                  </Box>
                  <Divider sx={{ mb: 2.5 }} />
                  <Grid container spacing={2}>
                    {[
                      { label: 'Love Language', value: 'Acts of Service' },
                      { label: 'Coffee Order', value: 'Oat milk latte, extra shot' },
                      { label: 'Fragrance', value: 'Jo Malone Peony & Blush' },
                      { label: 'Shoe Size', value: '7.5' },
                    ].map((item) => (
                      <Grid item xs={6} key={item.label}>
                        <Typography sx={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>{item.label}</Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: '#1A1A2E', fontWeight: 500 }}>{item.value}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box sx={{ position: 'absolute', bottom: -24, left: 0, right: 60, bgcolor: '#1C2B3A', borderRadius: 2, p: 2, border: '1px solid rgba(196,151,63,0.3)', display: 'flex', alignItems: 'center', gap: 1.5, boxShadow: '0 12px 32px rgba(0,0,0,0.35)' }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'rgba(196,151,63,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: '#C4973F' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>3 gift ideas saved for Sarah</Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Anniversary is in 2 days — have you made a reservation?</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Problem Section ───────────────────────────────────────────── */}
      <Box sx={{ bgcolor: '#F0EDE5', py: { xs: 8, md: 14 } }}>
        <Container maxWidth="md">
          <FadeIn>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C4973F', textTransform: 'uppercase', mb: 2 }}>The Problem</Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontFamily: '"Lora", Georgia, serif', color: '#1C2B3A', mb: 4, lineHeight: 1.25 }}>
                You have a system for everything —{' '}
                <Box component="span" sx={{ fontStyle: 'italic', color: '#9CA3AF' }}>except the people who matter most.</Box>
              </Typography>
              <Typography sx={{ fontSize: '1.05rem', color: '#4B5563', lineHeight: 1.85, mb: 8 }}>
                You track customers in Salesforce. Projects in Jira. Workouts in MyFitnessPal. Finances in Mint. But your spouse's love language? Your kid's shoe size? Your mother's favorite flowers? You rely on memory alone — and memory isn't enough.
              </Typography>
            </Box>
          </FadeIn>

          <Grid container spacing={4} justifyContent="center">
            {[
              { stat: '80%', text: 'of people forget important dates without a reminder' },
              { stat: '6 wks', text: 'average gap between intentional date nights for married couples' },
              { stat: '1 in 3', text: 'people say they wish they were more intentional with family' },
            ].map((item, i) => (
              <Grid item xs={12} sm={4} key={item.stat}>
                <FadeIn delay={i * 0.12}>
                  <Box sx={{ textAlign: 'center', p: 3, borderRadius: 3, bgcolor: 'white', border: '1px solid #E8E3DA', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 } }}>
                    <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#1C2B3A', fontFamily: '"Lora", Georgia, serif', mb: 1 }}>{item.stat}</Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6 }}>{item.text}</Typography>
                  </Box>
                </FadeIn>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <Box id="features" sx={{ py: { xs: 8, md: 14 }, bgcolor: '#F8F6F1' }}>
        <Container maxWidth="lg">
          <FadeIn>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C4973F', textTransform: 'uppercase', mb: 2 }}>Features</Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontFamily: '"Lora", Georgia, serif', color: '#1C2B3A', mb: 2 }}>
                Everything you need to love well.
              </Typography>
              <Typography sx={{ fontSize: '1.05rem', color: '#6B7280', maxWidth: 520, mx: 'auto' }}>Built for the details that make the difference.</Typography>
            </Box>
          </FadeIn>

          <Grid container spacing={3}>
            {features.map((feature, i) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <FadeIn delay={i * 0.08}>
                  <Card sx={{
                    height: '100%', cursor: 'default',
                    transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' },
                    '&:hover .feature-icon': { bgcolor: feature.color, color: 'white', transform: 'scale(1.05)' },
                    '&:hover .feature-title': { color: feature.color },
                  }}>
                    <CardContent sx={{ p: 3.5 }}>
                      <Box className="feature-icon" sx={{ width: 52, height: 52, borderRadius: '14px', bgcolor: feature.light, display: 'flex', alignItems: 'center', justifyContent: 'center', color: feature.color, mb: 2.5, transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)' }}>
                        {feature.icon}
                      </Box>
                      <Typography className="feature-title" variant="h6" sx={{ mb: 1.5, color: '#1C2B3A', transition: 'color 0.2s', fontWeight: 700 }}>{feature.title}</Typography>
                      <Typography sx={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.75 }}>{feature.description}</Typography>
                    </CardContent>
                  </Card>
                </FadeIn>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <Box id="how-it-works" sx={{ py: { xs: 8, md: 14 }, bgcolor: '#1C2B3A', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(196,151,63,0.07) 0%, transparent 60%)' }} />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <FadeIn>
            <Box sx={{ textAlign: 'center', mb: 9 }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C4973F', textTransform: 'uppercase', mb: 2 }}>How It Works</Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontFamily: '"Lora", Georgia, serif', color: 'white' }}>
                Simple to start. Powerful over time.
              </Typography>
            </Box>
          </FadeIn>

          <Grid container spacing={5}>
            {steps.map((step, i) => (
              <Grid item xs={12} md={4} key={step.number}>
                <FadeIn delay={i * 0.15} direction="up">
                  <Box sx={{ textAlign: 'center', px: { md: 2 } }}>
                    <Typography sx={{ fontSize: '4.5rem', fontWeight: 800, color: 'rgba(196,151,63,0.18)', fontFamily: '"Lora", Georgia, serif', lineHeight: 1, mb: 2 }}>{step.number}</Typography>
                    <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 700, fontSize: '1.15rem' }}>{step.title}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: '0.925rem' }}>{step.description}</Typography>
                  </Box>
                </FadeIn>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#F8F6F1' }}>
        <Container maxWidth="lg">
          <FadeIn>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C4973F', textTransform: 'uppercase', mb: 2 }}>What People Say</Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontFamily: '"Lora", Georgia, serif', color: '#1C2B3A' }}>
                Relationships worth remembering.
              </Typography>
            </Box>
          </FadeIn>

          <Grid container spacing={3}>
            {testimonials.map((t, i) => (
              <Grid item xs={12} md={4} key={t.name}>
                <FadeIn delay={i * 0.1}>
                  <Card sx={{
                    height: '100%',
                    transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
                    borderLeft: '3px solid transparent',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 32px rgba(0,0,0,0.09)', borderLeft: '3px solid #C4973F' },
                  }}>
                    <CardContent sx={{ p: 3.5 }}>
                      <FormatQuoteRoundedIcon sx={{ fontSize: 36, color: '#C4973F', mb: 2, opacity: 0.65 }} />
                      <Typography sx={{ color: '#374151', lineHeight: 1.8, fontSize: '0.925rem', mb: 3, fontStyle: 'italic', fontFamily: '"Lora", Georgia, serif' }}>
                        "{t.quote}"
                      </Typography>
                      <Divider sx={{ mb: 2.5 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#1C2B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{t.initial}</Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#1C2B3A', fontSize: '0.875rem' }}>{t.name}</Typography>
                          <Typography sx={{ color: '#9CA3AF', fontSize: '0.78rem' }}>{t.role}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </FadeIn>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <Box id="pricing" sx={{ py: { xs: 8, md: 14 }, bgcolor: '#F0EDE5' }}>
        <Container maxWidth="lg">
          <FadeIn>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C4973F', textTransform: 'uppercase', mb: 2 }}>Pricing</Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontFamily: '"Lora", Georgia, serif', color: '#1C2B3A', mb: 2 }}>
                Invest in what matters.
              </Typography>
              <Typography sx={{ fontSize: '1.05rem', color: '#6B7280' }}>Start free. Upgrade when you're ready.</Typography>
            </Box>
          </FadeIn>

          <Grid container spacing={3} alignItems="stretch" justifyContent="center">
            {pricingPlans.map((plan, i) => (
              <Grid item xs={12} sm={6} md={4} key={plan.name}>
                <FadeIn delay={i * 0.1}>
                  <Card sx={{
                    height: '100%',
                    bgcolor: plan.highlighted ? '#1C2B3A' : 'white',
                    border: plan.highlighted ? '2px solid #C4973F' : '1px solid #E8E3DA',
                    position: 'relative', overflow: 'visible',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    '&:hover': { transform: plan.highlighted ? 'scale(1.02)' : 'translateY(-4px)', boxShadow: plan.highlighted ? '0 20px 48px rgba(196,151,63,0.25)' : '0 12px 32px rgba(0,0,0,0.1)' },
                  }}>
                    {plan.highlighted && (
                      <Chip label="Most Popular" size="small"
                        sx={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', bgcolor: '#C4973F', color: 'white', fontWeight: 700, fontSize: '0.72rem', px: 0.5 }} />
                    )}
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ color: plan.highlighted ? '#C4973F' : '#1C2B3A', mb: 1, fontWeight: 700 }}>{plan.name}</Typography>
                      <Typography sx={{ color: plan.highlighted ? 'rgba(255,255,255,0.45)' : '#6B7280', fontSize: '0.875rem', mb: 3 }}>{plan.description}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 4 }}>
                        <Typography sx={{ fontSize: '2.75rem', fontWeight: 800, color: plan.highlighted ? 'white' : '#1C2B3A', lineHeight: 1, fontFamily: '"Lora", Georgia, serif' }}>{plan.price}</Typography>
                        {plan.period && <Typography sx={{ color: plan.highlighted ? 'rgba(255,255,255,0.4)' : '#9CA3AF', fontSize: '1rem' }}>{plan.period}</Typography>}
                      </Box>
                      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {plan.features.map((f) => (
                          <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CheckRoundedIcon sx={{ fontSize: 16, color: plan.highlighted ? '#C4973F' : '#10B981', flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.875rem', color: plan.highlighted ? 'rgba(255,255,255,0.75)' : '#374151' }}>{f}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Button fullWidth variant={plan.highlighted ? 'contained' : 'outlined'} onClick={() => navigate('/app/dashboard')}
                        sx={plan.highlighted
                          ? { bgcolor: '#C4973F', color: 'white', transition: 'all 0.2s', '&:hover': { bgcolor: '#D4A857', boxShadow: '0 4px 16px rgba(196,151,63,0.4)' } }
                          : { borderColor: '#1C2B3A', color: '#1C2B3A', transition: 'all 0.2s', '&:hover': { bgcolor: '#1C2B3A', color: 'white' } }}>
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </FadeIn>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: '#1C2B3A', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(196,151,63,0.09) 0%, transparent 65%)' }} />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <FadeIn>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: '#C4973F', textTransform: 'uppercase', mb: 3 }}>Start Today</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, color: 'white', fontFamily: '"Lora", Georgia, serif', mb: 3, lineHeight: 1.2 }}>
              The people you love deserve<br />to be remembered.
            </Typography>
            <Typography sx={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', mb: 7, maxWidth: 480, mx: 'auto', lineHeight: 1.8 }}>
              Not because love should be automated. Because the details are what make someone feel truly known.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/app/dashboard')}
              sx={{ bgcolor: '#C4973F', color: 'white', px: 6, py: 2, fontSize: '1.05rem', transition: 'all 0.2s',
                '&:hover': { bgcolor: '#D4A857', transform: 'translateY(-2px)', boxShadow: '0 10px 32px rgba(196,151,63,0.45)' } }}>
              Start for free — no credit card needed
            </Button>
          </FadeIn>
        </Container>
      </Box>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: '#0D1820', py: 5 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '7px', bgcolor: '#C4973F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FavoriteRoundedIcon sx={{ fontSize: 15, color: 'white' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Love Ledger</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', order: { xs: 3, sm: 2 }, width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'left' } }}>
              © 2026 Love Ledger. Private by design.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Privacy', 'Terms', 'Contact'].map((link) => (
                <Typography key={link} sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color 0.15s', '&:hover': { color: 'rgba(255,255,255,0.7)' } }}>
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
