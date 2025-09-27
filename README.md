# Dog Lovers 

A fun React app that includes a **Guess the Dog Game** & a page to learn **Fun Dog facts**. Also a cool questionnaire that help you to find your **perfect buddy**, and a **shop** to find the perfect toys for your best friend.

# Guess the Dog Breed Game

A simple fun game where users guess the correct breed of a dog from three random images. Players earn points for correct guesses & lose lives for wrong answers.
There is a json file named **mergedDogdFull.json** that contains collected information on over 200 dog breeds collected from different sources.

# APIs Used

- **Dog Image API:**  
  https://dog.ceo/api/breeds/image/random

- **Dog Facts API:**  
  https://dogapi.dog/api/v2/facts

## Features

- Guess the dog breed from images (Dog CEO API)
- Score tracking
- 5 lives per game
- Restart on game over
- Display random dog facts (Dog Facts API)
- Client-side routing with React Router

# Technologies Used

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Dog CEO API](https://dog.ceo/dog-api/)
- [Dog Facts API](https://dogapi.dog/)



# Shop
Products in the shop are **scraped** from the internet using a tool named **scraper.js**.

In the the shop you can add and remove your **favourites** to your favourites page by clicking the **heart button**, from the favourites page you can remove the products by clicking on the **heart button**. By clicking on the product you will be brought to the page where you can by the product.


# Admin Product Dashboard

A full-stack admin dashboard for managing products with image uploads, scraping, and secure access. Built with:

- **Frontend**: React + React Hook Form
- **Backend**: Node.js + Express + MongoDB
- **Image Hosting**: Cloudinary
- **Authentication**: JWT
- **Scraping**: Cheerio + Axios
- **Cron Jobs**: node-cron

---

## Features

- Add, edit, delete products with image preview
- Upload images via file or URL to Cloudinary
- Admin-only access with JWT auth
- Scrape products from the internet and clean favourites
- Daily cron job for scraping and cleanup
- Modular backend with secure routes and validation

---

## Setup Instructions

- clone the repo
- npm run dev
- npm run scrape(if needs to be tested)

You can setup admin accounts
node createAdmin.js
### Admin Routes (require JWT token)

| Method | Endpoint                    | Description             |
|--------|-----------------------------|-------------------------|
| GET    | `/api/products`             | Fetch all products      |
| GET    | `/api/products/:id`         | Fetch product by ID     |
| POST   | `/api/products/create`      | Create product          |
| PUT    | `/api/products/update/:id`  | Update product          |
| DELETE | `/api/products/delete/:id`  | Delete product          |
| GET    | `/api/products/scrape`      | Scrape products         |

> All admin routes require header: `Authorization: Bearer <your_token>`

### Daily Scheduled Task

- **Time**: Every day at **2:00 AM**
- **Tool**: `node-cron`
- **File**: `cron.js`

#### What It Does:
1. **Scrapes products** from Guaw.com using Cheerio + Axios
2. **Uploads images** to Cloudinary
3. **Upserts products** into MongoDB
4. **Cleans favourites** by removing references to deleted products

#### Logs:
- Success messages for scrape and cleanup
- Error messages with stack trace
- 
### Project Structure



├── public/                     # Static assets
├── src/
│   ├── api/
│   │   ├── controllers/        # Product logic (CRUD, scrape, cleanup)
│   │   │   └── products.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── products.js
│   │   │   └── users.js
│   │   ├── routes/             # Express routes
│   │   │   └── products.js
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.js             # JWT authentication
│   │   ├── adminAuth.js        # Role-based access control
│   │   └── file.js             # Multer + Cloudinary config
│   ├── utils/
│   │   ├── cloudinaryHelper.js # Image upload + publicId extraction
│   │   └── jwtHelper.js        # Token generation and verification
│   ├── pages/
│   │   └── AdminProducts.jsx   # Admin dashboard UI
│   ├── styles/
│   │   └── AdminProducts.css   # Styling for dashboard and modals
│   └── index.js                # Frontend entry point
├── createAdmin.js              # Script to seed admin user
├── scraper.js                  # CLI scraper for Guaw.com
├── cron.js                     # Daily scheduled scrape + cleanup
├── .env                        # Environment variables
├── package.json                # Project metadata and dependencies
└── README.md                   # Project documentation



### Technologies Used

**Frontend**
- React
- React Hook Form
- Axios
- React icons
- Lucide React

**Backend**
- Node.js
- Express
- Mongoose (MongoDB)

**Authentication**
- JWT (JSON Web Tokens)
- bcrypt (password hashing)

**Image Upload**
- Cloudinary
- Multer
- multer-storage-cloudinary

**Scraping**
- Puppeteer
- Axios
- Cheerio

**Scheduling**
- node-cron

**Dev Tools**
- dotenv
- Insomnia (API testing)
