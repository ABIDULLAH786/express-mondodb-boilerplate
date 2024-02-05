# **Node.js Application README**

# Overview

This is a Node.js application that runs on http://localhost:4545/. It provides various endpoints for users to perform CRUD operations on a database.

<br>

# Prerequisites

Before running the application, please ensure that you have the following software installed on your computer:

- Node.js (version X.X.X) 
- NPM (version X.X.X) 

<br>

# Getting Started

To get started with the application, follow these steps:

- Clone the repository to your local machine.
- Open a terminal window and navigate to the root directory of the application.
- Run `npm install` to install all dependencies.
- Run `npm start` to start the application.
- Open a web browser and navigate to `http://localhost:4545/`.

<br>

# API Endpoints

The following API endpoints are available:

- POST /api/v1/users/register => register new user.
- POST /api/v1/users/login => login user.
- GET /api/v1/users/profile/:id => Retrieves user profile from the database by ID.
- PUT /api/v1/users/profile/:id => Updates an existing user in the database
- DELETE /api/v1/users/profile/:id => Deletes a user from the database.

<br>

# Authentication

The API endpoints are protected by JWT authentication. To access the endpoints, you must include a valid JWT token in the Authorization header of your requests.

<br>

# Error Handling

If an error occurs, the API will return an error response in JSON format. Please refer to the [API documentation](./APIDocumentation.md) for the list of possible error responses and their meanings.

# License

This project is licensed under the MIT License.
