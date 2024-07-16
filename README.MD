# Chat App

Welcome to Chat App! This application provides an intuitive, hassle-free platform to connect and communicate with friends and colleagues.

## Description

Chat App allows you to communicate effortlessly, sharing ideas and building stronger connections. The app is crafted with ❤️, combining a user-friendly interface with the power of the latest technologies.

## Key Features

- **Effortless Communication:** Connect with others and communicate seamlessly.
- **Intuitive Interface:** User-friendly design for a smooth chatting experience.
- **Idea Sharing:** Share and discuss ideas with ease.
- **Modern Technologies:** Built with the latest technologies for optimized performance.

## Dependencies

Here are some of the key dependencies used in this project:

- **next:** React framework for building web applications.
- **typescript:** Typed superset of JavaScript.
- **@upstash-redis:** Redis database management tool.
- **@tailwindcss:** CSS styling utility.
- **axios:** HTTP client for making requests.
- **react:** JavaScript library for building UI.
- **zod:** TypeScript-first schema declaration and validation library.
- **@headlessui/react:** UI components for React without styles.

Make sure to check the `package.json` file for a complete list of dependencies and their versions.

# Getting Started

To get started with Chat App, follow these steps:

## 1. Clone the repository.

## 2. Install dependencies using `npm install`.

## 3. Configure dependencies:

### a. Upstash Redis Setup:

Ensure you have an Upstash account and create a Redis database. Fill in the variables in the `.env` file:
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token

### b. Google OAuth Setup:

Create a project on Google Developers Console, enable the Google+ API, and obtain your credentials. Fill in the variables in the `.env` file:
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

### c. JWT Setup:

Fill in the variable in the `.env` file with a secret string to sign JWT tokens:
JWT_SECRET=secret

### d. NextAuth Setup:

Fill in the variables in the `.env` file with your application URL and a secret string for NextAuth:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=secret

### e. Pusher Setup:

Create an account on Pusher and obtain the credentials. Fill in the variables in the `.env` file:
PUSHER_APP_ID=your_pusher_id
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_key
PUSHER_APP_SECRET=your_pusher_secret

## 4. Run the application using `npm run dev`.

Feel free to explore and customize the application according to your needs!

# Technological Choices Made During Development

### Upstash (Redis)

I used Upstash for caching and real-time data storage. Its ease of use and efficient integration make it an ideal choice.

### NextAuth with Google Provider

NextAuth provides a simple and secure solution for social authentication, while integration with Google offers familiarity to users.

### Next.js

Next.js, a React framework, offers SSR and static pre-rendering for enhanced performance and user experience.

### Tailwind CSS

Tailwind CSS simplifies styling with its utility-first approach, providing flexibility and efficiency.

### React Hook Form

React Hook Form simplifies form management in React, making validation and data handling more efficient.

### Axios

Axios for HTTP requests.

### Zod

Zod, a TypeScript validation library, enhances data integrity and reliability.

### Vercel

Vercel provides an efficient, scalable hosting platform with continuous integration and automated deployment.

# Contributions

Contributions are welcome! If you encounter issues or have suggestions for improvements, open an issue or create a pull request.

Enjoy your chats! 🚀
