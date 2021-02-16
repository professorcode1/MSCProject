//jshint esversion:6
const express = require("express");
const favicon = require('express-favicon');
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
    BonusQuestionsSolved: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5
    }, //0 when constructor is called
    BonusQuestionsVisible: {
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
    //1
    ["You look at the water that is beneath you, clear as the sky that’s above you.",
        "The area is lush with flora and fauna. The fresh air helps you relax and you feel like you are in a dream.",
        "The canoe that you took to reach the destination has stopped now. You step out of the boat, onto the shore and look at a sign nearby, that reads  'കുട്ടനാട്'.",
        "Decipher it to continue."],
    //2
    ["You go the village in Kerala and hire a translator to help you in conversing with the locals.",
        " But the translator is having a bit of a problem, he cant understand what the locals are saying, so you decide to help him by solving the question:"],
    //3
    [""],
    //4
    ["You find the box using the path that was described in the scrolls. but as soon you look at the box, you see a complicated lock that you have to solve it to open the damn thing up.",
        "solve the question:",
        "Find all the palindromes in the given string and input the answer according to the sample case given below:",
        "string: acdcdcaabbaaadaadacdaadcadna",
        "palindromes in it: abba and cdaadc",
        "answer: 4 2 2 2 (4a, 2b, 2c and 2d)",
        "Actual string: adcaabbaaacdcdcdcdbbcaacbadcadcadccbcbcbcaadcbbcdaddaabbaaddbcdadcddaabbaddaaccaadcaaadbaabbccb"],
    //5
    ["After opening the box, you look at its contents and notice that not all the coins are the same.upon expecting a few coins, you realise that they are all fake.",
        "you figure out that there is only one real coin.",
        "You notice that all the fake coins are really light, as if they are not made out of gold but some kind of resin.You also notice that its getting dark and dangerous to return.",
        "you decide to take the box to the village with you.",
        "upon returning, you decide to pay the translator and the three man team, but all of the people turn on you and demand that they get the largest share of the coin.",
        "After a bit of an arguement, you come to the conclusion that you will propose a plan of dividing the coins amongst the group, and the group gets to vote if the plan is good or not.",
        "If the majority votes yes, or if its a tie, your plan will pass and the coins will be divided according to it, other wise you will be kicked and the 4 remaining members will continue the same logic with a new group leader.You have to ensure that you get the largest amont of coins so that you have the highest probability of finding the real coin.",
        "Here are the some of the things taht you should know:",
        "1) Each one of you wants to have the highest number of coins.",
        "2) if you fail to have the majority vote, you will be kicked and replaced with a new leader and the cycle will continue until only one member is remains.The order will be: You -> Translator -> team member 1 -> tm2 -> tm3.",
        "3) Everyone has to vote",
        "4) You cant bribe anyone, or form alliances",
        "5) Everyone knows that everyone present in the room is greedy.There are 5 members, including you.",
        "6) Everyone is a perfect logician and greedy, and everyone knows about this.",
        "7) There are a total of 500 coins.",
        "\n",
        "The format of the solution will be: (your coins) (translator's coin) (tm1 coins) (tm2 coins) (tm3 coins)"]
];
const IndiaHints = [
    "Its the name of a village in south India",
    "Its an Indian Language",
    "Malyalam",
    "Morse code",
    "-.. . . .--. / .. -. - --- / - .... . / ..-. --- .-. . ... - --..-- / .-.. .. . ... / .- / -... --- -..- / --- ..-. / -.-. ..- .-. ... . ... / .- -. -.. / .-. .. -.-. .... . ... --..-- / ..-. .. .-.. .-.. . -.. / .-- .. - .... / --. .-. . . -.. --..-- / . -. ...- -.-- --..-- / .... .- - .-. . -.. --..-- / .--. .- .. -. --..-- / -.. .. ... . .- ... . --..-- / .... ..- -. --. . .-. --..-- / .--. --- ...- . .-. - -.-- --..-- / .-- .- .-. --..-- / .- -. -.. / -.. . .- - .... --..-- / -... ..- - / .- .-.. ... --- / .... --- .--. .",
    "There are 26 words",
    "Name of lane might help you!",
    "background might help you find the right answer",
    "secret lane of a state",
    "A palindrome is a word, number, phrase, or other sequence of characters which reads the same backward as forward, such as madam or racecar. There are no meaningful palindromes",
    "There are multiple palindromes",
    "There are 8 palindromes",
    "Start thinking in the reverse order",
    "Not everyone will recieve a coin, some will go empty handed",
    "You only have to give coins to tm1 and tm3",
];
const hashedIndiaAnswers = [
"$2b$08$2eTQpkOqcxFNfKMX6sXosuS57H1FIVIMfHY.qUTfCf3FOfbB5thL6",
"$2b$08$ephXxnWrCf1xbmV6UlRwHOmHELZ1QoYatrkHwTPx7ldmm63wHDf5K",
"$2b$08$jgoEwEbho/r7JxAo7qNpKO7cyrmbYPlzVDpl8HR3LFHNuPDCyMlDq",
"$2b$08$l8G3tFEInGJ3ErMApbs7Qee5tT.shiLCnxT3ucedmtsboekUbvivu",
"$2b$08$pWxgICU7AZcNRrjd2bUr6eZUh/ObCElZNCEF7lfyqbU/UzzvTqeqy"
];
const UnitedKingdomQuestions = [
    //1
    ["PLBBDXIUZNOWQOYGBEWCXJUNXTHNUPKWPFPUDRYNQQWXRSJYVZUCAQQXWKJVLHWDXQNGKGIKVTJLWKQNAXRQCOCW"],
    //2
    ["On your journey to the next stop you find a strange old man, who wants to give you 100 point but on the condition you solve his doubt,he wants to know in unique ways, how many ways are there to write “10000” as a sum of at least 2 natural numbers.",
        "Enter the answer modulo the biggest prime number below 10^12"],
    //3
    ['“Some people don’t like to socialize, do you? Who else doesn’t by the way?”',
        '“The profile you are looking for is in the format “answer to above_270221”'],
    //4
    ["Given an input string, convert the alphabets to numbers then the same to binary.",
        "Then….then what? Observe maybe.",
        " loremipsumdolorsitametconsecteturadipisicingelitametlaboriosamcupiditatefacilisaliquidodiopraesentiumullamsintrati",
        " Input string: club name"],
    //5
    [""],
];
const UnitedKingdomHints = [
    "What Wikipedia article does it lead to, what to do with it now though",
    "Think about the cipher- picture might help",
    " https://drive.google.com/file/d/195CXqfjtMjQo4bgKwDNROuK_hr_dQLVg/view?usp=sharing",
    "The prime you are looking for is 999999999989",
    "Memorization",
    "What did you learn from the infamous Coin Change problem",
    "Introvert or extrovert or both. What was the date of the event again?",
    'Think about the first clue “answer_SOME DATE”, emphasis on bold.',
    "The answer is some format that made it 10 characters long",
    "note the same lengths of the binary and the text ",
    "include exclude ",
    "alphabets corresponding to one are in the final answer rest not",
    "What does the DIMENSION mean",
    "Some coordinates are hidden in plain sight",
    "An important person from the city shown by the coordinates",
];
const hashedUnitedKingdomAnswers = [
"$2b$08$s6r5O5.7Cl9I3OODlsAyA.FCaaJ2u4LbTZhbeWMF2vY1F823ga7KG",
"$2b$08$.dJTzERpLG4G53Z3vDWKz.NI99Wqd/kZQRNryLquv/jZrfYS16maC",
"$2b$08$OAiGKJ/bP40BpcRRlF8V/OMksJ7WWIwAZdloNdqKE85vRMm8TL9Y.",
"$2b$08$P64f8WNp8yYu3PNEyAum3e9x/K5S9QfaBtJRbRXconKCcwSPwwvPa",
"$2b$08$9jicgscqejSsd1rhJfBZUuk1KvE603/1PTFGF6V8iGoj.g5e/vaIq"
];
const GreeceHints = [
    "a patterned ring",
    "atlantic ocean",
    "island of atlas",
    "voyager 2 space mission's last flyby",
    "greek,frenc,german,english",
    "levante voiture",
    "secret message passing",
    "sequence matters",
    "decoding is reverse of encoding",
    "num%10 gives the last digit of the number",
    "euclidean gcd algorithm",
    "first digit of answer is 2",
    "there were 12",
    "athens 1896",
    "maybe the answer lies in who poseidon really was",
];
const hashedGreeceAnswers = [
    "$2b$08$pKh8feuF01YgqDjQlqo6reALC4Qyzwy4M9cmRpVsma8GfzN6jZZ.S",
    "$2b$08$5AkbVeK31AhJh1SQc8pyu.m3GxG2VUJ8ribjq8HF3TQGhhCiCWmlm",
    "$2b$08$0IlMbh8ByUmlGfcCdxtY7OTSjqFugNHyEp2m8PIaVAAQXPPXn9cU.",
    "$2b$08$8B9RSGFk7M5XWsje3aZQYOBBr.jKXD20It.rojxrm8II2BdPz3j9a",
    "$2b$08$vsvKw0NUu2x3NSq/iYHkVe.knh3o0ZuBS2uDsbZNxRfe3N4x4tu.G"
];
const EgyptQuestions = [
    //1
    ["qccyb://maren.pxxpun.lxv/orun/m/1XQ45QAizLJ3E_cQeK7QtwGcgUPyYyEhk/ernf?dby=bqjarwp"],
    //2
    ["who am i? a human? a falcon? a sheep or a lion?",
        "what is my purpose? All i know is my riddle to guard my city.",
        "that truly is my only identity."],
    //3
    ["Beterest seems to have a keen interest in cubes. He challenges you to competition.",
        "He will help you only if you beat him in this challenge. He will give you a number your task is to find the sum of odd powers of that number till the number itself:",
        "eg: if the given number is 3 then answer will be 3^1+3^3 = 30",
        "since the sum can be huge compute it modulo 998244353",
        "given input : 55677"],
    //4
    ["you start moving ahead and due to very poor/bad/horrible/extremely bad luck, you trigger a trap.",
        "You fall down and land in a large open space with no walls in sight.",
        " You start heading in a random direction and encounter following text written on a board.",
        "",
        "Bakkar s10 / Super Henedi s5 = ?"],
    [""]

];
const EgyptHints = [
    "Julius Caesar",
    "a->j",
    "https://drive.google.com/file/d/1OH45HRzqCA3V_tHvB7HknXtxLGpPpVyb/view?usp=sharing and just google the text",
    '“you answer the riddle or you die”',
    "all i need is my true identity",
    "waset",
    "Making a special power function might help",
    "Temp = n1; for(){n1=(n1*temp)%mod}",
    "for(){if(){ans=(ans+special_pow(n1,i))%m}}",
    "Common factor maybe?",
    "Well, answer is a name of place",
    "The City of the dead studios.",
    "Performing some oprations on there heiroglyphs.",
    "https://www.wikiwand.com/en/Gardiner%27s_sign_list",
    "Add Ascii values of each code ",
];
const hashedEgyptAnswers = [
    "$2b$08$jzfcErucU/SzIFnSvym.feIsuXSx4UK60urBqn/kTWff8teGIiImC",
    "$2b$08$D645zGiUmLWzuOzONOcWZOgaP8YeRPpBZy4NTz4opJHkk4jXfIUcC",
    "$2b$08$JaK2TlPmvUXcSFKj8XvErOzzPxswIgqanZN3aa1QA/uNlvYj9Ldrm",
    "$2b$08$xYSt5g1DNAu6RLcIPdWMT.CrlRT97/qnIJQY3GKibJ4TiKUne/R0y",
    "$2b$08$2MnjwMtFObU6YOTKbE7nD.nB4qJsM2hxlm.GXrihPrFzMZpPNsaba"    
];
const MayanQuestions = [
    //1
    ["You arrive on the continent of South America, via a cruise ship.",
        "Exhausted and tired, you go to a motel and find an empty to pass out on, thinking about what to do and how to do it.",
        "Just then, you suddenly remember about the stone tablet you saw at a museum and google it out.",
        "Decipher the text on it to find out the location:",
        '“25 57 85 69 77 46 48 46 64 98 69 88 47 39 48 57 88 70 75 39 58 34 66 87 48 55 68 47 37 85 67 59 88 78 76 24 85 86 59 87 68 35 38 57 87 46 87 75 48 44 55 65 47 55 56 36 24 65 78 49 58 39 57 25 57 98 87 59 39 57 57 65 69 57 86 39 35 57 77 69 46 69 67 58 34 74 88 80 77 68 67 24 73 67 46 77 68 35 67 53 87 49 79 69 68 58 55 99 78 68 45 48 46 56 86 50 88 58 45 37 75 68 79 67 39 68 55 57 65 78 89 66 39”'],
    //2
    ["After reaching your destination , Standing at the foot of the mountain , you decide to climb up.",
        "Some of the stones of the of the steps are faulty/broken and to avoid being hurt you plan to avoid those stones.",
        "Identify these.",
        "Solve this question to move ahead.",
        "Question:",
        "create a multiplication table of division modulo 26 upto 50",
        "Choose the elements from the matrix in the order aij, such that j = i-1. Arrange the series in ascending order and remove any duplicate elements.",
        "For example, in this, the answer would be: 0 2 6 12 20"],
    //3
    ["In the city of macchu Picchu, you’re clueless so you head to the ancient town hall filled with tourists.",
        "The place  has  run down walls , covered with ancient texts. you ask around the tourist guide for legends/ mystical objects that you could find, but to your disappointment, the language the tourist guide uses is unknown to you.",
        "Solve it to continue:",
        '“hannankayuku”',
        "where all three realms meet"],
    //4
    [""],
    //5
    ["You reach the temple of the moon. There’s a large chest",
        "Decipher the text given to find your next intruction:",
        "oafpdxj .lbsj aelu loa kupm va aubvjjh hazup nupdvssvm loa va vn"]
];
const MayanHints = [
    "a supporter of an extreme Russian revolutionary party c. 1900 which found nothing to approve of in the established social order.",
    "a person who believes that life is meaningless and rejects all religious and moral principles",
    "Synonym Of Atheist",
    "In computing, the modulo operation returns the remainder of a division, after one number is divided by another (called the modulus of the operation).",
    "https://www.geeksforgeeks.org/multiplicative-inverse-under-modulo-m/",
    "There are 7 digits",
    "Its a place",
    "Its a temple",
    "To the moon",
    "Collect the numbers",
    "Add the numbers that you have gathered",
    "There’s only one path",
    "raseac rehpic",
    '“You see, things aren`t sequential. Good doesn`t lead to good, nor bad to bad. People who steal, don`t get caught, live the good life.”',
    "This is a jigsaw puzzle",
];
const hashedMayanAnswers = [
"$2b$08$4WUlq1kQrBZ/7gQJSgWHrOURypY/moQN49.f6wS72pcOSr/7v.hwW",
"$2b$08$jNoa7RlxB7bJCh9extf9gu8/FWwMZRPot8cqMsocL/qbbhGyyYW8y",
"$2b$08$9ZQCSqB7LE3weLZeOyhwQ.C1GmxhisXa1XBPuM0qkZ3Itvp.RZqSC",
"$2b$08$s.MzqzMrAA2OmJBKPgzMruIKsNapeYQ.SpR/0q.Wx3jKsue3hQjxK",
"$2b$08$/0L3tjwQXTqd9H70CarMbOVuCsUdzdpbwFxF9xmidooV7FlCpmTdS"
];
const BonusQuestions = [
    "",
    "",
    ["https://drive.google.com/file/d/1kEHRQi3MQsH4AdujrDPmD8GlpnWVcDFw/view?usp=sharing", "oct Ysvtbmir cxyittty wimij "],
    ["Ahh! I am on cAffine 7x24, Now I don’t know how I got this code -",
        "Waxx C tsl’b qlsw wvk ek Lybyx cu lsb wsnqclo sl Dalsl.",
        "C ecovb os hsn Umsnzcs lsw.",
        "Ksi qlsw wval cb wcxx fa sib?(tteekkkk)",
        "Please help me solve this."],
    ""
];
const hashedBonusAnswers = [
    "$2b$08$Zmmz554McFr4Jou82rIDhuSthv1.3sj/Z0QGPG0qRGiZM5SQgC2fS",
    "$2b$08$GHJWQp2sNZQbcN8kGuLGNerqoviUEt4qc1f13AMfZgTQxVlFm2T4y",
    "$2b$08$o/pKc9GVCkZdY4HVg5vtpunbNO1NRgaDaVCS6MTFeSu/ZQM2PRFb6",
    "$2b$08$mi.x.qBi6KxfpuZKTBLmBOKHO7zBXjNktZ3E/MDjrpYuPFlPymSDO",
    "$2b$08$0mDNckSrxwCJqkauo6/pX.cbq.ctOD1F3TyDwnce4yOhrafN9KV46"
];

app.get("/", (req, res) => res.sendFile(__dirname + "/webPages/index.html"));

app.get("/easteregg", (req, res) => {
    res.sendFile(__dirname + "/webPages/easter.html");
});
app.get("/loginFailed", (req, res) => res.render("message", {
    message: "You password or Username was incorrect. Try again"
}));


app.get("/login", (req, res) => res.sendFile(__dirname + "/webPages/login.html"));
app.post("/login", function (req, res) {
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
    console.log("called");
    User.exists({
        username: req.body.username
    }, (err, usernameTaken) => {
        if (usernameTaken) {
            res.render("message", {
                message: "Sorry, username taken"
            });
            return;
        } else {
            let numOfMem;
            if (req.body.numOfMem === "one")
                numOfMem = 1;
            else if (req.body.numOfMem === "two")
                numOfMem = 2;
            else if (req.body.numOfMem === "three")
                numOfMem = 3;
            User.register({
                username: req.body.username,
                numerOfMembers: numOfMem,
                memberOneName: req.body.nameOfMem1,
                memberOneEmail: req.body.emailOfMem1,
                memberOneInstitute: "req.body.instituteOfMem1",
                memberTwoName: req.body.nameOfMem2,
                memberTwoEmail: req.body.emailOfMem2,
                memberTwoInstitute: "req.body.instituteOfMem2",
                memberThreeName: req.body.nameOfMem3,
                memberThreeEmail: req.body.emailOfMem3,
                memberThreeInstitute: "req.body.instituteOfMem3",
            }, req.body.password, (err, user) => {
                if (!err) {
                    passport.authenticate("local")(req, res, function () {
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

app.get("/indiaQuestion2Audio", (req, res) => res.sendFile(__dirname + "/public/indianAudioQue2.mp3"));

app.get("/indiaQuestion3Photo", (req, res) => res.sendFile(__dirname + "/webPages/indiaScroll2.jpeg"));

app.get("/UnitedKingdomQuestion1Photo", (req, res) => res.sendFile(__dirname + "/webPages/UnitedKingdomQuestion1Photo.png"));

app.get("/lzxnq", (req, res) => res.sendFile(__dirname + "/webPages/UnitedKingdomQuestion5Photo.png"));

app.get("/greece", (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/webPages/greeceScroll" + req.user.GreeceQuestionsSolved + ".png");
    } else {
        res.redirect("/login");
    }
});

app.get("/mayanQuestion2Photo", (req, res) => res.sendFile(__dirname + "/webPages/mayanScroll1.jpg"));

app.get("/mayanMazeQuestion4", (req, res) => res.sendFile(__dirname + "/webPages/mayanMazeQuestion4.png"));

app.get("/bonus", (req, res) => {
    if (req.isAuthenticated()) {
        if (Number(req.user.BonusQuestionsSolved) === 4)
            return res.redirect("/nothinginside.jpg");
        return res.sendFile(__dirname + "/webPages/bonusScroll" + req.user.BonusQuestionsSolved + ".png");
    } else {
        return res.redirect("/login");
    }
});

app.get("/nothinginside.jpg", (req, res) => res.sendFile(__dirname + "/webPages/nothinginside.jpg"));

app.get("/EgyptQuestion5", (req, res) => res.sendFile(__dirname + "/webPages/EgyptQuestion5.html"));

app.get("/playground/:country", (req, res) => {
    //state can be "falseAnswerSubmitted" which que's us to tell the user he submitted a false answer,
    //state can be "correctAnswerSubmitted" which que's us to tell the user he submitted the correct answer,
    //state can be "showConfirmationCard" which means user asked for a hint and we need to show him confirmation card.
    //state can be "cooldownViolated" which mean user submitted before the cooldown period was complete
    let clue = "Ahh! I knew you will look for a key here, but sorry it’s not here \n";
    clue += "Want a hint??? \n"
    clue += "Since you are smart enough to search key here, I will give you a hint"
    clue += "Key was in front of you even before this event started must have seen an easter egg, if you don’t have any idea. You CIRCLED around that key again and again."
    clue += "and yes, just for your info - I make sensible things, but I won’t force you to do anything"
    clue += "gotcha?"
    if (req.isAuthenticated()) {
        // a card status of 1 reflects that card is locked, 2 reflects card is asking "are you sure", 3 reflects card is unlocked
        if (req.params.country === "Bonus" && !req.user.BonusQuestionsVisible)
            return res.render("message", {
                message: "Plase solve all 5 questions from all 5 countries before trying to access stage 2 questions."
            });

        if (req.user[req.params.country + "QuestionsSolved"] == 5)
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
                questionContent: BonusQuestions[req.user.BonusQuestionsSolved],
                questionNumber: req.user.BonusQuestionsSolved,
                cooldownViolated: (req.query.cooldownViolated ? true : false),
                clue: req.user.BonusQuestionsSolved == 0 ? clue : "",
                photoQuestion: Number(req.user.BonusQuestionsSolved) === 0 || Number(req.user.BonusQuestionsSolved) === 1 || Number(req.user.BonusQuestionsSolved) === 4 ? true : false,
                country: "Bonus"
            });
        } else
            return res.redirect("/playground");
    } else
        res.redirect("/login");
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
        } else if (req.params.country === "Bonus" && req.user.BonusQuestionsSolved < 5 && req.user.BonusQuestionsVisible) {
            answerCorrectness = await bcrypt.compare(req.body.response, hashedBonusAnswers[req.user.BonusQuestionsSolved]);
            const increaseInScore = answerCorrectness ? marksPerQuestion : 0;
            const answer = await new Answer({
                team: req.user._id,
                time: submissionTime,
                correctness: answerCorrectness,
                questionAttempted: {
                    questionNumber: req.user.BonusQuestionsSolved,
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
                BonusQuestionsSolved: req.user.BonusQuestionsSolved + (answerCorrectness ? 1 : 0),
                latestAnswerTime: submissionTime
            });
        }


        if (!req.user.BonusQuestionsVisible) {
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
                    BonusQuestionsVisible: true
                });
        }
        if (!COUNTRIES.includes(req.params.country))
            return res.redirect("/playground");

        return res.redirect("/playground/" + req.params.country + "/?" + (answerCorrectness ? "correctAnswerSubmitted=true" : "falseAnswerSubmitted=true"));
    } else {
        res.redirect("/login");
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
        res.redirect("/login");
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
        return res.redirect("/login");
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
        return res.redirect("/login");
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
        res.redirect("/login");
});

//below is enviornment code
var port_number = app.listen(process.env.PORT || 3000);
app.listen(port_number, () => {
    console.log("Server started on " + port_number);
});