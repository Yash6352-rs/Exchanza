# 🔄 Exchanza – AI-Powered Skill & Service Exchange Platform

**Exchanza** is a React Native mobile application that enables users to exchange skills and services without money through a structured trading system.

Exchanza consists of two major modules: a **Mobile Application** and an **Admin Dashboard**.

The **Mobile Application**, built with React Native (Expo), is designed for users to create offer and request posts, discover exchange opportunities, send trade proposals, communicate through real-time chat, receive AI-powered trade insights, generate PDF trade summaries, and build trust through reviews and ratings.

The **Admin Dashboard**, built with React.js for the web, provides centralized platform management capabilities, including user moderation, post and trade moderation, tag management, analytics reporting, account restrictions, notification management, public announcements, report handling, and overall platform monitoring. Together, these modules create a complete ecosystem for managing skill and service exchanges in a secure and scalable manner.

Together, these modules create a complete ecosystem for managing skill and service exchanges while ensuring platform security, transparency, scalability, and a seamless user experience.
 
 ---

 Exchanza Ecosystem

 ## 🏗️ System Architecture

```text

📱 Mobile App (React Native + Expo)
    │
    ├── Authentication
    ├── Posts & Discovery
    ├── Trading System
    ├── Real-Time Chat
    ├── Reviews & Ratings
    ├── AI Trade Insights
    └── Notifications

                │
                ▼

🔥 Firebase Backend
    ├── Authentication
    ├── Firestore
    └── Realtime Database

                │
                ▼

💻 Admin Dashboard (React.js)
    ├── User Management
    ├── Trade Moderation
    ├── Post Moderation
    ├── Tag Management
    ├── Analytics
    ├── Reports Center
    ├── Notifications
    └── Public Announcements
```
---

## ✨ Features

### 👤 Authentication & Profiles

* Email & Password Authentication
* Google Sign-In
* User Onboarding Flow
* Skill-Based Profiles
* Cloudinary Profile Image Upload
* Public User Profiles

### 📢 Posts & Discovery

* Create Offer Posts
* Create Request Posts
* Dynamic Skill Tags
* Search & Filtering
* Real-Time Feed Updates
* User Discovery

### 🤝 Trade Management

* Trade Proposal System
* Incoming & Sent Requests
* Accept / Reject Trades
* Complete Trades
* Trade History Tracking
* Multi-Proposal Handling

### 💬 Real-Time Chat

* Private Trade-Based Messaging
* Firebase Realtime Database
* Secure Participant Validation
* Instant Message Updates

### ⭐ Reviews & Ratings

* Post-Trade Reviews
* Star Rating System
* Trust Score Calculation
* Reputation Building

### 🧠 AI Trade Insights

* Trade Fairness Analysis
* Risk Assessment
* AI Recommendations
* Smart Proposal Evaluation

### 🔔 Notifications

* Real-Time Notifications
* Deep Linking Support
* Unread Badge Counts
* Swipe Actions

### 📄 PDF Reports

* Trade Invoice Generation
* Download & Share Support
* Professional PDF Layouts

### 🎨 Personalization

* Light Theme
* Dark Theme
* System Theme Detection
* Notification Preferences

### 🛡️ Admin Dashboard

* User Management
* Tag Management
* Post Moderation
* Trade Moderation
* Reports Center
* Analytics Dashboard
* Notification (Send message or public annoucements)
* Platform Monitoring

---

## 📸 Screenshots 

### Mobile Module

### Authentication (Login Screen)
<img width="1080" height="2412" alt="Screenshot_2026-06-04-14-23-24-41_9358374868c113ebc9525f75b12c111a" src="https://github.com/user-attachments/assets/279857d2-a7d9-408c-a514-f0d4ef510fb9" />

### Home Feed
<img width="1080" height="2412" alt="Screenshot_2026-06-04-14-29-54-23_9358374868c113ebc9525f75b12c111a" src="https://github.com/user-attachments/assets/536633ee-b4ee-4af6-8f39-0a2ae7c54e44" />

### Trade Proposal
<img width="1080" height="2412" alt="Screenshot_2026-06-04-14-29-57-57_9358374868c113ebc9525f75b12c111a" src="https://github.com/user-attachments/assets/49caf96a-bd01-4b4b-aea9-2028d54336e2" />

### Create Post
<img width="1080" height="2412" alt="Screenshot_2026-06-04-14-30-01-94_9358374868c113ebc9525f75b12c111a" src="https://github.com/user-attachments/assets/f3e81e2e-a96e-4019-8642-0f91c9848dec" />

### Notification
<img width="1080" height="2412" alt="Screenshot_2026-06-04-14-30-05-50_9358374868c113ebc9525f75b12c111a" src="https://github.com/user-attachments/assets/a83b7afa-56a4-4212-ab85-1905a9b22141" />

### Profile Screen
<img width="1080" height="2412" alt="Screenshot_2026-06-04-14-30-10-47_9358374868c113ebc9525f75b12c111a" src="https://github.com/user-attachments/assets/d106eb4a-4239-409c-a6f0-5f5270de0953" />


---

## 📂 Project Structure

```bash
Exchanza/
│
├── exchanza-admin/
├── exchanza-mobile/
```

---

## 🧰 Tech Stack

### Mobile App

* React Native
* Expo
* TypeScript
* Expo Router

### Backend & Database

* Firebase Authentication
* Cloud Firestore
* Firebase Realtime Database

### Storage

* Cloudinary (For Images)

### AI Trade Insights

* AI-powered trade analysis using OpenRouter
* Analyzes post title, offer, and request details
* Helps users evaluate trades before sending proposals
* Generates:
  - AI Summary
  - Fairness Analysis
  - Risk Assessment
  - Additional Notes
* Highlights potential benefits and concerns
  
### PDF Generation

* Expo Print (for mobile app)
* Expo Sharing (for mobile app)
* Puppeteer (for web admin module)
* html2canvas (for web admin module)

### UI & Animations

* React Native Reanimated
* LayoutAnimation

### State Management

* React Context API

---

## 📊 Current Version

### Exchanza v1

Latest Highlights:

* AI Trade Insights
* Enhanced Trade Details
* Invoice Management
* Advanced Notification System
* Trade Workflow Improvements

---

## 🔗 Repositories

### Mobile Application

[Exchanza Mobile](https://github.com/Yash6352-rs/Exchanza/tree/main/exchanza-mobile)

### Admin Dashboard

[Exchanza Admin](https://github.com/Yash6352-rs/Exchanza/tree/main/exchanza-admin)

---

## 🚀 Vision

Exchanza aims to create a community-driven exchange economy where people can trade skills, knowledge, and services without money while ensuring trust, transparency, and intelligent decision-making through AI-powered insights.

---

## 👨‍💻 Developed By

**Yash Panchal**

Built with React Native, Firebase, AI, and modern mobile architecture.
