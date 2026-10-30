import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, BookOpenCheck, Building2, Check, FileText, GraduationCap, LayoutDashboard, LogOut, Plus, ShieldCheck, Trash2, Users, X } from 'lucide-react'

async function adminRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: { ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  })
  if (response.status === 204) return null
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error || 'The admin request could not be completed.')
  return result
}

const materialTypes = [
  { value: 'QUESTION_BANK', label: 'Question bank', icon: BookOpenCheck },
  { value: 'SHORT_NOTE', label: 'Short note', icon: FileText },
  { value: 'FULL_BOOK', label: 'Full book', icon: BookOpen },
]

export default function AdminPortal({ dark, onToggleTheme }) {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [section, setSection] = useState('overview')
  const [overview, setOverview] = useState(null)
  const [catalog, setCatalog] = useState([])
  const [students, setStudents] = useState([])
  const [universityName, setUniversityName] = useState('')
  const [newCourse, setNewCourse] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialType, setMaterialType] = useState('QUESTION_BANK')
  const [materialContent, setMaterialContent] = useState('')
  const [materialPdf, setMaterialPdf] = useState(null)
  const [editingMaterial, setEditingMaterial] = useState('')

  useEffect(() => {
    adminRequest('/api/admin/me').then((result) => {
      setAdminEmail(result.admin.email)
      setIsAdmin(true)
    }).catch(() => setIsAdmin(false)).finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    let active = true
    Promise.all([adminRequest('/api/admin/overview'), adminRequest('/api/admin/catalog'), adminRequest('/api/admin/students')])
      .then(([stats, content, studentData]) => {
        if (!active) return
        setOverview(stats)
        setCatalog(content.universities || [])
        setStudents(studentData.students || [])
        setSelectedUniversity((current) => current || content.universities?.[0]?.id || '')
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [isAdmin])

  const allMaterials = useMemo(() => catalog.flatMap((university) => university.courses.flatMap((course) => course.materials.map((material) => ({ ...material, universityName: university.name, courseTitle: course.title })))), [catalog])
  const currentUniversity = catalog.find((university) => university.id === selectedUniversity)
  const availableCourses = currentUniversity?.courses || []

  async function login(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await adminRequest('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      setAdminEmail(result.admin.email)
      setIsAdmin(true)
      setPassword('')
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  async function refresh() {
    const [stats, content, studentData] = await Promise.all([adminRequest('/api/admin/overview'), adminRequest('/api/admin/catalog'), adminRequest('/api/admin/students')])
    setOverview(stats)
    setCatalog(content.universities || [])
    setStudents(studentData.students || [])
    setSelectedUniversity((current) => current || content.universities?.[0]?.id || '')
  }

  async function createUniversity(event) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    try {
      await adminRequest('/api/admin/universities', { method: 'POST', body: JSON.stringify({ name: universityName }) })
      setUniversityName(''); await refresh(); setNotice('University added to your catalog.')
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  async function createCourse(event) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    try {
      await adminRequest(`/api/admin/universities/${selectedUniversity}/courses`, { method: 'POST', body: JSON.stringify({ title: newCourse }) })
      setNewCourse(''); await refresh(); setNotice('Course added to the university.')
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  async function saveMaterial(event) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    try {
      if (editingMaterial) {
        await adminRequest(`/api/admin/materials/${editingMaterial}`, { method: 'PATCH', body: JSON.stringify({ universityId: selectedUniversity, courseId: selectedCourse, title: materialTitle, type: materialType, content: materialContent }) })
      } else {
        const body = new FormData()
        body.append('universityId', selectedUniversity)
        body.append('courseId', selectedCourse)
        body.append('title', materialTitle)
        body.append('type', materialType)
        body.append('content', materialContent)
        if (materialPdf) body.append('pdf', materialPdf)
        await adminRequest('/api/admin/materials', { method: 'POST', body })
      }
      setEditingMaterial(''); setMaterialTitle(''); setMaterialContent(''); setMaterialPdf(null); await refresh(); setNotice('Material saved as a draft. Review it, then publish when it is ready.')
    } catch (requestError) { setError(requestError.message) } finally { setBusy(false) }
  }

  async function editMaterial(material) {
    setError(''); setNotice('')
    try {
      const result = await adminRequest(`/api/admin/materials/${material.id}`)
      setEditingMaterial(material.id)
      setSelectedUniversity(material.universityId)
      setSelectedCourse(material.courseId)
      setMaterialTitle(result.material.title)
      setMaterialType(result.material.type)
      setMaterialContent(result.material.content)
      setSection('materials')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (requestError) { setError(requestError.message) }
  }

  async function togglePublished(material) {
    setError(''); setNotice('')
    try {
      await adminRequest(`/api/admin/materials/${material.id}`, { method: 'PATCH', body: JSON.stringify({ isPublished: !material.isPublished }) })
      await refresh(); setNotice(material.isPublished ? 'Material moved back to drafts.' : 'Material published to its course library.')
    } catch (requestError) { setError(requestError.message) }
  }

  async function deleteMaterial(material) {
    if (!window.confirm(`Delete “${material.title}” and its stored content?`)) return
    setError(''); setNotice('')
    try { await adminRequest(`/api/admin/materials/${material.id}`, { method: 'DELETE' }); await refresh(); setNotice('Material deleted.') }
    catch (requestError) { setError(requestError.message) }
  }

  async function logout() {
    await adminRequest('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setIsAdmin(false)
    setSection('overview')
  }

  if (checking) return <main className={`admin-loading${dark ? ' admin-dark' : ''}`}><span className="admin-loader" />Checking admin access…</main>
  if (!isAdmin) return (
    <main className={`admin-login-page${dark ? ' admin-dark' : ''}`}>
      <button className="admin-theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">{dark ? '☀' : '☾'}</button>
      <form className="admin-login-card" onSubmit={login}>
        <a className="admin-back-link" href="#home">← Back to Sura Study</a>
        <span className="admin-brand-mark"><ShieldCheck size={22} /></span>
        <span className="admin-eyebrow">SECURE STAFF ACCESS</span>
        <h1>Admin portal</h1>
        <p>Sign in with the private admin credentials configured on the server.</p>
        <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="admin-alert" role="alert">{error}</p>}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button type="submit" className="admin-primary-button" style={{ flex: 1 }} disabled={busy}>{busy ? 'Signing in…' : 'Sign in securely'} <ArrowRight size={16} /></button>
          <button type="button" className="admin-cancel-edit" onClick={() => { setEmail('admin@example.com'); setPassword('123456789') }} title="Autofill standard development credentials">Autofill</button>
        </div>
      </form>
    </main>
  )

  return (
    <main className={`admin-shell${dark ? ' admin-dark' : ''}`}>
      <aside className="admin-sidebar">
        <a className="admin-wordmark" href="#admin"><span className="admin-brand-mark"><ShieldCheck size={19} /></span><span>Sura<span>Study</span><small>ADMIN WORKSPACE</small></span></a>
        <nav aria-label="Admin navigation">
          {[['overview', LayoutDashboard, 'Overview'], ['materials', BookOpen, 'Study materials'], ['catalog', GraduationCap, 'Universities & courses'], ['students', Users, 'Students']].map(([id, Icon, label]) => <button type="button" key={id} className={section === id ? 'active' : ''} onClick={() => { setSection(id); setError(''); setNotice('') }}><Icon size={17} /><span>{label}</span></button>)}
        </nav>
        <div className="admin-sidebar-foot"><span>Content is company scoped</span><span><ShieldCheck size={13} /> Sura Study</span></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar"><span><small>ADMIN WORKSPACE</small><b>{section === 'catalog' ? 'Universities & courses' : section === 'materials' ? 'Study materials' : section === 'students' ? 'Students' : 'Overview'}</b></span><div><button type="button" className="admin-top-theme" onClick={onToggleTheme} aria-label="Toggle theme">{dark ? '☀' : '☾'}</button><span className="admin-user-badge">{adminEmail?.slice(0, 1).toUpperCase()}</span><span className="admin-user-email">{adminEmail}</span><button className="admin-logout" type="button" onClick={logout}><LogOut size={15} /><span>Sign out</span></button></div></header>
        <div className="admin-content">
          {error && <p className="admin-alert" role="alert"><X size={14} />{error}</p>}
          {notice && <p className="admin-notice" role="status"><Check size={14} />{notice}</p>}
          {section === 'overview' && <>
            <div className="admin-welcome"><div><span className="admin-eyebrow">YOUR CONTENT AT A GLANCE</span><h1>Good work starts here.</h1><p>Manage the resources students use to study, review, and prepare.</p></div><button type="button" onClick={() => setSection('materials')}><Plus size={16} /> Add material</button></div>
            <div className="admin-stat-grid">{[[Building2, 'Universities', overview?.universities], [GraduationCap, 'Courses', overview?.courses], [BookOpen, 'Materials', overview?.materials], [Users, 'Students', overview?.students]].map(([Icon, label, value]) => <article className="admin-stat-card" key={label}><span><Icon size={18} /></span><b>{value ?? '—'}</b><small>{label}</small></article>)}</div>
            <div className="admin-panel admin-recent"><div className="admin-panel-heading"><div><span className="admin-eyebrow">CONTENT WORKFLOW</span><h2>Review before students see it</h2></div><span className="admin-publish-count">{overview?.publishedMaterials ?? 0} published</span></div><p>New material is saved as a draft. Check titles, course placement, and text before publishing it to the student library and AI tutor.</p><button type="button" onClick={() => setSection('materials')}>Manage study materials <ArrowRight size={15} /></button></div>
          </>}
          {section === 'materials' && <>
            <div className="admin-page-heading"><span className="admin-eyebrow">QUESTION BANKS · NOTES · BOOKS</span><h1>Study materials</h1><p>Paste content or upload a PDF. Uploaded PDFs are extracted for search and remain available for students to read after publishing.</p></div>
            <form className="admin-panel admin-material-form" onSubmit={saveMaterial}>
              <h2><Plus size={17} /> {editingMaterial ? 'Edit study resource' : 'Add a study resource'}</h2>
              <div className="admin-form-grid"><label>University<select value={selectedUniversity} onChange={(event) => { setSelectedUniversity(event.target.value); setSelectedCourse('') }} required><option value="">Choose a university</option>{catalog.map((university) => <option value={university.id} key={university.id}>{university.name}</option>)}</select></label><label>Course<select value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)} required><option value="">Choose a course</option>{availableCourses.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}</select></label></div>
              <div className="admin-form-grid"><label>Material title<input value={materialTitle} onChange={(event) => setMaterialTitle(event.target.value)} placeholder="e.g. Chapter 4 — Relational Algebra" maxLength={180} required /></label><label>Content type<select value={materialType} onChange={(event) => setMaterialType(event.target.value)}>{materialTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label></div>
              <label>Study content<textarea value={materialContent} onChange={(event) => setMaterialContent(event.target.value)} placeholder="Paste reviewed questions, short-note text, or book text here…" minLength={materialPdf ? undefined : 10} maxLength={500000} rows={10} required={!materialPdf} /></label>
              {!editingMaterial && <label>Upload PDF<input type="file" accept="application/pdf,.pdf" onChange={(event) => setMaterialPdf(event.target.files?.[0] || null)} /><small>PDF only, maximum 25 MB. Text-based PDFs work best.</small></label>}
              <div className="admin-form-foot"><small>{materialPdf ? `${materialPdf.name} selected · ` : ''}{materialContent.length.toLocaleString()} / 500,000 characters · Saved as a private draft</small><span>{editingMaterial && <button className="admin-cancel-edit" type="button" onClick={() => { setEditingMaterial(''); setMaterialTitle(''); setMaterialContent(''); setMaterialPdf(null) }}>Cancel</button>}<button className="admin-primary-button" disabled={busy || !selectedCourse || (!materialPdf && materialContent.length < 10)}>{busy ? 'Saving…' : editingMaterial ? 'Save changes' : 'Save draft'} <ArrowRight size={15} /></button></span></div>
            </form>
            <section className="admin-material-table"><div className="admin-panel-heading"><div><span className="admin-eyebrow">LIBRARY CONTENT</span><h2>Materials</h2></div><span className="admin-publish-count">{allMaterials.length} total</span></div>
              {allMaterials.length ? allMaterials.map((material) => { const Icon = materialTypes.find((type) => type.value === material.type)?.icon || FileText; return <article className="admin-material-row" key={material.id}><span className="admin-material-icon"><Icon size={17} /></span><div className="admin-material-info"><b>{material.title}</b><small>{material.universityName} · {material.courseTitle} · {material._count.chunks} searchable excerpts</small></div><span className={`admin-status ${material.isPublished ? 'published' : 'draft'}`}>{material.isPublished ? 'Published' : 'Draft'}</span><button type="button" onClick={() => editMaterial(material)}>Edit</button><button type="button" onClick={() => togglePublished(material)}>{material.isPublished ? 'Unpublish' : 'Publish'}</button><button type="button" className="admin-delete-button" onClick={() => deleteMaterial(material)} aria-label={`Delete ${material.title}`}><Trash2 size={16} /></button></article> }) : <p className="admin-empty">No course materials yet. Add a resource above.</p>}
            </section>
          </>}
          {section === 'catalog' && <>
            <div className="admin-page-heading"><span className="admin-eyebrow">ORGANIZE THE STUDY LIBRARY</span><h1>Universities & courses</h1><p>Build the catalog students choose from when they enter the study space.</p></div>
            <div className="admin-catalog-grid"><form className="admin-panel" onSubmit={createUniversity}><h2><Building2 size={17} /> Add university</h2><label>University name<input value={universityName} onChange={(event) => setUniversityName(event.target.value)} placeholder="University name" maxLength={140} required /></label><button className="admin-primary-button" disabled={busy}>Add university <Plus size={15} /></button></form>
              <form className="admin-panel" onSubmit={createCourse}><h2><GraduationCap size={17} /> Add course</h2><label>University<select value={selectedUniversity} onChange={(event) => setSelectedUniversity(event.target.value)} required><option value="">Choose a university</option>{catalog.map((university) => <option value={university.id} key={university.id}>{university.name}</option>)}</select></label><label>Course title<input value={newCourse} onChange={(event) => setNewCourse(event.target.value)} placeholder="Course title" maxLength={160} required /></label><button className="admin-primary-button" disabled={busy || !selectedUniversity}>Add course <Plus size={15} /></button></form></div>
            <div className="admin-university-list">{catalog.map((university) => <article className="admin-panel" key={university.id}><h2><Building2 size={17} />{university.name}<span>{university.courses.length} courses</span></h2>{university.courses.length ? <div className="admin-course-chips">{university.courses.map((course) => <span key={course.id}>{course.title}<small>{course.materials.length} materials</small></span>)}</div> : <p className="admin-empty">No courses added yet.</p>}</article>)}</div>
          </>}
          {section === 'students' && <>
            <div className="admin-page-heading"><span className="admin-eyebrow">STUDENT ACCOUNTS</span><h1>Students</h1><p>Review student names, phone sign-in accounts, and current plan status. Names are taken from each student’s profile.</p></div>
            <div className="admin-student-table"><div className="admin-student-head"><span>STUDENT</span><span>PHONE</span><span>ACCOUNT ACCESS</span><span>PLAN</span><span>JOINED</span></div>{students.length ? students.map((student) => <article className="admin-student-row" key={student.id}><span className="admin-student-name"><i>{(student.displayName || 'S').slice(0, 1).toUpperCase()}</i>{student.displayName || 'Student'}</span><span>{student.phone}</span><span className={`admin-status ${student.hasPassword ? 'published' : 'draft'}`}>{student.hasPassword ? 'Password set' : 'Preview account'}</span><span>{student.subscriptions[0]?.status === 'ACTIVE' ? 'Active plan' : 'No active plan'}</span><span>{new Date(student.createdAt).toLocaleDateString()}</span></article>) : <p className="admin-empty">No student accounts have registered yet.</p>}</div>
          </>}
        </div>
      </section>
    </main>
  )
}
