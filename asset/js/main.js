document.addEventListener("DOMContentLoaded", function () {
    // sc-intro
    const textList = $(".hover-text");

    $(".sc-intro").on("mouseover", ".hover-text", function () {
        const index = textList.index(this);
        textList.each(function (i) {
            const weight = 900 - Math.abs(i - index) * 100;
            const wght = weight > 100 ? weight : 100;
            $(this).css("font-variation-settings", `"wght" ${wght}`);
            $(this).css("font-weight", wght);
        });
    });

    // sc-solution
    gsap.to(".solution-list", {
        scrollTrigger: {
            trigger: ".solution-list",
            start: "0% 30%",
            end: "100% 0%",
            scrub: true,
            // markers: true,
        },
        xPercent: -100,
        
    });

    // sc-description
    document.querySelectorAll(".split").forEach((element) => {
        const text = element.textContent;
        const chars = text
            .split("")
            .map((char) => {
                if (char.trim() === "") {
                    return char;
                } else {
                    return `<span>${char}</span>`;
                }
            })
            .join("");
        element.innerHTML = chars;
    });
});
