import * as Kefir from "kefir"
import * as U     from "karet.util"
import React      from "karet"

import * as RPC from "../../../client/rpc"

function Bus() {
  let emitter
  const bus = Kefir.stream(e => { emitter = e })
  bus.onAny(() => {})
  return [bus, emitter.emit]
}

const TextField = ({value}) =>
    <input type="text" value={value} onChange={U.getProps({value})}/>

const Form = ({form = U.atom({})}) => {
  const [controller, action] = Bus()
  const state = U.seq(controller,
                      U.flatMapLatest(RPC.mkPost("form-data")),
                      U.startWith("not-saved"),
                      U.toProperty)
  state.log("state")
  return <div>
    <h1>Form</h1>
    <div>Name: <TextField value={U.view("name", form)}/></div>
    {U.ift(U.equals(state, "not-saved"),
           <button onClick={() => action({answers: form.get()})}>
             Submit
           </button>)}
    {U.ift(U.equals(state, undefined), "Saving...")}
    {U.ift(U.has(state, "error"), "Error!")}
    {U.ift(U.has(state, "rowCount"), "Saved!")}
  </div>
}

export default Form
