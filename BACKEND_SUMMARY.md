# Backend Summary

## Overview
The NdaCampaignDemo backend is built with **NestJS** and **TypeScript**, using **PostgreSQL** as the database and **TypeORM** for object-relational mapping. It provides a secure, modular API for the web and mobile applications.

## Core Infrastructure
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM (Primary), Prisma (Schema Reference)
- **Authentication**: JWT (Access + Refresh Tokens) with Passport
- **Security**: Bcrypt for password hashing, Helmet for headers

## API Structure
- `/auth`: Authentication endpoints (login, register)
- `/users`: User management and profile
- `/campaigns`: Campaign management (CRUD)
- `/characters`: Character management (CRUD)
- `/npcs`: NPC management (Planned)
- `/items`: Item management (Planned)
- `/sessions`: Session management (Planned)
- `/media`: Media management (Planned)

## Database Schema
The database schema includes tables for:
- Users (Players and Game Masters)
- Campaigns
- Characters
- NPCs
- Items
- Sessions
- Media
- Refresh Tokens
- Campaign Memberships
- Character Inventories

See [database/schema.prisma](database/schema.prisma) or [database/database-schema.sql](database/database-schema.sql) for details.
