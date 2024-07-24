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
    // aos
    $(".sc-intro").addClass("on");
    setTimeout(() => {
        const textElements = document.querySelectorAll(".hover-text");
        const totalElements = textElements.length;
        let currentIndex = totalElements - 1;
        let lastTimestamp = 0;
        const interval = 60; // 20ms 간격으로 업데이트
        let isAnimationComplete = false;

        function updateFontWeights(timestamp) {
            if (isAnimationComplete) return;

            if (timestamp - lastTimestamp >= interval) {
                textElements.forEach((element, i) => {
                    let distance = i - currentIndex;
                    let weight = 100;

                    if (distance <= 0 && distance > -totalElements) {
                        weight = Math.max(100, Math.min(900, 900 + (800 / (totalElements - 1)) * distance));
                    }

                    element.style.fontVariationSettings = `"wght" ${weight}`;
                    element.style.fontWeight = weight;
                });

                currentIndex--;
                lastTimestamp = timestamp;

                // 애니메이션 종료 조건 체크
                if (currentIndex < -totalElements) {
                    isAnimationComplete = true;
                    document.querySelector(".sc-intro").classList.add("done");
                    $(".hover-text").css({
                        fontVariationSettings: "",
                        fontWeight: "",
                    });
                    return;
                }
            }

            requestAnimationFrame(updateFontWeights);
        }

        requestAnimationFrame(updateFontWeights);
    }, 1700);

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

    const solutionAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".sc-solution",
            start: "0% 60%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
    });
    solutionAnimation
        .from($(".sc-solution .common-title"), { y: 100, opacity: 0 })
        .from($(".sc-solution .common-description"), { y: 100, opacity: 0 });

    let xPos = 0;
    let isDragging = false;
    let zValue;
    let swiper;

    function initResizeCarousel() {
        if (window.innerWidth > 768) {
            // 모바일에서 데스크탑 전환 시 swiper 인스턴스 파괴
            if (swiper) {
                swiper.destroy(true, true);
                swiper = undefined;
            }
            setupDesktopCarousel();
        } else {
            resetDesktopCarousel(); // 데스크탑에서 모바일로 전환 시 설정 reset

            setupMobileSwiper();
        }
    }

    function setupDesktopCarousel() {
        // 화면 너비에 따른 zValue 설정
        if (window.innerWidth > 1630) {
            zValue = 2500;
        } else if (window.innerWidth > 1100) {
            zValue = 2000;
        } else {
            zValue = 1450;
        }

        gsap.timeline()
            .set(".solution-list", { rotationY: 180, cursor: "grab" }) // 초기 rotationY를 설정하여 파라락스 점프가 화면 밖에서 발생하도록 설정
            .set(".solution-item", {
                rotateY: (i) => i * -22.5,
                transformOrigin: `50% 50% ${zValue}px`,
                z: -zValue,
                backgroundPosition: (i) => getBgPos(i),
                backfaceVisibility: "hidden",
            })
            .from(".solution-item", {
                duration: 1.5,
                opacity: 0,
                ease: "expo",
            });

        $(document).on("mousedown touchstart", dragStart);
        $(document).on("mouseup touchend", dragEnd);
        $(window).on("wheel", handelWeel);
    }

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

    function handelWeel(e) {
        if (!isDragging) {
            const delta = e.originalEvent.deltaY;
            gsap.to(".solution-list", {
                rotationY: "+=" + (delta > 0 ? 22.5 : -22.5), // 회전 방향을 반대로 설정
                onUpdate: () => {
                    gsap.set(".solution-item", { backgroundPosition: (i) => getBgPos(i) });
                },
            });
        }
    }

    function getBgPos(i) {
        // 각 이미지에 파라락스 효과를 생성하기 위해 background-position 문자열을 반환
        return 100 - (gsap.utils.wrap(0, 360, gsap.getProperty(".solution-list", "rotationY") - 180 - i * 22.5) / 360) * zValue + "px 0px";
    }

    function setupMobileSwiper() {
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

    function resetDesktopCarousel() {
        // 이벤트 리스너 제거
        $(document).off("mousedown touchstart", dragStart);
        $(document).off("mouseup touchend", dragEnd);
        $(document).off("mousemove touchmove", drag);
        $(window).off("wheel", handelWeel);

        gsap.killTweensOf(".solution-list, .solution-item");
        gsap.set(".solution-list", { clearProps: "all" });
        gsap.set(".solution-item", { clearProps: "all" });
        gsap.set(".solution-list", { rotationY: 0 });
    }

    initResizeCarousel();
    const debounceInitResizeCarousel = debounce(() => {
        initResizeCarousel();
        if (swiper) {
            swiper.update();
        }
    }, 200);
    window.addEventListener("resize", debounceInitResizeCarousel);

    // custom cursor
    const cursor = document.querySelector(".cursor");
    let mouseX = 0;
    let mouseY = 0;
    let isInsideCarousel = false;

    document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        checkMousePosition();
    });

    document.querySelector(".carousel").addEventListener("mouseenter", function () {
        isInsideCarousel = true;
        cursor.classList.add("on");
    });

    document.querySelector(".carousel").addEventListener("mouseleave", function () {
        isInsideCarousel = false;
        cursor.classList.remove("on");
    });

    document.addEventListener("scroll", function () {
        checkMousePosition(); // 스크롤이 발생할 때마다 위치 체크
    });

    function checkMousePosition() {
        const solutionList = document.querySelector(".carousel");
        const rect = solutionList.getBoundingClientRect();

        if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
            if (!isInsideCarousel) {
                isInsideCarousel = true;
                cursor.classList.add("on");
            }
        } else {
            if (isInsideCarousel) {
                isInsideCarousel = false;
                cursor.classList.remove("on");
            }
        }
    }

    function animate() {
        cursor.style.transform = `translate(${mouseX - cursor.offsetWidth / 2}px, ${mouseY - cursor.offsetHeight / 2}px)`;

        requestAnimationFrame(animate);
    }

    animate();

    // cursor grab
    $(".carousel").on("mousedown", function (event) {
        $(".cursor").addClass("grab");
    });

    $(document).on("mouseup", function () {
        if ($(".cursor").hasClass("grab")) {
            $(".cursor").removeClass("grab");
        }
    });

    // Prevent default drag behavior
    $(".carousel").on("dragstart", function (event) {
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

    // sc-development
    const developmentAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".sc-development .title",
            start: "0% 90%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
    });
    developmentAnimation
        .from($(".sc-development .title"), { y: 100, opacity: 0 })
        .from($(".sc-development .common-description"), { y: 100, opacity: 0 });

    gsap.from(".sc-development .img-wrapper img", {
        scrollTrigger: {
            trigger: ".sc-development",
            start: "0% 50%",
            end: "100% 0%",
            toggleActions: "play none none none",
            // markers: true,
        },
        scale: 1.3,
        ease: "Power4.easeInOut",
        duration: 1.5,
    });

    // sc-partners
    const partnersAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".sc-partners",
            start: "0% 60%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
    });
    partnersAnimation.from($(".sc-partners .title"), { y: 100, opacity: 0 }).from($(".sc-partners .description"), { y: 100, opacity: 0 });

    gsap.from(".partner-list", {
        scrollTrigger: {
            trigger: ".partner-list",
            start: "0% 90%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        y: 100,
        opacity: 0,
    });

    // sc-recruit
    gsap.from(".sc-recruit .content-wrapper", {
        scrollTrigger: {
            trigger: ".sc-recruit",
            start: "0% 80%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        y: 100,
        opacity: 0,
    });
});
