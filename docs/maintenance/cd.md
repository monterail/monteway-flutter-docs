# 🏎💨 CD with AppCenter

We're using custom scripts to make [AppCenter](https://appcenter.ms/) support our app building process.

There's one for Android (`android/app/appcenter-post-clone.sh`) and one for iOS (`ios/appcenter-post-clone.sh`). Those download latest stable Flutter and build _prod_ flavored app with signing.

> To build the _dev_ flavored app, set a RELEASE_TARGET environment variable to `development` in branch build configuration.

## Android setup

Firstly, create a keystore for signing.

You need to have [Java installed](https://openjdk.java.net/) and available in the shell:

- on mac, using [brew](https://brew.sh/): `brew install openjdk`,
- on windows, just download a `.msi` file [from here](https://www.microsoft.com/openjdk),
- on linux or wsl, there's probably `openjdk` available in your package manager.

In the root project folder run: `make create-android-signing`.
You will be asked some questions, but the passwords are the most important. Remember those and put
in `android/app/build.gradle` in section `signingConfigs`:

```gradle
signingConfigs {
    release {
        storeFile rootProject.file("upload-keystore.jks") # leave as-is
        storePassword "password" # put your store password here
        keyAlias "upload" # leave as-is
        keyPassword "password" # put your key password here
    }
}
```

To check if signing works, you can run `make build-prod-apk`. If the build process goes fine
and the app is working it's done 🍾

### AppCenter Android setup

To use signing in Android builds, set the AppCenter build like so:

<img width="466" alt="image" src="https://user-images.githubusercontent.com/15102395/154212761-1ea57fa3-9cc9-4e92-b665-b22a25ecb180.png"/>

> To distribute the app automatically to the store, follow [this guide](https://docs.microsoft.com/en-us/appcenter/distribution/stores/googleplay).

## iOS setup

iOS builds will require `.mobileprovision` and `.p12` files. [Here's](https://docs.microsoft.com/en-us/appcenter/build/ios/code-signing) how to obtain them. Keep them somewhere safe and upload copies to AppCenter build config:

<img width="465" alt="Screenshot 2021-12-13 at 12 44 10" src="https://user-images.githubusercontent.com/15102395/145806541-104509d2-f81c-44bc-96f8-d53445557dd2.png"/>

### AppCenter iOS setup

To use signing in iOS builds, set the AppCenter build like so:

<img width="465" alt="Screenshot 2021-12-13 at 12 40 22" src="https://user-images.githubusercontent.com/15102395/145806568-aa100b39-3ad9-4aec-bfa2-765e20785cf4.png"/>
