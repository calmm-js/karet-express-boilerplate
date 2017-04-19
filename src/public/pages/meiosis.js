import * as L from "partial.lenses"
import * as R from "ramda"
import * as U from "karet.util"
import React  from "karet"

const Entry = ({entry}) => {
  const value = U.view("value", entry)
  return (
    <div>
      <span>Entry number:</span>
      <input type="text" size="2" value={value}
        onChange={e => value.set(e.target.value)}/>
    </div>
  )
}

const Date = ({date}) => {
  const value = U.view("value", date)
  return (
    <div>
      <span>Date:</span>
      <input type="text" size="10" value={value}
        onChange={e => value.set(e.target.value)}/>
    </div>
  )
}

const Temperature = ({temperature}) => {
  const label = U.view("label", temperature)
  const value = U.view("value", temperature)
  const units = U.view("units", temperature)

  const increase = by => () => value.modify(R.add(by))

  const toFahrenheit = value => Math.round( value * 9 / 5 + 32 )
  const toCelsius = value => Math.round( (value - 32) / 9 * 5 )

  const changeUnits = () => temperature.modify(R.ifElse(
    R.propEq("units", "C"),
    R.compose(L.set("units", "F"), L.modify("value", toFahrenheit)),
    R.compose(L.set("units", "C"), L.modify("value", toCelsius))
  ))

  return (
    <div className="row">
      <div className="col-md-3">
        <span>
          {label} Temperature:
          {value}&deg;{units}
        </span>
      </div>
      <div className="col-md-6">
        <button className="btn btn-sm btn-default" onClick={increase(1)}>Increase</button>{" "}
        <button className="btn btn-sm btn-default" onClick={increase(-1)}>Decrease</button>{" "}
        <button className="btn btn-sm btn-info" onClick={changeUnits}>Change Units</button>
      </div>
    </div>
  )
}

const defaults = {
  entry: {value: ""},
  date: {value: ""},
  temperature: {
    air: {label: "Air", value: 20, units: "C"},
    water: {label: "Water", value: 20, units: "C"}
  },
  saved: ""
}

export default U.withContext((_, {state}) => {
  const meiosis = U.view(["meiosis", L.valueOr(defaults)], state)

  const displayTemperature = temperature =>
    temperature.label + ": " +
    temperature.value + "\xB0" + temperature.units

  const message = model => L.set("saved", "Entry #" + model.entry.value +
    " on " + model.date.value + ":" +
    " Temperatures: " +
    displayTemperature(model.temperature.air) + " " +
    displayTemperature(model.temperature.water), model)

  const save = evt => {
    evt.preventDefault()
    meiosis.modify(R.pipe(
      message,
      L.set(["entry", "value"], ""),
      L.set(["date", "value"], "")
    ))
  }

  return (
    <div>
      <Entry entry={U.view("entry", meiosis)}/>
      <Date date={U.view("date", meiosis)}/>
      <Temperature temperature={U.view(["temperature", "air"],   meiosis)}/>
      <Temperature temperature={U.view(["temperature", "water"], meiosis)}/>
      <div>
        <button className="btn btn-primary" onClick={save}>Save</button>{" "}
        <span>{U.view("saved", meiosis)}</span>
      </div>
    </div>
  )
})
