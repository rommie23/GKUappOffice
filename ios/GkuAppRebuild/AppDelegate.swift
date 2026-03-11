import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore
import FirebaseMessaging
import UserNotifications

@main
class AppDelegate: RCTAppDelegate,
                   UNUserNotificationCenterDelegate,
                   MessagingDelegate {

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    // 🔥 Firebase
    FirebaseApp.configure()

    // 🔔 Notifications
    UNUserNotificationCenter.current().delegate = self
    Messaging.messaging().delegate = self

    UNUserNotificationCenter.current().requestAuthorization(
      options: [.alert, .badge, .sound]
    ) { granted, _ in
      if granted {
        DispatchQueue.main.async {
          application.registerForRemoteNotifications()
        }
      }
    }

    // ⚛️ React Native setup
    self.dependencyProvider = RCTAppDependencyProvider()
    self.moduleName = "GkuAppRebuild"
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // ✅ REQUIRED by RN 0.81
  override func bundleURL() -> URL? {
  #if DEBUG
    return RCTBundleURLProvider.sharedSettings()
      .jsBundleURL(forBundleRoot: "index")
  #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  #endif
  }
  // MARK: ✅ APNs token
  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    Messaging.messaging().apnsToken = deviceToken
  }

  // MARK: ❌ APNs error
  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("❌ APNs registration failed:", error.localizedDescription)
  }

  // MARK: 🔥 FCM token
  func messaging(
    _ messaging: Messaging,
    didReceiveRegistrationToken fcmToken: String?
  ) {
    print("🔥 FCM TOKEN:", fcmToken ?? "nil")
  }

  // MARK: 🔔 Foreground notification
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler:
      @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .sound, .badge])
  }
}
