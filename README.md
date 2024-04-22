# Uber Clone - Goober

## Getting Started

Run the follow comands:

```bash
npm install

npm run dev
```

The app is already set with .env variables getting data from server.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies

This project was built with:

```bash
- NexJs 14 as both (Client and Server)
- Typescript
- Shadcn - UI + Tailwind
- Socket.io
- Postgres
- Prisma
```

### Features

- Rider and Driver view
  - Get users from server
  - Get socket comunication of ride requests
    - Comunicating the entire flow steps
  - Diferent ride flow states as:
    - [Rider]
    - Initial
    - Searching drivers
      - Automatically cancel search if any drive had accept the ride request when hit 30 seconds of searching.
    - Accepted ride by driver
  - [Driver]
    - Initial - No ride requets
    - New ride request
    - Accepted ride request
    - Driver can ignore a ride request
- Google maps
  - See current initial user location if location is enabled on browser
  - See source and destination on map
  - See the route direction based on source and destination on map
- Get ride amount configs from server
  - Calculate amount based in some configs
- UI styles
  - For users pages
  - Fullscreen loader
  - User nav

### Not Implemented

Features not implemented but that I thought were important requirements and I possibly do if I had more time.

- Real-time location of driver car going to pick up the rider
- Real-time location of driver car going to the rider's destination
- Onboard step view when the rider is onboard of the car
- Properly rider and driver pages by ID (currently is getting by type)
- Ride payments table to separate the percentage app and driver amount into an isolate table
- Small UI/UX improvements as well, trying to get the most delightful UX.
- Responsive styles
 
## App Recommendations

- Enable Geolocation on browser

- At the first screen you have two buttons which each one will open a new tab. For /rider and for /driver.
Homepage
<img width="1728" alt="Screenshot 2024-03-04 at 16 38 23" src="https://github.com/rbqdev/trashlab-frontend-challenge/assets/32659372/149629ea-692c-4096-861f-554ca3158de8">

- So, for you be able to get a good view of the app communication, I recommend to split the two tabs as the follow image:
Rider and Driver pages
<img width="1728" alt="Screenshot 2024-03-04 at 16 38 11" src="https://github.com/rbqdev/trashlab-frontend-challenge/assets/32659372/f44966db-4b8f-481c-b546-04984a74ee12">
