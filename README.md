
# AI-Mart

### Discover the right AI tool for the right task.

Finding AI tools shouldn't be harder than using them.
 

**An AI-powered discovery platform that helps users find curated AI tools, receive personalized recommendations, and generate ready-to-use prompts based on their role and goals.**

 

> 🚧 **AI-Mart is actively evolving.**
>
> The core platform is functional and deployed, while documentation, screenshots, and additional improvements continue to be added.

 

# 📖 Why I Built AI-Mart

The number of AI tools grows every single day.

Writers, developers, designers, marketers, students, and founders all face the same problem:

**Which AI tool should I actually use?**

Search engines return thousands of links.

YouTube videos become outdated within weeks.

Social media recommendations are often sponsored or based on personal preference.

Instead of helping people work faster, finding the right AI tool often becomes another problem to solve.

I built AI-Mart to simplify that experience.

Rather than searching through hundreds of websites, users describe who they are and what they want to accomplish.

AI-Mart then recommends a curated set of AI tools designed for that specific need.

---

# 💡 The Problem

Today's AI ecosystem is growing faster than anyone can keep up with.

People don't struggle because there aren't enough AI tools.

They struggle because there are too many.

Questions like these are becoming common:

- Which AI tool is best for writing?
- What should a designer use?
- Which tool helps developers the most?
- What AI should students start with?
- Which tools are actually worth using?

Most people spend more time searching than creating.

---

# ✅ The Solution

AI-Mart transforms AI tool discovery into a guided experience.

Instead of scrolling through endless lists, users simply answer a few questions.

```
Choose Your Role
        │
        ▼
Select Your Task
        │
        ▼
Browse Curated AI Tools
        │
        ▼
AI Ranks the Best Matches
        │
        ▼
Generate Ready-to-Use Prompts
```

Instead of asking,

> "Where can I find an AI tool?"

AI-Mart asks,

> **"What are you trying to accomplish?"**

That small shift makes recommendations far more useful.

---

# 🤖 How AI Recommendations Work

AI-Mart doesn't search the internet in real time.

Instead, it works with a curated collection of approved AI tools.

When a user selects a role and task,

AI analyzes those requirements and ranks the most relevant tools from that curated collection.

For every recommendation,

AI-Mart also explains **why** the tool matches the user's needs.

Users can then generate ready-to-use prompts to start working immediately.

This creates a discovery experience focused on relevance rather than endless searching.

---

# ✨ Features

## 🔍 Smart AI Discovery

Discover AI tools based on your profession and the work you want to complete.

---

## 🤖 Personalized Recommendations

Receive AI-ranked suggestions instead of manually comparing dozens of tools.

---

## ✍️ Prompt Generator

Generate practical prompts for recommended AI tools so you can start using them immediately.

---

## 🧠 Role-Based Discovery

Explore recommendations designed for different types of users, including:

- Developers
- Designers
- Founders
- Marketers
- Content Creators
- Students
- Freelancers

---

## 🛒 Curated Marketplace

Browse a growing collection of AI tools that have been reviewed before becoming publicly available.

---

## 👨‍💼 Tool Owner Dashboard

Tool creators can:

- Submit new AI tools
- Manage existing listings
- Update tool information
- Track submission status

---

## 🛡 Founder Review System

Every submitted tool goes through a moderation process before it becomes visible to everyone.

This helps maintain the overall quality of the marketplace.

---

## 🔐 Secure Authentication

AI-Mart supports:

- Email & Password Login
- Google Sign-In
- Secure JWT Authentication
- Refresh Token Sessions

---

# 🖼 Screenshots

> 🚧 Screenshots will be added soon.

Planned sections include:

- Landing Page
- AI Explore Flow
- AI Recommendations
- Prompt Generator
- Tool Details
- Tool Owner Dashboard
- Founder Dashboard

---
 

# 🌟 What I Learned While Building AI-Mart

AI-Mart became much more than a simple directory of AI tools.

While building it, I learned how to design systems that combine traditional web development with AI-powered user experiences.

It challenged me to think about authentication, role-based access control, recommendation systems, API design, deployment, and creating products that solve real-world problems.

Every feature pushed me to become a better software engineer while exploring how AI can improve everyday workflows.


# 🏗 Architecture

AI-Mart is designed as a full-stack MERN application with a clear separation between the frontend, backend, business logic, and data layer.

Rather than placing everything inside a few large files, responsibilities are divided into focused modules that make the project easier to understand, maintain, and extend.

```
                React Client

                      │

                      ▼

               Express API

                      │

                      ▼

               Controllers

                      │

                      ▼

                 Services

                      │

                      ▼

             MongoDB Database

                      │

                      ▼

          AI Services (Groq LLM)
```

This architecture allows each layer to focus on one responsibility while keeping the codebase organized as new features are added.

---

# 🧩 Project Structure

AI-Mart consists of two independent applications.

```
AI-Mart
│
├── client/
│     React + Vite Frontend
│
└── server/
      Node.js + Express Backend
```

The frontend handles the complete user experience.

The backend manages authentication, AI recommendations, marketplace logic, moderation workflows, and database communication.

---

# 📂 Folder Structure

## Client

```
client/
│
├── src/
│   ├── api/
│   ├── app/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   ├── utils/
│   └── hooks/
```

The frontend is organized around features and user roles.

Separate layouts, dashboards, and route protection help keep different user experiences independent from one another.

---

## Server

```
server/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   ├── scripts/
│   ├── moment/
│   └── explore/
```

Each folder has a dedicated responsibility.

Controllers receive requests.

Services contain business logic.

Models define the database.

Middlewares handle authentication, authorization, uploads, caching, and security.

The **explore** module is isolated because it powers AI-driven tool discovery.

---

# ⚙ Engineering Principles

While building AI-Mart, I focused on writing code that could continue growing without becoming difficult to maintain.

Some principles used throughout the project include:

- Separation of Concerns
- Modular Architecture
- Role-Based Access Control
- Feature-Based Frontend Organization
- Service Layer
- Reusable Components
- API-First Development
- AI Integration with Fallback Handling

These decisions helped keep responsibilities clear across the application.

---

# 🏛 Backend Request Flow

A typical request follows this lifecycle.

```
Client Request

↓

Express Route

↓

Controller

↓

Service

↓

MongoDB

↓

Response
```

For AI-powered features, one additional step is included.

```
User Request

↓

Controller

↓

Explore Service

↓

Groq AI

↓

Ranked Results

↓

Client
```

This keeps AI logic separate from the rest of the marketplace while allowing recommendations to remain part of the overall application flow.

---

# 🤖 AI Recommendation Engine

One of AI-Mart's core features is its AI-assisted recommendation system.

The recommendation process follows this flow.

```
Choose Role

↓

Choose Task

↓

Find Matching Tools

↓

AI Ranks Results

↓

Generate Helpful Prompts

↓

Display Final Recommendations
```

Instead of recommending tools randomly, AI-Mart combines curated marketplace data with AI reasoning to produce more relevant suggestions.

If the AI service is unavailable, the application falls back gracefully instead of breaking the user experience.

---

# 🔐 Authentication Architecture

AI-Mart supports two authentication methods.

- Email & Password
- Google Sign-In

After successful authentication,

the backend issues:

- Access Token
- Refresh Token

Refresh token rotation helps keep long-running sessions secure while allowing users to remain signed in.

---

# 👥 Role-Based Access Control

AI-Mart supports three different user roles.

```
User
│
├── Browse AI Tools
├── Save Favorites
├── Explore with AI
└── Generate Prompts

Tool Owner
│
├── Submit AI Tools
├── Edit Listings
├── Manage Dashboard
└── Track Approval Status

Founder
│
├── Review Applications
├── Approve Tools
├── Reject Tools
└── Manage Marketplace Quality
```

Each role has its own dashboard and protected routes.

---

# 📊 Database Design

The application revolves around a few primary collections.

```
User
   │
   ├──────────────┐
   │              │
Saved Tools   Saved Prompts
   │
Tool
   │
Review
   │
Tool Owner Request
   │
Explore Session
```

Rather than storing everything inside one collection, responsibilities are separated into focused models that support authentication, discovery, moderation, and AI-powered workflows.

---

# 🚀 Performance Optimizations

Several optimizations help AI-Mart remain responsive.

- MongoDB Indexes
- Parallel Database Queries
- `.lean()` Read Operations
- Response Caching
- Lazy Loaded Routes
- Code Splitting
- Optimized Search Queries

These improvements reduce unnecessary database work and improve the overall user experience.

---

# ☁ Deployment Architecture

AI-Mart is deployed using separate frontend and backend services.

```
React Frontend
      │
      ▼
   Vercel

      │
      ▼

Express Backend
      │
      ▼
    Render

      │
      ▼

MongoDB Atlas

      │
      ▼

Groq AI
```

Keeping these services independent allows each part of the application to scale and evolve separately.

---

# 💻 Technologies Used

## Frontend

- React
- Vite
- Redux Toolkit
- React Router
- Axios

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Authentication

- JWT
- Google OAuth
- Refresh Tokens
- Bcrypt

---

## AI

- Groq
- Llama 3.1
- Google Generative AI (Integrated for future expansion)

---

## Cloud Services

- MongoDB Atlas
- Cloudinary
- Render
- Vercel

---

# 📈 What I Learned Building AI-Mart

AI-Mart taught me that building an AI-powered application is about much more than calling an API.

I learned how to combine authentication, AI services, database design, role-based access control, deployment, and performance optimization into one cohesive product.

Most importantly, I learned how to build software that remains organized as new features continue to grow.

# 🚀 Getting Started

Follow the steps below to run AI-Mart on your local machine.

---

# 📋 Prerequisites

Before getting started, make sure you have the following installed.

- Node.js (v20 or later recommended)
- npm
- MongoDB Atlas account (or local MongoDB)
- Git

You will also need:

- Cloudinary Account
- Google OAuth Credentials
- Groq API Key

---

# 📦 Clone the Repository

```bash
git clone https://github.com/Sugam0394/aimart.git
```

Move into the project.

```bash
cd aimart
```

---

# 📁 Install Dependencies

Install both frontend and backend dependencies separately.

### Client

```bash
cd client
npm install
```

---

### Server

```bash
cd ../server
npm install
```

---

# ⚙️ Environment Variables

AI-Mart uses environment variables to keep secrets and configuration outside the source code.

## Server (.env)

Create a `.env` file inside the `server` folder.

```env
PORT=

NODE_ENV=

CLIENT_URL=

MONGODB_URL=

ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_EXPIRY=

GOOGLE_CLIENT_ID=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

GROQ_API_KEY=

RENDER_EXTERNAL_URL=
```

---

## Client (.env)

Create another `.env` file inside the `client` folder.

```env
VITE_API_BASE_URL=

VITE_GOOGLE_CLIENT_ID=
```

> ⚠️ Never commit your `.env` files to GitHub.

---

# ▶️ Running the Project

### Start the Backend

```bash
cd server
npm run dev
```

---

### Start the Frontend

Open another terminal.

```bash
cd client
npm run dev
```

---

Once both servers are running,

visit

```
http://localhost:5173
```

to access AI-Mart.

---

# 📡 API Overview

Below are the major API groups used throughout the application.

---

## Authentication

```
POST /api/register

POST /api/login

POST /api/google-login

POST /api/logout

POST /api/refreshToken

GET /api/me
```

---

## Explore

```
POST /api/start

POST /api/step

POST /api/generate-prompts

POST /api/complete
```

---

## Tools

```
GET /api/home-data

GET /api/tools/:id

GET /api/trending

GET /api/risingTools

GET /api/recommend

GET /api/search

GET /api/use-cases

GET /api/workflow/:role

GET /api/stack/:role
```

---

## Tool Owner

```
POST /api/createTool

GET /api/myTool

PATCH /api/updateTool/:toolId

DELETE /api/deleteTool/:toolId
```

---

## Founder

```
GET /api/toolowner-requests

PATCH /api/approve/:toolId

PATCH /api/reject/:toolId

GET /api/pendingTool

GET /api/approvedTool
```

---

## User

```
POST /api/request-toolOwner

GET /api/my-toolowner-request

POST /api/save-prompt

DELETE /api/remove-prompt/:promptId
```

---

# 🤖 AI Recommendation Flow

When a user starts the Explore experience,

AI-Mart follows this process.

```
Select Role

↓

Select Task

↓

Find Matching Tools

↓

Groq AI Ranks Results

↓

Generate Helpful Prompts

↓

Display Final Recommendations
```

This workflow combines curated marketplace data with AI reasoning to make recommendations more relevant than a simple keyword search.

---

# 🔐 Authentication

AI-Mart supports two authentication methods.

## Email & Password

Traditional authentication using securely hashed passwords.

---

## Google Sign-In

Authenticate using a Google account without creating a separate password.

---

## Session Management

After authentication,

AI-Mart issues

- Access Token
- Refresh Token

Refresh tokens allow users to stay signed in securely while reducing the need for repeated logins.

---

# 👥 User Roles

AI-Mart supports three user roles.

### User

- Browse tools
- Save favorite tools
- Explore AI recommendations
- Generate prompts

---

### Tool Owner

- Submit AI tools
- Manage listings
- Update tool information
- Monitor approval status

---

### Founder

- Review tool owner applications
- Approve or reject AI tools
- Moderate marketplace content

Each role has dedicated dashboards and protected routes.

---

# ☁️ Deployment

AI-Mart is deployed as separate frontend and backend applications.

### Frontend

- Vercel

---

### Backend

- Render

---

### Database

- MongoDB Atlas

---

### AI Provider

- Groq (Llama 3.1)

---

### Image Hosting

- Cloudinary

Separating these services allows each part of the application to evolve independently.

---

# ⚡ Performance

Several optimizations help improve performance.

- MongoDB Indexes
- Lazy Loaded Routes
- Response Caching
- Parallel Database Queries
- Optimized Search
- Lean Database Queries
- Code Splitting

These optimizations help reduce unnecessary work and improve responsiveness.

---

# 🧪 Testing

Automated tests have not been added yet.

Future versions will include

- Unit Testing
- Integration Testing
- End-to-End Testing

to improve long-term reliability and maintainability.

---

# ❓ Frequently Asked Questions

### Can I use local MongoDB?

Yes.

Replace the MongoDB Atlas connection string with your local MongoDB instance.

---

### Is Groq required?

Yes.

The AI recommendation engine and prompt generation features depend on a valid Groq API key.

---

### Can I use AI-Mart without logging in?

Yes.

Users can browse public content.

Authentication is only required for features such as saving tools, generating personalized experiences, becoming a Tool Owner, and accessing protected dashboards.

---

### Is AI-Mart production ready?

AI-Mart is built using a production-oriented architecture with role-based access control, AI-powered recommendations, secure authentication, deployment on cloud platforms, and scalable backend design.

The project will continue evolving with improved documentation, testing, CI/CD, and additional developer tooling.


---

# 🛣 Roadmap

AI-Mart is continuously evolving.

The current version focuses on building a reliable AI-powered discovery platform with strong engineering fundamentals before expanding into larger marketplace features.

## ✅ Completed

- AI Tool Marketplace
- AI-Powered Discovery
- Personalized Recommendations
- Prompt Generator
- Tool Owner Dashboard
- Founder Moderation Dashboard
- Role-Based Access Control
- Email Authentication
- Google Sign-In
- Refresh Token Authentication
- Secure JWT Sessions
- Cloudinary Integration
- Search & Categories
- MongoDB Optimization
- Production Deployment

---

## 🚧 Currently Improving

- Documentation
- Repository Organization
- User Experience
- Performance Optimizations
- Developer Experience
- Mobile Improvements

---

## 🚀 Future Plans

Some ideas I'm excited to explore in future versions include:

- Advanced AI Recommendations
- Personalized AI Workspaces
- Tool Collections
- Community Reviews
- AI Workflow Builder
- AI News & Updates
- Team Collaboration
- Browser Extension
- Mobile Application
- Advanced Analytics
- Automated Testing
- CI/CD Pipeline

The roadmap will continue evolving as the platform grows.

---

# 🤝 Contributing

Thank you for taking the time to explore AI-Mart.

At the moment, this project is maintained by me as I continue learning, improving, and expanding the platform.

Contributions will be welcome in future releases.

If you have ideas, suggestions, or discover a bug, feel free to open an Issue.

Every piece of constructive feedback helps make the project better.

---

# 📄 License

This repository is currently shared for educational and portfolio purposes.

A formal open-source license will be added in a future release.

Until then, please contact the author before redistributing significant portions of the project.

---

# 👨‍💻 About the Author

Hi, I'm **Sugam Singh**.

I'm a Full Stack Developer who enjoys building products that solve practical problems.

Rather than creating many small tutorial projects, I prefer building complete applications that challenge me to think about software architecture, scalability, user experience, and long-term maintainability.

AI-Mart has been one of the most valuable learning experiences in my development journey.

While building it, I explored authentication, AI integration, backend architecture, database optimization, cloud deployment, and role-based application design.

I'm currently focused on improving my skills in:

- Full Stack Development
- Backend Engineering
- System Design
- Artificial Intelligence
- Communication & Storytelling

Every project I build teaches me something new, and my goal is to make each one better than the last.

---

# 🙏 Acknowledgements

AI-Mart wouldn't exist without the amazing open-source community.

Special thanks to the teams behind:

- React
- Node.js
- Express.js
- MongoDB
- Mongoose
- Redux Toolkit
- Vite
- Groq
- Cloudinary

for building tools that make projects like this possible.

---

# 📬 Connect With Me

### 📧 Email

**singhsugam348@gmail.com**

---

### 💻 GitHub

https://github.com/Sugam0394

---

### 💼 LinkedIn

Coming Soon

---

### 🌐 Portfolio

Coming Soon

---

# ⭐ Support the Project

If you found AI-Mart interesting or useful,

consider giving the repository a ⭐.

It encourages me to continue building better products and sharing my work with the developer community.

Thank you for taking the time to explore AI-Mart.

I hope you enjoyed learning about it as much as I enjoyed building it.

---
 

### Discover the right AI tool for the right task.

**Made with ❤️ by Sugam Singh**
 

