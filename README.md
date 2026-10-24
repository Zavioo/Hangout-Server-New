# Hangout Server

Hangout Server is the Node.js/Express backend for a social app. It provides user accounts and profiles, posts with media, likes and comments, friend lists, saved posts, and one-to-one chats. MongoDB stores application data, and Socket.IO provides real-time chat events.

## Tech stack

- Node.js and Express
- MongoDB with Mongoose
- JSON Web Tokens and bcrypt
- Multer for uploaded media
- Socket.IO for real-time messaging

## Getting started

### Prerequisites

- Node.js and npm
- A MongoDB connection string

### Install

```bash
npm install
```

Create a `.env` file in the project root:

```env
DBCONNECTIONSTRING=your-mongodb-connection-string
JWTPASSWORD=your-jwt-signing-secret
```

Start the server:

```bash
node index.js
```

The server listens on port `3000`. The root URL (`http://localhost:3000/`) returns a status message. Uploaded files are served from `/uploads`.

## HTTP API

All routes use the server's base URL, for example `http://localhost:3000`. JSON request bodies are expected unless a route accepts a file. Routes marked **JWT** require an `Authorization` header using the `Bearer` scheme; the token is returned by the login endpoint.

| Method | Path | Purpose | Auth |
| --- | --- | --- | --- |
| `POST` | `/register` | Register a user. Body: `username`, `name`, `email`, `password`. | No |
| `POST` | `/login` | Log in. Body: `email`, `password`. Returns user data and a token. | No |
| `PUT` | `/edit-user` | Update the logged-in user's profile. Supports `profilePic` file upload and profile fields. | JWT |
| `POST` | `/add-post` | Create a post. Supports a `media` file and `username`, `title`, `description` fields. | JWT |
| `GET` | `/all-posts` | Get posts. Optional query: `search` to search titles. | No |
| `PUT` | `/post/:id/edit` | Update a post. Supports a `media` file and post fields. | JWT |
| `DELETE` | `/post/:id/remove` | Delete a post. | JWT |
| `PUT` | `/post/:id/like` | Toggle the authenticated user's like on a post. | JWT |
| `PUT` | `/post/:id/comments` | Add a comment. Body: `userId`, `comment`, `username`, `userProfilePic`. | JWT |
| `DELETE` | `/post/:id/removecomments` | Remove a comment. Body: `postId`; `id` is the comment ID. | No |
| `GET` | `/getuserposts/:id` | Get posts for a user. | No |
| `PUT` | `/user/:id/friends` | Toggle a friend. Body: `userId` is the other user's ID. | JWT |
| `GET` | `/user/:id` | Get a user's friends. | No |
| `GET` | `/users/all` | Get users. Optional query: `search` to search names. | No |
| `PUT` | `/user/:id/savepost` | Toggle a post in a user's saved posts. Body: `userId`. | No |
| `POST` | `/user/:id/openchat` | Find or create a chat with the user in `:id`. Body: `userId` is the other user ID. | No |
| `POST` | `/user/createmassage` | Create a message. Body: `sender`, `content`, `ChatId`. | No |
| `GET` | `/user/:id/fetchallmassages` | Fetch messages for a chat. | No |

Files uploaded as `media` or `profilePic` are stored under `uploads/`. Use the returned filename at `/uploads/<filename>` to access an uploaded file.

## Real-time chat

Connect a Socket.IO client to the server and use these events:

- Emit `join room` with a chat ID to join that chat room.
- Emit `chat message` with a message object containing `ChatId` to send it to the other clients in that room.
- Listen for `receive message` to receive messages from the room.

The HTTP message endpoint stores messages in MongoDB; the `chat message` socket event broadcasts to the room.
