## Getting Started

Run the follow comands:

```bash
npm install

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies

This project was built with:

```bash
- NexJs 14 as both (Client and Server)
  - Choosed because I wanted to have only one build with client and server
- Typescript
  - I use in 100% of my JS projects
- Shadcn - UI + Tailwind
  - Really great minimalist lib for UI adn UX
- Socket.io
  - To be able to get a real time communication between a rider and driver
- Postgres
  - I already worked with Posgres before and was recomended on challenge description
- Prisma
  - Choosed because is a easy ORM to use and with types generate
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

PS: I had a lot of ambiguity and issues with socket and Next14(custom server, limit size of event payloads and next deployment thinking in a "node" server), so this took me a decent amount of time which I could spent on other features.

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
 
## App Recommendations

- Enable Geolocation on browser

- At the first screen you have two buttons which each one will open a new tab. For /rider and for /driver.
Homepage
<img width="1728" alt="Screenshot 2024-03-04 at 16 38 23" src="https://github.com/rbqdev/trashlab-frontend-challenge/assets/32659372/149629ea-692c-4096-861f-554ca3158de8">

- So, for you be able to get a good view of the app communication, I recommend to split the two tabs as the follow image:
Rider and Driver pages
<img width="1728" alt="Screenshot 2024-03-04 at 16 38 11" src="https://github.com/rbqdev/trashlab-frontend-challenge/assets/32659372/f44966db-4b8f-481c-b546-04984a74ee12">

## Deployed on Render

You see the project live. [Link Here](https://trashlab-frontend-challenge.onrender.com/).
