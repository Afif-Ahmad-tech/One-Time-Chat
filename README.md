# One Time Chat Room

A temporary WhatsApp-style chat room website. A user can create a one-time room, share the invite link, chat with anyone who joins, send pictures, and end the room. When the creator ends the room, the room is deleted from server memory and everyone sees that the chat has ended.

## Important Privacy Note

This app stores chats only in server memory. It does not write messages or pictures to a database or file.

That means:

- Ending a room deletes its messages and pictures from memory.
- Restarting the server deletes all active rooms.
- The app is temporary by design.
- This is not end-to-end encrypted. The server temporarily handles messages while the room is active.

## Features

- Create one-time chat rooms.
- Share room links.
- Anyone with the link can join.
- WhatsApp-style chat layout.
- Text messages.
- Picture messages up to about 3 MB.
- Creator-only `End chat` button.
- No chat history after the room is ended.

## Project Files

```text
package.json          Node.js dependencies and start script
server.js             Express and Socket.IO server
public/index.html     Website structure
public/styles.css     Website styling
public/script.js      Browser chat logic
README.md             Project instructions
```

## Run Locally

Install Node.js first. Then run:

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## How To Use

1. Open the website.
2. Enter a room name and your display name.
3. Click `Create chat room`.
4. Click `Copy link`.
5. Share that link with other people.
6. Chat and send pictures.
7. As the creator, click `End chat` when finished.

After the creator ends the chat, the room and its messages are gone.

## Deploying

This app needs a Node.js server, so it will not work as a normal static GitHub Pages site.

You can upload the repository to GitHub, then deploy it to a Node-friendly host such as:

- Render
- Railway
- Fly.io
- Glitch
- Replit
- A VPS

For most hosts:

```bash
npm install
npm start
```

The app uses `process.env.PORT` when available, so hosting platforms can choose the port automatically.

## GitHub Repository Setup

1. Create a new GitHub repository.
2. Upload all files and folders from this project.
3. Commit the files.
4. Deploy the repository to a Node.js hosting service.

Do not use GitHub Pages for this project because GitHub Pages cannot run the live chat server.

## Customization

- Edit colors and layout in `public/styles.css`.
- Edit the home page text in `public/index.html`.
- Change message/image limits in `server.js`.
- Change app behavior in `public/script.js`.
