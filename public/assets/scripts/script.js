//GSAP shit
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    console.log("set cookie done");
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    console.log(ca);
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var check = getCookie("anim");



let cursor = gsap.to('.overlay_cursor', {
    opacity: 1,
    ease: "power4.inOut",
    repeat: -1
})
let cursor1 = gsap.to('.overlay_cursor1', {
    opacity: 1,
    ease: "power4.inOut",
    repeat: -1
}).pause()
let words = [
    "(Knock Knock)",
    "(angrily) What do you want..?",
    "Cache-Quest 2.0, Maybe wrong li..",
    "Eh, More Nerds, Come in.."
]


$(".overlay").dblclick(function() {
    overlayTL_1.seek("End", false)
})



let overlayTL_1 = gsap.timeline({
    delay: 1
});


if (check == true) {
    console.log("cookie found");
} else {
    words.forEach(tlChange);
    var val = true;
    setCookie("anim", val, 365);
}

function tlChange(word, index) {

    let tl;
    switch (index) {
        case 0:
            tl = gsap.timeline({
                repeat: 1,
                yoyo: true,
                repeatDelay: 1
            })
            tl.to('.overlay_text', {
                duration: 1,
                text: word
            })
            overlayTL_1.add(tl)
            break;
        case 1:
            tl = gsap.timeline({
                repeat: 1,
                yoyo: true,
                repeatDelay: 1
            })
            tl.to('.overlay_text', {
                duration: 1,
                text: word
            })
            overlayTL_1.add(tl)
            break;
        case 2:
            tl = gsap.timeline({
                repeat: 1,
                yoyo: true,
                repeatDelay: 1
            })
            tl.to('.overlay_text', {
                duration: 1,
                text: word
            })
            overlayTL_1.add(tl)
            break;
        case 3:
            tl = gsap.timeline({
                repeat: 1,
                yoyo: true,
                repeatDelay: 1,
                onComplete: () => {
                    cursor.pause()
                    $(".overlay_cursor").css("opacity", 0);
                }
            })
            tl.to('.overlay_text', {
                duration: 1,
                text: word
            }, "=-1")
            overlayTL_1.add(tl)
            break;
    }
}

overlayTL_1.to('.overlay_text1', {
        duration: 2,
        text: "*the door opens*",
        onStart: () => {
            cursor1.play()
        },
        onComplete: () => {
            $(".skip_text").css("opacity", "0");
        }
    }, "-=1.5")

    .addLabel("End")
    .to(".overlay", {
        y: "-=100vh",
        onComplete: () => {
            $("body").css("overflow", "")
        },
        delay: 0.5
    })