// Application configuration process

Steps for setting-up environment:

Step 1: npm install :
   This will install npm dependencies specified under package.json

Step 2: npm install -g grunt-cli :
   This will install command line interface for grunt so, that on terminal we will be able to access grunt command.

Step 3: grunt build :
   This will run the task called build which was specified in gruntfile.js. we can pass different values for option target. Each value represents one environment.
   we can use grunt build --target=prod if we want run the project with production environment. other options are 'dev' and 'stage'. The default option is dev.

Step 4: npm start :
   This will start node server on port '8088'.
