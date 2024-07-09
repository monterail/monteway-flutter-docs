# ⚙️ Environment variables (flavors)

This template supports flavoring via environment variables passed to `flutter build/run` commands.

Variables are available to other modules in `lib/src/environment/variables.dart` and any new ones should be added there.

## Adding environment variables

Each variable should have an `APP_` prefix to avoid accidental overriding of other tool variables.

To add a new variable:

- Add a new `--dart-define=APP_VARIABLE=value` parameter to `flutter build/run` command or `.vscode/launch.json`, like so:

```shell
flutter run --dart-define=APP_VARIABLE=value
```

- Handle the variable in the code. In `lib/src/environment/variables.dart` add a new field that will read value from environment, like so:

```dart
class EnvironmentVariables {
  // ...
  static const String appVariable = String.fromEnvironment('APP_VARIABLE', defaultValue: 'default');
  // ...
}
```

- (Optional) Handle the value in Android build process. Head to `android/app/build.gradle` and add your variable to `dartEnvironmentVariables`, like so:

```gradle
def dartEnvironmentVariables = [
    // ...
    APP_VARIABLE: 'default'
    // ...
];
```

- (Optional) Handle the value in iOS build process. New variables will be automatically available for use in Xcode (as long as those are prefixed with `APP_`).

## Adding environments

To create new environment:

1. Create new file with variables in `environment/` directory.
2. Include new variables file in `Makefile`.
3. Create build scripts for the new flavor.

Also, for VS Code:

1. Open `.vscode/launch.json`.
2. Create _debug_ and _profile_ launch modes with new environment variables.
