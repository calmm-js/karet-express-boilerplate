import * as L from 'kefir.partial.lenses'
import * as R from 'kefir.ramda'
import * as React from 'karet'
import * as U from 'karet.util'

import * as RPC from '../../../client/rpc'
import * as W from '../../../client/window'

import {Link} from '../../components/link'

const rowHeight = 28

const execute = U.through(U.flatMapSerial(R.identity), U.startWith({}))

const LabeledTextInput = ({value, label}) => (
  <label>
    {label}: <input type="text" value={value} onChange={U.getProps({value})} />
  </label>
)

const ContactInput = ({contact}) => (
  <div className="fields">
    <LabeledTextInput label="Name" value={U.view('name', contact)} />
    <LabeledTextInput label="Phone" value={U.view('phone', contact)} />
  </div>
)

export function New() {
  const contact = U.atom({name: '', phone: ''})

  const actions = U.bus()
  const save = () =>
    actions.push(
      U.thru(
        U.template({contact}),
        U.takeFirst(1),
        RPC.mkPost('contacts/data', null),
        U.tapPartial(status => {
          const id = L.get('id', status)
          if (id) W.location.modify(L.set('path', `/contacts/${id}`))
        })
      )
    )
  const io = R.equals(undefined, execute(actions))

  return (
    <div id="contact">
      <h2>New contact</h2>
      {U.when(io, <div className="loader contact" />)}
      <ContactInput {...{contact}} />
      <button onClick={save}>Save</button>
    </div>
  )
}

export function Edit({id}) {
  const state = U.variable()
  const contact = U.view(['contact', L.valueOr({name: '', phone: ''})], state)

  const entry = U.string`contacts/data/${id}`

  const read = RPC.mkGet(entry, null)
  const autosave = U.thru(
    state,
    U.skipFirst(2),
    U.debounce(300),
    RPC.mkPut(entry, null),
    U.startWith(0)
  )
  const io = R.contains(undefined, [read, autosave])

  return (
    <div id="contact">
      <h2>Edit contact</h2>
      {U.ifElse(
        io,
        <div className="loader contact" />,
        <div className="saved" />
      )}
      <ContactInput {...{contact}} />
      {U.set(state, read)}
    </div>
  )
}

export function Browse() {
  const bodyElem = U.variable()
  const scrollTop = U.atom(0)

  const limit = U.thru(
    U.template([
      bodyElem,
      W.dimensions,
      U.takeUntilBy(
        U.skipUnless(R.identity, U.lazy(() => limit)),
        U.interval(100, 0)
      )
    ]),
    U.lift(([e]) =>
      Math.trunc((e.getBoundingClientRect().height + rowHeight - 1) / rowHeight)
    ),
    U.startWith(0)
  )

  const actions = U.bus()
  const remove = id => () =>
    actions.push(RPC.mkDelete(`contacts/data/${id}`, {}))
  const actionsIO = execute(actions)

  const contactsQuery = U.thru(
    U.template([
      {
        offset: U.floor(R.divide(scrollTop, rowHeight)),
        limit: U.skipUnless(R.identity, limit)
      },
      L.get('id', actionsIO)
    ]),
    U.throttle(300),
    L.get(0),
    RPC.mkGet('contacts/data'),
    U.startWith(undefined)
  )

  const io = R.contains(undefined, [actionsIO, contactsQuery])

  const contacts = U.skipUnless(L.get('data'), contactsQuery)

  const offset = U.view(['offset', L.valueOr(0)], contacts)
  const total = U.view(['total', L.valueOr(0)], contacts)

  return (
    <div id="contacts">
      <h2>Contacts</h2>
      {U.when(io, <div className="loader contacts" />)}
      <div className="contacts-table">
        <div className="head-wrapper">
          <div className="head">
            <div>
              <Link href="/contacts/new">&#65291;</Link>
            </div>
            <div>Name</div>
            <div>Phone</div>
          </div>
        </div>
        <div
          className="body"
          ref={U.actions(U.setProps({scrollTop}), U.refTo(bodyElem))}
          onScroll={U.getProps({scrollTop})}>
          <div
            className="rows"
            style={{minHeight: U.string`${R.multiply(total, rowHeight)}px`}}>
            <div
              className={U.cns(
                'visible',
                U.ifElse(R.mathMod(offset, 2), 'odd', 'even')
              )}
              style={{top: U.string`${R.multiply(offset, rowHeight)}px`}}>
              {U.thru(
                U.view('data', contacts),
                U.mapElemsWithIds('id', (item, id) => {
                  const contact = U.view('contact', item)
                  const href = `/contacts/${id}`
                  return (
                    <div className="row" key={id}>
                      <div>
                        <button onClick={remove(id)}>&#x2715;</button>
                      </div>
                      <div>
                        <Link href={href}>{U.view('name', contact)}</Link>
                      </div>
                      <div>
                        <Link href={href}>{U.view('phone', contact)}</Link>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
      {U.when(
        R.equals(contactsQuery, null),
        'NOTE: This example requires a DB.'
      )}
    </div>
  )
}
