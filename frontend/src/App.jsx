import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  BookOpenCheck,
  Building2,
  Bookmark,
  Braces,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  FileText,
  Home,
  Layers3,
  LibraryBig,
  LockKeyhole,
  Menu,
  Monitor,
  Moon,
  Play,
  Phone,
  Search,
  Send,
  Sparkles,
  ShieldCheck,
  Sun,
  Target,
  Timer,
  UserRound,
  X,
} from 'lucide-react'
import { courses, features } from './data/content'
import { demoExamYears, demoExams, demoResources } from './data/demoContent'
import { universities } from './data/universities'
import AdminPortal from './AdminPortal'
import './App.css'

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Explore courses', href: '#courses' },
  { label: 'Universities', href: '#universities' },
  { label: 'Practice exams', href: '#features' },
  { label: 'Study materials', href: '#workspace' },
  { label: 'About', href: '#how-it-works' },
]

const studyMaterials = [
  { id: 'questions', title: 'Practice exam', description: 'Try timed sample questions for your selected year', icon: BookOpenCheck, tag: 'FREE PRACTICE' },
  { id: 'notes', title: 'Short notes', description: 'Quick reviews for focused study', icon: FileText, tag: 'STUDY NOTES' },
  { id: 'books', title: 'Full course books', description: 'Read complete course materials', icon: BookOpen, tag: 'DIGITAL LIBRARY' },
]

function Logo({ light = false }) {
  return (
    <a className={`brand${light ? ' brand-light' : ''}`} href="#home" aria-label="Sura Study home">
      <img className="brand-emblem" src="/sura-crown-emblem.webp" alt="" />
      <span className="brand-name">sura<span>study</span></span>
    </a>
  )
}

const universityInitials = {
  'Addis Ababa University': 'AAU',
  'Bahir Dar University': 'BDU',
  'Hawassa University': 'HU',
  'Haramaya University': 'HRU',
  'Jimma University': 'JU',
  'Mekelle University': 'MU',
  'Adama Science and Technology University': 'ASTU',
  'University of Gondar': 'UoG',
  'Samara University': 'SU',
}

const universityLogoSources = {
  'Addis Ababa University': ['/university-logos/addis.jpeg'],
  'Bahir Dar University': ['/university-logos/bahir-dar-university.jpg'],
  'Hawassa University': ['/university-logos/hawassa-university.webp'],
  'Haramaya University': ['/university-logos/haramaya-university.png'],
  'Adama Science and Technology University': ['/university-logos/adama.jpeg'],
  'University of Gondar': ['/university-logos/gondar-university.png'],
  'Samara University': ['/university-logos/semera.jpeg'],
}

function UniversityMark({ name }) {
  return <UniversityMarkImage key={name} name={name} />
}

function UniversityMarkImage({ name }) {
  const sources = ['webp', 'png', 'jpg', 'jpeg']
  const [sourceIndex, setSourceIndex] = useState(0)
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const logoSources = universityLogoSources[name] || sources.map((extension) => `/university-logos/${slug}.${extension}`)
  return <span className="university-mark">{sourceIndex < logoSources.length ? <img src={logoSources[sourceIndex]} alt={`${name} logo`} onError={() => setSourceIndex((current) => current + 1)} /> : <span aria-label={`${name} logo placeholder`}>{universityInitials[name] || name.split(/\s+/).slice(0, 3).map((part) => part[0]).join('').toUpperCase()}</span>}</span>
}

function UniversityDropdown({ choices, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const dropdownRef = useRef(null)
  const selected = choices.find((item) => item.name === value)
  const filteredChoices = choices.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(() => {
    if (!open) return undefined
    const closeOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOutside)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOutside)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  function selectUniversity(name) {
    onChange(name)
    setOpen(false)
    setQuery('')
  }

  return <div className="university-picker" ref={dropdownRef}>
    <span><Building2 size={15} /> 1 · YOUR UNIVERSITY</span>
    <button type="button" className="university-dropdown-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      {selected ? <><UniversityMark name={selected.name} /><b>{selected.name}</b></> : <span>Choose university</span>}
      <ChevronDown size={16} />
    </button>
    {open && <div className="university-dropdown-menu">
      <label className="university-dropdown-search"><Search size={15} /><input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search universities" aria-label="Search universities" /></label>
      <div className="university-dropdown-list" role="listbox" aria-label="Universities">
        {filteredChoices.length ? filteredChoices.map((item) => <button type="button" role="option" aria-selected={item.name === value} className={`university-dropdown-option${item.name === value ? ' active' : ''}`} key={item.id || item.name} onClick={() => selectUniversity(item.name)}>
          <UniversityMark name={item.name} /><span><b>{item.name}</b><small>Free sample library</small></span>{item.name === value && <Check size={16} />}
        </button>) : <p className="university-dropdown-empty">No universities match that search.</p>}
      </div>
      <small className="university-dropdown-count">{filteredChoices.length} {filteredChoices.length === 1 ? 'university' : 'universities'} available</small>
    </div>}
  </div>
}

function AuthPage({ mode, dark, onToggleTheme }) {
  const isRegister = mode === 'register'
  const [countryCode, setCountryCode] = useState('+251')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [demoEnabled, setDemoEnabled] = useState(false)

  useEffect(() => {
    fetch('/api/auth/demo/status').then((response) => response.ok ? response.json() : null).then((result) => setDemoEnabled(Boolean(result?.enabled))).catch(() => setDemoEnabled(false))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const formData = new FormData(event.currentTarget)
      const localDigits = String(formData.get('phone') || '').replace(/\D/g, '')
      const phone = `${countryCode}${countryCode === '+251' && localDigits.startsWith('0') ? localDigits.slice(1) : localDigits}`
      const password = String(formData.get('password') || '')
      if (isRegister && password !== String(formData.get('confirmPassword') || '')) throw new Error('Your passwords do not match.')
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const body = { phone, password, ...(isRegister ? { displayName: String(formData.get('fullName') || '') } : {}) }
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Could not access your student account right now.')
      window.location.hash = 'app'
    } catch (requestError) {
      setError(requestError.message || 'Could not access your student account right now.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDemoAccess() {
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/auth/demo', { method: 'POST', credentials: 'same-origin' })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Demo student access is unavailable.')
      window.location.hash = 'app'
    } catch (requestError) { setError(requestError.message || 'Demo student access is unavailable.') }
    finally { setBusy(false) }
  }

  return (
    <main className={`auth-page${dark ? ' theme-dark' : ''}`}>
      <section className="auth-story" aria-label="Sura Study for students">
        <div className="auth-story-overlay" />
        <div className="auth-story-inner">
          <Logo light />
          <div className="auth-story-copy">
            <span className="auth-story-kicker"><Sparkles size={14} /> YOUR STUDY SPACE, READY WHEN YOU ARE</span>
            <h1>Make every<br />study session<br /><span>count.</span></h1>
            <p>Keep your courses, practice exams, and study materials close. Pick up where you left off, whenever you’re ready.</p>
            <div className="auth-story-points"><span><Check size={14} /> Built for university students</span><span><Check size={14} /> Sign in with your phone and password</span></div>
          </div>
          <span className="auth-story-foot">© 2026 Sura Study · Learn at your pace</span>
        </div>
        <div className="auth-orbit auth-orbit-one" /><div className="auth-orbit auth-orbit-two" />
      </section>

      <section className="auth-form-side">
        <a className="auth-back-link" href="#home"><ArrowLeft size={15} /> Back to home</a>
        <button className="auth-theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
        <div className="auth-card">
          <div className="auth-mobile-brand"><Logo /></div>
          <span className="auth-eyebrow">{isRegister ? 'START YOUR STUDY JOURNEY' : 'WELCOME BACK'}</span>
          <h2>{isRegister ? 'Create your account' : 'Sign in to your space'}</h2>
          <p className="auth-subtitle">{isRegister ? 'Create your account using your phone number and a password.' : 'Sign in securely using your phone number and password.'}</p>

          <div className="auth-mode-switch" role="tablist" aria-label="Account access">
            <a role="tab" aria-selected={!isRegister} className={!isRegister ? 'active' : ''} href="#login">Sign in</a>
            <a role="tab" aria-selected={isRegister} className={isRegister ? 'active' : ''} href="#register">Create account</a>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && <label className="auth-field"><span>Full name</span><span className="auth-input-wrap"><UserRound size={17} /><input name="fullName" autoComplete="name" placeholder="Your name" minLength={2} maxLength={100} required /></span></label>}
            <label className="auth-field"><span>Phone number</span><span className="auth-phone-wrap"><span className="auth-phone-icon"><Phone size={16} /></span><select aria-label="Country calling code" value={countryCode} onChange={(event) => setCountryCode(event.target.value)}><option value="+251">ET +251</option><option value="+254">KE +254</option><option value="+252">SO +252</option><option value="+256">UG +256</option><option value="+1">US +1</option><option value="+44">UK +44</option></select><i /><input name="phone" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="9 12 34 56 78" required /></span><small>Use the phone number linked to your account.</small></label>
            <label className="auth-field"><span>Password</span><span className="auth-input-wrap"><LockKeyhole size={17} /><input name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={8} maxLength={128} placeholder={isRegister ? 'Create a password' : 'Your password'} required /></span>{isRegister && <small>Use at least 8 characters.</small>}</label>
            {isRegister && <label className="auth-field"><span>Confirm password</span><span className="auth-input-wrap"><ShieldCheck size={17} /><input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} placeholder="Enter your password again" required /></span></label>}
            <button className="button auth-submit" type="submit" disabled={busy}>{busy ? (isRegister ? 'Creating account…' : 'Signing in…') : (isRegister ? 'Create account' : 'Sign in')} <ArrowRight size={16} /></button>
          </form>
          {error && <p className="auth-error" role="alert">{error}</p>}
          {demoEnabled && <div className="auth-demo-access"><span>Just exploring?</span><button type="button" onClick={handleDemoAccess} disabled={busy}>{busy ? 'Opening preview…' : 'Preview the student space'} <ArrowRight size={14} /></button><small>Temporary development account · sample content only</small></div>}
          <div className="auth-secure-note"><ShieldCheck size={15} /><span>Your details stay private and secure.</span></div>
          {isRegister && <p className="auth-terms">By creating an account, you agree to use Sura Study for your personal learning.</p>}
        </div>
        <span className="auth-mobile-foot">© 2026 Sura Study · Learn at your pace</span>
      </section>
    </main>
  )
}

function StudentExperience({ dark, onToggleTheme, onSignOut, onStudentUpdate, student }) {
  const [tab, setTab] = useState(() => new URLSearchParams(window.location.search).get('payment') === 'chapa' ? 'profile' : 'home')
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const [university, setUniversity] = useState('')
  const [year, setYear] = useState('')
  const [course, setCourse] = useState('')
  const [catalog, setCatalog] = useState([])
  const [paymentConfig, setPaymentConfig] = useState({ amount: 200, currency: 'ETB', environment: 'test', configured: false })
  const [paymentConfigError, setPaymentConfigError] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [paymentNotice, setPaymentNotice] = useState(() => {
    const search = new URLSearchParams(window.location.search)
    return search.get('payment') === 'chapa' && !search.get('tx_ref')
      ? 'We could not find the payment reference. Contact support before trying again.'
      : ''
  })
  const [paymentBusy, setPaymentBusy] = useState(() => {
    const search = new URLSearchParams(window.location.search)
    return search.get('payment') === 'chapa' && Boolean(search.get('tx_ref'))
  })
  const [aiOpen, setAiOpen] = useState(false)
  const [readingResource, setReadingResource] = useState(null)

  function openCheckout() {
    setPaymentNotice('')
    setTab('checkout')
  }

  useEffect(() => {
    fetch('/api/catalog').then((response) => response.ok ? response.json() : null).then((result) => { if (result?.universities?.length) setCatalog(result.universities) }).catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/payments/chapa/config').then(async (response) => {
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Payment settings are unavailable.')
      setPaymentConfig(result)
    }).catch((error) => setPaymentConfigError(error.message || 'Payment settings are unavailable.'))
  }, [])

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    if (search.get('payment') !== 'chapa') return
    const txRef = search.get('tx_ref')
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`)
    if (!txRef) return
    let active = true
    fetch('/api/payments/chapa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ txRef }),
    }).then(async (response) => {
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'We could not verify the payment.')
      const accountResponse = await fetch('/api/auth/me', { credentials: 'same-origin' })
      const accountResult = await accountResponse.json().catch(() => ({}))
      if (!accountResponse.ok) throw new Error(accountResult.error || 'Payment was confirmed, but your account could not be refreshed.')
      if (active) {
        onStudentUpdate(accountResult.student)
        setPaymentNotice('Payment confirmed. Your monthly study access is active.')
      }
    }).catch((error) => {
      if (active) setPaymentNotice(error.message || 'Payment could not be confirmed. If you completed checkout, try again in a moment.')
    }).finally(() => {
      if (active) setPaymentBusy(false)
    })
    return () => { active = false }
  }, [onStudentUpdate])

  async function beginChapaCheckout(event) {
    event.preventDefault()
    if (paymentBusy) return
    setPaymentBusy(true)
    setPaymentNotice('')
    try {
      const response = await fetch('/api/payments/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: billingEmail }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Chapa checkout could not be started.')
      if (!result.checkoutUrl) throw new Error('Chapa did not return a checkout link. Please try again.')
      window.location.assign(result.checkoutUrl)
    } catch (error) {
      setPaymentNotice(error.message || 'Chapa checkout could not be started. Please try again.')
      setPaymentBusy(false)
    }
  }

  const catalogNames = new Set(catalog.map((item) => item.name))
  const universityChoices = [...catalog, ...universities.filter((name) => !catalogNames.has(name)).map((name) => ({ name, courses }))]
  const selectedUniversity = universityChoices.find((item) => item.name === university)
  const selectedUniversityName = selectedUniversity?.name || ''
  const courseChoices = selectedUniversity?.courses?.length ? selectedUniversity.courses : courses
  const yearCourses = year ? courseChoices.filter((item) => demoExams[item.title]?.some((exam) => exam.year === year)) : []
  const selectedCourseRecord = yearCourses.find((item) => item.title === course)
  const courseMeta = courses.find((item) => item.title === selectedCourseRecord?.title)
  const selectedCourse = selectedCourseRecord
    ? { ...courseMeta, ...selectedCourseRecord, title: selectedCourseRecord.title, category: courseMeta?.category || 'YOUR COURSE', icon: courseMeta?.icon || BookOpen }
    : null
  const hasStudySelection = Boolean(selectedUniversity && year && selectedCourse)

  function chooseUniversity(name) {
    setUniversity(name)
    setYear('')
    setCourse('')
    setReadingResource(null)
  }

  function chooseYear(value) {
    setYear(value)
    setCourse('')
    setReadingResource(null)
  }

  function chooseCourse(title) {
    setCourse(title)
    setReadingResource(null)
  }

  useEffect(() => {
    if (!profileMenuOpen) return undefined
    const closeOnOutside = (event) => { if (!profileMenuRef.current?.contains(event.target)) setProfileMenuOpen(false) }
    const closeOnEscape = (event) => { if (event.key === 'Escape') setProfileMenuOpen(false) }
    document.addEventListener('mousedown', closeOnOutside)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [profileMenuOpen])

  return (
    <main className={`student-app${dark ? ' theme-dark' : ' theme-light'}`}>
      <div className="phone-stage-glow" />
      <section className="phone-device" aria-label="Sura Study student dashboard">
          <div className="phone-status"><span>STUDENT SPACE</span><span><i />{student?.phone === 'DEMO-PREVIEW' ? 'Preview account' : 'Student account'}</span></div>
        <header className="phone-header">
          <Logo />
          <div className="phone-header-actions">
            <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} title={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
            <div className="student-profile-menu" ref={profileMenuRef}>
              <button className="student-profile-trigger" type="button" onClick={() => setProfileMenuOpen((open) => !open)} aria-label="Open profile menu" aria-expanded={profileMenuOpen} aria-haspopup="menu"><span className="student-avatar">{(student?.displayName || 'S').slice(0, 1).toUpperCase()}</span><span>Profile</span><ChevronDown size={14} /></button>
              {profileMenuOpen && <div className="student-profile-dropdown" role="menu"><button type="button" role="menuitem" onClick={() => { setTab('profile'); setProfileMenuOpen(false) }}><UserRound size={15} /> My profile</button><button type="button" role="menuitem" onClick={onSignOut}><ArrowRight size={15} /> Sign out</button></div>}
            </div>
          </div>
        </header>

        <div className="phone-scroll-area">
          {tab === 'home' && <div className="student-home-grid">
            <div className="student-home-main">
              <section className="student-welcome"><span className="student-overline">YOUR LEARNING, IN ONE PLACE</span><h1>Ready to make progress?</h1><p>Choose your university, exam year, and course to open free sample materials.</p></section>
              <div className="student-selection-row">
                <UniversityDropdown choices={universityChoices} value={university} onChange={chooseUniversity} />
                {university && <label className="course-picker study-step-reveal"><span><i>2</i> EXAM YEAR</span><select value={year} onChange={(event) => chooseYear(event.target.value)}><option value="">Select an exam year</option>{demoExamYears.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}
                {university && year && <label className="course-picker study-step-reveal"><span><i>3</i> COURSE</span><select value={course} onChange={(event) => chooseCourse(event.target.value)}><option value="">Select a course</option>{yearCourses.map((item) => <option key={item.id || item.title} value={item.title}>{item.title}</option>)}</select></label>}
              </div>
              {selectedUniversity && <div className="selected-university-summary"><UniversityMark name={selectedUniversityName} /><span><small>YOUR UNIVERSITY</small><b>{selectedUniversityName}</b></span><span className="sample-access-badge"><Check size={13} /> Free samples</span></div>}
              {selectedCourse && <section className="student-course-card">
                <span className="student-card-icon"><selectedCourse.icon size={19} /></span><span className="student-card-kicker">SELECTED COURSE · {year}</span><h2>{selectedCourse.title}</h2><p>{selectedUniversityName} · sample study materials</p>
                <button type="button" className="student-card-link" onClick={() => setTab('library')}>Read course samples <ArrowRight size={15} /></button>
                <span className="student-orb student-orb-one" /><span className="student-orb student-orb-two" />
              </section>}
              <section className="student-section-head"><div><span className="student-overline">BUILT FOR YOUR NEXT EXAM</span><h2>Study materials</h2></div><button type="button" onClick={() => setTab('library')}>See all <ArrowRight size={14} /></button></section>
              {hasStudySelection ? <div className="student-material-list">{studyMaterials.map((material) => <MaterialCard key={material.id} material={material} onOpen={() => setTab(material.id === 'questions' ? 'explore' : 'library')} />)}</div> : <div className="selection-empty-state"><b>Start with your study path</b><p>Choose a university, exam year, and course above. Your free notes, reading samples, and practice exam will then be ready.</p></div>}
            </div>
            <aside className="student-home-aside"><SubscriptionCard price={paymentConfig.amount} onChoose={openCheckout} /><div className="student-aside-note"><span><ShieldCheck size={17} /></span><div><b>Study with confidence</b><p>Your questions, notes, and books stay organized around your course.</p></div></div></aside>
          </div>}

          {tab === 'explore' && <>
            <DemoExamWorkspace university={selectedUniversityName} year={year} course={selectedCourse?.title || ''} onChoosePath={() => setTab('home')} />
          </>}

          {tab === 'library' && <>
            {hasStudySelection && readingResource ? <>
              <button className="checkout-back" type="button" onClick={() => setReadingResource(null)}><ArrowLeft size={15} /> Back to sample library</button>
              <section className="student-page-heading"><span className="student-overline">FREE SAMPLE · {readingResource.kind}</span><h1>{readingResource.title}</h1><p>{selectedCourse.title} · {selectedUniversityName} · {year}</p></section>
              <p className="sample-data-note">Demonstration content for preview. It is not an official university publication or historical exam record.</p>
              <article className="demo-reader"><p>{readingResource.content}</p></article>
            </> : hasStudySelection ? <>
              <section className="student-page-heading"><span className="student-overline">FREE COURSE SAMPLES</span><h1>Notes & books</h1><p>Read these demonstration resources at no cost. Samples are illustrative and are not official university materials.</p></section>
              <div className="student-library-filter"><span>University</span><b>{selectedUniversityName}</b></div><div className="student-library-filter"><span>Exam year</span><b>{year}</b></div><div className="student-library-filter"><span>Course</span><b>{selectedCourse.title}</b></div>
              <div className="demo-resource-grid">{Object.entries(demoResources[selectedCourse.title] || {}).map(([kind, resource]) => <article className="demo-resource-card" key={kind}><span className="demo-resource-icon">{kind === 'note' ? <FileText size={18} /> : <BookOpen size={18} />}</span><small>FREE SAMPLE {kind.toUpperCase()}</small><h2>{resource.title}</h2><p>{resource.content.slice(0, 150)}…</p><button type="button" onClick={() => setReadingResource({ ...resource, kind })}>Read sample <ArrowRight size={14} /></button></article>)}</div>
            </> : <section className="selection-empty-state"><b>Choose your study path first</b><p>Select a university, exam year, and course to see free reading samples.</p><button type="button" onClick={() => setTab('home')}>Choose university and course <ArrowRight size={14} /></button></section>}
          </>}

          {tab === 'profile' && <>
            <section className="student-page-heading"><span className="student-overline">YOUR ACCOUNT</span><h1>Profile</h1><p>Manage your student learning space.</p></section>
            {paymentNotice && <p className={`student-notice${paymentNotice.startsWith('Payment confirmed') ? ' payment-success-notice' : ''}`} role="status">{paymentBusy ? 'Checking your Chapa payment…' : paymentNotice}</p>}
            <div className="profile-card"><span className="profile-avatar">{(student?.displayName || 'S').slice(0, 1).toUpperCase()}</span><div><b>{student?.displayName || 'Student'}</b><small>{student?.phone === 'DEMO-PREVIEW' ? 'Temporary demo account' : `Phone sign-in · ${student?.phone}`}</small></div><ShieldCheck size={18} /></div>
            <div className="student-profile-row"><span>University</span><b>{selectedUniversityName || 'Not selected'}</b></div><div className="student-profile-row"><span>Study path</span><b>{hasStudySelection ? `${year} · ${selectedCourse.title}` : 'Not selected'}</b></div><div className="student-profile-row"><span>Current plan</span><b className={student?.activeSubscription ? '' : 'locked-label'}>{student?.activeSubscription ? `Active until ${new Date(student.activeSubscription.endsAt).toLocaleDateString()}` : 'No active plan'}</b></div>
            <SubscriptionCard price={paymentConfig.amount} onChoose={openCheckout} />
          </>}

          {tab === 'checkout' && <>
            <button className="checkout-back" type="button" onClick={() => setTab('home')}><ArrowLeft size={15} /> Back to study space</button>
            <section className="student-page-heading checkout-heading"><span className="student-overline">MONTHLY STUDY ACCESS</span><h1>Study with<br />full access.</h1><p>Securely pay with Chapa. Access activates only after the payment is verified.</p></section>
            <div className="checkout-summary"><span className="checkout-summary-icon"><Layers3 size={19} /></span><div><b>Monthly all-access</b><small>All universities · All available courses · 1 month</small></div><span className="checkout-price">{paymentConfig.amount ? `ETB ${Number(paymentConfig.amount).toLocaleString('en-ET')}` : 'Price unavailable'}</span></div>
            <div className="checkout-plan-note"><Check size={15} /><span>One-time payment for one month. Your access starts after Chapa confirms payment.</span></div>
            <form className="chapa-checkout-form" onSubmit={beginChapaCheckout}>
              <label className="chapa-email-field"><span>Email for your Chapa receipt</span><input type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@example.com" value={billingEmail} onChange={(event) => setBillingEmail(event.target.value)} required /></label>
              <span className="payment-label">PAYMENT METHOD</span>
              <div className="payment-options">
                <div className="payment-option selected"><span className="payment-radio" /><span className="payment-brand chapa-brand"><img src="/payment-logos/chapa.png" alt="Chapa logo" /></span><span className="payment-description"><b>Chapa</b><small>Secure hosted checkout · ETB</small></span><span className="payment-selected-label">Selected</span></div>
                <div className="payment-option payment-option-soon" aria-label="Telebirr, coming soon"><span className="payment-radio" /><span className="payment-brand telebirr-brand"><img src="/payment-logos/telebirr.jpg" alt="Telebirr logo" /></span><span className="payment-description"><b>Telebirr</b><small>Mobile money payment</small></span><span className="payment-coming-soon">Coming soon</span></div>
              </div>
              {paymentConfig.environment === 'test' && <p className="chapa-test-note"><ShieldCheck size={15} /> Test mode — use Chapa test credentials; no real money should be charged.</p>}
              {!paymentConfig.configured && <p className="student-notice" role="status">{paymentConfigError || 'Chapa is not configured yet. Add CHAPA_SECRET_KEY to backend/.env to enable checkout.'}</p>}
              {paymentNotice && <p className="student-notice" role="alert">{paymentNotice}</p>}
              <button type="submit" className="checkout-pay-button" disabled={paymentBusy || !paymentConfig.configured}>{paymentBusy ? 'Connecting to Chapa…' : `Pay ETB ${Number(paymentConfig.amount || 0).toLocaleString('en-ET')} with Chapa`} <ArrowRight size={15} /></button>
            </form>
            <p className="checkout-footnote"><LockKeyhole size={13} /> Card details are entered on Chapa, never on this site.</p>
          </>}
        </div>

        <nav className="phone-tabbar" aria-label="Student app navigation">
          {[['home', Home, 'Home'], ['explore', Search, 'Explore'], ['library', BookOpen, 'Library'], ['profile', UserRound, 'Profile']].map(([id, Icon, label]) => <button type="button" key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)} title={label}><Icon size={18} /><span>{label}</span></button>)}
        </nav>
      </section>
      <button className="ai-floating-launcher" type="button" onClick={() => setAiOpen(true)} aria-label="Open AI study tutor" title="Ask Sura AI"><Sparkles size={22} /><span>Ask Sura AI</span></button>
      {aiOpen && <AiChatModal mode="student" demoMode={!student?.activeSubscription} dark={dark} university={selectedUniversityName} course={selectedCourse?.title || ''} onClose={() => setAiOpen(false)} />}
    </main>
  )
}

function DemoExamWorkspace({ university, year, course, onChoosePath }) {
  const [duration, setDuration] = useState('10')
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [explanationOpen, setExplanationOpen] = useState(false)
  const exam = demoExams[course]?.find((item) => item.year === year)
  const question = exam?.questions[index]
  const currentAnswer = answers[index]
  const isChecked = Boolean(checked[index])
  const score = exam?.questions.reduce((total, item, questionIndex) => total + (checked[questionIndex] && answers[questionIndex] === item.answer ? 1 : 0), 0) || 0

  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => {
      if (remaining <= 1) {
        window.clearInterval(timer)
        setRemaining(0)
        setRunning(false)
        setFinished(true)
      } else {
        setRemaining((seconds) => seconds - 1)
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running, remaining])

  function startExam() {
    if (!exam?.questions.length) return
    setIndex(0); setAnswers({}); setChecked({}); setExplanationOpen(false)
    setRemaining(Number(duration) * 60); setFinished(false); setRunning(true)
  }

  function moveNext() {
    setExplanationOpen(false)
    if (index >= exam.questions.length - 1) { setRunning(false); setFinished(true) }
    else setIndex((current) => current + 1)
  }

  const formattedTime = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`

  return <section className="demo-exam-shell">
    <div className="demo-exam-heading"><span className="student-overline">FREE PRACTICE · SAMPLE DATA</span><h2>Build your practice exam</h2><p>Practice questions are demonstration content, not official past papers or university exam records.</p></div>
    {!running && !finished && <>
      {university && year && course ? <>
        <div className="demo-exam-path"><span><UniversityMark name={university} /></span><b>{university}</b><i>{year}</i><b>{course}</b><button type="button" onClick={onChoosePath}>Change study path</button></div>
        <div className="demo-exam-selectors"><label><span>Time limit</span><select value={duration} onChange={(event) => setDuration(event.target.value)}><option value="5">5 minutes</option><option value="10">10 minutes</option><option value="20">20 minutes</option></select></label></div>
        <div className="demo-exam-start-row"><span><Timer size={15} /> {exam ? `${exam.questions.length} free sample questions · answers explained` : 'No sample exam is available for this course yet'}</span><button type="button" disabled={!exam} onClick={startExam}><Play size={15} /> Start timed exam</button></div>
      </> : <div className="selection-empty-state"><b>Choose a university, year, and course</b><p>Your selected course and year will appear here when your study path is ready.</p><button type="button" onClick={onChoosePath}>Choose study path <ArrowRight size={14} /></button></div>}
    </>}
    {running && question && <div className="demo-exam-active">
      <div className="demo-exam-active-top"><span>{course} <i>·</i> {year} sample</span><span className={`demo-exam-clock${remaining < 60 ? ' urgent' : ''}`}><Clock3 size={16} /> {formattedTime}</span></div>
      <div className="demo-exam-progress"><i style={{ width: `${((index + 1) / exam.questions.length) * 100}%` }} /></div>
      <div className="demo-question-meta">QUESTION {String(index + 1).padStart(2, '0')} <span>OF {exam.questions.length}</span></div>
      <h3>{question.prompt}</h3>
      <div className="demo-answer-list">{question.choices.map((choice, choiceIndex) => {
        const correct = isChecked && choiceIndex === question.answer
        const wrong = isChecked && currentAnswer === choiceIndex && choiceIndex !== question.answer
        return <button type="button" key={choice} disabled={isChecked} aria-pressed={currentAnswer === choiceIndex} className={`${currentAnswer === choiceIndex ? 'chosen ' : ''}${correct ? 'correct ' : ''}${wrong ? 'wrong' : ''}`} onClick={() => setAnswers((current) => ({ ...current, [index]: choiceIndex }))}><i>{String.fromCharCode(65 + choiceIndex)}</i><span>{choice}</span>{correct && <Check size={17} />}{wrong && <X size={17} />}</button>
      })}</div>
      {isChecked && <div className={`demo-answer-feedback ${currentAnswer === question.answer ? 'is-correct' : 'is-wrong'}`}><b>{currentAnswer === question.answer ? 'Correct answer' : 'Not quite'}</b><span>{currentAnswer === question.answer ? 'Well done. Review the explanation to reinforce the idea.' : 'The correct choice is highlighted in green. Review why below.'}</span><button type="button" onClick={() => setExplanationOpen((open) => !open)}>{explanationOpen ? 'Hide explanation' : 'Show explanation'} <ChevronDown size={14} /></button>{explanationOpen && <p>{question.explanation}</p>}</div>}
      <div className="demo-exam-footer"><span>{isChecked ? 'Answer saved' : 'Select an answer, then check it'}</span>{isChecked ? <button type="button" onClick={moveNext}>{index === exam.questions.length - 1 ? 'Finish exam' : 'Next question'} <ArrowRight size={14} /></button> : <button type="button" disabled={currentAnswer === undefined} onClick={() => setChecked((current) => ({ ...current, [index]: true }))}>Check answer <Check size={14} /></button>}</div>
    </div>}
    {finished && exam && <div className="demo-exam-results"><span className="demo-results-icon"><Check size={21} /></span><span className="student-overline">PRACTICE COMPLETE</span><h3>{score} <small>/ {exam.questions.length}</small></h3><p>You completed the {year} {course} sample for {university}.</p><div className="demo-result-review">{exam.questions.map((item, questionIndex) => <details key={item.prompt}><summary>Question {questionIndex + 1} · {answers[questionIndex] === item.answer ? 'Correct' : 'Review answer'}</summary><p>{item.prompt}</p><b>Correct answer: {item.choices[item.answer]}</b><p>{item.explanation}</p></details>)}</div><button type="button" className="demo-restart-button" onClick={onChoosePath}>Choose another study path</button></div>}
  </section>
}

function MaterialCard({ material, onOpen }) {
  const Icon = material.icon
  return <article className="student-material-card"><span className="material-icon"><Icon size={18} /></span><div className="material-copy"><span>{material.tag}</span><h3>{material.title}</h3><p>{material.description}</p></div><button type="button" aria-label={`Open free sample ${material.title}`} onClick={onOpen}><ArrowRight size={15} /><span>Free sample</span></button></article>
}

function SubscriptionCard({ onChoose, price }) {
  return <section className="subscription-card"><span className="subscription-spark"><Sparkles size={16} /></span><span className="student-overline">ONE PLAN. ALL YOUR STUDIES.</span><h2>Monthly all-access</h2><p>Unlock the full question bank, short notes, and course books for one month.</p><div className="subscription-price"><b>{price ? `ETB ${Number(price).toLocaleString('en-ET')}` : 'Price unavailable'}</b><span>/ month</span></div><button type="button" onClick={onChoose}>View secure payment <ArrowRight size={15} /></button><small>Sample materials remain free.</small></section>
}

function AiChatModal({ mode = 'public', demoMode = false, dark = false, university, course, onClose }) {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const bottomRef = useRef(null)
  const studentTutor = mode === 'student'
  const demoSuggestions = {
    'Data Structures and Algorithms': ['Explain Big O notation', 'How does binary search work?', 'Compare stacks and queues'],
    'Database Systems': ['Explain primary and foreign keys', 'What does ACID mean?', 'Why use a database index?'],
    'Operating Systems': ['Explain process and thread', 'What is a page fault?', 'How does round-robin scheduling work?'],
    'Computer Networks': ['Compare TCP and UDP', 'What does DNS do?', 'How does a router forward packets?'],
    'Software Engineering': ['Explain functional requirements', 'What is a unit test?', 'Compare verification and validation'],
    Cybersecurity: ['Explain the CIA triad', 'What does least privilege mean?', 'Compare hashing and encryption'],
  }
  const suggestions = studentTutor
    ? demoMode ? (demoSuggestions[course] || ['Explain a key idea from my course', 'Help me understand a course topic']) : ['Explain a key idea from my course', 'Help me understand a difficult topic', 'Give me a short revision summary']
    : ['What can I study with Sura Study?', 'How does monthly access work?', 'Can I use Sura Study on my phone?']

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, busy])

  async function submitQuestion(event) {
    event.preventDefault()
    const question = draft.trim()
    if (!question || busy) return
    setMessages((current) => [...current, { role: 'user', content: question }])
    setDraft('')
    setBusy(true)
    setError('')
    try {
      const response = await fetch(studentTutor ? '/api/ai/chat' : '/api/ai/public-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(studentTutor ? { question, university, course, sessionId } : { question }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || (response.status === 401 ? 'Sign in to use your course tutor.' : response.status === 402 ? 'Activate your monthly study pass to use course AI.' : 'Sura AI is unavailable right now. Please try again.'))
      if (result.sessionId) setSessionId(result.sessionId)
      setMessages((current) => [...current, { role: 'assistant', content: result.answer, sources: result.sources || [] }])
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach Sura AI. Please try again.')
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className={`ai-modal-backdrop${dark ? ' is-dark' : ''}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="ai-modal" role="dialog" aria-modal="true" aria-labelledby="ai-modal-title">
        <header className="ai-modal-header">
          <span className="ai-modal-brand"><span className="ai-modal-mark"><Sparkles size={18} /></span><span><b id="ai-modal-title">Sura AI</b><small>{studentTutor ? 'Your course study tutor' : 'Your study guide'}</small></span></span>
          <button className="ai-modal-close" type="button" onClick={onClose} aria-label="Close Sura AI chat"><X size={19} /></button>
        </header>
        <div className="ai-modal-context">
          <span className="ai-context-dot" />
          {studentTutor ? <span><b>{course}</b><small>{university} · {demoMode ? 'Demo tutor · sample materials' : 'Published course sources'}</small></span> : <span><b>Ask about Sura Study</b><small>Platform guide · Course answers require student access</small></span>}
          {studentTutor && <ShieldCheck className="ai-context-shield" size={17} />}
        </div>
        <div className="ai-modal-thread" aria-live="polite">
          {!messages.length && <div className="ai-modal-welcome"><span className="ai-welcome-spark"><Sparkles size={20} /></span><h2>{studentTutor ? 'What are you learning today?' : 'How can I guide you?'}</h2><p>{studentTutor ? demoMode ? 'Try the sample course tutor. It answers from the demo notes shown in your library.' : 'Ask for help with this course. I’ll ground my answer in the published study materials available to you.' : 'Ask about Sura Study, our learning tools, or how to get started.'}</p><div className="ai-modal-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => setDraft(suggestion)}>{suggestion}<ArrowUpRight size={14} /></button>)}</div></div>}
          {messages.map((message, index) => <article className={`ai-modal-message ${message.role}`} key={`${message.role}-${index}`}><span className="ai-modal-message-avatar">{message.role === 'assistant' ? <Sparkles size={14} /> : 'S'}</span><div className="ai-modal-bubble"><p>{message.content}</p>{message.sources?.length > 0 && <div className="ai-modal-sources"><b>{message.sources.some((source) => source.sample) ? 'Sample course materials' : 'From your course'}</b>{message.sources.map((source) => <span key={source.id}>{source.title}{source.pageNumber ? ` · page ${source.pageNumber}` : ''}</span>)}</div>}</div></article>)}
          {busy && <div className="ai-modal-thinking"><span /><span /><span /> {studentTutor ? 'Reviewing your course materials' : 'Sura AI is thinking'}…</div>}
          {error && <p className="ai-modal-error" role="alert">{error}</p>}
          <div ref={bottomRef} />
        </div>
        <form className="ai-modal-composer" onSubmit={submitQuestion}>
          <textarea ref={inputRef} rows={1} maxLength={1200} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={studentTutor ? 'Ask about your course…' : 'Ask a question about Sura Study…'} aria-label="Your question for Sura AI" />
          <button type="submit" disabled={!draft.trim() || busy} aria-label="Send question"><Send size={17} /></button>
          <small>{studentTutor ? 'Answers are based on published course materials.' : 'Sura AI answers questions about the Sura Study platform.'}</small>
        </form>
      </section>
    </div>
  )
}

function Navbar({ loggedIn = false, dark, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Logo />
        <div className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
          {navigation.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a className="mobile-nav-cta" href={loggedIn ? '#app' : '#register'} onClick={() => setMenuOpen(false)}>{loggedIn ? 'Profile' : 'Get started'} <ArrowRight size={15} /></a>
        </div>
        <div className="nav-actions">
          {loggedIn ? <a className="button button-small button-dark profile-nav-button" href="#app"><UserRound size={15} /> Profile</a> : <><a className="sign-in-link" href="#login">Sign in</a><a className="button button-small button-dark" href="#register">Get started <ArrowRight size={15} /></a></>}
          <button className="site-theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} title={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
    </header>
  )
}

function DashboardPreview() {
  return (
    <div className="dashboard-wrap" aria-label="Preview of the Sura Study student dashboard">
      <div className="dashboard-orbit orbit-one" />
      <div className="dashboard-orbit orbit-two" />
      <div className="dashboard-card">
        <div className="dashboard-topbar">
          <div className="dashboard-brand-mini"><span className="mini-brand-icon"><img src="/sura-crown-emblem.webp" alt="" /></span> surastudy</div>
          <div className="dashboard-top-actions"><span className="topbar-status"><i /> Study space</span><span className="avatar">AM</span></div>
        </div>
        <div className="dashboard-content">
          <div className="dashboard-greeting">
            <div><span className="eyebrow">MONDAY, OCTOBER 26</span><h3>Good morning, Alex <span>✦</span></h3><p>A little progress goes a long way.</p></div>
            <div className="dashboard-streak"><Sparkles size={15} /><span>Focus mode</span></div>
          </div>
          <div className="dashboard-main-grid">
            <article className="mock-exam-card">
              <div className="mock-exam-head"><span className="exam-icon"><Timer size={17} /></span><span className="pill pill-blue">MOCK EXAM</span><button type="button" aria-label="More exam options">···</button></div>
              <span className="card-kicker">UP NEXT · TODAY, 2:30 PM</span>
              <h4>Data Structures<br />&amp; Algorithms</h4>
              <div className="exam-meta"><span><Clock3 size={13} /> 45 min</span><span><FileText size={13} /> 20 questions</span></div>
              <div className="timer-box"><span>STARTS IN</span><strong>01<span>:</span>24<span>:</span>08</strong><small>hours&nbsp;&nbsp; min&nbsp;&nbsp; sec</small></div>
              <button type="button" className="dashboard-start">Review exam <ArrowRight size={13} /></button>
            </article>
            <div className="dashboard-side">
              <article className="progress-card">
                <div className="card-title-row"><div><span className="card-kicker">YOUR PROGRESS</span><h4>This week</h4></div><ArrowUpRight size={17} /></div>
                <div className="progress-summary"><strong>68%</strong><span>course completed</span></div>
                <div className="progress-track"><span /></div>
                <div className="progress-foot"><span>Data Structures</span><span>12 / 18 topics</span></div>
              </article>
              <article className="quick-list-card">
                <div className="card-title-row"><h4>Pick up where you left off</h4><ArrowRight size={15} /></div>
                <div className="quick-item"><span className="quick-icon violet"><Braces size={14} /></span><span><b>Algorithm analysis</b><small>Lecture notes · 8 min read</small></span><ArrowRight size={13} /></div>
                <div className="quick-item"><span className="quick-icon peach"><Code2 size={14} /></span><span><b>Binary trees</b><small>Practice set · 12 questions</small></span><ArrowRight size={13} /></div>
              </article>
            </div>
          </div>
          <div className="dashboard-bottom">
            <span className="bottom-label"><Target size={14} /> TODAY’S FOCUS</span>
            <span className="focus-question">What is the time complexity of binary search?</span>
            <span className="question-count">Question 4 of 12 <ArrowRight size={13} /></span>
          </div>
        </div>
      </div>
      <div className="float-note float-note-top"><span className="float-note-icon"><Check size={15} /></span><span><b>Progress saved</b><small>Pick up anytime</small></span></div>
      <div className="float-note float-note-bottom"><span className="float-note-icon violet-float"><BookOpen size={15} /></span><span><b>All in one place</b><small>Notes meet practice</small></span></div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-photo-collage" aria-hidden="true"><div className="hero-photo hero-photo-one" /><div className="hero-photo hero-photo-two" /><div className="hero-photo hero-photo-three" /></div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="kicker-mark"><Sparkles size={13} /></span> A better way to prepare</div>
          <h1>Study smarter.<br />Practice better.<br /><span>Ace your exams.</span></h1>
          <p className="hero-description">Your university study space, all in one place. Practice timed exams, solve exercises, and access your notes and learning materials without the endless search.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#features">Start practicing <ArrowRight size={17} /></a>
            <a className="button button-outline" href="#workspace"><span className="play-icon"><Play size={13} fill="currentColor" /></span> Explore study materials</a>
          </div>
          <div className="hero-trust"><span className="trust-check"><Check size={13} /></span> Built for university students. Designed for focused learning.</div>
        </div>
        <DashboardPreview />
      </div>
      <div className="hero-bottom container">
        <span>ONE SPACE FOR YOUR STUDIES</span>
        <div className="hero-bottom-items"><span><BookOpen size={15} /> Course notes</span><i /><span><Timer size={15} /> Timed practice</span><i /><span><Layers3 size={15} /> Organized learning</span></div>
        <a href="#features" aria-label="Scroll to features"><ArrowDownRight size={17} /></a>
      </div>
    </section>
  )
}

function SectionHeading({ eyebrow, title, text, centered = false }) {
  return (
    <div className={`section-heading${centered ? ' section-heading-centered' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

function FeaturesSection() {
  return (
    <section className="section features-section" id="features">
      <div className="container">
        <div className="features-intro">
          <SectionHeading eyebrow="LESS SEARCHING, MORE LEARNING" title={<>Everything you need<br />to feel exam-ready.</>} text="A focused study toolkit that brings your materials and practice into one clear, connected space." />
          <a className="text-link" href="#workspace">See how it works <ArrowUpRight size={16} /></a>
        </div>
        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article className={`feature-card ${feature.tone}`} key={feature.title}>
                <div className="feature-card-top"><span className="feature-icon"><Icon size={21} strokeWidth={1.9} /></span><ArrowUpRight className="feature-arrow" size={18} /></div>
                <div className="feature-illustration">
                  {feature.key === 'exams' && <div className="mini-exam-preview"><span className="mini-label">PRACTICE SESSION</span><div className="mini-timer"><Clock3 size={14} /> 24:18 <small>left</small></div><div className="mini-question-line short" /><div className="mini-question-line" /><div className="mini-answer-line"><i /> Question 08 <span>of 20</span></div></div>}
                  {feature.key === 'questions' && <div className="question-preview"><span className="topic-chip">CHAPTER 04</span><div className="question-number">Q<span>12</span><i /></div><div className="question-lines"><i /><i /><i /></div><div className="question-tags"><span>Arrays</span><span>Practice</span><span>+8</span></div></div>}
                  {feature.key === 'library' && <div className="library-preview"><div className="library-sheet"><span className="sheet-icon"><FileText size={16} /></span><span><b>Lecture 06 — Graphs</b><small>PDF · 2.4 MB</small></span><Bookmark size={15} /></div><div className="library-sheet second"><span className="sheet-icon sheet-violet"><BookOpen size={16} /></span><span><b>Exam review notes</b><small>Study guide · 12 pages</small></span><Bookmark size={15} /></div></div>}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <a href={feature.href} className="feature-link">{feature.linkLabel} <ArrowRight size={14} /></a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { number: '01', icon: LibraryBig, title: 'Choose your course', text: 'Find your subject and get straight to the topics you need.' },
    { number: '02', icon: Timer, title: 'Practice your way', text: 'Work through questions or set a timer for exam-style practice.' },
    { number: '03', icon: Target, title: 'Learn from every try', text: 'Review your results, revisit notes, and keep building confidence.' },
  ]

  return (
    <section className="section how-section" id="how-it-works">
      <div className="container">
        <SectionHeading eyebrow="A SIMPLE STUDY FLOW" title="From course to confidence." text="Less time figuring out where to start. More time making real progress." centered />
        <div className="steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <article className="step-card" key={step.number}>
                <div className="step-top"><span className="step-icon"><Icon size={20} /></span><span className="step-number">{step.number}</span></div>
                {index < steps.length - 1 && <div className="step-connector"><span /></div>}
                <h3>{step.title}</h3><p>{step.text}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StudyWorkspacePreview() {
  return (
    <div className="workspace-preview" aria-label="Preview of a study workspace with a practice question and lecture notes">
      <div className="workspace-header"><div className="workspace-path"><span>Courses</span><ChevronDown size={12} /><b>Data Structures</b></div><span className="workspace-mode"><i /> EXAM PRACTICE</span></div>
      <div className="workspace-body">
        <div className="exam-pane">
          <div className="exam-pane-top"><span className="question-pill">QUESTION 08 <i>OF 20</i></span><span className="workspace-timer"><Clock3 size={14} /> 32:48</span></div>
          <div className="question-progress"><span /></div>
          <span className="question-topic">TREES &amp; TRAVERSAL</span>
          <h4>Which traversal visits nodes in ascending order in a binary search tree?</h4>
          <div className="answer-list">
            <div className="answer-option"><span>A</span> Pre-order traversal</div>
            <div className="answer-option answer-selected"><span>B</span> In-order traversal <Check size={14} /></div>
            <div className="answer-option"><span>C</span> Post-order traversal</div>
            <div className="answer-option"><span>D</span> Level-order traversal</div>
          </div>
          <div className="exam-pane-foot"><span>Answer saved automatically</span><button type="button">Next question <ArrowRight size={14} /></button></div>
        </div>
        <aside className="notes-pane">
          <div className="notes-title"><span><FileText size={15} /> Course notes</span><button type="button" aria-label="More note options">···</button></div>
          <span className="notes-course">DATA STRUCTURES · WEEK 06</span>
          <h5>Binary search trees</h5>
          <p>A binary search tree keeps values in an ordered structure. For every node:</p>
          <div className="note-rule"><span className="note-dot dot-blue" /><span>Values in the <b>left subtree</b> are smaller.</span></div>
          <div className="note-rule"><span className="note-dot dot-violet" /><span>Values in the <b>right subtree</b> are larger.</span></div>
          <div className="note-callout"><Sparkles size={13} /> In-order traversal visits values from smallest to largest.</div>
          <div className="notes-page"><span>Lecture 6 · Page 12</span><ArrowRight size={13} /></div>
        </aside>
      </div>
    </div>
  )
}

function WorkspaceSection() {
  return (
    <section className="section workspace-section" id="workspace">
      <div className="container workspace-layout">
        <div className="workspace-copy">
          <span className="eyebrow">YOUR STUDY DESK, REIMAGINED</span>
          <h2>Practice exams.<br /><span>Review notes.</span><br />Stay in your flow.</h2>
          <p>Switch less, learn more. Keep your course materials close while you work through questions and prepare at your own pace.</p>
          <ul className="check-list">
            <li><span><Check size={13} /></span> Courses organized by topic and chapter</li>
            <li><span><Check size={13} /></span> Practice questions next to your notes</li>
            <li><span><Check size={13} /></span> Progress that helps guide what’s next</li>
          </ul>
          <a className="button button-dark" href="#courses">Explore the platform <ArrowRight size={16} /></a>
          <div className="workspace-quote"><span className="quote-mark">“</span><span>One focused place to prepare for what matters.</span></div>
        </div>
        <StudyWorkspacePreview />
      </div>
    </section>
  )
}

function CoursesSection() {
  return (
    <section className="section courses-section" id="courses">
      <div className="container">
        <div className="courses-heading-row">
          <SectionHeading eyebrow="FIND YOUR NEXT SUBJECT" title="Your courses, all together." text="Start with a subject. Find the materials and practice that fit your next study session." />
          <a className="text-link" href="#get-started">Browse all courses <ArrowRight size={15} /></a>
        </div>
        <div className="course-grid">
          {courses.map((course) => {
            const Icon = course.icon
            return (
              <article className="course-card" key={course.title}>
                <div className={`course-icon ${course.tone}`}><Icon size={20} strokeWidth={1.8} /></div>
                <span className="course-subject">{course.category}</span>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <a href="#get-started">View course <ArrowUpRight size={14} /></a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function UniversitiesSection() {
  return (
    <section className="section universities-section" id="universities">
      <div className="container">
        <div className="universities-heading">
          <SectionHeading
            eyebrow="BUILT AROUND YOUR CAMPUS"
            title="Your university, your study space."
            text="Choose your institution to find course materials and focused exam practice in one place."
          />
          <a className="text-link" href="#register">Get started <ArrowRight size={15} /></a>
        </div>
        <div className="university-directory">
          {universities.map((name) => (
            <article className="university-card" key={name}>
              <UniversityMark name={name} />
              <div>
                <span>UNIVERSITY LIBRARY</span>
                <h3>{name}</h3>
              </div>
              <ArrowUpRight className="university-card-arrow" size={17} />
            </article>
          ))}
        </div>
        <p className="university-directory-note">University names and logos are shown to identify the available study spaces. All marks belong to their respective owners.</p>
      </div>
    </section>
  )
}

function BenefitsSection() {
  const benefits = [
    { icon: Clock3, title: 'Spend time learning, not looking', text: 'Find what you need without another search through folders and tabs.' },
    { icon: Layers3, title: 'Keep every topic in order', text: 'Course materials stay together, from lecture notes to practice sets.' },
    { icon: Monitor, title: 'Learn at your own pace', text: 'Build a study rhythm that works for your schedule and your goals.' },
    { icon: Timer, title: 'Feel ready for exam day', text: 'Get familiar with timed practice before the real thing.' },
    { icon: Target, title: 'Turn mistakes into progress', text: 'Review tricky questions and focus on what you want to strengthen.' },
  ]

  return (
    <section className="section benefits-section" id="benefits">
      <div className="container benefits-layout">
        <div className="benefits-intro">
          <span className="eyebrow">MADE FOR THE WAY YOU STUDY</span>
          <h2>More clarity.<br />Less cramming.</h2>
          <p>Good preparation isn’t about doing everything at once. It’s about making the next step easier to find.</p>
          <a className="text-link" href="#get-started">Make a better study plan <ArrowRight size={15} /></a>
          <div className="benefit-decoration"><div className="deco-card"><span className="deco-check"><Check size={17} /></span><span><b>One topic at a time</b><small>Progress you can see</small></span><ArrowUpRight size={16} /></div></div>
        </div>
        <div className="benefits-list">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <article className="benefit-row" key={benefit.title}>
                <span className="benefit-index">0{index + 1}</span><span className="benefit-icon"><Icon size={18} /></span>
                <div><h3>{benefit.title}</h3><p>{benefit.text}</p></div><ArrowUpRight className="benefit-arrow" size={16} />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CallToAction() {
  return (
    <section className="cta-section" id="get-started">
      <div className="container cta-inner">
        <div className="cta-decoration cta-decoration-one"><span /><span /><span /></div>
        <div className="cta-decoration cta-decoration-two"><Sparkles size={19} /></div>
        <span className="cta-kicker"><span /> READY WHEN YOU ARE</span>
        <h2>Your next exam starts with<br /><span>better preparation.</span></h2>
        <p>Bring your courses, practice questions, and study materials together in one focused learning space.</p>
        <a className="button button-cta" href="#register">Get started <ArrowRight size={16} /></a>
        <span className="cta-footnote"><LockKeyhole size={12} /> A calmer way to get ready for what’s next.</span>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-about"><Logo light /><p>Your university study space, bringing practice and learning materials together.</p><a className="footer-contact" href="mailto:hello@surastudy.example">Say hello <ArrowUpRight size={14} /></a></div>
          <div className="footer-links-group"><h3>Explore</h3><a href="#courses">Courses</a><a href="#features">Practice exams</a><a href="#workspace">Study materials</a><a href="#how-it-works">How it works</a></div>
          <div className="footer-links-group"><h3>Study resources</h3><a href="#courses">Course library</a><a href="#features">Question bank</a><a href="#workspace">Lecture notes</a><a href="#benefits">Study tips</a><a href="#admin">Admin portal</a></div>
          <div className="footer-note"><span className="footer-note-icon"><Atom size={16} /></span><p>Make space for focused learning.</p><a href="#home">Back to top <ArrowUpRight size={13} /></a></div>
        </div>
        <div className="footer-bottom">        <span>© 2026 Sura Study. Made for your next big moment.</span><span className="footer-bottom-links"><span>Built for students, one step at a time.</span></span></div>
      </div>
    </footer>
  )
}

function App() {
  const [page, setPage] = useState(() => getPageFromHash())
  const [dark, setDark] = useState(() => {
    try {
      return window.localStorage.getItem('sura-study-theme') === 'dark'
    } catch {
      return false
    }
  })
  const [loggedIn, setLoggedIn] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  function toggleTheme() {
    setDark((current) => {
      const next = !current
      try {
        window.localStorage.setItem('sura-study-theme', next ? 'dark' : 'light')
      } catch {
        // Keep the selected theme for this session if storage is unavailable.
      }
      return next
    })
  }

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {})
    setLoggedIn(false)
    window.location.hash = 'home'
  }

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' }).then((response) => setLoggedIn(response.ok)).catch(() => setLoggedIn(false))
  }, [])

  useEffect(() => {
    const syncPage = () => {
      const nextPage = getPageFromHash()
      setPage(nextPage)
    }
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  useEffect(() => {
    if (page !== 'home') return undefined
    const items = document.querySelectorAll('.section-heading, .feature-card, .step-card, .workspace-copy, .workspace-preview, .course-card, .university-card, .benefit-row')
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' })

    items.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`)
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [page])

  if (page === 'login' || page === 'register') return <AuthPage key={page} mode={page} dark={dark} onToggleTheme={toggleTheme} />
  if (page === 'app') return <StudentGate dark={dark} onToggleTheme={toggleTheme} onSignOut={signOut} />
  if (page === 'admin') return <AdminPortal dark={dark} onToggleTheme={toggleTheme} />

  return (
    <>
      <div className={`site-home${dark ? ' theme-dark' : ''}`}>
        <Navbar loggedIn={loggedIn} dark={dark} onToggleTheme={toggleTheme} />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorks />
          <WorkspaceSection />
          <CoursesSection />
          <UniversitiesSection />
          <BenefitsSection />
          <CallToAction />
        </main>
        <Footer />
      </div>
      <button className="ai-floating-launcher" type="button" onClick={() => setAiOpen(true)} aria-label="Open Sura AI guide" title="Ask Sura AI"><Sparkles size={22} /><span>Ask Sura AI</span></button>
      {aiOpen && <AiChatModal mode="public" dark={dark} onClose={() => setAiOpen(false)} />}
    </>
  )
}

function StudentGate({ dark, onToggleTheme, onSignOut }) {
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)
  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'same-origin' }).then(async (response) => {
      if (!active) return
      if (response.ok) { const result = await response.json(); setStudent(result.student); setLoading(false) }
      else window.location.hash = 'login'
    }).catch(() => { if (active) window.location.hash = 'login' })
    return () => { active = false }
  }, [])
  if (loading) return <main className="auth-loading"><span className="ai-modal-thinking"><i /> Loading your study space…</span></main>
  return <StudentExperience dark={dark} onToggleTheme={onToggleTheme} onSignOut={onSignOut} onStudentUpdate={setStudent} student={student} />
}

function getPageFromHash() {
  if (typeof window === 'undefined') return 'home'
  if (window.location.hash === '#login') return 'login'
  if (window.location.hash === '#register') return 'register'
  if (window.location.hash === '#app') return 'app'
  if (window.location.hash === '#admin') return 'admin'
  return 'home'
}

export default App
