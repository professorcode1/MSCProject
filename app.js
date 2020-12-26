//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: "IWntLCZxnk0nOpaHBjep",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  answersArray: [mongoose.Types.ObjectId],
  adminPrivilege: Boolean,
  numerOfMembers: Number,
  memberOneName: String,
  memberOneEmail: String,
  memberOneInstitute: String,
  memberTwoName: String,
  memberTwoEmail: String,
  memberTwoInstitute: String,
  memberThreeName: String,
  memberThreeEmail: String,
  memberThreeInstitute: String,
  score: Number, //0 when constructor is called
  currentQuestion: Number, //1 when constructor is called
  hintTaken: [Boolean], //an array with 75 elements representing the 75 hints.Will be set to true if hint taken,false otherwise.
  latestAnswerTime: Date //milliseconds that passed b/w when the latest answer was given and when the contest started.Will be set to sentinal infinity on construction
});
userSchema.plugin(passportLocalMongoose);
const answerSchema = new mongoose.Schema({
  team: mongoose.Types.ObjectId,
  time: Date, //this number will represents how many milliseconds passed b/w when the contest startred to when the answer was submitted.
  correctness: Boolean,
  questionAttempted: Number,
  hintOneTaken: Boolean,
  hintTwoTaken: Boolean,
  hintThreeTaken: Boolean,
  answerSubmitted:String
});


const User = new mongoose.model("user", userSchema);
const Answer = new mongoose.model("answer", answerSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// the above code sets up the enviornment. Is volatile, even changing the order of things will cause Undocument Behaviour

//LOGICAL CODE FOR THE BACKEND
const startingTime = new Date(2020, 11, 22, 14, 0, 0, 0); //for the event this will be set to 2021,0,9,12
const endingTime = new Date(2021, 0); //for the event this will be set to 2021,0,10,12
const cooldownPeriod = 2000; //in milliseconds
const penaltyHintOne = 10;
const penaltyHintTwo = 20;
const penaltyHintThree = 30;
const saltRounds = 8;
const hashedAnswers = [
  "$2b$08$I0g56IpUrdyFmXyPIkxLye2e5quaKYArW/Y/WfjOapx.XEjTP/cO6", //1
  "$2b$08$SCmRyDOQGMksbunDopKqo..XJM3OGq94lqkLaDMk7jqNA6m8FAgdW", //2
  "$2b$08$hCkl5WMK8GMjKaVsiZhp7.F46MrI3s95NwE0kfIQfcDm7Zmxqger2", //3
  "$2b$08$cH0dAX/z2bGkCerAD72XCevaUoX6bwKMENZt/acEVbxNfGIMmanie", //4
  "$2b$08$DTteHhl7blZgP0UsImqZTeloY38k46Q1mP9TG1n1wiuaRzSWcgcTa", //5
  "$2b$08$Z2L/7udm90kWKVyx8KJyy.jhF35lvIUisRPDMZ0HW7kdnVqMggom.", //6
  "$2b$08$.21NJuj9CUTz1L6O/FH3z.qCiDTuIp3NgHp/cEm6QHCxWoAGsR0Cq", //7
  "$2b$08$pePUqXFxL2wAx0WD5pifT.y91P2GzN75d77PVVmOyjl8rArTggXVW", //8
  "$2b$08$9IT2xcyxJxkusbMgS2soReHxusqsHDAzN3UO0qihI0Set.swjXQ1y", //9
  "$2b$08$9DQ7R1EvmG.1SxcfrCTkRuallddX.YkqpRrzGKyBcW3lc.8GkTtIm", //10
  "$2b$08$bdnngmc3iJfziYIAkkO2Wepd2JogrdcoM/B018IrrrhPgyo60PTOS", //11
  "$2b$08$eeeImxEFknm0Px28epxcv.wGWg5j4WPRd4LlOkrFwKHmcRtGA90JO", //12
  "$2b$08$jgeGrlhTzd4foDaujCudoeBOTJ8qgiBrLnX2nMsl6WynrWsKf1hIu", //13
  "$2b$08$ndiXGSxYTlwQrDF8wn81xuSFMJuhk2mmNJ.1zLiAYIIOz3wa/4dUW", //14
  "$2b$08$x2L17BG27zuQSfPSRyWRXu60dxCjm0dUC/gfgyXoQrwAXypON5cMa", //15
  "$2b$08$MPc.JHgw3rPPsfurGNyaC.5RAk4f2smPqREnOhlbznTsxZ2b3KDHC", //16
  "$2b$08$cSSPjP3.kasB1.5RUXWLJucKk3z3OSwmPZLVbfUXTXeufFGbQPGG6", //17
  "$2b$08$lYzwexJ.//F4jQMcyPBpteWWZFx67rfmfyDiUhfLGye27.obdwCyW", //18
  "$2b$08$h3lijZUnP2BPLlN..WmSBeDoVlRMdzYnUROkM3NbX0A/QlUo0iMqC", //19
  "$2b$08$3QfjEGk7PGa3w0xpXx16QOmlFCMtioc6eL6HpN7IFGmKP4U8tXdJK", //20
  "$2b$08$qqNPjmvzTQnLwMyzPIzGx.zUzB1do/PdTctBYcIHjR3mB/x.c/mn6", //21
  "$2b$08$p82nmI1PHcLohRZmGgN8COyOTCaSO3xDQEODaGdHOinsktaH370hO", //22
  "$2b$08$JIVOrsmPJJ3mW2HuHfm./ect46ah7.xA8qsuhsk.Wb.TlZY0DMO7e", //23
  "$2b$08$bt432wP6mJUnFon6MyZ4y.iDLxyuQuaIVE6iGa2KU0DOL9EAp.qEK", //24
  "$2b$08$7hrJDUF.X3NLfOErnhnJQuIPv8Fz71w7u0b0G6BCzpW6fSjtOnkHS" //25
];
const questionContent = [
  "What is the fullform of BBC(P.S. the news organization,not the other thing you are thinking)", //britishbrodsatingcompany
  "What nut is used to make marzipan?", //groundalmonds
  "What element does 'O' represent on the periodic table?", //oxygen
  "Who was the prime minister before Adani's personal dog", //manmohansingh
  "Who won I'm A Celebrity... Get Me Out Of Here! in 2019?", //jacquelinejossa
  "What's the name of the river that runs through Egypt?", //nile
  "In meters, how long is an Olympic swimming pool?", //fifty
  "name the actors who played Joey  in Friends.", //mattleblanc
  "What's the name of the Royal family's castle in Scotland?", //balmoral
  "Who is the tech head of MSCDB?", //raghavkumar
  "Who did Orlando Bloom play in Pirates Of The Caribbean?", //willturner
  "Which English town has football teams called United and Wednesday?", //sheffield
  "How many people are there on an English jury?", //twelve
  "Which bevarage(other than rum) is used to make a cube libre", //cola
  "What is my favorite color?", //green
  "What's the highest mountain in the world?", //everest
  "How many wives did Henry VIII have?", //six
  "What's the name of Andy Murray's tennis playing brother?", //jamiemurray
  "What is the fullform of TIET", //thaparinstituteofengineeringandtechnology
  "Where would you find the Golden Gate bridge?", //sanfrancisco
  "What year did World War II end?", //nineteenfortyfive
  "What sport did Fred Perry play?", //tennis
  "Who is Ashton Kutcher married to?", //milakunis
  "What's the capital of Spain?", //madrid
  "How many makes up a baker's dozen?" //thirteen
];

app.get("/playground", (req, res) => {
  //state can be "falseAnswerSubmitted" which que's us to tell the user he submitted a false answer,
  //state can be "correctAnswerSubmitted" which que's us to tell the user he submitted the correct answer,
  //state can be "showConfirmationCard" which means user asked for a hint and we need to show him confirmation card.
  //state can be "cooldownViolated" which mean user submitted before the cooldown period was complete
  if (req.isAuthenticated()) {
    // a card status of 1 reflects that card is locked, 2 reflects card is asking "are you sure", 3 reflects card is unlocked
    let cardOneStatus = (req.user.hintTaken[((req.user.currentQuestion - 1) * 3)] ? 3 : 1);
    let cardTwoStatus = (req.user.hintTaken[((req.user.currentQuestion - 1) * 3) + 1] ? 3 : 1);
    let cardThreeStatus = (req.user.hintTaken[((req.user.currentQuestion - 1) * 3) + 2] ? 3 : 1);
    if (req.query.showConfirmationCard) {
      if (cardOneStatus === 1) {
        cardOneStatus = 2;
      } else if (cardTwoStatus === 1) {
        cardTwoStatus = 2;
      } else if (cardThreeStatus === 1) {
        cardThreeStatus = 2;
      }
    }
    res.render("playground", {
      hint1: (req.user.hintTaken[((req.user.currentQuestion - 1) * 3)] ? "Hello world, I am hint 1!" : ""),
      hint2: (req.user.hintTaken[((req.user.currentQuestion - 1) * 3) + 1] ? "Hello world, I am hint 2!" : ""),
      hint3: (req.user.hintTaken[((req.user.currentQuestion - 1) * 3) + 2] ? "Hello world, I am hint 3!" : ""),
      falseAnswerSubmitted: (req.query.falseAnswerSubmitted ? true : false),
      correctAnswerSubmitted: (req.query.correctAnswerSubmitted ? true : false),
      questionContent: questionContent[req.user.currentQuestion - 1],
      cooldownViolated: (req.query.cooldownViolated ? true : false),
      cardOneStatus: cardOneStatus,
      cardTwoStatus: cardTwoStatus,
      cardThreeStatus: cardThreeStatus
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/playground", (req, res) => {
  if (req.isAuthenticated()) {
    if (((new Date())- req.user.latestAnswerTime) < cooldownPeriod) {
      return res.redirect("/playground/?cooldownViolated=true");
    }
    bcrypt.compare(req.body.response, hashedAnswers[req.user.currentQuestion - 1], (err, result) => {
      let hintIndex = (req.user.currentQuestion - 1) * 3;
      const answer = new Answer({
        team: req.user._id,
        time: new Date(), //this number will represents how many milliseconds passed b/w when the contest startred to when the answer was submitted.
        correctness: result,
        questionAttempted: req.user.currentQuestion,
        hintOneTaken: req.user.hintTaken[hintIndex],
        hintTwoTaken: req.user.hintTaken[hintIndex + 1],
        hintThreeTaken: req.user.hintTaken[hintIndex + 2],
        answerSubmitted:req.body.response
      });
      answer.save();
      let newAnswerArray = req.user.answersArray;
      newAnswerArray.push(answer._id);
      if (result) {
        User.updateOne({
          _id: req.user._id
        }, {
          score: (req.user.score + 100),
          currentQuestion: (req.user.currentQuestion + 1),
          latestAnswerTime: new Date(),
          answersArray: newAnswerArray
        }, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/playground/?correctAnswerSubmitted=true");
      } else {
        User.updateOne({
          _id: req.user._id
        }, {
          latestAnswerTime: new Date(),
          answersArray: newAnswerArray
        }, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/playground/?falseAnswerSubmitted=true");
      }
    });
  } else {
    res.redirect("/login");
  }
});

// below code are all the route request
app.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.adminPrivilege) {
      User.find((err, user) => {
        if (!err) {
          res.render("admin", {
            teams: user
          });
        } else {
          console.log(err);
        }
      });
    } else {
      res.redirect("/playground");
    }
  } else {
    res.redirect("/login");
  }
});
app.get("/teamanswerhistory", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.adminPrivilege && req.query.teamid) {
      (async () => {
        const teamAnswerHistory = (await User.findById(req.query.teamid).exec()).answersArray;
        let teamAnswerHistoryObj = [];
        for(const answerId of teamAnswerHistory)
        {
          const rndmVar = await Answer.findById(answerId).exec();
          teamAnswerHistoryObj.push({
            answerSubmitted : rndmVar.answerSubmitted,
            timeOfSubmission: rndmVar.time
          });
        }
        teamAnswerHistoryObj.reverse();
        res.render("teamanswerhistory",{answerHistory:teamAnswerHistoryObj});
      })(); //Using a Immediately Invoked Function Expression(IIFE) as setting it to async allows mongoodb to act inside as if it returns objects instead of promises
      //and helps me avoide writing many .then functions as everything can be done from the same control flow
      return ;
    } else {
      res.redirect("/playground");
    }
  } else {
    res.redirect("/login");
  }
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/homepage.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.get("/gethint", (req, res) => {
  if (req.isAuthenticated()) {
    let hintIndex = (req.user.currentQuestion - 1) * 3;
    if (!(req.user.hintTaken[hintIndex])) {
      let newHintTakenArray = req.user.hintTaken;
      newHintTakenArray[hintIndex] = true;
      User.updateOne({
        _id: req.user._id
      }, {
        score: (req.user.score - penaltyHintOne),
        hintTaken: newHintTakenArray
      }, (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.redirect("/playground");
    } else if (!(req.user.hintTaken[hintIndex + 1])) {
      let newHintTakenArray = req.user.hintTaken;
      newHintTakenArray[hintIndex + 1] = true;
      User.updateOne({
        _id: req.user._id
      }, {
        score: (req.user.score - penaltyHintTwo),
        hintTaken: newHintTakenArray
      }, (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.redirect("/playground");
    } else if (!(req.user.hintTaken[hintIndex + 2])) {
      let newHintTakenArray = req.user.hintTaken;
      newHintTakenArray[hintIndex + 2] = true;
      User.updateOne({
        _id: req.user._id
      }, {
        score: (req.user.score - penaltyHintThree),
        hintTaken: newHintTakenArray
      }, (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.redirect("/playground");
    } else {
      res.redirect("/playground");
    }
  } else {
    res.redirect("/login");
  }
});
app.post("/register", (req, res) => {
  User.exists({
    username: req.body.username
  }, (err, usernameTaken) => {
    if (usernameTaken) {
      res.render("message", {
        message: "Sorry, username taken"
      });
      return;
    } else {
      let hintTaken = new Array(75);
      hintTaken.fill(false, 0, 75);
      User.register({
        username: req.body.username,
        numerOfMembers: req.body.numOfMem,
        memberOneName: req.body.nameOfMem1,
        memberOneEmail: req.body.emailOfMem1,
        memberOneInstitute: req.body.instituteOfMem1,
        memberTwoName: req.body.nameOfMem2,
        memberTwoEmail: req.body.emailOfMem2,
        memberTwoInstitute: req.body.instituteOfMem2,
        memberThreeName: req.body.nameOfMem3,
        memberThreeEmail: req.body.emailOfMem3,
        memberThreeInstitute: req.body.instituteOfMem3,
        adminPrivilege: false,
        score: 0, //0 when constructor is called
        currentQuestion: 1, //1 when constructor is called
        hintTaken: hintTaken, //true if the hint was taken, false otherwise (false on construction)
        latestAnswerTime: new Date(0) //milliseconds b/w 1 Jan 2022 &  1 jan 1970. so sentinal infinity
      }, req.body.password, (err, user) => {
        if (!err) {
          passport.authenticate("local")(req, res, function() {
            res.redirect("/playground");
          });
        } else {
          console.log(err);
          res.redirect("/login");
        }
      });
    }
  });
});
app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, (err) => {
    if (!err) {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/playground");
      });
    } else {
      console.log(err);
      res.redirect("/");
    }
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


//below is enviornment code
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
