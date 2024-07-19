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
            start: "0% 40%",
            end: "150% 0%",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
                const items = document.querySelectorAll(".solution-list li");
                const centerScreenX = window.innerWidth / 2; // 화면 중앙 위치 계산
                let closestItem = null; // 화면 중앙에 가장 가까운 아이템
                let minDistance = Infinity; // 현재까지 계산된 가장 작은 거리(초기 값은 매우 큰 값으로 설정)

                items.forEach((item) => {
                    const rect = item.getBoundingClientRect();
                    const itemCenterX = rect.left + rect.width / 2; // 아이템의 왼쪽 위치에 아이템 너비의 절반을 더해 중앙값 계산
                    const distance = Math.abs(centerScreenX - itemCenterX); // 현재 아이템과 화면 중앙 사이의 거리(절대값)

                    if (distance < minDistance) {
                        closestItem = item;
                        minDistance = distance;
                    }
                });

                if (closestItem) {
                    const itemName = closestItem.getAttribute("data-name");
                    document.querySelector(".item-text").textContent = itemName;
                }
            },
        },
        xPercent: -50,
    });

    $(".solution-list").hover(function () {
        const cursor = $(".cursor");
        cursor.toggleClass("on");
    });

    const cursor = document.querySelector(".cursor");
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let speed = 1; // 커서의 움직임 속도

    document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // 마우스 위치에 따라 커서 위치를 천천히 변경
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        // 커스텀 커서의 위치를 업데이트
        cursor.style.transform = `
              translate(${cursorX - cursor.offsetWidth / 2}px, ${cursorY - cursor.offsetHeight / 2}px)
          `;

        requestAnimationFrame(animate);
    }

    animate();

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

    gsap.from(".description-wrapper .description .split span", {
        scrollTrigger: {
            trigger: ".description-wrapper .description",
            start: "0% 60%",
            end: "100% 50%",
            scrub: true,
            // markers: true,
        },
        color: "#656565",
        stagger: 0.1,
    });

    // sc-partners
    gsap.from(".partner-list", {
        scrollTrigger: {
            trigger: ".partner-list",
            start: "0% 70%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        y: 100,
        opacity: 0,
    });
});
