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

All screenshots are available in the **Output folder**.

You can also view them on **Google Drive**:
https://drive.google.com/drive/folders/1DY-fjmTFbVdPTeCAtUiWdiov0HmJmKW-?usp=drive_link

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
