import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "LifeOS",
  slug: "lifeos",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic", // Supports light/dark as per design spec
  // @ts-ignore - newArchEnabled is valid for Expo SDK 55
  newArchEnabled: false,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#F9FAFB",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.yourcompany.lifeos",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#F9FAFB",
    },
    package: "com.yourcompany.lifeos",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-font",
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: "35.0.0",
        },
        ios: {
          deploymentTarget: "15.1",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true, // Enables typed useRouter() and <Link href={...} />
  },
  extra: {
    eas: {
      projectId: "YOUR_EAS_PROJECT_ID", // Replace after running: eas init
    },
  },
  scheme: "lifeos", // Deep link scheme: lifeos://
});
