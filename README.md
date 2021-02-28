# **MLSC Scavenger Hunt Online Portal**
###### Thanks to parv for designing the Homepage and Register WebPage. Thanks to sahaj for designing the Login and Victory WebPages
###### Thanks to the entire MLSC Core team for designing the questions.

The portal was used to host the MLSC Online Scavenger Hunt starting at 12 AM on 27th February 2021 and ending at 5 PM on 28th February 2021(41 hours).
There were 130+ participanting teams and 12000+ answers were submitted.

The backend uses Passport for authentication and is attached to a MongoDB Database on MongoDB Atlas. 
The answers are hashed using bcrypt so that even if the source code was to get leaked only the hints and questions would get compromised,not the answers.
To use the portal 
- Git clone this repo
- run ``` npm install ``` to get all the node modules
- run ``` node app.js ``` to start the website on your localhost
- in the app.js file on line 24 change ``` 
mongoose.connect("mongodb+srv://cluster0.tbblr.mongodb.net/MLSCScavengerHuntDep", {
    poolSize: 460,
    auth: {
        user: "admin-raghav",
        password: encodeURIComponent(process.env.MONGOCLUSTERPASS)
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
});
 ``` 
 to
 ```
 mongoose.connect("mongodb://localhost:27017/MLSCScavengerHuntDep", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
 ```
 and make sure you have MongoDB installed and running on your system.
- now just open any browser and goto localhost:3000
- enjoy the contest.