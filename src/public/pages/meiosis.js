import * as L     from "partial.lenses"
import * as R     from "ramda"
import * as React from "karet"
import * as U     from "karet.util"

const LabeledInput = ({value, label, ...props}) =>
  <div>
    <span>{label}</span>
    <input value={value} onChange={U.getProps({value})} {...props}/>
  </div>

const Entry = ({entry}) =>
  <LabeledInput label="Entry number:" type="text" size="2"
    value={U.view("value", entry)}/>

const Date = ({date}) =>
  <LabeledInput label="Date:" type="text" size="10"
    value={U.view("value", date)}/>

const toFahrenheit = value => Math.round( value * 9 / 5 + 32 )
const toCelsius = value => Math.round( (value - 32) / 9 * 5 )

const Temperature = ({temperature}) => {
  const label = U.view("label", temperature)
  const value = U.view("value", temperature)
  const units = U.view("units", temperature)

  const increase = by => () => value.modify(R.add(by))

  const changeUnits = () => U.holding(() => {
    if (units.get() === "C") {
      units.set("F")
      value.modify(toFahrenheit)
    } else {
      units.set("C")
      value.modify(toCelsius)
    }
  })

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

const displayTemperature = temperature =>
  temperature.label + ": " +
  temperature.value + "\xB0" + temperature.units

const message = model =>
  "Entry #" + model.entry.value +
  " on " + model.date.value + ":" +
  " Temperatures: " +
  displayTemperature(model.temperature.air) + " " +
  displayTemperature(model.temperature.water)

export default U.withContext((_, {state}) => {
  const meiosis = U.view(["meiosis", L.valueOr(defaults)], state)

  function save(evt) {
    evt.preventDefault()
    meiosis.modify(R.pipe(
      L.set("saved", message(meiosis.get())),
      L.set(["entry", "value"], ""),
      L.set(["date", "value"], "")))
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
