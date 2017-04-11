import * as R from "ramda"
import * as L from "partial.lenses"
import * as U from "karet.util"
import React  from "karet"

const TextInput = ({value}) => console.log("TextInput") ||
  <input type="text"
         value={value}
         onChange={U.getProps({value})}/>

const Contact = ({contact}) => console.log("Contact") ||
  <div>
    <TextInput value={U.view("name", contact)}/>
    <TextInput value={U.view("phone", contact)}/>
    <button onClick={() => contact.remove()}>Remove</button>
  </div>

const Contacts = ({contacts}) => console.log("Contacts") ||
  <div>
    {U.seq(contacts,
           U.mapElems((contact, i) =>
                      <Contact key={i} contact={contact}/>))}
  </div>

export default U.withContext((_, {state}) => {
  const contacts = U.view(L.define([]), state)
  state.log("state")
  return <div>
    <h1>Main page</h1>
    <button onClick={() =>
              state.modify(R.append({name: "", phone: ""}))}>
      Add</button>
    <Contacts contacts={contacts}/>
    Num: {U.length(contacts)}
  </div>
})
