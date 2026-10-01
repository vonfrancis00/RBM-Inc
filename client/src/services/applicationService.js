// Frontend-only repository.
// Later, replace these functions with fetch() calls to Google Apps Script.
const STORAGE_KEY = 'rbm_online_applications_v1'

function read() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function write(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }
function reference() {
  const now = new Date()
  const y = now.getFullYear()
  const n = Math.floor(100000 + Math.random() * 900000)
  return `RBM-${y}-${n}`
}

export const applicationService = {
  async submit(form) {
    const item = {
      id: crypto.randomUUID(),
      referenceNumber: reference(),
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      ...structuredClone(form),
    }
    write([item, ...read()])
    return item
  },
  async list() { return read() },
  async get(id) { return read().find(x => x.id === id) || null },
  async updateStatus(id, status) {
    const items = read().map(x => x.id === id ? {...x, status} : x)
    write(items)
    return items.find(x => x.id === id)
  }
}
