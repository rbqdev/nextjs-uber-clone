This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies

This project was built with:

```bash
- NexJs 14 as both (Client and Server)
  - Custom server file
- Typescript
- Shadcn - UI + Tailwind
- Socket.io
- Postgres
- Prisma
```

## Features

Some features implemented and related with the challenge's problems requirements.
As some requirements are implicties and ambigous. I implemented some that I was thinking that were important thinking of the ride request flow.

### Implemented

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

From challenge requirements

**Goober rider**

- They want to be able to request a taxi ride, specifying a pickup and dropoff location. Goober should provide a quote on the trip fee based on the trip distance & other factors. **Done**
- They should not have to worry about selecting a driver, our system should handle that in a reasonable way. **Done**
- Riders can cancel ongoing rides. **Done**

**Goober driver**

This is the driver that joins the platform to provide ride-share taxi services.

- They should be able to receive requests for rides, and accept or decline them. Each ride should come with an indication of how much the driver will be paid. **Done**
- Once they’ve accepted a ride, they should not see new requests for rides until the ride is complete. **Done** (There's a condition for this requirement on the code)
- They should see enough relevant information to pickup the rider and complete the ride request. **Done**
- Drivers can cancel ongoing rides. **Done** (Thinking in the case of cancel an accepted ride)

### Not Implemented

Features not implemented but that I thought were important requirements and I possibly do if I had more time.

- Real-time location of driver car going to pick up the rider
- Real-time location of driver car going to the rider's destination
- Onboard step view when the rider is onboard of the car
- Properly rider and driver pages by ID (currently is getting by type)
- Ride payments table to separate the percentage app and driver amount into an isolate table
- Small UI/UX improvements as well, trying to get the most delightful UX.
- Responsive styles

### Guidance

Some description accordingly the guidance afirmations.

```bash
You should implement this purely as web app, with different views as necessary.
```

**Implemented Rider and Driver views**

```bash
What features do you think are most impactful?
```

**For this problem, maps and web socket comunication**

```bash
What scope would you cut?
```

**For now I would cut authentications and permissions, as were recommended on challenge description**

```bash
What unspoken requirements need to be implemented to provide our core service?
```

**Google maps, Web socket comunication between rider and driver**

```bash
This is really important: Once the bare minimum functionality is implemented, what feature, or section of the app would you work on to make _really good? Really good here can mean, really good UI, powerful differentiating functionality, delightful UX._
```

**Based on this last point, I think I focused in a mix of:**

- Have a good UI
  - Using a minimalist view with tailwind style and shadcn components.
- Powerful differentiating functionality
  - Since this was not said on the challenge description, I think using web socket + google maps it's a powerfull combination.
- Delightful UX.
  - As above, I think web socket provided a great UX experience specially on the app in prod.

## Deployed on Render

You see the project live. [Link Here](https://trashlab-frontend-challenge.onrender.com/).
