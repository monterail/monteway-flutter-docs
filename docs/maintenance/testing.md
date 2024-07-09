# 🧪 Testing

Testing of Flutter goes into three categories:

- unit tests for single function, class or method,
- widget tests for a single widget,
- integration tests for whole app or big part of the app.

Example tests can be found in `test/` directory.

## BLoC

Strive to **test every BLoC** thoroughly as it is the source of data for UI
and a recipient of events from the system. If it works, then UI will likely work too
as it listens closely for updates, and requested actions will take place.

Example test:

```dart
blocTest<CounterBloc, CounterState>(
  'decrease actions',
  build: () => CounterBloc(),
  act: (bloc) => [
    for (int i = 0; i < 4; i++) bloc.add(const CounterEvent.decreased())
  ],
  expect: () => const <CounterState>[
    CounterState(value: -1),
    CounterState(value: -2),
    CounterState(value: -3),
    CounterState(value: -4)
  ],
);
```

Use `blocTest` to reduce boilerplate compared to classic tests, where managing
instances is required.

## Widgets

When creating reusable widget, **DO** test if it's params do affect the UI as expected.

Testing complex widgets, like whole pages should be done via integration tests.

## Integration tests

Consider implementing integration tests for crucial workflows, eg. logging in.
Avoid implementing integration tests for every workflow as updating an app
fortified with a lot of integration tests will be difficult. Assume that
reusable widgets are working correctly (as those are tested) and focus
integration tests on workflow interactions.

Look at [Flutter integration testing docs](https://docs.flutter.dev/cookbook/testing/integration/introduction).

We're keeping integration tests in `integration_test` directory.

To run integration tests, use `make run-integration-test`.
