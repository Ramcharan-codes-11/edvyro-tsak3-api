Internship REST API

A simple REST API built using Node.js, Express and SQLite.

Features

- List all internships
- View an internship by ID
- Add a new internship
- Update internship details
- Delete an internship
- Input validation and error handling
- Pagination using page and limit
- SQLite database for persistent storage

Technologies

- Node.js
- Express.js
- SQLite
- JavaScript

Run the project

1. Install Node.js.
2. Run "npm install".
3. Run "npm start".
4. Open "http://localhost:3000/api/internships" in your browser.

API Endpoints

Method| Endpoint| Purpose
GET| "/api/internships"| List internships
GET| "/api/internships/:id"| View one internship
POST| "/api/internships"| Add an internship
PUT| "/api/internships/:id"| Update an internship
DELETE| "/api/internships/:id"| Delete an internship

Pagination

Use "/api/internships?page=1&limit=2" to return two records per page.