# Brahma Muhurta Background Alarm

The alarm uses Web Push so the browser can display a notification while the PWA is closed. It is not a native Android/iOS alarm: the browser, operating system, network, and power-saving policy control final delivery time. On iOS, users generally need to install the site as a Home Screen web app and grant notification permission.

## Server setup

Install the backend dependencies from `requirements.txt`, then configure these environment variables on the API service:

- `VAPID_PUBLIC_KEY`: URL-safe base64 public key from a VAPID key pair.
- `VAPID_PRIVATE_KEY`: matching URL-safe base64 private key. Keep this secret and out of source control.
- `VAPID_SUBJECT`: contact URI, preferably `mailto:your-operations-email@example.org`.

Generate a pair with `npx web-push generate-vapid-keys`; use its `publicKey` and `privateKey` values. The API verifies the pair before advertising background delivery as available.

The API process runs a MongoDB-backed scheduler that checks due alarms every five seconds, sends a Web Push notification, and calculates the next local-day alarm from the saved coordinates and IANA timezone. Keep the API process and MongoDB available continuously. Deploy the frontend and API over HTTPS; the browser must grant notification and location permission. Multiple API workers are supported through atomic MongoDB claims.

Alarm subscription records include the browser push endpoint and the user's coordinates so sunrise can be calculated. Turning the home-page switch off deletes that record and unsubscribes the browser.