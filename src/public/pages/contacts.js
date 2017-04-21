import * as L from "partial.lenses"
import * as U from "karet.util"
import React  from "karet"

const TextInput = ({value}) =>
  <input type="text"
         value={value}
         onChange={U.getProps({value})}/>

const Contact = ({contact}) =>
  <div>
    <TextInput value={U.view("name", contact)}/>
    <TextInput value={U.view("phone", contact)}/>
    <button onClick={() => contact.remove()}>Remove</button>
  </div>

const Contacts = ({contacts}) =>
  <div>
    <button onClick={() => contacts.modify(U.append({name: "", phone: ""}))}>
      Add contact
    </button>
    <div>
      {U.seq(contacts, U.mapElems((contact, i) =>
         <Contact key={i} contact={contact}/>))}
    </div>
    Number of contacts: {U.length(contacts)}
  </div>

export default U.withContext((_, {state}) =>
  <div>
    <h1>Contacts</h1>
    <Contacts contacts={U.view(["contacts", L.define([])], state)}/>
  </div>
)
