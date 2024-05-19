# Article_platform

Article_platform is a web application built with Node.js and Express, utilizing MongoDB for data storage. It features user authentication, article management, and admin functionalities, all styled with Bootstrap and vanilla JavaScript.

## Overview

The architecture of Article_platform is centered around a Node.js server using Express for handling HTTP requests. MongoDB serves as the database for storing user and article data. The application uses session-based authentication and does not implement JWT. EJS is used as the templating engine for rendering views, and Bootstrap provides the styling framework. The project structure is organized into models, routes, views, and public directories for clarity and maintainability.

## Features

- User registration and login without email verification or password recovery.
- Session-based authentication with the first registered user becoming an administrator.
- Home page displaying all article titles and publish dates.
- Admin panel accessible only to administrators, allowing for article deletion and creation.
- Article creation form with HTML content input and validation.
- Article pages with content display and a comment section.
- Comment functionality with reply options for users.

## Getting started

### Requirements

- Node.js and npm installed on your machine.
- MongoDB database setup.

### Quickstart

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Configure the `.env` file with your MongoDB URL and session secret.
4. Run the server with `npm start`.

### License

Copyright (c) 2024.