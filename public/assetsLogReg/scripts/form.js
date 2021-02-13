// fullpage.js
new fullpage('#fullpage', {
    autoScrolling:true,
    loopBottom: false,
    anchors:['register', 'login'],
    scrollHorizontally: true,
    showActiveTooltip: true,
    loopHorizontal: false,
    dragAndMove:true,
    css3: false,
    easing: 'easeOutQuint'
});
fullpage_api.setAllowScrolling(true);

// Forms API

document.addEventListener("DOMContentLoaded", function() {
    var elements = document.getElementsByTagName("INPUT");
    for (var i = 0; i < elements.length; i++) {
        elements[i].oninvalid = function(e) {
            e.target.setCustomValidity("");
            if (!e.target.validity.valid) {
                e.target.setCustomValidity("Ayo Fill this (-_-)");
                var error = document.getElementsByClassName("ui error message");
            }
        };
        elements[i].oninput = function(e) {
            e.target.setCustomValidity("");
        };
    }
})

// -------------------------------

// 1. Responsive
// 2. Jquery step form validation
// 3. Hiding lad2 lad3
// 4. Mp4 to webm

// -------------------------------


// Disabling the lads section

// var select = document.querySelector(".ui.fluid.search.dropdown")
// select.addEventListener("change", () => {
//     var selIndex = select.selectedIndex;
//     switch (selIndex) {
//         case 0:
//         // document.querySelector("#ladTwo").classList.toggle("slide");
//         // document.querySelector("#ladThree").classList.toggle("slide");
//             break;
//         case 1:
//             document.querySelector("#ladTwo").classList.add("slide").add("fp-slide").add("fp-table");
//             document.querySelector("#ladTwo").classList.remove("hide");
//             alert(document.querySelector("#ladTwo").classList);
//             // document.querySelector("#ladThree").classList.toggle("slide");
//             break;
//         case 2:
//             document.querySelector("#ladTwo").classList.add("slide").add("fp-slide").add("fp-table");
//             document.querySelector("#ladTwo").classList.remove("hide");
//             document.querySelector("#ladThree").classList.add("slide").add("fp-slide").add("fp-table");
//             document.querySelector("#ladThree").classList.remove("hide");
//             alert(select.selectedIndex);
//             break;
//     }
// });