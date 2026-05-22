# Rakshak AI - PWA Installation Guide

## Table of Contents

1. [What is a PWA?](#what-is-a-pwa)
2. [PWA Features in Rakshak AI](#pwa-features-in-rakshak-ai)
3. [Installation Instructions](#installation-instructions)
4. [Platform-Specific Instructions](#platform-specific-instructions)
5. [Offline Functionality](#offline-functionality)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## What is a PWA?

A Progressive Web App (PWA) is a web application that provides a native app-like experience through the web. Rakshak AI is built as a PWA to ensure it works reliably in emergency situations, even with poor or no internet connectivity.

### Key Benefits

- **Works Offline:** Critical for emergency situations in dead zones
- **Installable:** Can be installed on home screen like a native app
- **Fast Loading:** Optimized for quick access during emergencies
- **Push Notifications:** Can send alerts even when app is closed
- **Auto-Updates:** Updates automatically in the background
- **Cross-Platform:** Works on iOS, Android, and desktop

---

## PWA Features in Rakshak AI

### Offline Capabilities

- **Cached Emergency Data:** Nearby hospitals, police stations cached locally
- **Map Tiles:** Map tiles cached for offline navigation
- **Emergency Forms:** SOS forms work without internet
- **Location Tracking:** Continues tracking location when offline
- **Sync on Reconnect:** Automatically syncs data when connection restored

### Installation Features

- **Add to Home Screen:** One-tap installation on supported devices
- **App Icon:** Custom app icon for easy identification
- **Splash Screen:** Branded splash screen on launch
- **Full Screen:** Runs in full-screen mode like native app
- **Status Bar:** Custom status bar color for branding

---

## Installation Instructions

### General Requirements

- **HTTPS Required:** PWAs only work over HTTPS (or localhost)
- **Supported Browser:** Chrome, Edge, Safari, Firefox (latest versions)
- **Storage Permission:** May need storage permission for caching
- **Location Permission:** Required for GPS features

---

## Platform-Specific Instructions

### Android (Chrome)

#### Method 1: Automatic Install Prompt

1. Open Rakshak AI in Chrome
2. Look for the "Add to Home Screen" banner at the bottom
3. Tap "Install"
4. Confirm installation
5. App will be added to home screen

#### Method 2: Manual Installation

1. Open Rakshak AI in Chrome
2. Tap the three-dot menu (⋮) in the top-right
3. Select "Add to Home screen"
4. Confirm installation
5. App will be added to home screen

#### Method 3: Desktop Mode

1. Open Rakshak AI in Chrome
2. Tap the three-dot menu (⋮)
3. Select "Install app" or "Add to Home screen"
4. Confirm installation

### iOS (Safari)

#### Installation Steps

1. Open Rakshak AI in Safari (Chrome won't show install prompt)
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top-right corner
5. App will be added to home screen

#### Important Notes for iOS

- **Safari Only:** Install prompt only appears in Safari
- **No Auto-Prompt:** iOS doesn't show automatic install banners
- **Manual Only:** Must manually add to home screen
- **Full Screen:** Runs in full-screen mode when launched from home screen

### Desktop (Chrome/Edge)

#### Chrome Installation

1. Open Rakshak AI in Chrome
2. Look for install icon in address bar (⊕)
3. Click the install icon
4. Click "Install" in the dialog
5. App will be installed and can be launched from desktop

#### Edge Installation

1. Open Rakshak AI in Edge
2. Look for "App available" icon in address bar
3. Click the icon
4. Click "Install"
5. App will be installed

#### Firefox Installation

1. Open Rakshak AI in Firefox
2. Click the site identity icon (lock) in address bar
3. Click "Install" or "Add to Home Screen"
4. Confirm installation

---

## Offline Functionality

### What Works Offline

- **SOS Trigger:** Can trigger SOS without internet
- **Location Tracking:** GPS continues to work
- **Cached POI Data:** View cached hospitals, police stations
- **Cached Map Tiles:** View cached map tiles
- **Emergency Forms:** Fill out forms offline
- **AI Safety Analysis:** Risk assessment works offline

### What Requires Internet

- **Real-time Updates:** Guardian notifications need connection
- **Trip Sharing:** Live tracking requires connection
- **New POI Search:** Can't search for new locations
- **Visual Triage:** Camera uploads need connection
- **Database Sync:** Data sync requires connection

### Offline Data Sync

When you regain internet connection:

1. **Automatic Sync:** Queued requests automatically retry
2. **Location History:** Syncs location breadcrumbs
3. **Emergency Events:** Syncs any offline SOS events
4. **Cache Updates:** Updates cached POI data
5. **Map Tiles:** Downloads new map tiles for current area

---

## Troubleshooting

### Install Prompt Not Showing

**Android/Chrome:**
- Check if app is already installed
- Clear browser cache and cookies
- Try in incognito mode
- Check if HTTPS is enabled
- Verify service worker is registered

**iOS/Safari:**
- Remember iOS doesn't show auto-prompts
- Use manual installation method
- Ensure you're using Safari (not Chrome)
- Check if app is already installed
- Clear Safari cache

### App Won't Install

**Common Solutions:**
1. Check browser compatibility
2. Verify HTTPS is enabled
3. Clear browser cache
4. Try different browser
5. Check available storage space
6. Restart browser

### Service Worker Issues

**Check Service Worker Status:**

1. Open DevTools (F12)
2. Go to Application tab
3. Check Service Workers section
4. Verify service worker is active
5. Check for errors in console

**Reinstall Service Worker:**
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  registrations.forEach(function(registration) {
    registration.unregister();
  });
});
```

### Offline Mode Not Working

**Troubleshooting Steps:**

1. Check IndexedDB is enabled
2. Verify service worker is active
3. Check cache is populated
4. Test in incognito mode
5. Check browser console for errors
6. Verify storage permission granted

### Cache Issues

**Clear Cache:**
```javascript
// In browser console
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
  }
});
```

**Clear IndexedDB:**
```javascript
// In browser console
indexedDB.deleteDatabase('RakshakOfflineDB');
```

---

## Best Practices

### For Users

1. **Install the App:** Install for best experience
2. **Grant Permissions:** Allow location and storage permissions
3. **Keep Updated:** Allow automatic updates
4. **Test Offline:** Test offline functionality periodically
5. **Report Issues:** Report any problems with offline mode

### For Developers

1. **Test on Real Devices:** Test on actual mobile devices
2. **Test Offline:** Test offline functionality thoroughly
3. **Monitor Cache:** Monitor cache size and usage
4. **Update Service Worker:** Update service worker carefully
5. **Test Updates:** Test update mechanism

### For Hackathon Demo

1. **Pre-Install:** Install app before demo
2. **Test Offline:** Demonstrate offline capabilities
3. **Show Installation:** Show installation process
4. **Highlight PWA Features:** Emphasize offline capabilities
5. **Demonstrate Sync:** Show data sync on reconnection

---

## PWA Configuration

### Manifest File

The app manifest is configured in `public/manifest.json`:

```json
{
  "name": "Rakshak AI",
  "short_name": "Rakshak",
  "description": "AI-Powered Emergency Response",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#ef4444",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker

The service worker is configured in `public/service-worker.js`:

- Caches static assets
- Caches map tiles
- Caches API responses
- Handles offline fallbacks
- Implements cache strategies

---

## Testing PWA Functionality

### Lighthouse PWA Audit

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Progressive Web App" category
4. Run audit
5. Review results and fix issues

### Manual Testing Checklist

- [ ] Install prompt appears (on supported browsers)
- [ ] App installs successfully
- [ ] App launches from home screen
- [ ] App runs in full-screen mode
- [ ] App works offline
- [ ] Cache functions properly
- [ ] Service worker is active
- [ ] Updates download automatically
- [ ] App icon displays correctly
- [ ] Splash screen displays correctly

### Offline Testing

1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" throttling
4. Test app functionality
5. Verify offline features work
6. Reconnect and verify sync

---

## Updates and Maintenance

### Automatic Updates

The PWA automatically checks for updates:

- **On Launch:** Checks for updates when app opens
- **Background:** Downloads updates in background
- **Activation:** Activates updates on next launch
- **No User Action:** Updates happen automatically

### Manual Update Check

```javascript
// In browser console
navigator.serviceWorker.getRegistration().then(function(registration) {
  registration.update();
});
```

### Update Strategy

1. **Version Service Worker:** Update service worker version
2. **Update Manifest:** Update manifest with new version
3. **Test Updates:** Test update mechanism
4. **Deploy:** Deploy new version
5. **Monitor:** Monitor update success rate

---

## Security Considerations

### HTTPS Requirement

- **Required:** PWAs only work over HTTPS
- **Localhost:** Exception for development
- **SSL Certificate:** Required for production
- **Mixed Content:** Avoid mixed content (HTTP/HTTPS)

### Data Security

- **Encrypted Storage:** Consider encrypting cached data
- **Secure Storage:** Use secure storage for sensitive data
- **Clear on Uninstall:** Clear data on app uninstall
- **Privacy:** Respect user privacy preferences

---

## Performance Optimization

### Cache Strategies

- **Cache First:** For static assets
- **Network First:** For API calls
- **Stale While Revalidate:** For frequently updated data
- **Cache Only:** For offline-only resources

### Bundle Size

- **Code Splitting:** Split code into smaller chunks
- **Lazy Loading:** Load features on demand
- **Tree Shaking:** Remove unused code
- **Minification:** Minify JavaScript and CSS

### Asset Optimization

- **Image Optimization:** Optimize images
- **Font Optimization:** Optimize fonts
- **Compression:** Use gzip/brotli compression
- **CDN:** Use CDN for static assets

---

## Browser Compatibility

### Supported Browsers

- **Chrome:** Full support (recommended)
- **Edge:** Full support
- **Firefox:** Full support
- **Safari:** Full support (iOS requires manual install)
- **Opera:** Full support

### Unsupported Browsers

- **IE11:** Not supported
- **Old Safari:** Version < 11.3 not supported
- **Old Chrome:** Version < 70 not supported
- **Old Firefox:** Version < 65 not supported

### Feature Detection

The app includes feature detection for PWA features:

```javascript
if ('serviceWorker' in navigator) {
  // Service worker supported
}

if ('indexedDB' in window) {
  // IndexedDB supported
}

if ('caches' in window) {
  // Cache API supported
}
```

---

## Accessibility

### PWA Accessibility

- **Keyboard Navigation:** Full keyboard support
- **Screen Reader:** Screen reader compatible
- **High Contrast:** High contrast mode support
- **Text Scaling:** Text scaling support
- **Reduced Motion:** Respects prefers-reduced-motion

### Testing Accessibility

1. Test with screen reader
2. Test keyboard navigation
3. Test with high contrast mode
4. Test with text scaling
5. Test with reduced motion

---

## Analytics and Monitoring

### PWA Analytics

Track PWA-specific metrics:

- **Install Rate:** Track app installation rate
- **Offline Usage:** Track offline usage patterns
- **Cache Hit Rate:** Monitor cache effectiveness
- **Service Worker Errors:** Track SW errors
- **Update Success Rate:** Track update success

### Monitoring Tools

- **Lighthouse:** PWA audit
- **Chrome DevTools:** Service Worker debugging
- **Safari Web Inspector:** iOS debugging
- **Firebase Analytics:** User analytics
- **Sentry:** Error tracking

---

## FAQ

### Q: Why won't the install prompt appear?

A: Install prompts only appear on certain conditions:
- Must be served over HTTPS
- Must have a valid manifest
- Must have a registered service worker
- User must have visited site at least twice
- User must have spent time on site
- iOS doesn't show auto-prompts (manual only)

### Q: Can I use the PWA offline indefinitely?

A: Yes, but with limitations:
- Cached data expires after 7 days
- Map tiles expire after 7 days
- POI data expires after 24 hours
- Some features require internet
- Data syncs when connection restored

### Q: How do I uninstall the PWA?

A: Uninstall like any app:
- **Android:** Long-press app icon → Uninstall
- **iOS:** Long-press app icon → Remove App
- **Desktop:** Uninstall from browser settings

### Q: Will the PWA work on all devices?

A: Most modern devices support PWAs:
- Android 5.0+ (Chrome)
- iOS 11.3+ (Safari)
- Windows 10+ (Chrome/Edge)
- macOS (Chrome/Edge/Safari)
- Linux (Chrome/Firefox)

### Q: How much storage does the PWA use?

A: Storage usage varies:
- **Base App:** ~5MB
- **Cached Data:** Up to 50MB (configurable)
- **Map Tiles:** ~10-20MB per area
- **POI Data:** ~1-5MB
- **Total:** ~20-80MB depending on usage

---

## Support

### Documentation

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

### Community

- [PWA Slack](https://bit.ly/pwa-slack)
- [PWA Twitter](https://twitter.com/pwa)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/pwa)

### Issues

Report PWA-specific issues:
- GitHub Issues: [Rakshak AI Issues](https://github.com/yourusername/rakshak-ai/issues)
- Include browser version
- Include device information
- Include steps to reproduce

---

## Version History

- **v1.0.0** - Initial PWA implementation
- **v1.1.0** - Enhanced offline capabilities
- **v1.2.0** - Improved caching strategies
- **v1.3.0** - Added update mechanism
