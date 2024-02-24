### Postaway API

This repository hosts the backend RESTful API for the Postaway application, serving as the foundation of a comprehensive social media platform. The API facilitates seamless sharing of posts, comments, and likes among users, while also providing functionality for managing user friendships.

### Features

- **User Management**: Sign up, sign in, log out, update password, get user details, and update user details.
- **Post Management**: Create, get all, get by ID, update, and delete posts.
- **Comment Management**: Get comments for a post, add a comment to a post, and delete a comment.
- **Like Management**: Get likes by ID and toggle like on a post.
- **Friendship Management**: Get friends by user ID, get pending friend requests, toggle friendship, and respond to friend requests.

### Technologies Used

- **Express**: Node.js web application framework for building APIs.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT**: JSON Web Tokens for user authentication.
- **Swagger UI Express**: Middleware for serving Swagger UI documentation.
- **File Upload Middleware**: Middleware for handling file uploads.
- **Logger Middleware**: Middleware for logging HTTP requests.

### API Documentation

The API documentation is available at [http://localhost:8000/api-docs](http://localhost:8000/api-docs) when the server is running.

### Getting Started

1. Clone this repository.
2. Install dependencies: `npm install`.
3. Start the server: `npm start`.
4. Access the API documentation in your browser: [http://localhost:8000/api-docs](http://localhost:8000/api-docs).
