# BPS Energy Charging Stations App 🔌

<div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0;">
  <img src="https://is2-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/d0/50/28/d0502890-a178-6313-c137-1fbc20b6e643/1-1242_U04452688.jpg/0x0ss.png" style="height: 300px; width: auto;">
  <img src="https://is2-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/20/a3/4f/20a34fed-f457-2090-2765-89a939d5e6e6/4-1242_U04452688.jpg/0x0ss.png" style="height: 300px; width: auto;">
  <img src="https://is2-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/4a/cd/b5/4acdb5fb-2b59-399f-94d0-9fcd0ac90f2d/5-1242_U04452688.jpg/0x0ss.png" style="height: 300px; width: auto;">
  <img src="https://is2-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/3a/13/f8/3a13f86b-1d34-b44e-5662-775e9c5e8339/2-1242_U04452688.jpg/0x0ss.png" style="height: 300px; width: auto;">
  <img src="https://is2-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/db/6a/25/db6a25ab-071a-ba35-7b65-6e3a2ec71433/3-1242_U04452688.jpg/0x0ss.png" style="height: 300px; width: auto;">
</div>

A comprehensive mobile application for managing electric vehicle charging stations with real-time session monitoring, secure payment processing, and seamless user experience.

## Features ✨

- **Charging Station Management** 🔋  
  Find and manage charging stations with interactive maps, real-time availability, and detailed station information using Yandex Maps integration.

- **Real-Time Charging Sessions** ⚡  
  Monitor active charging sessions with live updates on power consumption, battery level, charging duration, and cost. Support for multiple simultaneous charging sessions.

- **Secure Payment Processing** 💳  
  Integrated payment acquiring via bePaid for seamless balance top-ups. Save payment cards for quick transactions and manage multiple payment methods.

- **Theme Support** 🌓  
  Beautiful light and dark themes with automatic system theme detection. Smooth theme switching with haptic feedback for enhanced user experience.

- **Multi-Language Support** 🌍  
  Built-in internationalization with `i18next` supporting Russian, English, and Chinese languages. Easy language switching from profile settings.

- **Push Notifications** 🔔  
  Instant updates for charging session status, balance changes, and important alerts via Firebase Cloud Messaging and Notifee. Configurable notification preferences.

- **Interactive Maps** 🗺️  
  Discover charging stations with clustered markers, real-time location tracking, and navigation support. Filter stations by power, availability, and connector types.

- **QR Code Scanning** 📷  
  Quick station access via QR code scanning using device camera. Deep linking support for seamless navigation.

- **Transaction History** 📊  
  Comprehensive history of charging sessions and balance transactions with detailed filtering and date range selection.

- **User Authentication** 🔒  
  Secure OTP-based authentication flow with phone number verification using `react-native-otp-entry`.

- **Card Management** 💰  
  Save and manage multiple payment cards for convenient balance top-ups. Quick access to saved cards from profile.

- **Support Service Integration** 💬  
  Direct integration with support service (Telegram) for instant assistance during charging sessions.

- **Haptic Feedback** 📳  
  Enhanced UX with tactile responses for critical actions and notifications.

- **Offline Support** 📶  
  Graceful handling of network connectivity with automatic data synchronization when back online.

## Tech Stack ⚙️

- **Frontend**: React Native (v0.75.5), Zustand (state management), Immer (immutable updates)
- **Navigation**: React Navigation (tabs, stacks, gestures)
- **Maps**: React Native Yamap (Yandex Maps integration)
- **Payment**: bePaid payment gateway integration via WebView
- **APIs**: Axios with retry logic (`axios-retry`) for reliable communication
- **Styling**: React Native Reanimated, Gesture Handler for smooth animations
- **Internationalization**: i18next with AsyncStorage persistence
- **Notifications**: Firebase Cloud Messaging, Notifee for local notifications
- **Camera**: React Native Vision Camera for QR code scanning
- **Forms**: React Hook Form for form management and validation
- **Error Tracking**: Sentry for crash reporting and error monitoring
- **Dev Tools**: ESLint, Prettier, Jest, TypeScript

This is a [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Prerequisites

- Node.js >= 18
- React Native development environment set up
- iOS: Xcode and CocoaPods
- Android: Android Studio and Android SDK

## Step 1: Install Dependencies

Install project dependencies:

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

For iOS, install CocoaPods dependencies:

```bash
cd ios && pod install && cd ..
```

## Step 2: Configure Environment

Create a `.env` file in the root directory with the following variables:

```env
API_HOST=your_api_host
YA_MAP_API_KEY=your_yandex_map_api_key
SENTRY_DSN=your_sentry_dsn
```

## Step 3: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 4: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 5: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Build Commands

### Android

```bash
# Build APK
npm run build:apk

# Build AAB (App Bundle)
npm run build:aab

# Open APK output folder
npm run open-apk

# Open AAB output folder
npm run open-aab
```

### Version Management

```bash
# Bump patch version (1.0.0 -> 1.0.1)
npm run bump:patch

# Bump minor version (1.0.0 -> 1.1.0)
npm run bump:minor

# Bump major version (1.0.0 -> 2.0.0)
npm run bump:major
```

## Internationalization

The app supports multiple languages (Russian, English, Chinese). Translation files are located in `src/i18n/`.

```bash
# Generate TypeScript interfaces for translations
npm run interface

# Generate table of contents for translations
npm run toc
```

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Common Issues

- **Metro bundler issues**: Try clearing cache with `npm start -- --reset-cache`
- **iOS build errors**: Run `cd ios && pod install && cd ..` to reinstall CocoaPods dependencies
- **Android build errors**: Clean build with `cd android && ./gradlew clean && cd ..`
- **Environment variables not loading**: Ensure `.env` file exists in the root directory

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

## Project Structure

```
src/
├── api/              # API configuration and endpoints
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization resources
├── navigation/      # Navigation configuration
├── providers/       # Context providers (Auth, Camera)
├── screens/         # Screen components
├── service/         # Business logic services
├── store/           # Zustand stores
├── theme/           # Theme configuration
├── ui/              # UI components library
├── utils/           # Utility functions
└── widgets/         # Complex UI widgets
```
