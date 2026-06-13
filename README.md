# 💬 One Time Chat Room

> 🚀 A temporary WhatsApp-style chat room where conversations disappear when the room ends.

![Node.js](https://img.shields.io/badge/Node.js-Ready-green?style=for-the-badge\&logo=node.js)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real_Time-black?style=for-the-badge\&logo=socket.io)
![Privacy](https://img.shields.io/badge/Privacy-Temporary-blue?style=for-the-badge\&logo=shield)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

---

## 🌟 About

**One Time Chat Room** is a temporary real-time chat application that lets users create private chat rooms and share them instantly with friends.

No accounts. No registration. No permanent storage.

Simply:

✅ Create a room
✅ Share the link
✅ Chat in real time
✅ Send images
✅ End the room when finished

Once the creator ends the room, everything disappears forever.

---

## 🔒 Privacy First

This application is designed to be **temporary by nature**.

### What happens to your messages?

🗑️ Messages are stored only in server memory

🗑️ Images are stored only while the room is active

🗑️ Ending a room permanently removes all messages and images

🗑️ Restarting the server removes all active rooms

⚠️ Note: This project is **not end-to-end encrypted**. Messages pass through the server while the room is active.

---

## ✨ Features

### 💬 Real-Time Messaging

* Instant chat updates using Socket.IO
* WhatsApp-style chat experience

### 🔗 Shareable Rooms

* Create unique one-time chat rooms
* Share invite links instantly

### 🖼️ Image Sharing

* Send images up to approximately 3 MB
* View images directly in chat

### 👑 Creator Controls

* Only the room creator can end the chat
* One click destroys the room permanently

### 🚀 No Registration

* No accounts required
* Join instantly using a room link

---

## 📂 Project Structure

```text
📦 One-Time-Chat
├── 📄 package.json
├── 📄 server.js
├── 📁 public
│   ├── 📄 index.html
│   ├── 📄 styles.css
│   └── 📄 script.js
└── 📄 README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/One-Time-Chat.git
cd One-Time-Chat
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start the Server

```bash
npm start
```

### 4️⃣ Open in Browser

```text
http://localhost:3000
```

---

## 📖 How To Use

### Creating a Chat Room

1. Enter a room name
2. Enter your display name
3. Click **Create Chat Room**
4. Copy the invite link

### Joining a Chat Room

1. Open the shared invite link
2. Enter your display name
3. Start chatting instantly

### Ending a Chat Room

1. Creator clicks **End Chat**
2. Room is deleted
3. Messages disappear permanently
4. All participants are notified

---

## 🌐 Deployment

This project requires a **Node.js server** and cannot run on GitHub Pages.

### Recommended Hosting Platforms

🚂 Railway

🎨 Render

✈️ Fly.io

🔄 Replit

🌍 Glitch

🖥️ VPS Hosting

Deploy using:

```bash
npm install
npm start
```

The application automatically uses:

```javascript
process.env.PORT
```

allowing hosting providers to assign ports automatically.

---

## 🎨 Customization

### Change Colors & UI

```text
public/styles.css
```

### Change Website Content

```text
public/index.html
```

### Modify Chat Logic

```text
public/script.js
```

### Update Server Settings

```text
server.js
```

---

## 🚧 Future Improvements

* 🌙 Dark Mode
* 😀 Emoji Picker
* 🔔 Notifications
* 📁 File Sharing
* 🔐 Password-Protected Rooms
* 📱 Progressive Web App (PWA)

---

## ❤️ Contributing

Contributions are welcome!

Feel free to:

⭐ Star the repository

🍴 Fork the project

🐛 Report bugs

💡 Suggest new features

---

## 📜 License

This project is open-source and available under the MIT License.

---

<div align="center">

### 💬 Create • Share • Chat • Disappear

**Temporary conversations, permanent memories.**

⭐ If you like this project, consider giving it a star!

</div>
