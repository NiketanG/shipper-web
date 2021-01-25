## Shipper
##### Web App

 Traffic Management System for Coastal Regions. 
Developed for **ASEAN-India Hackathon** 2021 - PS7.

##### Demo:  [Shipper-Web](https://shipper-web.netlify.app)

##### For Backend - Refer to [Shipper-Server](https://github.com/NiketanG/shipper-server)

### Local Development

##### Prerequisites
[Mapbox Account](https://account.mapbox.com/) & [Access token](https://account.mapbox.com/access-tokens/create)
Shipper-Server running
[Node.js](https://nodejs.org/) Installed

##### Configure Environment Variables
Make sure you have set the following environment variables. You can also use a **.env** file. An .env.example file is provided for the format

REACT_APP_MAPBOX_ACCESS_TOKEN=Access token from Mapbox
REACT_APP_API_URL=Url of Shipper-Server

##### Install Dependencies
```
yarn install
	#OR
npm install
```

##### Start Development Server
```
yarn dev
	#OR
npm run dev
```
This will allow you to access the app on [http://localhost:3000](http://localhost:3000) 

#### Create Production Build
This will create a production build that can be deployed.
```
yarn build
	#OR
npm run build
```


### Getting Started
Just enter your Email Address & Name in the Login Page. It will automatically sign you up if your account doesn'st exist. 

You will see a map with your ships location. This location isn't your actual current location, it's just used for Demo Purposes.

Use the Navigation Controls on the Left Bottom Corner to navigate your ship location (Black Arrow in the middle of screen). As you move your ship, the other ships (People using the App) will be able to view it as well in the real time. Similiarly, you can view other ships as they move. 
