# 🧬 BioWithKhushi

**A modern, full-stack web platform for biology, genetics, and biotechnology content.**

Explore cutting-edge articles on CRISPR, DNA sequencing, molecular biology, and career opportunities in life sciences with Dr. Khushi.

🌐 **Live Demo:** [https://sukwinderk14-ai.github.io/biowithkhushi/](https://sukwinderk14-ai.github.io/biowithkhushi/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Setup](#-database-setup)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Frontend
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Modern UI** - Beautiful gradient designs with smooth animations
- ✅ **Fast Loading** - Optimized assets and lazy loading
- ✅ **Accessible** - WCAG compliant with semantic HTML
- ✅ **SEO Optimized** - Meta tags, Open Graph, structured data
- ✅ **Dynamic Content** - Articles, research notes, categories loaded from API

### Backend
- ✅ **FastAPI** - Modern, fast Python web framework
- ✅ **MongoDB Integration** - Flexible document database
- ✅ **RESTful API** - Well-designed endpoints
- ✅ **Input Validation** - Pydantic models for data validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **CORS Support** - Cross-origin resource sharing enabled
- ✅ **Logging** - Detailed application logging

### Content Management
- ✅ **Articles** - Browse, search, and filter by category
- ✅ **Comments** - Add comments to articles
- ✅ **Research Notes** - Access curated research papers
- ✅ **Categories** - 6 pre-configured categories
- ✅ **Contact Form** - Get in touch with Dr. Khushi
- ✅ **Statistics** - Track views, likes, and engagement

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **JavaScript (ES6+)** - Dynamic interactivity
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **Fetch API** - Data fetching

### Backend
- **Python 3.9+** - Programming language
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **python-dotenv** - Environment variables

### Database
- **MongoDB** - NoSQL database
- **MongoDB Atlas** - Cloud hosting (optional)

### Deployment
- **GitHub Pages** - Frontend hosting
- **Heroku / Railway / Render** - Backend hosting (optional)
- **Docker** - Containerization (optional)

---

## 📁 Project Structure

```
biowithkhushi/
├── index.html           # Main HTML file
├── styles.css           # Styling
├── main.js              # JavaScript functionality
│
├── app/
│   └── backend/
│       ├── server.py        # FastAPI application
│       ├── models.py        # Pydantic data models
│       ├── seed_data.py     # Sample data for seeding
│       ├── .env             # Environment variables
│       ├── .env.example     # Example environment file
│       └── requirements.txt # Python dependencies
│
├── README.md                # This file
├── .gitignore              # Git ignore rules
└── LICENSE                 # License file
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **MongoDB** (local or Atlas cloud)
- **Git**

### 5-Minute Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sukwinderk14-ai/biowithkhushi.git
   cd biowithkhushi
   ```

2. **Set up backend**
   ```bash
   cd app/backend
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB credentials
   ```

4. **Seed the database**
   ```bash
   python seed_data.py
   ```

5. **Start the API server**
   ```bash
   uvicorn server:app --reload
   ```

6. **Open frontend**
   - Open `index.html` in your browser
   - Or serve locally with a Python server:
   ```bash
   python -m http.server 8080
   ```

---

## 💻 Installation

### Backend Installation

#### Step 1: Clone Repository
```bash
git clone https://github.com/sukwinderk14-ai/biowithkhushi.git
cd biowithkhushi/app/backend
```

#### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Verify Installation
```bash
python -c "import fastapi; print('FastAPI installed successfully')"
```

### Frontend Installation

The frontend is pure HTML, CSS, and JavaScript. No build tools required!

Simply open `index.html` in your browser or serve with:
```bash
cd ../..
python -m http.server 8080
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in `app/backend/`:

```env
# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=biowithkhushi

# FastAPI
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# CORS
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8000", "https://yourdomain.com"]

# Environment
ENVIRONMENT=development
```

### MongoDB Setup

#### Option 1: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string
5. Add to `.env`

#### Option 2: Local MongoDB
1. Download and install [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017`

---

## 🏃 Running the Application

### Development Mode

#### Backend
```bash
cd app/backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn server:app --reload
```

API will be available at: `http://localhost:8000`

#### API Documentation
- **Interactive Docs (Swagger UI):** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

#### Seed Database
```bash
python seed_data.py
```

#### Frontend
```bash
# In a new terminal, from project root
python -m http.server 8080
```

Visit: `http://localhost:8080`

### Production Mode

#### Build for Production
```bash
cd app/backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 server:app
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Articles Endpoints

#### Get All Articles
```bash
GET /api/articles
```

**Query Parameters:**
- `category` - Filter by category (optional)
- `search` - Search articles (optional)
- `sort` - Sort by: newest, oldest, popular, mostLiked (optional)

**Example:**
```bash
curl "http://localhost:8000/api/articles?category=Genetics&search=DNA&sort=popular"
```

#### Get Single Article
```bash
GET /api/articles/{slug}
```

#### Like Article
```bash
POST /api/articles/{article_id}/like
```

#### View Article
```bash
POST /api/articles/{article_id}/view
```

### Categories Endpoints

#### Get All Categories
```bash
GET /api/categories
```

### Research Endpoints

#### Get All Research Notes
```bash
GET /api/research
```

### Comments Endpoints

#### Get Comments for Article
```bash
GET /api/articles/{article_id}/comments
```

#### Add Comment
```bash
POST /api/articles/{article_id}/comments
Content-Type: application/json

{
  "author": "John Doe",
  "text": "Great article!"
}
```

### Contact Endpoints

#### Submit Contact Form
```bash
POST /api/contact
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I want to collaborate"
}
```

### Stats Endpoints

#### Get Statistics
```bash
GET /api/stats
```

### Health Check
```bash
GET /api/health
```

---

## 🗄️ Database Setup

### Collections

The application uses the following MongoDB collections:

#### 1. Articles
```json
{
  "id": "article-001",
  "title": "Introduction to CRISPR",
  "slug": "introduction-to-crispr",
  "excerpt": "Discover CRISPR technology...",
  "content": "Full article content...",
  "category": "Biotechnology",
  "tags": ["CRISPR", "genetics"],
  "imageUrl": "https://...",
  "author": "Dr. Khushi",
  "likes": 342,
  "views": 5230,
  "publishedDate": "2024-01-15T10:30:00",
  "updatedDate": "2024-01-15T10:30:00"
}
```

#### 2. Comments
```json
{
  "id": "comment-001",
  "articleId": "article-001",
  "author": "John Doe",
  "text": "Great article!",
  "createdAt": "2024-01-20T14:30:00",
  "likes": 5
}
```

#### 3. Research Notes
```json
{
  "id": "research-001",
  "title": "CRISPR in Cancer",
  "description": "Research paper on CRISPR...",
  "fileUrl": "https://...",
  "uploadDate": "2024-01-15T10:30:00",
  "category": "Biotechnology",
  "tags": ["CRISPR", "cancer"]
}
```

#### 4. Contact Submissions
```json
{
  "id": "contact-001",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Collaboration inquiry",
  "submittedAt": "2024-01-20T14:30:00",
  "status": "new"
}
```

---

## 🚢 Deployment

### Deploy Frontend to GitHub Pages

1. **Enable GitHub Pages**
   - Go to repository settings
   - Scroll to "GitHub Pages"
   - Select `main` branch as source

2. **Access your site**
   - https://sukwinderk14-ai.github.io/biowithkhushi/

### Deploy Backend

#### Option 1: Railway
```bash
# Install Railway CLI
railway up
```

#### Option 2: Render
1. Connect GitHub repository
2. Create new Web Service
3. Set start command: `uvicorn server:app --host 0.0.0.0`

#### Option 3: Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY app/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/backend/ .

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t biowithkhushi .
docker run -p 8000:8000 biowithkhushi
```

---

## 📝 Sample Data

The application comes with 5 pre-loaded articles:

1. **Introduction to CRISPR Gene Editing** - Biotechnology
2. **Understanding DNA Sequencing Techniques** - Genetics
3. **Protein Folding and Its Biological Significance** - Molecular Biology
4. **Career Paths in Bioinformatics** - Career
5. **The Human Microbiome: Our Hidden World** - Molecular Biology

Plus 3 research papers and 6 categories.

To seed the database:
```bash
cd app/backend
python seed_data.py
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: Failed to connect to MongoDB
```
**Solution:** Check your `MONGO_URL` in `.env` and ensure MongoDB is running.

### Port Already in Use
```
Address already in use: ('0.0.0.0', 8000)
```
**Solution:** 
```bash
# Change port or use:
uvicorn server:app --port 8001
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Update `ALLOWED_ORIGINS` in `.env` to include your frontend URL.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Dr. Khushi**

- GitHub: [@sukwinderk14-ai](https://github.com/sukwinderk14-ai)

---

## 🎯 Roadmap

- [ ] User authentication
- [ ] Email notifications
- [ ] Advanced search
- [ ] User profiles
- [ ] Admin dashboard
- [ ] Dark mode support

---

**Made with ❤️ by Dr. Khushi** 
