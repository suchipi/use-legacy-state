# `use-legacy-state`

This package provides a custom [React Hook](https://reactjs.org/docs/hooks-overview.html) that behaves the same way as `this.setState` from React component classes, which may help you transition a component from a class to a function when you want to use hooks in that component.

## Features

- Drop-in replacement for class state
- Shallowly merges objects passed into `setState`
- Supports a function callback argument, the same as `this.setState`
- Skips update if function callback argument returns `null`
- Supports a second function callback argument, to be executed after the state update (same as `this.setState`)

## Installation

```
$ npm install --save use-legacy-state
```

## Usage

```jsx
const useLegacyState = require("use-legacy-state");

function Counter(props) {
  const [state, setState] = useLegacyState({ count: 0 });

  return (
    <div>
      Count: {state.count}
      <button onClick={() => setState({ count: state.count + 1 })}>
        Increase
      </button>
    </div>
  );
}
```

## License

MIT
