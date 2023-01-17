# reaktor-project-birdnest
A project created as part of Reaktor's software developer trainee recruitment pre-assignment.
The deployed project can be found [here](https://reaktor-project-birdnest.vercel.app/).

To run this project for yourself locally, you need to have Node.js and NPM installed on your local machine. Clone the git repository and run <code>npm install</code> in both the BIRDNEST and server directories. 

You also need to create a .env file in the server directory, and add your own Redis URL it. <code>REDIS_URL=<YOUR_URL_HERE></code>

> ## Brief
> A rare and endangered Monadikuikka has been spotted nesting at a local lake.
> Unfortunately some enthusiasts have been a little too curious about this elusive bird species, flying their drones very close to the nest for rare photos and bothering the birds in the process.
> To preserve the nesting peace, authorities have declared the area within 100 meters of the nest a no drone zone (NDZ), but suspect some pilots may still be violating this rule.
> The authorities have set up drone monitoring equipment to capture the identifying information broadcasted by the drones in the area, and have given you access to a national drone pilot registry. They now need your help in tracking violations and getting in touch with the offenders.

The full assignment brief can be found on the [assignment page](https://assignments.reaktor.com/birdnest/?_gl=1*1v94qv0*_ga*NzE2Mjc0OTA3LjE2NjM2ODMzMzA.*_ga_DX023XT0SX*MTY3MDMyODMzNy44LjEuMTY3MDMyODU1Mi42MC4wLjA.).

# Implementation

### Backend
The implemented server queries data from the drone data endpoint every two seconds. For each fetch, captured drones are checked for whether they are violating the NDZ. If a drone is found to violate the NDZ, then that drone's pilot is retrieved from the pilot information endpoint and the drone and pilot data is merged. Before being sent to the database, the pilot's ID number is however used to retrieve existing entries from the database. If an entry with the same ID number is found, and if the distance parameter has decreased, then the fetched entry is updated with the new data. If, however, the database query's response is empty, then a new entry is created. This way it is ensured that there will only ever be one entry per pilot, and that this entry tracks the closest distance the drone has been to the nest in the past 10 minutes. To persist data for no more than 10 minutes, a time-to-live is given to all entries after creation. Finally, the server exposes a /getDrones endpoint to query the database with.

The Node.js + Express server is hosted on a Digital Ocean Droplet running Ubuntu. It uses NGINX to host a web server and establish a reverse proxy, having used Certbot to generate a self-signed SSL certificate and PM2 to maintain the server. Setting all this up was necessary to be able to query the server once the application was deployed and running over HTTPS (instead of http).

### Frontend
The front end is quite simply a React application created with Vite. It also uses TailwindCSS for some styling. The client application queries data every two seconds, but this is directed at the Redis database (using the endpoint created for it) instead of the assignment endpoints. The client application is hosted on Vercel.