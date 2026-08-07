import PolicyShell from './PolicyShell';
import { policyFor } from './policies';

const meta = policyFor('luniva')!;

const LunivaPolicy = () => (
  <PolicyShell meta={meta}>
    <p>
      Luniva is made by Ajdin Pajazetović (Pajzo). This policy explains what
      happens to your information when you use the app. It is written to be
      read, not to be survived.
    </p>

    <h2>The short version</h2>
    <p>
      Luniva has no accounts, no sign-up, no analytics, no advertising, and no
      tracking of any kind. There is no server that belongs to us. Everything
      you write (your prayers, tasks, Qur&rsquo;an reading, dhikr, journal and
      reflections) is stored on your own device, and we never see it.
    </p>

    <h2>What Luniva stores on your device</h2>
    <p>All of it stays on your iPhone, in the app&rsquo;s own private storage:</p>
    <ul>
      <li>
        Your prayer records, tasks, Qur&rsquo;an reading log, dhikr counts and
        streaks
      </li>
      <li>
        Your morning check-in and evening reflection, including anything you
        write
      </li>
      <li>
        Your settings: calculation method, madhab, language, appearance,
        reminders, widget and Lock Screen preferences
      </li>
      <li>
        Your chosen location for prayer times (city name, coordinates and time
        zone)
      </li>
    </ul>
    <p>
      You can export all of it as a JSON file at any time (Settings → Data), and
      you can delete any day&rsquo;s entries from inside the app. Deleting the
      app removes everything it stored on the device.
    </p>

    <h2>Location</h2>
    <p>
      Luniva uses your location for one purpose: calculating accurate prayer
      times and pointing the Qibla compass. Location is requested only while you
      are using the app, at a coarse (roughly city-level) accuracy.
    </p>
    <p>
      Your coordinates are stored on your device only and are used to compute
      prayer times on your device. They are never sent to us, and we have no way
      to see them.
    </p>
    <p>
      When you pick a location, iOS&rsquo;s own geocoding service is used to
      turn the coordinates into a city name so the app can show it to you. That
      lookup is performed by Apple under Apple&rsquo;s privacy policy. You can
      also enter a city or coordinates by hand and skip this entirely. If you
      decline location access, the app keeps working; you simply set your
      location manually.
    </p>

    <h2>iCloud sync (optional, off by default)</h2>
    <p>
      If you turn on Sync with iCloud (Settings → Data), your Luniva data file
      is copied to your own private iCloud storage so your devices stay in step.
      That data lives in your personal Apple account, governed by
      Apple&rsquo;s privacy policy. We cannot access it, and it is not shared
      with us or anyone else. Turning the setting off stops syncing; you can
      remove the stored file at any time through iOS Settings → your name →
      iCloud → Manage Storage.
    </p>

    <h2>Qur&rsquo;an text</h2>
    <p>
      The Qur&rsquo;an text and translations are fetched from the public
      Quran.com API (<code>api.quran.com</code>) and then cached on your device
      so the app works offline. These requests contain only which page and
      translation are being requested. No personal information, and nothing you
      have written, is included. As with any internet request, the service can
      see your device&rsquo;s IP address. Quran.com&rsquo;s own privacy policy
      applies to that request. You can download the whole muṣḥaf once (Settings
      → Qur&rsquo;an) after which the app needs no network for reading at all.
    </p>

    <h2>AI features (optional, off by default, your own key)</h2>
    <p>
      Luniva has two optional AI features: writing your nightly reflection
      question, and an understanding check for what you have read of the
      Qur&rsquo;an. They are off unless you turn them on and add your own API
      key.
    </p>
    <p>If you enable them:</p>
    <ul>
      <li>
        Your key is stored in your device&rsquo;s Keychain. It is never included
        in your data file, your export, or any backup, and it is never sent to
        us.
      </li>
      <li>
        When a feature runs, the relevant text is sent directly from your device
        to the provider you chose: Anthropic (Claude), OpenAI (ChatGPT), Google
        (Gemini) or xAI (Grok). Specifically: for the nightly question, your
        evening check-in (mood, energy, the word you chose, and what you wrote
        about your day); for the Qur&rsquo;an check, the sūrah and āyāt
        concerned and your notes on them.
      </li>
      <li>
        That request goes to the provider under their privacy policy and terms,
        and any usage is billed to your account with them.
      </li>
      <li>
        Nothing is sent to us at any point, and nothing is sent to any provider
        while the feature is switched off.
      </li>
    </ul>
    <p>
      You can remove your key at any time in Settings, and the app returns to
      being entirely offline.
    </p>

    <h2>Notifications, alarms, widgets and Lock Screen</h2>
    <p>
      Prayer reminders, remembrance reminders and the Fajr alarm are local
      notifications and alarms scheduled by your device. There is no push server
      and no notification token is sent anywhere.
    </p>
    <p>
      Widgets, the Lock Screen Live Activity and the Dynamic Island read a small
      summary of today&rsquo;s data &mdash; the coming prayer, its time, and
      which prayers you have marked &mdash; through a private app group on your
      device. That data never leaves the device, and nothing about it is sent to
      us or to anyone else.
    </p>

    <h2>Face ID / Touch ID</h2>
    <p>
      If you clear a day&rsquo;s entries, iOS may ask you to confirm with Face
      ID, Touch ID or your passcode. That check is performed entirely by iOS.
      Luniva only receives a yes or no, and never sees your biometric data.
    </p>

    <h2>What we do not do</h2>
    <ul>
      <li>
        We do not collect, receive, transmit or store your personal data on any
        server of ours. We do not operate one.
      </li>
      <li>
        We do not use analytics, crash reporting SDKs, advertising, advertising
        identifiers, or any third-party tracking library. The app contains no
        third-party SDKs at all.
      </li>
      <li>
        We do not create user profiles, and we do not sell, rent or share
        personal data, because we never receive any.
      </li>
    </ul>

    <h2>Children</h2>
    <p>
      Luniva is suitable for general audiences and does not knowingly collect
      personal information from anyone, including children.
    </p>

    <h2>Your rights</h2>
    <p>
      Because your information stays on your device (and, if you choose, in your
      own iCloud account), you keep direct control of it: you can view, edit,
      export and delete everything from inside the app or by deleting the app.
    </p>
    <p>
      If you are in the European Economic Area or the United Kingdom, data
      protection law gives you rights of access, correction, erasure,
      restriction and portability. Since we do not receive or process your
      personal data, there is nothing held by us to disclose or erase, but you
      are welcome to contact us with any question, and we will help you exercise
      those rights against the data you hold on your own device.
    </p>

    <h2>Beta (TestFlight)</h2>
    <p>
      If you are using Luniva through TestFlight, Apple collects information
      about your participation and app crashes and shares aggregate crash and
      usage data with the developer under Apple&rsquo;s own privacy policy. That
      is Apple&rsquo;s process, not ours, and it does not include the contents of
      your journal, reflections or any other data you enter in the app.
    </p>

    <h2>Changes to this policy</h2>
    <p>
      If this policy changes, the new version will be posted here with an
      updated date. Material changes will be noted in the app.
    </p>

    <h2>Contact</h2>
    <p>Questions about this policy or about privacy in Luniva:</p>
    <p>
      <a className="inline" href="mailto:info@pajzo.com">
        info@pajzo.com
      </a>
      <br />
      Ajdin Pajazetović (Pajzo)
    </p>
  </PolicyShell>
);

export default LunivaPolicy;
