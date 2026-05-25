# 📱 MetricInfo

> **Field Sales & Attendance Management App**
> React Native CLI · TypeScript · v1.0.8

![React Native](https://img.shields.io/badge/React%20Native-0.73+-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React Navigation](https://img.shields.io/badge/React%20Navigation-v6-6C3FC5?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-22A96A?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.8-E08C1A?style=flat-square)

---

## 📋 Overview

**MetricInfo** is a production-grade field sales and attendance management app for field executives. Manage client visits, track daily attendance, and handle sales activities — all from one fast, clean mobile app.

---

## ✨ Features

| Screen | Key Features |
|---|---|
| 🏠 **Home** | Check-in / out toggle, duty status, current location, work hours summary, quick actions |
| 🏢 **Companies** | Paginated client list, live search, infinite scroll, nearby filter, FAB to add company |
| 📅 **Attendance** | Calendar grid, colour-coded statuses, tap-to-view day details, monthly summary |

**Attendance status colours:**

| Status | Colour |
|---|---|
| ✅ Present | Green |
| ❌ Absent | Red |
| 🌓 Half Day | Amber |
| 🏖️ Leave | Blue |
| 🎉 Holiday | Purple |

---

## 🗂️ Project Structure

```
MetricInfo/
├── App.tsx                            ← Entry point
└── src/
    ├── config/
    │   └── constants.ts               ← Colors, radii, base URL, pagination
    ├── utils/
    │   └── dateUtils.ts               ← getMonthRange, formatDisplayDate, todayISO
    ├── services/
    │   └── api.ts                     ← fetchClientList, fetchAttendance, normalizeArray
    ├── components/
    │   └── index.tsx                  ← LoadingView, ErrorView, EmptyView, ClientCard, AttendanceCard
    ├── screens/
    │   ├── HomeScreen.tsx             ← Dashboard
    │   ├── CompanyScreen.tsx          ← Client list
    │   └── AttendanceScreen.tsx       ← Calendar + details
    └── navigation/
        └── AppNavigator.tsx           ← Bottom tab navigator (5 tabs)
```

---

## 🛠️ Tech Stack

| Package | Purpose |
|---|---|
| `react-native` | Cross-platform iOS & Android framework |
| `typescript` | Static typing and interfaces |
| `@react-navigation/native` | NavigationContainer |
| `@react-navigation/bottom-tabs` | 5-tab bottom navigator |
| `react-native-screens` | Native screen optimisation |
| `react-native-safe-area-context` | Notch & home bar support |
| `react-native-gesture-handler` | Swipe & gesture navigation |

---

## 🚀 Installation

```bash
# 1 — Install navigation + native packages
npm install @react-navigation/native @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context \
  react-native-gesture-handler

# 2 — TypeScript dev dependencies
npm install --save-dev typescript @types/react @types/react-native

# 3 — iOS pods
cd ios && pod install && cd ..

# 4 — Run
npx react-native run-android
npx react-native run-ios
```

---

## 🌐 API Reference

**Base URL:** `https://apex.metricinfo.com/ords/accounts`

| Endpoint | Method | Description |
|---|---|---|
| `/clientlist/getclient` | GET | Paginated client list for an employee |
| `/attendance/getdaywise` | GET | Day-wise attendance for a date range |

**Default config:**

```
SUBSCRIPTION_ID  =  SUB22106
USER_ID          =  177
EMPLOYEE_ID      =  177
ITEMS_PER_PAGE   =  20
```

---

## 📜 Scripts

```bash
npm start                              # Start Metro bundler
npx react-native run-android           # Run on Android
npx react-native run-ios               # Run on iOS
npx react-native start --reset-cache   # Clear Metro cache
npx tsc --noEmit                       # TypeScript type check
```

---

## 👨‍💻 Author

| | |
|---|---|
| **Name** | Imran Ali |
| **Experience** | 1+ Year — React Native CLI, TypeScript, REST API Integration |
| **Assignment** | Lobotus Technologies |
| **Skills** | React Native · TypeScript · React Navigation · REST APIs · Git |
| **Version** | v1.0.8 |

---

*Built with React Native CLI + TypeScript*
