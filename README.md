# Suggesto Server

A Node.js Express server application that provides a recommendation system backend, allowing users to create queries and receive recommendations from other users.

## Live URL


## Purpose

Suggesto Server is a backend API that facilitates a community-driven recommendation platform. Users can post queries asking for product recommendations, and other users can provide suggestions with detailed explanations. The system tracks recommendation counts and provides various endpoints to manage users, queries, and recommendations.

## Key Features

- **User Management**: Complete user registration and profile management
- **Query System**: Users can create, update, delete, and retrieve product recommendation queries
- **Recommendation Engine**: Users can add recommendations to queries with detailed information
- **Real-time Tracking**: Automatic recommendation count updates using MongoDB's `$inc` operator
- **Flexible Filtering**: Get recommendations by query, user, or recommender
- **RESTful API**: Well-structured endpoints following REST conventions
- **MongoDB Integration**: Efficient data storage and retrieval
- **CORS Enabled**: Cross-origin resource sharing for frontend integration
- **Firebase Integration**: Ready for Firebase admin operations

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:email` - Get user by email
- `POST /users` - Create new user

### Queries
- `GET /queries` - Get all queries
- `GET /queries/:id` - Get query by ID
- `GET /queries/user/:email` - Get queries by user email
- `POST /queries` - Create new query
- `PUT /queries/:id` - Update query
- `DELETE /queries/:id` - Delete query

### Recommendations
- `GET /recommendations` - Get all recommendations
- `GET /recommendations/query/:queryId` - Get recommendations for a specific query
- `GET /recommendations/recommender/:email` - Get recommendations by recommender
- `GET /recommendations/user/:email` - Get recommendations for user's queries
- `POST /recommendations` - Add new recommendation (auto-increments query count)
- `DELETE /recommendations/:id` - Delete recommendation (auto-decrements query count)

### Core Dependencies
- **express** (^5.1.0) - Fast, unopinionated web framework for Node.js
- **mongodb** (^6.17.0) - Official MongoDB driver for Node.js
- **cors** (^2.8.5) - Express middleware for enabling CORS
- **dotenv** (^16.5.0) - Loads environment variables from .env file

### Authentication & Security
- **firebase-admin** (^13.4.0) - Firebase Admin SDK for server-side operations

### Utilities
- **cookie-parser** (^1.4.7) - Express middleware for parsing cookies