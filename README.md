# 🛒 E-commerce Platform

A full-featured e-commerce application built with **Next.js**, **Prisma**, **MySQL**, and **MinIO** for object storage. This project includes product listings, user authentication, cart functionality, and order processing.

## 🚀 Technologies Used

* **Next.js** – Full-stack React framework for building web applications.
* **Prisma** – ORM for database access and schema modeling.
* **MySQL** – Relational database for persistent storage.
* **MinIO** – S3-compatible object storage used to store product images and other assets.

## 📦 Features

* User registration and authentication
* Product catalog with filtering and search
* Shopping cart and checkout flow
* Admin dashboard for managing products and orders
* Image upload to MinIO and dynamic image rendering
* Responsive design for desktop and mobile

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Fill in the `.env` file with your credentials:

```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET_NAME="your-bucket"
NEXTAUTH_SECRET="your-secret"
```

### Run Migrations

```bash
npx prisma migrate dev --name init
```

### Start the Development Server

```bash
npm run dev
```

## 🖼️ MinIO Setup

To run MinIO locally using Docker:

```bash
docker run -p 9000:9000 -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  -v ~/minio/data:/data \
  quay.io/minio/minio server /data --console-address ":9001"
```

Then create a bucket using the MinIO web console (`http://localhost:9001`) and update the `.env` file accordingly.

## 🔒 Authentication

The app uses NextAuth.js for authentication. You can configure providers like GitHub, Google, or credentials.

## 📂 Project Structure

```
/prisma        # Prisma schema and migrations
/pages         # Next.js pages (routes)
/components    # Reusable React components
/lib           # Utilities and MinIO integration
/public        # Static files
/styles        # Global styles (Tailwind or CSS)
```


## ✅ To-Do / Future Improvements

* Payment integration (Stripe, PayPal)
* Order history and status tracking
* Email notifications
* User reviews and ratings
* Wishlist functionality

## 🤝 Contributing

Feel free to fork this repo and contribute via pull requests. Suggestions and feedback are always welcome!

## 📄 License

This project is licensed under the MIT License.

---

Se quiser, posso adaptar esse modelo ao seu projeto real — com nome, links, comandos específicos e mais detalhes personalizados. Deseja isso?
