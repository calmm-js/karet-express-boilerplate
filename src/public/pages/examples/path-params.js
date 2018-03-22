import * as L from 'partial.lenses'
import * as React from 'karet'
import * as U from 'karet.util'

export const PathParams = ({path, props}) => (
  <div>
    <h2>Path params</h2>
    <pre className="pretty-stringify">{path}</pre>
    <table>
      <thead>
        <tr>
          <td>Key</td>
          <td>Value</td>
        </tr>
      </thead>
      <tbody>
        {L.collectAs(
          (value, key) => (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>
                <U.Input
                  spellCheck={false}
                  value={U.view(L.defaults(''), value)}
                />
              </td>
            </tr>
          ),
          L.values,
          props
        )}
      </tbody>
    </table>
  </div>
)
