import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

export default function MyLectures() {
  const [lectures, setLectures] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  // Create-form state
  const [newTitle, setNewTitle]       = useState('')
  const [newDesc, setNewDesc]         = useState('')
  const [createError, setCreateError] = useState(null)

  // Edit state: null = no edit in progress; object = {id, title, description}
  const [editing, setEditing]   = useState(null)
  const [editError, setEditError] = useState(null)

  const fetchLectures = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/lectures/mine')
      setLectures(data)
    } catch {
      setError('Failed to load lectures')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLectures() }, [fetchLectures])

  async function handleCreate(e) {
    e.preventDefault()
    setCreateError(null)
    try {
      await api.post('/lectures', { title: newTitle, description: newDesc })
      setNewTitle('')
      setNewDesc('')
      fetchLectures()
    } catch (err) {
      setCreateError(err.response?.data?.message ?? 'Failed to create lecture')
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setEditError(null)
    try {
      await api.put(`/lectures/${editing.id}`, {
        title: editing.title,
        description: editing.description,
      })
      setEditing(null)
      fetchLectures()
    } catch (err) {
      setEditError(err.response?.data?.message ?? 'Failed to update lecture')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this lecture?')) return
    try {
      await api.delete(`/lectures/${id}`)
      fetchLectures()
    } catch {
      alert('Failed to delete lecture')
    }
  }

  return (
    <section style={{ marginBottom: 40 }}>
      <h2>My Lectures</h2>

      {/* Create form */}
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>New lecture</h3>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="Title" required value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            style={{ padding: 8, width: 300, marginRight: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <textarea placeholder="Description" value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            rows={3} style={{ padding: 8, width: 300 }} />
        </div>
        {createError && <p style={{ color: 'red' }}>{createError}</p>}
        <button type="submit">Create</button>
      </form>

      {/* Lecture list */}
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && lectures.length === 0 && <p>No lectures yet.</p>}

      {lectures.map(lecture => (
        <div key={lecture.id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 4 }}>
          {editing?.id === lecture.id ? (
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: 8 }}>
                <input required value={editing.title}
                  onChange={e => setEditing({ ...editing, title: e.target.value })}
                  style={{ padding: 8, width: 300 }} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <textarea rows={3} value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  style={{ padding: 8, width: 300 }} />
              </div>
              {editError && <p style={{ color: 'red' }}>{editError}</p>}
              <button type="submit">Save</button>{' '}
              <button type="button" onClick={() => setEditing(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <strong>{lecture.title}</strong>
              {lecture.description && <p style={{ margin: '4px 0' }}>{lecture.description}</p>}
              <button onClick={() => setEditing({ id: lecture.id, title: lecture.title, description: lecture.description ?? '' })}>
                Edit
              </button>{' '}
              <button onClick={() => handleDelete(lecture.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </section>
  )
}
