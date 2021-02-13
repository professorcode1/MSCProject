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
require('dotenv').config();
const COUNTRIES = ["India", "UnitedKingdom", "Greece", "Egypt", "Mayan", "Bonus"];


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.use(session({
    secret: "IWntLCZxnk0nOpaHBjep",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://cluster0.tbblr.mongodb.net/MLSCScavengerHunt", {
    auth: {
        user: "admin-raghav",
        password: encodeURIComponent(process.env.MONGOCLUSTERPASS)
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    answersArray: {
        type: [mongoose.Types.ObjectId],
        required: true,
        default: new Array(0)
    },
    adminPrivilege: {
        type: Boolean,
        required: true,
        default: false
    },
    numerOfMembers: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    },
    memberOneName: {
        type: String,
        required: true
    },
    memberOneEmail: {
        type: String,
        required: true
    },
    memberOneInstitute: {
        type: String,
        required: true
    },
    memberTwoName: String,
    memberTwoEmail: String,
    memberTwoInstitute: String,
    memberThreeName: String,
    memberThreeEmail: String,
    memberThreeInstitute: String,
    score: {
        type: Number,
        required: true,
        default: 0
    }, //0 when constructor is called
    IndiaQuestionsSolved: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5
    }, //0 when constructor is called
    IndiaHints: {
        type: [Boolean],
        required: true,
        default: (new Array(15)).fill(false)
    },
    UnitedKingdomQuestionsSolved: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5
    }, //0 when constructor is called
    UnitedKingdomHints: {
        type: [Boolean],
        required: true,
        default: (new Array(15)).fill(false)
    },
    GreeceQuestionsSolved: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5
    }, //0 when constructor is called
    GreeceHints: {
        type: [Boolean],
        required: true,
        default: (new Array(15)).fill(false)
    },
    EgyptQuestionsSolved: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5
    }, //0 when constructor is calledd
    EgyptHints: {
        type: [Boolean],
        required: true,
        default: (new Array(15)).fill(false)
    },
    MayanQuestionsSolved: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5
    }, //0 when constructor is called
    MayanHints: {
        type: [Boolean],
        required: true,
        default: (new Array(15)).fill(false)
    },
    bonusQuestionsSolved: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 7
    }, //0 when constructor is called
    bonusQuestionsVisible: {
        type: Boolean,
        required: true,
        default: false
    },
    latestAnswerTime: {
        type: Number, //miliiseconds passed b/w now and the Unix epoch
        required: true,
        default: 0,
    }
});
userSchema.plugin(passportLocalMongoose);
const answerSchema = new mongoose.Schema({
    team: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    time: {
        type: Number, //milliseconds passed till now from the unix epoch
        required: true
    },
    correctness: {
        type: Boolean,
        required: true
    },
    questionAttempted: {
        type: new mongoose.Schema({
            questionNumber: {
                type: Number,
                required: true
            },
            country: {
                type: String,
                required: true,
                enum: COUNTRIES
            }
        }),
        required: true
    },
    hintOneTaken: {
        type: Boolean,
        required: true
    },
    hintTwoTaken: {
        type: Boolean,
        required: true
    },
    hintThreeTaken: {
        type: Boolean,
        required: true
    },
    answerSubmitted: {
        type: String,
        required: true
    }
});


const User = new mongoose.model("user", userSchema);
const Answer = new mongoose.model("answer", answerSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// the above code sets up the enviornment. Is volatile, even changing the order of things will cause Undocument Behaviour

//LOGICAL CODE FOR THE BACKEND
const startingTime = new Date(Date.parse('10 Feb 2021 22:00:00 UTC+5:30')); //lets say the event starts at 10PM of 10th feb 2021
const endingTime = new Date(Date.parse('11 Feb 2021 10:00:00 UTC+5:30')); //and ends 24 hours after that 
const cooldownPeriod = 2000; //in milliseconds
const penaltyHintOne = 10;
const penaltyHintTwo = 20;
const penaltyHintThree = 30;
const marksPerQuestion = 100;
const saltRounds = 8;
const IndiaQuestions = [
    "India Question One     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "India Question Two",
    "India Question Three",
    "India Question Four",
    "India Question Five"
];
const IndiaHints = [
    "Hint 1 of Question 1 of India",
    "Hint 2 of Question 1 of India",
    "Hint 3 of Question 1 of India",
    "Hint 1 of Question 2 of India",
    "Hint 2 of Question 2 of India",
    "Hint 3 of Question 2 of India",
    "Hint 1 of Question 3 of India",
    "Hint 2 of Question 3 of India",
    "Hint 3 of Question 3 of India",
    "Hint 1 of Question 4 of India",
    "Hint 2 of Question 4 of India",
    "Hint 3 of Question 4 of India",
    "Hint 1 of Question 5 of India",
    "Hint 2 of Question 5 of India",
    "Hint 3 of Question 5 of India",
];
const hashedIndiaAnswers = [
    "$2b$08$rZH9XaJU9wU9kge05LF6LeNnE7Y9dXE2YdF8.ESLEvqlIRUtdcSE2",
    "$2b$08$ZP5.6TKi9Bfk1aG2WYtd2eWzp4oGaj0qsXzavvPJqmrFeLlb4bV7i",
    "$2b$08$LBHmnI800KWqJ75L7KhR5OsPhpwIYa1K8TVraY8ZJ.KT/a3OiTExS",
    "$2b$08$Pq3z6SuYr6wXmp5zhsnQQubYXbkTpclzVU4XGByiqwq7jQmDQcvnW",
    "$2b$08$y3knzzXzuvpc2JKnj1es/uOIV607HVrIF0fiUv9boNBTItthDGh4y"
];
const UnitedKingdomQuestions = [
    "United Kingdom Question One",
    "United Kingdom Question Two",
    "United Kingdom Question Three",
    "United Kingdom Question Four",
    "United Kingdom Question Five"
];
const UnitedKingdomHints = [
    "Hint 1 of Question 1 of UnitedKingdom",
    "Hint 2 of Question 1 of UnitedKingdom",
    "Hint 3 of Question 1 of UnitedKingdom",
    "Hint 1 of Question 2 of UnitedKingdom",
    "Hint 2 of Question 2 of UnitedKingdom",
    "Hint 3 of Question 2 of UnitedKingdom",
    "Hint 1 of Question 3 of UnitedKingdom",
    "Hint 2 of Question 3 of UnitedKingdom",
    "Hint 3 of Question 3 of UnitedKingdom",
    "Hint 1 of Question 4 of UnitedKingdom",
    "Hint 2 of Question 4 of UnitedKingdom",
    "Hint 3 of Question 4 of UnitedKingdom",
    "Hint 1 of Question 5 of UnitedKingdom",
    "Hint 2 of Question 5 of UnitedKingdom",
    "Hint 3 of Question 5 of UnitedKingdom",
];
const hashedUnitedKingdomAnswers = [
    "$2b$08$wWZJ3d27BYH2re4VsTT53uMgJw/jdbi.kNu415iV0GN1jtT6tVDKK",
    "$2b$08$iF9bXxUeq7ijs3w/NYksH.McjCF7eNpTsz2mhZboCfxKU7DlDwGtO",
    "$2b$08$gRarZlttCO8Qlk8zOniKL.3g7dTIcPhQp5XnNrjBcWiY0AmdLE88y",
    "$2b$08$X4NzhjpM9FFq/RCyygadDOtxGzS3tBe38aG3b6re0IUW9V8rUUCmq",
    "$2b$08$NRrCkaneEy6wxkiMuI2KbOO4P4YLD3Q8NZgxezWodhebmjMggHy4i"
];

const GreeceHints = [
    "Hint 1 of Question 1 of Greece",
    "Hint 2 of Question 1 of Greece",
    "Hint 3 of Question 1 of Greece",
    "Hint 1 of Question 2 of Greece",
    "Hint 2 of Question 2 of Greece",
    "Hint 3 of Question 2 of Greece",
    "Hint 1 of Question 3 of Greece",
    "Hint 2 of Question 3 of Greece",
    "Hint 3 of Question 3 of Greece",
    "Hint 1 of Question 4 of Greece",
    "Hint 2 of Question 4 of Greece",
    "Hint 3 of Question 4 of Greece",
    "Hint 1 of Question 5 of Greece",
    "Hint 2 of Question 5 of Greece",
    "Hint 3 of Question 5 of Greece",
];
const hashedGreeceAnswers = [
    "$2b$08$m8nVnJ3/6CdoM9K1Jss7i.GRcbSsVj/4nZr6huv1FAwyEEhA6dD7u",
    "$2b$08$XIJiLMuM6rxW/s9snJfM.eFP/xDj.K5dJrf8WEKX7Ha/dNA7MMDeC",
    "$2b$08$ZcFScIf8cjNunqLpq8FfZed0Se2QDm4ncqj6qIpOsf.mqNa3sHJga",
    "$2b$08$deKtqgQRx5Bq1OrD6w6a8eFk7ofRXkns1Yxruhy54X6kx.U4JEBwK",
    "$2b$08$h90fzgErtWQst7Um5GrpGuz6qxTjzPirRYlSXJWw2dy9dfENUFoei"
];
const EgyptQuestions = [
    "Egypt Question One",
    "Egypt Question Two",
    "Egypt Question Three",
    "Egypt Question Four",
    "Egypt Question Five"
];
const EgyptHints = [
    "Hint 1 of Question 1 of Egypt",
    "Hint 2 of Question 1 of Egypt",
    "Hint 3 of Question 1 of Egypt",
    "Hint 1 of Question 2 of Egypt",
    "Hint 2 of Question 2 of Egypt",
    "Hint 3 of Question 2 of Egypt",
    "Hint 1 of Question 3 of Egypt",
    "Hint 2 of Question 3 of Egypt",
    "Hint 3 of Question 3 of Egypt",
    "Hint 1 of Question 4 of Egypt",
    "Hint 2 of Question 4 of Egypt",
    "Hint 3 of Question 4 of Egypt",
    "Hint 1 of Question 5 of Egypt",
    "Hint 2 of Question 5 of Egypt",
    "Hint 3 of Question 5 of Egypt",
];
const hashedEgyptAnswers = [
    "$2b$08$3CBD3qQucI0tqMjPVMOd/O9ph73YSUbwi9VIkd7GXv/f0kmt9Kl.i",
    "$2b$08$L51UIL2HoeFrT1tyu4dxwuMwjVnNZlYJAuhIEv4qbnDJYdYbO4le2",
    "$2b$08$yaJNAXCKRGog7EvtTeQEZuagu5zdB1QcSa5fpbWizPX/ilwVNZhwS",
    "$2b$08$4JANxHu3bxlld9j2WIuBuOIlX1ajDfBMZn802pFXlrWfAeuR93Stu",
    "$2b$08$PEHUaKpF7I.zdavlR0SEWOeUYQEbG6zqJ782AqodtgcnVvs5UayGq"
];
const MayanQuestions = [
    "Mayan Question One",
    "Mayan Question Two",
    "Mayan Question Three",
    "Mayan Question Four",
    "Mayan Question Five"
];
const MayanHints = [
    "Hint 1 of Question 1 of Mayan",
    "Hint 2 of Question 1 of Mayan",
    "Hint 3 of Question 1 of Mayan",
    "Hint 1 of Question 2 of Mayan",
    "Hint 2 of Question 2 of Mayan",
    "Hint 3 of Question 2 of Mayan",
    "Hint 1 of Question 3 of Mayan",
    "Hint 2 of Question 3 of Mayan",
    "Hint 3 of Question 3 of Mayan",
    "Hint 1 of Question 4 of Mayan",
    "Hint 2 of Question 4 of Mayan",
    "Hint 3 of Question 4 of Mayan",
    "Hint 1 of Question 5 of Mayan",
    "Hint 2 of Question 5 of Mayan",
    "Hint 3 of Question 5 of Mayan",
];
const hashedMayanAnswers = [
    "$2b$08$riYIMoI.csMCN4EAbKs0r.vL8VQ1sRjQy.tpHUOfdjELfFXRVkkEm",
    "$2b$08$gzRsfHUBu6AE0HQJ3UXkH.F.MG1EodE2rdaKbcW4/Zi2Bv4Ma4sqC",
    "$2b$08$DUVAU4Naob028sjcF/koWu3ZFsgv6cUYEgzdQ1jSQYQ4hutP9iTo2",
    "$2b$08$XiwQXah62l5bOhqIhHQeh.sI84R9EsjgZSST8Nenijpicn/l3Lc.i",
    "$2b$08$FATYy2pxjNKUGWfJNlFRvOfQ80XLmTHozqjxnexVXmIvlaMNt1sUG",
];
const BonusQuestions = [
    "Bonus Question One",
    "Bonus Question Two",
    "Bonus Question Three",
    "Bonus Question Four",
    "Bonus Question Five",
    "Bonus Question Six",
    "Bonus Question Seven"
];
const hashedBonusAnswers = [
    "$2b$08$jQKI4xOcw43GQNl.jUvMMuoK9DToNX0bijJ6sZC7Sc0Q8DDSSyebq",
    "$2b$08$OpNKCLJuEbxOKFjwejRRxevETq14040I3rgjgLBjry1NVGAS9rgQ2",
    "$2b$08$kbAXsQ.i6CprOS9kZotij.gCRCcGDpIKQOzGHJoeA/erATduBwgPK",
    "$2b$08$2YMFQep7DR9DheCNHnI75eChEeXPrHkmfsCj/QZfiGhuoDNs.3Yjm",
    "$2b$08$pJIWPRgWueLYlUfQDtvRGOlH7cGsCq6GZS2nSWmnkZoz2VnewUDN6",
    "$2b$08$CHz0yDt8wdjzRcAQhUPrzOyqCX4Cvemzt1g1pRbNAemCU9ZdDMb6S",
    "$2b$08$WxJywa4d/TKsJG2mUuLYe.jr1FJOJnhBzTV3Wbbj5lFwDlH6UNb3C",
];

app.get("/", (req, res) => res.sendFile(__dirname + "/webPages/index.html"));

app.get("/easteregg", (req, res) => {
    res.sendFile(__dirname + "/webPages/easter.html");
});
app.get("/loginFailed", (req, res) => res.render("message", {
    message: "You password or Username was incorrect. Try again"
}));


app.get("/login", (req, res) => res.sendFile(__dirname + "/webPages/login.html"));
app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err) => {
        if (!err) {
            passport.authenticate("local", {
                failureRedirect: "/loginFailed"
            })(req, res, () => {
                res.redirect("/playground");
            });
        } else {
            console.log(err);
            res.redirect("/");
        }
    });
});

app.get("/register", (req, res) => res.sendFile(__dirname + "/webPages/register.html"));
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
            }, req.body.password, (err, user) => {
                if (!err) {
                    passport.authenticate("local")(req, res, function() {
                        res.redirect("/playground");
                    });
                } else {
                    console.log(err);
                    res.redirect("/");
                }
            });
        }
    });
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/playground", (req, res) => res.redirect("/playground/India"));

app.get("/greece", (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/webPages/greeceScroll" + req.user.GreeceQuestionsSolved + ".png");
    } else {
        res.redirect("/");
    }
});

app.get("/playground/:country", (req, res) => {
    //state can be "falseAnswerSubmitted" which que's us to tell the user he submitted a false answer,
    //state can be "correctAnswerSubmitted" which que's us to tell the user he submitted the correct answer,
    //state can be "showConfirmationCard" which means user asked for a hint and we need to show him confirmation card.
    //state can be "cooldownViolated" which mean user submitted before the cooldown period was complete
    if (req.isAuthenticated()) {
        // a card status of 1 reflects that card is locked, 2 reflects card is asking "are you sure", 3 reflects card is unlocked
        if (req.params.country === "Bonus" && !req.user.bonusQuestionsVisible)
            return res.render("message", {
                message: "Plase solve all 5 questions from all 5 countries before trying to access bonus questions."
            });

        if (req.user[req.params.country + "QuestionsSolved"] == (req.params.country === "Bonus" ? 7 : 5))
            return res.render("message", {
                message: "You have solved all questions from " + req.params.country
            });

        if (req.params.country === "India") {

            let cardOneStatus = req.user.IndiaHints[req.user.IndiaQuestionsSolved * 3] ? 3 : 1;
            let cardTwoStatus = req.user.IndiaHints[req.user.IndiaQuestionsSolved * 3 + 1] ? 3 : 1;
            let cardThreeStatus = req.user.IndiaHints[req.user.IndiaQuestionsSolved * 3 + 2] ? 3 : 1;
            if (req.query.showConfirmationCard) {
                if (cardOneStatus === 1) {
                    cardOneStatus = 2;
                } else if (cardTwoStatus === 1) {
                    cardTwoStatus = 2;
                } else if (cardThreeStatus === 1) {
                    cardThreeStatus = 2;
                }
            }
            return res.render("playground", {
                hint1: req.user.IndiaHints[req.user.IndiaQuestionsSolved * 3] ? IndiaHints[req.user.IndiaQuestionsSolved * 3] : "",
                hint2: req.user.IndiaHints[req.user.IndiaQuestionsSolved * 3 + 1] ? IndiaHints[req.user.IndiaQuestionsSolved * 3 + 1] : "",
                hint3: req.user.IndiaHints[req.user.IndiaQuestionsSolved * 3 + 2] ? IndiaHints[req.user.IndiaQuestionsSolved * 3 + 2] : "",
                falseAnswerSubmitted: (req.query.falseAnswerSubmitted ? true : false),
                correctAnswerSubmitted: (req.query.correctAnswerSubmitted ? true : false),
                questionContent: IndiaQuestions[req.user.IndiaQuestionsSolved],
                questionNumber: req.user.IndiaQuestionsSolved,
                cooldownViolated: (req.query.cooldownViolated ? true : false),
                cardOneStatus: cardOneStatus,
                cardTwoStatus: cardTwoStatus,
                cardThreeStatus: cardThreeStatus,
                country: "India"
            });
        } else if (req.params.country === "UnitedKingdom") {


            let cardOneStatus = req.user.UnitedKingdomHints[req.user.UnitedKingdomQuestionsSolved * 3] ? 3 : 1;
            let cardTwoStatus = req.user.UnitedKingdomHints[req.user.UnitedKingdomQuestionsSolved * 3 + 1] ? 3 : 1;
            let cardThreeStatus = req.user.UnitedKingdomHints[req.user.UnitedKingdomQuestionsSolved * 3 + 2] ? 3 : 1;
            if (req.query.showConfirmationCard) {
                if (cardOneStatus === 1) {
                    cardOneStatus = 2;
                } else if (cardTwoStatus === 1) {
                    cardTwoStatus = 2;
                } else if (cardThreeStatus === 1) {
                    cardThreeStatus = 2;
                }
            }
            return res.render("playground", {
                hint1: req.user.UnitedKingdomHints[req.user.UnitedKingdomQuestionsSolved * 3] ? UnitedKingdomHints[req.user.UnitedKingdomQuestionsSolved * 3] : "",
                hint2: req.user.UnitedKingdomHints[req.user.UnitedKingdomQuestionsSolved * 3 + 1] ? UnitedKingdomHints[req.user.UnitedKingdomQuestionsSolved * 3 + 1] : "",
                hint3: req.user.UnitedKingdomHints[req.user.UnitedKingdomQuestionsSolved * 3 + 2] ? UnitedKingdomHints[req.user.UnitedKingdomQuestionsSolved * 3 + 2] : "",
                falseAnswerSubmitted: (req.query.falseAnswerSubmitted ? true : false),
                correctAnswerSubmitted: (req.query.correctAnswerSubmitted ? true : false),
                questionContent: UnitedKingdomQuestions[req.user.UnitedKingdomQuestionsSolved],
                questionNumber: req.user.UnitedKingdomQuestionsSolved,
                cooldownViolated: (req.query.cooldownViolated ? true : false),
                cardOneStatus: cardOneStatus,
                cardTwoStatus: cardTwoStatus,
                cardThreeStatus: cardThreeStatus,
                country: "UnitedKingdom"
            });
        } else if (req.params.country === "Greece") {
            let cardOneStatus = req.user.GreeceHints[req.user.GreeceQuestionsSolved * 3] ? 3 : 1;
            let cardTwoStatus = req.user.GreeceHints[req.user.GreeceQuestionsSolved * 3 + 1] ? 3 : 1;
            let cardThreeStatus = req.user.GreeceHints[req.user.GreeceQuestionsSolved * 3 + 2] ? 3 : 1;
            if (req.query.showConfirmationCard) {
                if (cardOneStatus === 1) {
                    cardOneStatus = 2;
                } else if (cardTwoStatus === 1) {
                    cardTwoStatus = 2;
                } else if (cardThreeStatus === 1) {
                    cardThreeStatus = 2;
                }
            }
            return res.render("greece", {
                hint1: req.user.GreeceHints[req.user.GreeceQuestionsSolved * 3] ? GreeceHints[req.user.GreeceQuestionsSolved * 3] : "",
                hint2: req.user.GreeceHints[req.user.GreeceQuestionsSolved * 3 + 1] ? GreeceHints[req.user.GreeceQuestionsSolved * 3 + 1] : "",
                hint3: req.user.GreeceHints[req.user.GreeceQuestionsSolved * 3 + 2] ? GreeceHints[req.user.GreeceQuestionsSolved * 3 + 2] : "",
                falseAnswerSubmitted: (req.query.falseAnswerSubmitted ? true : false),
                correctAnswerSubmitted: (req.query.correctAnswerSubmitted ? true : false),
                cooldownViolated: (req.query.cooldownViolated ? true : false),
                questionNumber: req.user.GreeceQuestionsSolved,
                cardOneStatus: cardOneStatus,
                cardTwoStatus: cardTwoStatus,
                cardThreeStatus: cardThreeStatus,
                country: "Greece"
            });
        } else if (req.params.country === "Egypt") {
            let cardOneStatus = req.user.EgyptHints[req.user.EgyptQuestionsSolved * 3] ? 3 : 1;
            let cardTwoStatus = req.user.EgyptHints[req.user.EgyptQuestionsSolved * 3 + 1] ? 3 : 1;
            let cardThreeStatus = req.user.EgyptHints[req.user.EgyptQuestionsSolved * 3 + 2] ? 3 : 1;
            if (req.query.showConfirmationCard) {
                if (cardOneStatus === 1) {
                    cardOneStatus = 2;
                } else if (cardTwoStatus === 1) {
                    cardTwoStatus = 2;
                } else if (cardThreeStatus === 1) {
                    cardThreeStatus = 2;
                }
            }
            return res.render("playground", {
                hint1: req.user.EgyptHints[req.user.EgyptQuestionsSolved * 3] ? EgyptHints[req.user.EgyptQuestionsSolved * 3] : "",
                hint2: req.user.EgyptHints[req.user.EgyptQuestionsSolved * 3 + 1] ? EgyptHints[req.user.EgyptQuestionsSolved * 3 + 1] : "",
                hint3: req.user.EgyptHints[req.user.EgyptQuestionsSolved * 3 + 2] ? EgyptHints[req.user.EgyptQuestionsSolved * 3 + 2] : "",
                falseAnswerSubmitted: (req.query.falseAnswerSubmitted ? true : false),
                correctAnswerSubmitted: (req.query.correctAnswerSubmitted ? true : false),
                questionContent: EgyptQuestions[req.user.EgyptQuestionsSolved],
                questionNumber: req.user.EgyptQuestionsSolved,
                cooldownViolated: (req.query.cooldownViolated ? true : false),
                cardOneStatus: cardOneStatus,
                cardTwoStatus: cardTwoStatus,
                cardThreeStatus: cardThreeStatus,
                country: "Egypt"
            });
        } else if (req.params.country === "Mayan") {
            let cardOneStatus = req.user.MayanHints[req.user.MayanQuestionsSolved * 3] ? 3 : 1;
            let cardTwoStatus = req.user.MayanHints[req.user.MayanQuestionsSolved * 3 + 1] ? 3 : 1;
            let cardThreeStatus = req.user.MayanHints[req.user.MayanQuestionsSolved * 3 + 2] ? 3 : 1;
            if (req.query.showConfirmationCard) {
                if (cardOneStatus === 1) {
                    cardOneStatus = 2;
                } else if (cardTwoStatus === 1) {
                    cardTwoStatus = 2;
                } else if (cardThreeStatus === 1) {
                    cardThreeStatus = 2;
                }
            }
            return res.render("playground", {
                hint1: req.user.MayanHints[req.user.MayanQuestionsSolved * 3] ? MayanHints[req.user.MayanQuestionsSolved * 3] : "",
                hint2: req.user.MayanHints[req.user.MayanQuestionsSolved * 3 + 1] ? MayanHints[req.user.MayanQuestionsSolved * 3 + 1] : "",
                hint3: req.user.MayanHints[req.user.MayanQuestionsSolved * 3 + 2] ? MayanHints[req.user.MayanQuestionsSolved * 3 + 2] : "",
                falseAnswerSubmitted: (req.query.falseAnswerSubmitted ? true : false),
                correctAnswerSubmitted: (req.query.correctAnswerSubmitted ? true : false),
                questionContent: MayanQuestions[req.user.MayanQuestionsSolved],
                questionNumber: req.user.MayanQuestionsSolved,
                cooldownViolated: (req.query.cooldownViolated ? true : false),
                cardOneStatus: cardOneStatus,
                cardTwoStatus: cardTwoStatus,
                cardThreeStatus: cardThreeStatus,
                country: "Mayan"
            });
        } else if (req.params.country === "Bonus") {
            return res.render("playgroundBonus", {
                falseAnswerSubmitted: (req.query.falseAnswerSubmitted ? true : false),
                correctAnswerSubmitted: (req.query.correctAnswerSubmitted ? true : false),
                questionContent: BonusQuestions[req.user.bonusQuestionsSolved],
                questionNumber: req.user.bonusQuestionsSolved,
                cooldownViolated: (req.query.cooldownViolated ? true : false),
                country: "Bonus"
            });
        } else
            return res.redirect("/playground");
    } else
        res.redirect("/");
});

app.post("/playground/:country", async (req, res) => {
    if (req.isAuthenticated()) {

        if (((new Date().getTime()) - req.user.latestAnswerTime) < cooldownPeriod)
            return res.redirect("/playground/" + req.params.country + "/?cooldownViolated=true");

        const submissionTime = new Date().getTime();
        let answerCorrectness = false;
        if (req.params.country === "India" && req.user.IndiaQuestionsSolved < 5) {
            answerCorrectness = await bcrypt.compare(req.body.response, hashedIndiaAnswers[req.user.IndiaQuestionsSolved]);
            const increaseInScore = answerCorrectness ? marksPerQuestion : 0;
            const answer = await new Answer({
                team: req.user._id,
                time: submissionTime,
                correctness: answerCorrectness,
                questionAttempted: {
                    questionNumber: req.user.IndiaQuestionsSolved,
                    country: "India",
                },
                hintOneTaken: req.user.IndiaHints[3 * req.user.IndiaQuestionsSolved],
                hintTwoTaken: req.user.IndiaHints[3 * req.user.IndiaQuestionsSolved + 1],
                hintThreeTaken: req.user.IndiaHints[3 * req.user.IndiaQuestionsSolved + 2],
                answerSubmitted: req.body.response
            }).save();
            await User.updateOne({
                _id: req.user._id
            }, {
                answersArray: [...req.user.answersArray, answer._id],
                score: req.user.score + increaseInScore,
                IndiaQuestionsSolved: req.user.IndiaQuestionsSolved + (answerCorrectness ? 1 : 0),
                latestAnswerTime: submissionTime
            });
        } else if (req.params.country === "UnitedKingdom" && req.user.UnitedKingdomQuestionsSolved < 5) {
            answerCorrectness = await bcrypt.compare(req.body.response, hashedUnitedKingdomAnswers[req.user.UnitedKingdomQuestionsSolved]);
            const increaseInScore = answerCorrectness ? marksPerQuestion : 0;
            const answer = await new Answer({
                team: req.user._id,
                time: submissionTime,
                correctness: answerCorrectness,
                questionAttempted: {
                    questionNumber: req.user.UnitedKingdomQuestionsSolved,
                    country: "UnitedKingdom",
                },
                hintOneTaken: req.user.UnitedKingdomHints[3 * req.user.UnitedKingdomQuestionsSolved],
                hintTwoTaken: req.user.UnitedKingdomHints[3 * req.user.UnitedKingdomQuestionsSolved + 1],
                hintThreeTaken: req.user.UnitedKingdomHints[3 * req.user.UnitedKingdomQuestionsSolved + 2],
                answerSubmitted: req.body.response
            }).save();
            await User.updateOne({
                _id: req.user._id
            }, {
                answersArray: [...req.user.answersArray, answer._id],
                score: req.user.score + increaseInScore,
                UnitedKingdomQuestionsSolved: req.user.UnitedKingdomQuestionsSolved + (answerCorrectness ? 1 : 0),
                latestAnswerTime: submissionTime
            });
        } else if (req.params.country === "Greece" && req.user.GreeceQuestionsSolved < 5) {
            answerCorrectness = await bcrypt.compare(req.body.response, hashedGreeceAnswers[req.user.GreeceQuestionsSolved]);
            const increaseInScore = answerCorrectness ? marksPerQuestion : 0;
            const answer = await new Answer({
                team: req.user._id,
                time: submissionTime,
                correctness: answerCorrectness,
                questionAttempted: {
                    questionNumber: req.user.GreeceQuestionsSolved,
                    country: "Greece",
                },
                hintOneTaken: req.user.GreeceHints[3 * req.user.GreeceQuestionsSolved],
                hintTwoTaken: req.user.GreeceHints[3 * req.user.GreeceQuestionsSolved + 1],
                hintThreeTaken: req.user.GreeceHints[3 * req.user.GreeceQuestionsSolved + 2],
                answerSubmitted: req.body.response
            }).save();
            await User.updateOne({
                _id: req.user._id
            }, {
                answersArray: [...req.user.answersArray, answer._id],
                score: req.user.score + increaseInScore,
                GreeceQuestionsSolved: req.user.GreeceQuestionsSolved + (answerCorrectness ? 1 : 0),
                latestAnswerTime: submissionTime
            });
        } else if (req.params.country === "Egypt" && req.user.EgyptQuestionsSolved < 5) {
            answerCorrectness = await bcrypt.compare(req.body.response, hashedEgyptAnswers[req.user.EgyptQuestionsSolved]);
            const increaseInScore = answerCorrectness ? marksPerQuestion : 0;
            const answer = await new Answer({
                team: req.user._id,
                time: submissionTime,
                correctness: answerCorrectness,
                questionAttempted: {
                    questionNumber: req.user.EgyptQuestionsSolved,
                    country: "Egypt",
                },
                hintOneTaken: req.user.EgyptHints[3 * req.user.EgyptQuestionsSolved],
                hintTwoTaken: req.user.EgyptHints[3 * req.user.EgyptQuestionsSolved + 1],
                hintThreeTaken: req.user.EgyptHints[3 * req.user.EgyptQuestionsSolved + 2],
                answerSubmitted: req.body.response
            }).save();
            await User.updateOne({
                _id: req.user._id
            }, {
                answersArray: [...req.user.answersArray, answer._id],
                score: req.user.score + increaseInScore,
                EgyptQuestionsSolved: req.user.EgyptQuestionsSolved + (answerCorrectness ? 1 : 0),
                latestAnswerTime: submissionTime
            });
        } else if (req.params.country === "Mayan" && req.user.MayanQuestionsSolved < 5) {
            answerCorrectness = await bcrypt.compare(req.body.response, hashedMayanAnswers[req.user.MayanQuestionsSolved]);
            const increaseInScore = answerCorrectness ? marksPerQuestion : 0;
            const answer = await new Answer({
                team: req.user._id,
                time: submissionTime,
                correctness: answerCorrectness,
                questionAttempted: {
                    questionNumber: req.user.MayanQuestionsSolved,
                    country: "Mayan",
                },
                hintOneTaken: req.user.MayanHints[3 * req.user.MayanQuestionsSolved],
                hintTwoTaken: req.user.MayanHints[3 * req.user.MayanQuestionsSolved + 1],
                hintThreeTaken: req.user.MayanHints[3 * req.user.MayanQuestionsSolved + 2],
                answerSubmitted: req.body.response
            }).save();
            await User.updateOne({
                _id: req.user._id
            }, {
                answersArray: [...req.user.answersArray, answer._id],
                score: req.user.score + increaseInScore,
                MayanQuestionsSolved: req.user.MayanQuestionsSolved + (answerCorrectness ? 1 : 0),
                latestAnswerTime: submissionTime
            });
        } else if (req.params.country === "Bonus" && req.user.bonusQuestionsSolved < 7 && req.user.bonusQuestionsVisible) {
            answerCorrectness = await bcrypt.compare(req.body.response, hashedBonusAnswers[req.user.bonusQuestionsSolved]);
            const increaseInScore = answerCorrectness ? marksPerQuestion : 0;
            const answer = await new Answer({
                team: req.user._id,
                time: submissionTime,
                correctness: answerCorrectness,
                questionAttempted: {
                    questionNumber: req.user.bonusQuestionsSolved,
                    country: "Bonus",
                },
                hintOneTaken: false,
                hintTwoTaken: false,
                hintThreeTaken: false,
                answerSubmitted: req.body.response
            }).save();
            await User.updateOne({
                _id: req.user._id
            }, {
                answersArray: [...req.user.answersArray, answer._id],
                score: req.user.score + increaseInScore,
                bonusQuestionsSolved: req.user.bonusQuestionsSolved + (answerCorrectness ? 1 : 0),
                latestAnswerTime: submissionTime
            });
        }


        if (!req.user.bonusQuestionsVisible) {
            const {
                IndiaQuestionsSolved,
                UnitedKingdomQuestionsSolved,
                GreeceQuestionsSolved,
                EgyptQuestionsSolved,
                MayanQuestionsSolved
            } = await User.findById(req.user._id);
            const bonusQuestionUnlocked = IndiaQuestionsSolved == 5 &&
                UnitedKingdomQuestionsSolved == 5 &&
                GreeceQuestionsSolved == 5 &&
                EgyptQuestionsSolved == 5 &&
                MayanQuestionsSolved == 5;
            if (bonusQuestionUnlocked)
                await User.updateOne({
                    _id: req.user._id
                }, {
                    bonusQuestionsVisible: true
                });
        }
        if (!COUNTRIES.includes(req.params.country))
            return res.redirect("/playground");

        return res.redirect("/playground/" + req.params.country + "/?" + (answerCorrectness ? "correctAnswerSubmitted=true" : "falseAnswerSubmitted=true"));
    } else {
        res.redirect("/");
    }
});

app.get("/admin", (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.adminPrivilege) {
            User.find((err, users) => {
                if (!err) {
                    res.render("admin", {
                        teams: users
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            res.redirect("/playground");
        }
    } else {
        res.redirect("/");
    }
});

app.get("/teamanswerhistory", async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.adminPrivilege && req.query.teamid) {

            if (!mongoose.Types.ObjectId.isValid(req.query.teamid))
                return res.send("this isn't even a mongodb id");

            if (!await User.exists({
                    _id: mongoose.Types.ObjectId(req.query.teamid)
                }))
                return res.send("user doesn't exists");

            const answers = new Array(0);
            const {
                answersArray: teamAnswerIds
            } = await User.findById(req.query.teamid);
            for (const id of teamAnswerIds)
                answers.push(await Answer.findById(id));

            answers.reverse();

            return res.render("teamanswerhistory", {
                answers: answers
            });
        } else {
            return res.redirect("/playground");
        }
    } else {
        return res.redirect("/");
    }
});


app.get("/leaderboard", (req, res) => {
    if (req.isAuthenticated()) {
        (async () => {
            board = await User.find({}, {
                username: 1,
                score: 1,
                latestAnswerTime: 1
            });
            board.sort((left, right) => {
                if (left.score === right.score) {
                    return left.latestAnswerTime - right.latestAnswerTime;
                }
                return right.score - left.score;
            });
            return res.render("leaderboard", {
                board: board
            });
        })(); //Using a Immediately Invoked Function Expression(IIFE) as setting it to async allows mongoodb to act inside as if it returns objects instead of promises
        //and helps me avoide writing many .then functions as everything can be done from the same control flow
    } else {
        return res.redirect("/");
    }
});


app.get("/gethint/:country", (req, res) => {
    if (req.isAuthenticated()) {
        if (req.params.country === "India") {
            let hintIndex = req.user.IndiaQuestionsSolved * 3;
            let newHintTakenArray = req.user.IndiaHints;
            let penalty = 0;
            if (!(req.user.IndiaHints[hintIndex])) {
                newHintTakenArray[hintIndex] = true;
                penalty = penaltyHintOne;
            } else if (!(req.user.IndiaHints[hintIndex + 1])) {
                newHintTakenArray[hintIndex + 1] = true;
                penalty = penaltyHintTwo;
            } else if (!(req.user.IndiaHints[hintIndex + 2])) {
                newHintTakenArray[hintIndex + 2] = true;
                penalty = penaltyHintThree;
            }
            User.updateOne({
                _id: req.user._id
            }, {
                score: (req.user.score - penalty),
                IndiaHints: newHintTakenArray
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            return res.redirect("/playground/India");
        } else if (req.params.country === "UnitedKingdom") {
            let hintIndex = req.user.UnitedKingdomQuestionsSolved * 3;
            let newHintTakenArray = req.user.UnitedKingdomHints;
            let penalty = 0;
            if (!(req.user.UnitedKingdomHints[hintIndex])) {
                newHintTakenArray[hintIndex] = true;
                penalty = penaltyHintOne;
            } else if (!(req.user.UnitedKingdomHints[hintIndex + 1])) {
                newHintTakenArray[hintIndex + 1] = true;
                penalty = penaltyHintTwo;
            } else if (!(req.user.UnitedKingdomHints[hintIndex + 2])) {
                newHintTakenArray[hintIndex + 2] = true;
                penalty = penaltyHintThree;
            }
            User.updateOne({
                _id: req.user._id
            }, {
                score: (req.user.score - penalty),
                UnitedKingdomHints: newHintTakenArray
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            return res.redirect("/playground/UnitedKingdom");
        } else if (req.params.country === "Greece") {
            let hintIndex = req.user.GreeceQuestionsSolved * 3;
            let newHintTakenArray = req.user.GreeceHints;
            let penalty = 0;
            if (!(req.user.GreeceHints[hintIndex])) {
                newHintTakenArray[hintIndex] = true;
                penalty = penaltyHintOne;
            } else if (!(req.user.GreeceHints[hintIndex + 1])) {
                newHintTakenArray[hintIndex + 1] = true;
                penalty = penaltyHintTwo;
            } else if (!(req.user.GreeceHints[hintIndex + 2])) {
                newHintTakenArray[hintIndex + 2] = true;
                penalty = penaltyHintThree;
            }
            User.updateOne({
                _id: req.user._id
            }, {
                score: (req.user.score - penalty),
                GreeceHints: newHintTakenArray
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            return res.redirect("/playground/Greece");
        } else if (req.params.country === "Egypt") {
            let hintIndex = req.user.EgyptQuestionsSolved * 3;
            let newHintTakenArray = req.user.EgyptHints;
            let penalty = 0;
            if (!(req.user.EgyptHints[hintIndex])) {
                newHintTakenArray[hintIndex] = true;
                penalty = penaltyHintOne;
            } else if (!(req.user.EgyptHints[hintIndex + 1])) {
                newHintTakenArray[hintIndex + 1] = true;
                penalty = penaltyHintTwo;
            } else if (!(req.user.EgyptHints[hintIndex + 2])) {
                newHintTakenArray[hintIndex + 2] = true;
                penalty = penaltyHintThree;
            }
            User.updateOne({
                _id: req.user._id
            }, {
                score: (req.user.score - penalty),
                EgyptHints: newHintTakenArray
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            return res.redirect("/playground/Egypt");
        } else if (req.params.country === "Mayan") {
            let hintIndex = req.user.MayanQuestionsSolved * 3;
            let newHintTakenArray = req.user.MayanHints;
            let penalty = 0;
            if (!(req.user.MayanHints[hintIndex])) {
                newHintTakenArray[hintIndex] = true;
                penalty = penaltyHintOne;
            } else if (!(req.user.MayanHints[hintIndex + 1])) {
                newHintTakenArray[hintIndex + 1] = true;
                penalty = penaltyHintTwo;
            } else if (!(req.user.MayanHints[hintIndex + 2])) {
                newHintTakenArray[hintIndex + 2] = true;
                penalty = penaltyHintThree;
            }
            User.updateOne({
                _id: req.user._id
            }, {
                score: (req.user.score - penalty),
                MayanHints: newHintTakenArray
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            return res.redirect("/playground/Mayan");
        } else
            return res.redirect("/playground");
    } else
        res.redirect("/");
});

//below is enviornment code
var port_number = app.listen(process.env.PORT || 3000);
app.listen(port_number, () => {
    console.log("Server started on " + port_number);
});