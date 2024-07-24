document.addEventListener("DOMContentLoaded", function () {
    function debounce(func, sec) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), sec);
        };
    }

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
    let animateInterval;
    function initCicleAnimate() {
        if (animateInterval) {
            clearInterval(animateInterval);
        }

        if (window.innerWidth > 768) {
            function circleAnimate() {
                const randomX = Math.random() * 200; // 0 ~ 200
                const randomY = Math.random() * 200; // 0 ~ 200

                gsap.to(".sc-solution", {
                    duration: 6,
                    "--translate-x": `${randomX}%`,
                    "--translate-y": `${randomY}%`,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1,
                });
            }

            circleAnimate();
            animateInterval = setInterval(circleAnimate, 6000);
        } else {
            gsap.killTweensOf(".sc-solution");
            gsap.set(".sc-solution", { "--translate-x": 0, "--translate-y": 0 });
        }
    }

    initCicleAnimate();
    const debouncingInitCircleAnimate = debounce(initCicleAnimate, 200);
    window.addEventListener("resize", debouncingInitCircleAnimate);

    let swiper;

    function initResizeCarousel() {
        // 이벤트 리스너 제거
        $(document).off("mousedown touchstart", dragStart);
        $(document).off("mouseup touchend", dragEnd);
        $(document).off("mousemove touchmove", drag);
        $(window).off("wheel");

        if (window.innerWidth > 768) {
            if (swiper) {
                swiper.destroy();
                swiper = undefined;
            }

            let xPos = 0;
            let isDragging = false;

            gsap.timeline()
                .set(".solution-list", { rotationY: 180, cursor: "grab" }) // 초기 rotationY를 설정하여 파라락스 점프가 화면 밖에서 발생하도록 설정
                .set(".solution-item", {
                    rotateY: (i) => i * -45,
                    transformOrigin: "50% 50% 1200px",
                    z: -1200,
                    backgroundPosition: (i) => getBgPos(i),
                    backfaceVisibility: "hidden",
                })
                .from(".solution-item", {
                    duration: 1.5,
                    opacity: 0,
                    ease: "expo",
                })
                .add(() => {
                    $(".solution-item").on("mouseenter", (e) => {
                        let current = e.currentTarget;
                        // gsap.to(".solution-item", { opacity: (i, t) => (t == current ? 1 : 0.5), ease: "power3" });
                    });
                    $(".solution-item").on("mouseleave", (e) => {
                        // gsap.to(".solution-item", { opacity: 1, ease: "power2.inOut" });
                    });
                }, "-=0.5");

            $(document).on("mousedown touchstart", dragStart);
            $(document).on("mouseup touchend", dragEnd);

            $(window).on("wheel", (e) => {
                if (!isDragging) {
                    const delta = e.originalEvent.deltaY;
                    gsap.to(".solution-list", {
                        rotationY: "+=" + (delta > 0 ? 45 : -45), // 회전 방향을 반대로 설정
                        onUpdate: () => {
                            gsap.set(".solution-item", { backgroundPosition: (i) => getBgPos(i) });
                        },
                    });
                }
            });

            function dragStart(e) {
                if (e.touches) e.clientX = e.touches[0].clientX;
                xPos = Math.round(e.clientX);
                gsap.set(".solution-list", { cursor: "grabbing" });
                $(document).on("mousemove touchmove", drag);
                isDragging = true;
                e.preventDefault();
                e.stopPropagation();
            }

            function drag(e) {
                if (e.touches) e.clientX = e.touches[0].clientX;

                gsap.to(".solution-list", {
                    rotationY: "-=" + ((Math.round(e.clientX) - xPos) % 360),
                    onUpdate: () => {
                        gsap.set(".solution-item", { backgroundPosition: (i) => getBgPos(i) });
                    },
                });

                xPos = Math.round(e.clientX);
                e.preventDefault();
                e.stopPropagation();
            }

            function dragEnd(e) {
                $(document).off("mousemove touchmove", drag);
                gsap.set(".solution-list", { cursor: "grab" });
                setTimeout(() => (isDragging = false), 50);
                e.preventDefault();
                e.stopPropagation();
            }

            function getBgPos(i) {
                // 각 이미지에 파라락스 효과를 생성하기 위해 background-position 문자열을 반환
                return 100 - (gsap.utils.wrap(0, 360, gsap.getProperty(".solution-list", "rotationY") - 180 - i * 45) / 360) * 1200 + "px 0px";
            }
        } else {
            if (!swiper) {
                swiper = new Swiper(".swiper", {
                    slidesPerView: "auto",
                    centeredSlides: true,
                    spaceBetween: 15,
                    loop: true,
                    pagination: {
                        el: ".swiper-pagination",
                        type: "bullets",
                        clickable: true,
                        renderBullet: function (index, className) {
                            if (index < 4) {
                                return '<span class="' + className + '"></span>';
                            }
                            return "";
                        },
                    },
                    grabCursor: true,
                    keyboard: {
                        enabled: true,
                    },
                    on: {
                        slideChangeTransitionEnd: function () {
                            updateContent();
                            updatePagination(swiper.realIndex);
                        },
                    },
                });

                function updateContent() {
                    const activeSlide = document.querySelector(".swiper-slide-active");
                    const itemDescription = activeSlide.getAttribute("data-description");
                    const itemName = activeSlide.getAttribute("data-name");

                    document.querySelector(".item-description").textContent = itemDescription;
                    document.querySelector(".item-text").textContent = itemName;
                }

                function updatePagination(realIndex) {
                    const bullets = document.querySelectorAll(".swiper-pagination-bullet");
                    const bulletIndex = realIndex % 4;

                    bullets.forEach((bullet, index) => {
                        bullet.classList.remove("swiper-pagination-bullet-active");
                    });

                    if (bullets[bulletIndex]) {
                        bullets[bulletIndex].classList.add("swiper-pagination-bullet-active");
                    }
                }

                updateContent();
            }
        }
    }

    initResizeCarousel();
    const debounceInitResizeCarousel = debounce(initResizeCarousel, 200);
    window.addEventListener("resize", debounceInitResizeCarousel);

    // custom cursor
    $(".solution-list").hover(function () {
        const cursor = $(".cursor");
        cursor.toggleClass("on");
    });

    const cursor = document.querySelector(".cursor");
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        cursor.style.transform = `translate(${mouseX - cursor.offsetWidth / 2}px, ${mouseY - cursor.offsetHeight / 2}px)`;

        requestAnimationFrame(animate);
    }

    animate();

    // cursor grab
    $(".solution-list").on("mousedown", function (event) {
        $(".cursor").addClass("grab");
    });

    $(document).on("mouseup", function () {
        if ($(".cursor").hasClass("grab")) {
            $(".cursor").removeClass("grab");
        }
    });

    // Prevent default drag behavior
    $(".solution-list").on("dragstart", function (event) {
        event.preventDefault();
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

    gsap.from(".description-wrapper .description .split span", {
        scrollTrigger: {
            trigger: ".description-wrapper .description",
            start: "0% 70%",
            end: "100% 60%",
            scrub: true,
            // markers: true,
        },
        color: "#656565",
        stagger: 0.1,
    });

    // section-wrapper
    let animateInterval2;
    function initCicleAnimate2() {
        if (animateInterval2) {
            clearInterval(animateInterval2);
        }

        if (window.innerWidth > 768) {
            function circleAnimate() {
                const randomX = Math.random() * 200 - 200; // -200 ~ 0
                const randomY = Math.random() * 200; // 0 ~ 200

                gsap.to(".section-wrapper", {
                    duration: 6,
                    "--translate-x": `${randomX}%`,
                    "--translate-y": `${randomY}%`,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1,
                });
            }

            circleAnimate();
            animateInterval2 = setInterval(circleAnimate, 6000);
        } else {
            gsap.killTweensOf(".section-wrapper");
            gsap.set(".section-wrapper", { "--translate-x": 0, "--translate-y": 0 });
        }
    }

    initCicleAnimate2();
    const debouncingInitCircleAnimate2 = debounce(initCicleAnimate2, 200);
    window.addEventListener("resize", debouncingInitCircleAnimate2);

    let animateInterval3;
    function initCicleAnimate3() {
        if (animateInterval3) {
            clearInterval(animateInterval3);
        }

        if (window.innerWidth > 768) {
            function circleAnimate() {
                const randomX = Math.random() * 200; // 0 ~ 200
                const randomY = Math.random() * 200 - 150; // -150 ~ 50

                gsap.to(".common-circle", {
                    duration: 4,
                    "--translate-x": `${randomX}%`,
                    "--translate-y": `${randomY}%`,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1,
                });
            }

            circleAnimate();
            animateInterval3 = setInterval(circleAnimate, 4000);
        } else {
            gsap.killTweensOf(".common-circle");
            gsap.set(".common-circle", { "--translate-x": 0, "--translate-y": 0 });
        }
    }

    initCicleAnimate3();
    const debouncingInitCircleAnimate3 = debounce(initCicleAnimate3, 200);
    window.addEventListener("resize", debouncingInitCircleAnimate3);

    // sc-partners
    const animation = gsap.timeline({
        scrollTrigger: {
            trigger: ".sc-partners",
            start: "0% 70%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
    });
    animation
        .from($(".sc-partners .title"), { y: 100, opacity: 0 }, "a")
        .from($(".sc-partners .description"), { y: 100, opacity: 0 }, "a")
        .from($(".partner-list"), { y: 100, opacity: 0 });
});
