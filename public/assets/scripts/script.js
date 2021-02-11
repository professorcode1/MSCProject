
// GSAP Animation
// var menu_text = document.querySelectorAll(".menu_text")

// for (let i = 0; i < menu_text.length; i++) {
//     menu_text[i].addEventListener("mouseenter",() => {
//     var tl = gsap.timeline();
//     tl.to(`.menu_text svg`, {duration : .1,opacity : 0})
//     .to (`.menu_text span`, {duration : .1,opacity : 1})

//     .play();
//     });

//     menu_text[i].addEventListener("mouseleave",() => {
//     var tl = gsap.timeline();
//     tl.to (`.menu_text span`, {duration : .1,opacity : 0})
//     .to(`.menu_text svg`, {duration : .1,opacity : 1})

//     .play();
//     })
// }

// Barba js
function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, n);
    });
}

function pageTransition() {
    var tl = gsap.timeline();
    tl.to(".loading-screen", {
        duration: 1.2,
        transform: "translateX(0)",
        ease: "Expo.easeInOut"
    });
    // tl.from("#loadsvg",{x:50},"-=1.2")
    tl.to(".loading-screen", {
        duration: 1,
        transform: "translateX(100vw)",
        ease: "Expo.easeInOut",
        delay: 0.3,
    });
    tl.set(".loading-screen", { transform: "translateX(-100vw)" });
}


barba.init({

    sync: true,
    transitions: [
            {
                async afterLeave(data) {
                    const done = this.async();

                    pageTransition();
                    await delay(1000);
                    done();
                },

                async enter(data) {
                    //contentAnimation();
                },

                async once(data) {
                    //contentAnimation();
                },
            },
        ],
})

