import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { PlusCircle, Pencil, Trash2, BookOpen, Loader2 } from 'lucide-react'
import api from '../api/axios'
import Button from './ui/Button'
import Card from './ui/Card'
import { Input, Textarea } from './ui/Input'
import Alert from './ui/Alert'
import { LoadingState, EmptyState } from './ui/Spinner'
import { listContainer, listItem } from '../lib/motion'

export default function MyLectures() {
  const [lectures, setLectures]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [newTitle, setNewTitle]       = useState('')
  const [newDesc, setNewDesc]         = useState('')
  const [createError, setCreateError] = useState(null)
  const [creating, setCreating]       = useState(false)
  const [editing, setEditing]         = useState(null)  // { id, title, description }
  const [editError, setEditError]     = useState(null)

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
    setCreating(true)
    try {
      await api.post('/lectures', { title: newTitle, description: newDesc })
      setNewTitle('')
      setNewDesc('')
      toast.success('Lecture created.')
      fetchLectures()
    } catch (err) {
      setCreateError(err.response?.data?.message ?? 'Failed to create lecture')
    } finally {
      setCreating(false)
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
      toast.success('Lecture updated.')
      fetchLectures()
    } catch (err) {
      setEditError(err.response?.data?.message ?? 'Failed to update lecture')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this lecture?')) return
    try {
      await api.delete(`/lectures/${id}`)
      toast.success('Lecture deleted.')
      fetchLectures()
    } catch {
      toast.error('Failed to delete lecture.')
    }
  }

  return (
    <section aria-labelledby="my-lectures-heading">
      <h2 id="my-lectures-heading" className="mb-4 text-xl font-semibold text-slate-800">
        My Lectures
      </h2>

      {/* Create-lecture form */}
      <Card className="mb-6 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          New Lecture
        </h3>
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Title"
            id="new-title"
            placeholder="e.g. Introduction to Algorithms"
            required
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            id="new-desc"
            placeholder="Brief overview of the lecture…"
            rows={3}
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
          />
          {createError && <Alert>{createError}</Alert>}
          <div className="flex justify-end">
            <Button type="submit" disabled={creating}>
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
              )}
              {creating ? 'Creating…' : 'Create lecture'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Lecture list */}
      {loading && <LoadingState message="Loading your lectures…" />}
      {!loading && error && <Alert>{error}</Alert>}
      {!loading && !error && lectures.length === 0 && (
        <EmptyState icon={BookOpen} message="No lectures yet — create one above." />
      )}

      <motion.div
        className="space-y-3"
        variants={listContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence>
          {lectures.map(lecture => (
            <motion.div key={lecture.id} variants={listItem} exit="exit" layout>
          <Card className="p-5">
            {editing?.id === lecture.id ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <Input
                  label="Title"
                  required
                  value={editing.title}
                  onChange={e => setEditing({ ...editing, title: e.target.value })}
                />
                <Textarea
                  label="Description"
                  rows={3}
                  value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                />
                {editError && <Alert>{editError}</Alert>}
                <div className="flex gap-2 justify-end">
                  <Button type="submit">Save changes</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{lecture.title}</p>
                  {lecture.description && (
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                      {lecture.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setEditing({
                        id: lecture.id,
                        title: lecture.title,
                        description: lecture.description ?? '',
                      })
                    }
                    aria-label={`Edit ${lecture.title}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(lecture.id)}
                    aria-label={`Delete ${lecture.title}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            )}
          </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
