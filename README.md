# NewTwitter

NewTwitter is a social media application developed with Next.js and React. It simulates a microblogging platform with the key functionality of user registration, creating posts, and searching posts.

## Features

- **User Authentication**: Login and registration with JWT-based authentication.
- **Create and View Posts**: Users can create, view, and delete posts.
- **Search**: Search functionality with autocomplete feature.
- **Responsive Design**: Built with Tailwind CSS for a responsive UI.

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:TathanDev/NewTwitter.git
   ```

2. Navigate to the project directory:
   ```bash
   cd newtwitter
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Application

- **Development Mode**: 
  ```bash
  npm run dev
  ```
  This will start the server in development mode.

- **Building for Production**: 
  ```bash
  npm run build
  npm run start
  ```
  Build the app for production and start the production server.

## Technologies Used

- **Next.js**: Framework for server-rendered React applications.
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **SQLite3**: Relational database system.

## Security - Rate Limiting

The API implements rate limiting to prevent abuse. Limits are applied per IP address:

| Endpoint | Limit (requests/min) |
|----------|---------------------|
| `/api/search*` | 30 |
| `/api/messages/send` | 20 |
| `/api/auth/*` | 30 |
| `/api/getPosts`, `/api/posts` | 60 |
| `/api/user/*`, `/api/messages/*` | 60 |
| Other API routes | 100 |

When a limit is exceeded, the API returns `429 Too Many Requests` with headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds to wait before retrying

## Contributing

Feel free to fork the project and submit pull requests.

## License

This project is licensed under the MIT License.
