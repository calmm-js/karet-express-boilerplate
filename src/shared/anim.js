import * as R from 'kefir.ramda'
import * as U from 'karet.util'
import React from 'karet'

export const ticks = ({interval = 1 / 30, duration}) =>
  U.thru(
    U.interval(interval, 0),
    U.takeUntilBy(U.later(duration, 0)),
    U.foldPast(start => start || Date.now(), 0),
    U.skipFirst(1),
    U.liftRec(start => Math.min(duration, Date.now() - start) / duration),
    U.endWith(1)
  )

export const easeInOutCubic = /*#__PURE__*/ U.liftRec(
  t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)
)

export const lerp = /*#__PURE__*/ R.curry((x0, x1, t) => x0 + (x1 - x0) * t)

export const transitionInOut = ({
  wrapperClass,
  transitionDuration,
  delayDuration
}) =>
  U.pipe(
    U.foldPast((o, next) => ({next, prev: o.next}), {next: null}),
    U.flatMapSerial(({prev, next}) => {
      const wrap = (elem, visible) => (
        <div
          key={wrapperClass}
          style={{transitionDuration: `${transitionDuration}ms`}}
          className={`${wrapperClass}${visible ? ' visible' : ''}`}>
          {elem}
        </div>
      )
      const actions = []
      if (prev)
        actions.push(wrap(prev, false), U.later(transitionDuration, null))
      if (next)
        actions.push(
          wrap(next, false),
          U.later(delayDuration, wrap(next, true)),
          U.later(transitionDuration, wrap(next, true))
        )
      return U.serially(actions)
    }),
    U.startWith(null)
  )

export const transitionMaxHeight = ({content, show, transitionPeriod}) => {
  const overflowY = 'hidden'
  const transition = `max-height ${transitionPeriod}ms ease-in-out`

  return U.parallel([
    U.thru(
      show,
      U.takeFirst(1),
      U.liftRec(s => (s ? {} : {overflowY, maxHeight: '0px'}))
    ),
    U.thru(
      show,
      U.changes,
      U.flatMapLatest(s => {
        const maxHeight = `${content.get() &&
          content.get().getBoundingClientRect().height}px`
        return U.serially(
          s
            ? [
                {overflowY, maxHeight, transition},
                U.later(transitionPeriod, {})
              ]
            : [
                {overflowY, maxHeight},
                U.later(50, {overflowY, maxHeight: '0px', transition})
              ]
        )
      })
    )
  ])
}
