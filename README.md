# Vue Todo — About Us Feature

## Routes

- `#/` — Main Todo list
- `#/about` — About Us screen

## About Us behavior

The About Us screen shows:
- An `h1` titled **About Us**
- Exactly one non-empty paragraph describing the app
- A single **Back to App** link (`href="#/"`) that returns to the Todo list

Navigating to `#/about` and back does not modify the current in-memory state (todos/filter) and does not change the persisted localStorage payload under `vue-todo.v1`.

## Development

- Install: `npm install`
- Test: `npm test`
- Build: `npm run build`
