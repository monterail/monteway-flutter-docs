# 🧭 Routing

By default [auto_route](https://pub.dev/packages/auto_route) is used as route management. It provides us opportunity to easily send params to our routes.

## Add a route with parameter

To create a route with a parameter:

- Add a `RouteHelper` class in `lib/src/config/routes/` directory with defined parameter:

```dart
import 'package:template/src/config/routes/routes.dart';
import 'package:template/src/modules/bloc_screen/view/bloc_view.dart';
export 'package:template/src/modules/bloc_screen/view/bloc_view.dart';

class BlocRouteHelper extends RouteHelper<String> {
  static const path = '/bloc/:title';
  static const widget = BlocView;

  const BlocRouteHelper() : super(path: path);

  @override
  String generatePath(String title) =>
      absolutePath.replaceFirst(':title', title);
}
```

> **Be sure to export the widget file.**

- Annotate parameter in the target widget's constructor

```dart
class ParamView extends StatelessWidget {
  final String? title;
  const BlocView({@PathParam('title') this.title, Key? key}) : super(key: key);
  ...
```

- Add the route helper to `Routes` (`lib/src/config/routes.dart`) class

```dart
class Routes {
  // ...
  static const bloc = BlocRouteHelper();
  // ...
}
```

- Let `auto_route` know about the new route

```dart
@AdaptiveAutoRouter(routes: [
  // ...
  AutoRoute(page: BlocRouteHelper.widget, path: BlocRouteHelper.path),
  // ...
])
class AppRouter extends _$AppRouter {}
```

- Run `make generate-code` to make the new route available in the app.

## Add a route without parameter

To create a route without any parameters:

- Add a `ParameterlessRouteHelper` class in `lib/src/config/routes/` directory:

```dart
import 'package:template/src/config/routes/routes.dart';
import 'package:template/src/modules/main_screen/view/main_screen_view.dart';
export 'package:template/src/modules/main_screen/view/main_screen_view.dart';

class MainRouteHelper extends ParameterlessRouteHelper {
  static const path = '/';
  static const widget = MainScreenWidget;
  const MainRouteHelper() : super(path: path);
}
```

> **Be sure to export the widget file.**

- Add the route helper to `Routes` (`lib/src/config/routes.dart`) class

```dart
class Routes {
  // ...
  static const main = MainRouteHelper();
  // ...
}
```

- Let `auto_route` know about the new route

```dart
@AdaptiveAutoRouter(routes: [
  // ...
  AutoRoute(page: MainRouteHelper.widget, path: MainRouteHelper.path),
  // ...
])
class AppRouter extends _$AppRouter {}
```

- Run `make generate-code` to make the new route available in the app.
