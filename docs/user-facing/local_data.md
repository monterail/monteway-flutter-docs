
# 📒 Caching, storing local data

We use [Hive](https://docs.hivedb.dev/#/) database to store data locally. Hive is a lightweight, powerful database which runs fast on the device.
Unless you absolutely need to model your data with many relationships, choosing this pure-Dart package with no native dependencies can be the best option.
Hive is centered around the idea of `boxes`. `Box` has to be opened before use. In addition to the plain-flavored Boxes,
there are also options which support lazy-loading of values and encryption.

## Initialization

Hive needs to be ​initialized​ to, among other things, know in which directory it stores the data. A service for hive was created.
The `setupHive` method initializes hive for flutter and registers adapters and is called in `main`.
`IHiveRepository<E>` is an mixin that manages Hive box opening, where `E` is a specific type depending on the type of data being stored.

Hive service

```dart
Future<void> setupHive() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  _registerAdapters();
}

void _registerAdapters() {
  Hive.registerAdapter<User>(UserAdapter());
}

abstract class IHiveRepository<E> {
  Box<E>? _box;

  String get boxKey;

  Future<Box<E>> get box async {
    _box ??= await Hive.openBox<E>(boxKey);
    return _box!;
  }
}
```

## Boxes

Data can be stored and read only from an opened `Box`. Opening a `Box` loads all of its data from the local storage into memory for immediate access.

- Open box

```dart
Hive.openBox('userBox');
```

- Get an already opened instance

```dart
Hive.box('name');
```

There are two basic options of adding data - either call `put(key, value)` and specify the key yourself, 
or call `add` and utilize Hive's auto-incrementing keys. Unless you absolutely need to define the keys manually,
calling add is the better and simpler option.

```dart
userBox.add(User('Test User', 28));
```

### TypeAdapter

Hive works with binary data. While it's entirely possible to write a custom adapter which fumbles with a ​​​​​BinaryWriter and a BinaryReader,
it's much easier to let the ​`hive_generator`​ package do the hard job for you. Making an adapter for specific class is then as simple as adding a few annotations.

Creating a TypeAdapter

```dart
import 'package:hive/hive.dart';

part 'user.g.dart';

@HiveType()
class User {
  @HiveField(0)
  final String name;

  @HiveField(1)
  final int age;

  User(this.name, this.age);
}
```

To generate TypeAdapter you should run `flutter packages pub run build_runner build`. Thanks to the `Makefile` scripts, we can do this with `make generate-code`
`make watch-and-generate-code` until stopped will watch for file changes and automatically build code if necessary.
It's useful when dealing with a lot of code generation since it'll do a whole project build only at start and then do smaller builds only for affected files.
The created adapter must be registered.

## Repositories

`IHiveRepository` should be used with every repository that is using Hive.

Example

```dart
class UserRepository with IHiveRepository<User> implements IUserRepository {
  @override
  String get boxKey => 'userInfoBoxKey';

  @override
  Future<User?> getUser(String userKey) async {
    return (await box).get(userKey);
  }

  @override
  Future<void> saveUser(String userKey, User user) async {
    await (await box).put(userKey, user);
  }

  @override
  Future<void> deleteUser(String userKey) async {
    await (await box).delete(userKey);
  }
```

### Dependency injection

Dependency injection is an object-oriented technique that sends the dependencies of another object to an object. Using dependency injection,
we can also move the creation and restriction of dependent objects outside the classes. This concept brings a more significant level of adaptability, decoupling, and simpler testing.

Popular choice managing service location is [get_it](https://pub.dev/packages/get_it).
