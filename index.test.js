const React = require("react");
const {
  render,
  fireEvent,
  cleanup,
  waitForElement
} = require("react-testing-library");
const useLegacyState = require(".");

afterEach(cleanup);

describe("use-legacy-state", () => {
  test("basic usage", () => {
    function Counter() {
      const [state, setState] = useLegacyState({
        count: 0
      });

      return (
        <div>
          <span data-testid="count">{state.count}</span>
          <button
            onClick={() => {
              setState({ count: state.count + 1 });
            }}
          >
            Increase
          </button>
        </div>
      );
    }

    const { getByText, getByTestId, container, asFragment } = render(
      <Counter />
    );

    const count = getByTestId("count");
    expect(count.textContent).toEqual("0");
    getByText("Increase").click();
    expect(count.textContent).toEqual("1");
  });

  test("shallow merge", () => {
    function Counter() {
      const [state, setState] = useLegacyState({
        foo: 0,
        bar: 0
      });

      return (
        <div>
          <span data-testid="state">{JSON.stringify(state)}</span>
          <button
            onClick={() => {
              setState({ foo: state.foo + 1 });
            }}
          >
            Increase Foo
          </button>
        </div>
      );
    }

    const { getByText, getByTestId, container, asFragment } = render(
      <Counter />
    );

    const state = getByTestId("state");
    expect(state.textContent).toEqual(
      JSON.stringify({
        foo: 0,
        bar: 0
      })
    );
    getByText("Increase Foo").click();
    expect(state.textContent).toEqual(
      JSON.stringify({
        foo: 1,
        bar: 0
      })
    );
  });

  test("callback receiving previous state", () => {
    function Counter() {
      const [state, setState] = useLegacyState({
        count: 0
      });

      return (
        <div>
          <span data-testid="count">{state.count}</span>
          <button
            onClick={() => {
              setState(prevState => ({
                count: prevState.count + 1
              }));
            }}
          >
            Increase
          </button>
        </div>
      );
    }

    const { getByText, getByTestId, container, asFragment } = render(
      <Counter />
    );

    const count = getByTestId("count");
    expect(count.textContent).toEqual("0");
    getByText("Increase").click();
    expect(count.textContent).toEqual("1");
  });

  test("callback returning null doesn't update", () => {
    let timesRendered = 0;

    function Counter() {
      timesRendered++;

      const [state, setState] = useLegacyState({
        count: 0
      });

      return (
        <div>
          <span data-testid="count">{state.count}</span>
          <button
            onClick={() => {
              setState(prevState => null);
            }}
          >
            Increase
          </button>
        </div>
      );
    }

    const { getByText, getByTestId, container, asFragment } = render(
      <Counter />
    );

    expect(timesRendered).toEqual(1);
    getByText("Increase").click();
    expect(timesRendered).toEqual(1);
  });

  test("after update callback", async () => {
    const messages = [];

    function Counter() {
      messages.push("render");

      const [state, setState] = useLegacyState({
        count: 0
      });

      return (
        <div>
          <span data-testid="count">{state.count}</span>
          <button
            onClick={() => {
              setState(
                prevState => ({
                  count: prevState.count + 1
                }),
                () => {
                  messages.push("post-update");
                }
              );
            }}
          >
            Increase
          </button>
        </div>
      );
    }

    const { getByText, getByTestId, container, asFragment } = render(
      <Counter />
    );

    expect(messages).toEqual(["render"]);
    getByText("Increase").click();
    expect(messages).toEqual(["render", "render", "post-update"]);
  });
});
