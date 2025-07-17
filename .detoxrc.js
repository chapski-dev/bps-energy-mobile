/** @type {Detox.DetoxConfig} */
module.exports = {
  apps: {
    'android.debug': {
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [
        8081
      ],
      type: 'android.apk'
    },
    'android.release': {
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
      type: 'android.apk'
    },
    'ios.debug': {
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/BPS Energy.app',
      build: 'xcodebuild -workspace ios/bpsenergy.xcworkspace -scheme bpsenergy -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.app'
    },
    'ios.release': {
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/bpsenergy.app',
      build: 'xcodebuild -workspace ios/bpsenergy.xcworkspace -scheme bpsenergy -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.app'
    }
  },
  behavior: {
    init: {
      reinstallApp: true
    },
    launchApp: 'auto'
  },
  configurations: {
    'android.att.debug': {
      app: 'android.debug',
      device: 'attached'
    },
    'android.att.release': {
      app: 'android.release',
      device: 'attached'
    },
    'android.emu.debug': {
      app: 'android.debug',
      device: 'emulator'
    },
    'android.emu.release': {
      app: 'android.release',
      device: 'emulator'
    },
    'ios.sim.debug': {
      app: 'ios.debug',
      device: 'simulator'
    },
    'ios.sim.release': {
      app: 'ios.release',
      device: 'simulator'
    }
  },
  devices: {
    attached: {
      device: {
        adbName: '.*'
      },
      type: 'android.attached'
    },
    emulator: {
      bootArgs: '-verbose -no-snapshot -wipe-data',
      device: {
        avdName: 'Pixel_9'
      },
      type: 'android.emulator'
    },
    simulator: {
      device: {
        type: 'iPhone 15 Pro'
      },
      type: 'ios.simulator'
    }
  },
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 300000,
      teardownTimeout: 30000
    }
  }
};