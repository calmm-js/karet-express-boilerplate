import * as U from 'karet.util'
import Stored from 'atom.storage'

function isSessionStorageSupported() {
  if (typeof sessionStorage === 'undefined') return false

  try {
    sessionStorage.setItem('test', 'data')
    if (sessionStorage.getItem('test') !== 'data') throw new Error('')
    sessionStorage.removeItem('test')
    return true
  } catch (_) {
    return false
  }
}

const SessionStored = ({key, value}) =>
  Stored({
    key,
    value,
    Atom: U.atom,
    storage: sessionStorage
  })

const NotStored = ({value}) => U.atom(value)

export default (isSessionStorageSupported() ? SessionStored : NotStored)
