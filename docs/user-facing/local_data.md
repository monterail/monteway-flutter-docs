
# 📒 Caching, storing local data

We use [sembast](https://pub.dev/packages/sembast) database to store data locally. Sembast is a NoSQL database that works in both Flutter and Flutter web projects. It is simple, fast, and supports cross-platform persistence, making it an ideal choice for our Flutter template. Fully compatible with Dart VM and Flutter without the need for additional plugins. Implemented entirely in Dart, ensuring seamless operation across all platforms, including macOS, Android, iOS, Linux, and Windows. For web, separate package [sembast_web](https://pub.dev/packages/sembast_web) is required.

## Initialization

Sembast needs to be initialized to set up the database instance. A service for `sembast` was created. The `setupSembast` method initializes the database differently for web and non-web platforms and is called in `main.dart`.

### `sembast` service

```dart
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:sembast/sembast_io.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sembast_web/sembast_web.dart';

const String _databaseName = 'app_database.db';
late Database _database;

Future<void> setupSembast() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (kIsWeb) {
    _database = await databaseFactoryWeb.openDatabase(_databaseName);
  } else {
    final appDir = await getApplicationDocumentsDirectory();
    final dbPath = '${appDir.path}/$_databaseName';
    _database = await databaseFactoryIo.openDatabase(dbPath);
  }
}

Database get database => _database;
```

## Store

Sembast works with `StoreRef` to hold collections of data. Data is stored in key-value pairs within a store.

- Define a store

```dart
final StoreRef<String, Map<String, dynamic>> _store = stringMapStoreFactory.store('userStore');
```

- Add or update data

```dart
await _store.record('userKey').put(database, user.toJson());
```

- Retrieve data

```dart
final record = await _store.record('userKey').get(database);
```

- Delete data

```dart
await _store.record('userKey').delete(database);
```

The test model here is `User`.

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required int pk,
    String? email,
    String? phone,
    String? firstName,
    String? lastName,
  }) = _User;

  factory User.fromJson(Map<String, Object?> json) => _$UserFromJson(json);
}
```

## Repositories

We implement the `IUserRepository` interface with sembast operations. Result is a type that represents either `Success` or `Failure`. Inspired by functional programming. Thanks to this, we have clear and easy-to-use error handling.

Example

```dart
import 'package:sembast/sembast.dart';
import 'package:result_type/result_type.dart';
import 'package:template/src/services/sembast.dart';

class UserRepository implements IUserRepository {
  static const String _storeName = 'userStore';
  final StoreRef<String, Map<String, dynamic>> _store = stringMapStoreFactory.store(_storeName);

  @override
  Future<Result<User?, UserRepositoryException>> getUser(String userKey) async {
    try {
      final record = await _store.record(userKey).get(database);
      return Success(record != null ? User.fromJson(record) : null);
    } catch (e) {
      return Failure(UserRepositoryException(MainScreenErrorType.fetchError));
    }
  }

  @override
  Future<Result<void, UserRepositoryException>> saveUser(String userKey, User user) async {
    try {
      await _store.record(userKey).put(database, user.toJson());
      return Success(null);
    } catch (e) {
      return Failure(UserRepositoryException(MainScreenErrorType.saveError));
    }
  }

  @override
  Future<Result<void, UserRepositoryException>> deleteUser(String userKey) async {
    try {
      await _store.record(userKey).delete(database);
      return Success(null);
    } catch (e) {
      return Failure(UserRepositoryException(MainScreenErrorType.deleteError));
    }
  }
}

class UserRepositoryException implements Exception {
  UserRepositoryException(this.errorType);
  final MainScreenErrorType errorType;
}
```

## Dependency injection

Dependency injection is an object-oriented technique that sends the dependencies of another object to an object. Using dependency injection,
we can also move the creation and restriction of dependent objects outside the classes. This concept brings a more significant level of adaptability, decoupling, and simpler testing.

Popular choice managing service location is [get_it](https://pub.dev/packages/get_it).
