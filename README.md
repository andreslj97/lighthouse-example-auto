# ⚡ Lighthouse CI Automation

This project automates performance audits for multiple URLs using [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci). It saves each run in a timestamped directory for easy tracking and historical comparison.

---

## 📦 Requirements

- Node.js `v20` or higher
- Internet connection
- Access to the URLs you want to audit

---

## 🚀 Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

## 🔍 Configuration Breakdown

_lighthouserc.json_

| Key                | Description                                 |
| ------------------ | ------------------------------------------- |
| `url`              | List of URLs to audit.                      |
| `numberOfRuns`     | Times to run Lighthouse per URL (averaged). |
| `throttlingMethod` | Use `"provided"` to skip throttling.        |
| `formFactor`       | `"desktop"` or `"mobile"` testing.          |
| `screenEmulation`  | Custom viewport and device scale.           |
| `throttling`       | Simulate real-world network performance.    |
| `assertions`       | Set minimum performance score thresholds.   |
| `upload.outputDir` | Folder to store the reports.                |


## 📁 Script: `run-lighthouse.js`

This script generates timestamped folders automatically for every run to avoid overwriting reports.

### Add to your `package.json`:

```json
"scripts": {
  "lighthouse:run": "node run-lighthouse.js"
}
```

### Run it:

```bash
terminal
npm run lighthouse:run
```

Reports will be saved in:

```swift
.lighthouseci/lhr-{{ID}}
```


## 🌐 Cross-Platform

Compatible with:

* Windows ✅

* macOS ✅

* Linux ✅

No extra setup required.
