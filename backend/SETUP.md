# Backend Setup Guide

## Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `backend` directory with the following content:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=NdaCampaignDemo
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

## Database Migration
The application uses `synchronize: true` in development, so tables will be created automatically when the app starts. For production, you should use migrations.

## Testing
- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
