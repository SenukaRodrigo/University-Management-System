import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { PlusCircle, Pencil, Trash2, BookOpen } from 'lucide-react'
import api from '../api/axios'
import Button from './ui/Button'
import Card from './ui/Card'
import { Input, Textarea } from './ui/Input'
import Alert from './ui/Alert'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import LectureCardSkeleton from './ui/LectureCardSkeleton'
import useListFetch from '../hooks/useListFetch'
import { listContainer, listItem } from '../lib/motion'

// Load failures render inline (ErrorState) — skipErrorToast stops the global
// axios interceptor from also firing a toast for them.
const fetchMine = () => api.get('/lectures/mine', { skipErrorToast: true }).then(r => r.data)

export default function MyLectures() {
  const { items: lectures, status, refetch } = useListFetch(fetchMine)
  const [newTitle, setNewTitle]       = useState('')
  const [newDesc, setNewDesc]         = useState('')
  const [createError, setCreateError] = useState(null)
  const [creating, setCreating]       = useState(false)
  const [editing, setEditing]         = useState(null)  // { id, title, description }
  const [editError, setEditError]     = useState(null)
  const [saving, setSaving]           = useState(false)
  const [deletingId, setDeletingId]   = useState(null)

  const focusCreateForm = useCallback(() => {
    const el = document.getElementById('new-title')
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el?.focus({ preventScroll: true })
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setCreateError(null)
    setCreating(true)
    try {
      await api.post('/lectures', { title: newTitle, description: newDesc })
      setNewTitle('')
      setNewDesc('')
      toast.success('Lecture created.')
      refetch()
    } catch (err) {
      setCreateError(err.response?.data?.message ?? 'Failed to create lecture')
    } finally {
      setCreating(false)
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setEditError(null)
    setSaving(true)
    try {
      await api.put(`/lectures/${editing.id}`, {
        title: editing.title,
        description: editing.description,
      })
      setEditing(null)
      toast.success('Lecture updated.')
      refetch()
    } catch (err) {
      setEditError(err.response?.data?.message ?? 'Failed to update lecture')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this lecture?')) return
    setDeletingId(id)
    try {
      await api.delete(`/lectures/${id}`)
      toast.success('Lecture deleted.')
      refetch()
    } catch {
      toast.error('Failed to delete lecture.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section aria-labelledby="my-lectures-heading">
      <h2 id="my-lectures-heading" className="mb-4 text-xl font-semibold text-slate-100">
        My Lectures
      </h2>

      {/* Create-lecture form */}
      <Card className="mb-6 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
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
            <Button type="submit" loading={creating}>
              {!creating && <PlusCircle className="h-4 w-4" aria-hidden="true" />}
              {creating ? 'Creating…' : 'Create lecture'}
            </Button>
          </div>
        </form>
      </Card>

      {status === 'loading' && (
        <div className="space-y-3">
          <LectureCardSkeleton />
          <LectureCardSkeleton />
          <LectureCardSkeleton />
        </div>
      )}

      {status === 'error' && (
        <ErrorState message="Couldn't load your lectures." onRetry={refetch} />
      )}

      {status === 'empty' && (
        <EmptyState
          icon={BookOpen}
          title="No lectures yet"
          message="Create your first lecture to get started."
          actionLabel="Create lecture"
          onAction={focusCreateForm}
        />
      )}

      {status === 'success' && (
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
                        id="edit-title"
                        required
                        value={editing.title}
                        onChange={e => setEditing({ ...editing, title: e.target.value })}
                      />
                      <Textarea
                        label="Description"
                        id="edit-desc"
                        rows={3}
                        value={editing.description}
                        onChange={e => setEditing({ ...editing, description: e.target.value })}
                      />
                      {editError && <Alert>{editError}</Alert>}
                      <div className="flex gap-2 justify-end">
                        <Button type="submit" loading={saving}>
                          {saving ? 'Saving…' : 'Save changes'}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={saving}
                          onClick={() => setEditing(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="break-words font-semibold text-slate-100">{lecture.title}</p>
                        {lecture.description && (
                          <p className="mt-1 text-sm text-slate-400 line-clamp-2">
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
                          loading={deletingId === lecture.id}
                          onClick={() => handleDelete(lecture.id)}
                          aria-label={`Delete ${lecture.title}`}
                        >
                          {deletingId !== lecture.id && (
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          )}
                          <span className="hidden sm:inline">
                            {deletingId === lecture.id ? 'Deleting…' : 'Delete'}
                          </span>
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
