# 🚄 BLoC state management

We're using bloc (mostly) as out state management. It provides us easy separation of our apps into three layers:

1. Presentation (your UI has to be located here)
2. Business logic (here is place for code that do some stuff)
3. Data (work with network or local data will be located here)

We recommend to combine it with [freezed](https://pub.dev/packages/freezed) package. It reduce significant amount of boilerplate code and make it easier to read.
Also it helps with generating code for models, but please be aware and don't use freezed generation to classes you want to store using hive, while this [issue](https://github.com/hivedb/hive/issues/795) is open.

## BLoC or Cubit?

We use both Cubit and classic BLoC.

BLoC is your choice if you are building a feature that has inputs, a lot of fetches, or any other kind of complicated states

If you are working on some simpler stuff, take a Cubit. You can easily rewrite it later.

## Freezed + BLoC, States

There are two main aproaches in state creation using Freezed and BLoC.

First one is using the [Factory Method pattern](https://refactoring.guru/design-patterns/factory-method)

```dart
@freezed
class DataState with _$DataState {
    const factory DataState.initial(bool isLoading) = DataInitial;
    const factory DataState.error(String message, bool isLoading) = DataError;
    const factory DataState.success(Data data, bool isLoading) = DataSuccess;
}
```

1) State is represented by objects of different classes, that however, inherit the main class (```DataState``` in example above). So please make sure your logic is ok with [Liskov substitution principle](https://blog.knoldus.com/what-is-liskov-substitution-principle-lsp-with-real-world-examples/#:~:text=Simply%20put%2C%20the%20Liskov%20Substitution,the%20objects%20of%20our%20superclass.)
2) Fields of each state can be unique.
3) This approach allows us to use ```.when()``` method

```dart
state.when(
  initial: () => InitialWidget(),
  error: () => ErrorWidget(),
  success: () => SuccessWidget(),
)
```

Second approach is a common one, using the single class (this tamplate contains examples with this approach)

```dart
@freezed
class CounterState with _$CounterState {
  const factory CounterState({
    @Default(0) int value,
    @Default('') String someString,
    String? nullableString,
  }) = _CounterState;
}
```
1) State is represented by object of a single class
2) Fields are always the same for this state.

Which one is the best to use? None of them, it depends on logic you want to create, so feel free to experiment!

## Freezed + BLoC, Events

Creation of events should be always implemented using the factory method pattern, it makes it easy to read and reduce boilerplate code we had in previous version of template
```dart
@freezed
class CounterEvent with _$CounterEvent {
  const factory CounterEvent.increased() = _Increased;
  const factory CounterEvent.decreased() = _Decreased;
  const factory CounterEvent.increaseWithValue(int valueToIncrease) = _IncreaseWithValue
}
```

## Freezed + BLoC, BLoC class and logic

Realization of logic is pretty simple and it doesn't really changed after we added Freezed package.

```dart
void _onIncreased(
  _Increased event,
  Emitter<CounterState> emit,
) {
  emit(state.copyWith(value: state.value + 1));
}
```

However, there are a few new approaches to implement logic with multi-class state (approach #1 for the state implementation)

- First one is common for multi-class state

```dart
void _onSomeEvent(
  _SomeEvent event,
  Emitter<SomeState> emit,
) {
  emit(SomeNewState(data:event.someData));
}
```

- Second one, is modification of current state with specified state class.


```dart
// Class
@freezed
class DataState with _$DataState {
    const factory DataState.initial({bool isLoading = false}) = DataInitial;
    const factory DataState.error(String message, bool isLoading) = DataError;
    const factory DataState.success(Data data, bool isLoading) = DataSuccess;
}

// BLoC
class DataBloc extends Bloc<DataEvent, DataState> {
  DataBloc() : super(const DataInitial()) {
    on<_SomeEvent>(_onDecreased);
  }

  void _onSomeEvent(
    _SomeEvent event,
    // Here we don't use [DataState], but instead specify class of state we expect
    Emitter<DataInitial> emit,
  ) {
    emit(state.copyWith(isLoading = true));
  }
}
```

We have to be really careful with this solution, to don't allow type cast exception.

### Useful tips

- Install [this](https://marketplace.visualstudio.com/items?itemName=FelixAngelov.bloc) VSCode extension to save your time while you're creating your blocs
- Separate your models, API fetches, UI screens, and blocs/cubits by features
- Write tests for each of your bloc/cubit
* Put only one [BlocProvider](https://pub.dev/documentation/flutter_bloc/latest/flutter_bloc/BlocProvider-class.html) in the tree, then just use [BlocBuilder](https://pub.dev/documentation/flutter_bloc/latest/flutter_bloc/BlocBuilder-class.html) to have access to your bloc or cubit
- If your bloc contains some work with streams, don't forget to close it in [close()](https://pub.dev/documentation/bloc/latest/bloc/Bloc/close.html) method of your bloc
- **Do** use [MultiBlocProvider](https://pub.dev/documentation/flutter_bloc/latest/flutter_bloc/MultiBlocProvider-class.html) in case you need to provide more than one bloc to your module
