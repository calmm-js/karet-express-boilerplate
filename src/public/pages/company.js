import * as L from "partial.lenses"
import * as R from "ramda"
import * as U from "karet.util"
import React  from "karet"

const TextInput = ({mount, value, ...props}) =>
  <input ref={mount}
         type="text"
         value={value}
         onChange={U.getProps({value})}
         {...props}/>

const JoinView = ({title, other, unique, primaries, secondaries}) => {
  const Primary = ({primary}) => {
    const assignments = U.view(["assignments", L.define([])], primary)
    const sub = id => () => assignments.modify(R.reject(R.equals(id)))
    const search = U.atom("")
    const add = id => () => U.holding(() => {
      search.set("")
      assignments.modify(R.union([id]))
    })
    const matches =
      U.seq(U.template({search, assignments}),
            U.debounce(300),
            U.flatMapLatest(({search, assignments}) =>
              search.length < 3
              ? []
              : U.seq(secondaries,
                      U.filter(({id, name}) =>
                               name.indexOf(search) !== -1 &&
                               !R.contains(id, assignments)))),
            U.startWith([]))

    return (
      <div>
        <div className="info">
          <TextInput mount={e => L.get("value", e) === "" && e.focus()}
                     placeholder="name"
                     value={U.view("name", primary)}/>
          <button onClick={() => primary.remove()}>Delete</button>
        </div>
        <div className="assignments">
          {U.seq(assignments, U.mapCached(id =>
             <div key={id}>
               <button onClick={sub(id)}>-</button>
               {U.view([L.find(R.whereEq({id})), "name"], secondaries)}
             </div>))}
          <div className="add">
            <TextInput placeholder={U.string`add ${other}`} value={search}/>
            {U.ift(U.length(matches),
                   <div className="popup">
                     {U.seq(matches,
                            U.map(({id, name}) =>
                              <button onClick={add(id)}>{name}</button>))}
                   </div>)}
          </div>
        </div>
      </div>
    )
  }

  const addNew = () => U.holding(() => {
    const id = unique.get().toString()
    unique.modify(R.add(1))
    primaries.modify(R.append({id, name: "", assignments: []}))
  })

  return (
    <div>
      <h2>{title}</h2>
      <div className="controls">
        <button onClick={addNew}>New</button>
      </div>
      <div>
        {U.seq(primaries, U.map(L.get("id")), U.mapCached(id =>
           <Primary key={id}
                    primary={U.view(L.find(R.whereEq({id})), primaries)}/>))}
      </div>
    </div>
  )
}

const plurals = (primary, secondary) => ({
  primary,
  secondary,
  primaries: primary + "s",
  secondaries: secondary + "s"
})

const joinView = R.pipe(plurals, ({primary, secondary, primaries, secondaries}) => {
  const to = data => {
    const assignmentsByPrimary = R.groupBy(L.get(primary), data.assignments)
    return {
      primaries: U.seq(
        data[primaries],
        R.map(({id, ...props}) => ({
          id,
          ...props,
          assignments: U.seq(assignmentsByPrimary,
                             L.collect([id, L.elems, secondary]),
                             R.sortBy(R.identity))
        }))),
      secondaries: data[secondaries]
    }
  }
  const from = data => ({
    [primaries]: U.seq(data.primaries,
                       R.map(L.remove("assignments"))),
    [secondaries]: data.secondaries,
    assignments: U.seq(data.primaries,
                       R.chain(prim =>
                               U.seq(prim.assignments,
                                     R.map(secondaryId => ({
                                       [primary]: prim.id,
                                       [secondary]: secondaryId
                                     })))))
  })
  return [L.iso(to, from), "primaries", L.define([])]
})

const defaults = {
  projects: [
    {id: "1", name: "Satumaa"},
    {id: "2", name: "Sinitaivas"}
  ],
  consultants: [
    {id: "1", name: "Teppo"},
    {id: "2", name: "Matti"}
  ],
  assignments: [
    {project: "1", consultant: "2"},
    {project: "1", consultant: "1"},
    {project: "2", consultant: "1"}
  ]
}

export default U.withContext((_, {state}) => {
  const unique = U.view(["unique", L.valueOr(10)], state)
  const company = U.view(["company", L.define(defaults)], state)
  const    projects = U.view(joinView("project", "consultant"), company)
  const consultants = U.view(joinView("consultant", "project"), company)
  return (
    <div id="company">
      <h1>Company</h1>
      <div className="views">
        <JoinView title="Projects"
                  other="consultant"
                  unique={unique}
                  primaries={projects}
                  secondaries={consultants}/>
        <JoinView title="Consultants"
                  other="project"
                  unique={unique}
                  primaries={consultants}
                  secondaries={projects}/>
      </div>
    </div>
  )
})
