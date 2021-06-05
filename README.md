## Shipper

#### Web

Traffic Management System for Coastal Regions.
Developed for **ASEAN-India Hackathon** 2021 - PS7 and won **Encouragement Award**.

### Demo

[Shipper-Web](https://shipper-web.netlify.app)

## Local Development

### Prerequisites

-   [Mapbox Account](https://account.mapbox.com/) & [Access token](https://account.mapbox.com/access-tokens/create)
-   [Shipper-Server](https://github.com/NiketanG/shipper-server) running
-   [Node.js](https://nodejs.org/) Installed
-   [Postgres](https://www.postgresql.org/) Installed and Configured to accept connections (Optional if you use docker)

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file
An (env.example)[.env.example] file is provided in the repo.

`REACT_APP_MAPBOX_ACCESS_TOKEN` Access token from Mapbox

`REACT_APP_API_URL` Url of Shipper-Server

### Install Dependencies

```bash
yarn install
or
npm install
```

### Start Development Server

```bash
yarn dev
or
npm run dev
```

This will start a develoment server for the frontend on [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Create a production build

This will create a production build that can be deployed.

```bash
yarn build
or
npm run build
```

For Deploying, you can use Docker (with Docker Compose).

```bash
docker-compose up --build
```

---

## Getting Started

Open the application in your web browser on [http://localhost:3000](http://localhost:3000)

Enter your email address and name on the login page, you will be redirected to the dashboard.

The map uses an initial location (not your current location) for demo purposes. Use the Controls in Bottom Left corner for navigation. Based on the ships around you, warnings and alerts will be displayed.

The locations of all ships (including yours) are synchronized in real time, so as you move, all other ships around you will also see your movements.
