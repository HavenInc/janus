# bacchus
## Haven Full-Stack Engineering Applicant Exercise

## The Mini Project
Create a small application that can display voyages based on a list of provided port pairs. **You can use this skeleton project as a starting point, or use another framework of your choice. The only requirement is it must be Javascript based**

We have provided a list of vessel port calls (portCalls.json).  A port call contains the name of a vessel, a port and the dates the vessel arrives and departs from that port.  The port is defined by a UNLOCODE, a unique string assigned to each port worldwide.  Port calls are tied together by a voyageId which represents that several port calls are tied together as a single voyage.

While port calls are interesting what we really want to display is the list of voyages that are possible within a certain date range.  For example, in our data set the 'USS Harpoon' starts a voyage from Hong Kong (HKHKG) and will travel to Oakland (USOAK), visiting Singapore and Los Angeles along the way.  If we were to display the possible voyages it would be as follows:

HKHKG to SGSIN
HKHKG to USLAX
HKHKG to USOAK
SGSIN to USLAX
SGSIN to USOAK
USLAX to USOAK

Using either the provided skeleton app or writing your own create an interface that can transform the port calls into voyages.  The user should be able to enter a starting date and ending date and get back all of the possible voyages that are possible between those two dates.

> Do not hesitate to ask questions about how this could/should be set up! This is not a strict quiz, it is a starting point for collaboration.

#### Skeleton Overview
The skeleton provided here is a barebones [Strongloop/Loopback](https://docs.strongloop.com/display/public/LB/Getting+started+with+LoopBack) application. The additions include

- A Port Call model which represents the port calls
- Pre-populating the sample data within
- An Angular client that includes two date pickers and a 'find' button.  The Angluar app can communicate with the loopback API / PortCall model to call the 'getRoutes' remote method / endpoint
- The 'getRoutes' endpoint is stubbed to only return the list of Port Calls between the date range

## Getting Started
- The [Create a Simple API](https://docs.strongloop.com/display/public/LB/Create+a+simple+API) tutorial for Strongloop is a great starting point, along with [Installing Strongloop](https://docs.strongloop.com/display/public/LB/Installing+StrongLoop) and [Loopback Core Concepts](https://docs.strongloop.com/display/public/LB/LoopBack+core+concepts).
- Install [NodeJS](https://nodejs.org) on your dev machine, and make sure [npm](https://www.npmjs.com/) is also installed (it should come with most distributions of node).
- Clone this repository.
- Once cloned, install the application dependencies using `npm install` in the root of the project.
- Once installed, start the application with `npm start` - this will regenerate the loopback Angular SDK and start the server.
- Extend the stubbed remote methods inside [common/models/portCalls.js](https://github.com/HavenInc/bacchus/blob/master/common/models/portCall.js) to return the expected voyages.
- Update and refactor the UI to match the provided mockup as closely as possible
- You can use the [API Explorer http://0.0.0.0:3000/explorer](http://0.0.0.0:3000/explorer) to test your new methods while in development.
- Document tradeoffs/shortcuts in the interest of time; this exercise should not take more than 2-3 hours for basic functionality.


## Bonus Options
- Add appropriate unit tests
- Create an npm run script inside package.json that uses supervisor to reload/rerun the code as you edit it.
- What would be an interesting way to present the app to the engineering team?
