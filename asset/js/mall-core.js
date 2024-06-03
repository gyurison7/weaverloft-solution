document.addEventListener("DOMContentLoaded", function () {
    function debounce(func, sec) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), sec);
        };
    }

    // header
    let menuOpen = false;
    let lastScroll = 0;

    ScrollTrigger.create({
        onUpdate: (self) => {
            if (menuOpen) return;

            let currentScroll = self.scroll();
            if (currentScroll > lastScroll) {
                // scroll down
                $(".header").addClass("hide");
            } else {
                // scroll up
                $(".header").removeClass("hide");
                $(".header").addClass("white");
            }
            lastScroll = currentScroll;
            if (currentScroll === 0) {
                $(".header").removeClass("white");
            }
        },
    });

    // gnb
    $(".menu-btn").click(function () {
        if (!$(".mo-gnb").hasClass("on")) {
            if ($(".header").hasClass("white")) {
                $(".header").removeClass("white");
            }
            $(".menu-btn").addClass("on");
            $(".mo-gnb").addClass("on");
            $(".mo-gnb .mo-gnb-area .mo-gnb-list li span").addClass("on");
            $(".mo-gnb .mo-gnb-bottom").addClass("on");
            $("html, body").addClass("no-scroll");
            menuOpen = true;
        } else {
            closeMenu();
        }
    });

    const closeMenu = function () {
        $(".menu-btn").removeClass("on");
        if ($(".sub-gnb").is(":visible")) {
            $(".sub-gnb").slideUp();
        }
        $(".mo-gnb .mo-gnb-area .mo-gnb-list li span").removeClass("on");
        $(".mo-gnb .mo-gnb-bottom").removeClass("on");
        $(".mo-gnb .mo-gnb-area .mo-gnb-list li span").one("transitionend", function () {
            $(".mo-gnb").removeClass("on");
            $("html, body").removeClass("no-scroll");
            menuOpen = false;
        });
        menuOpen = false;
    };

    $(document).on("keydown", function (e) {
        if (menuOpen && e.key === "Escape") {
            closeMenu();
        }
    });

    $(".gnb-solution span")
        .click(function () {
            $(".sub-gnb").slideToggle();
        })
        .keydown(function (e) {
            if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                $(this).click();
            }
        });

    // introduce-sec
    let mainTitleAnimation;

    function initMainAnimation() {
        if (mainTitleAnimation) {
            mainTitleAnimation.kill();
        }
        mainTitleAnimation = gsap.timeline({ invalidateOnRefresh: true });

        if (window.innerWidth > 768) {
            mainTitleAnimation
                .to($(".introduce-sec .introduce-title-area"), { x: 0, opacity: 1 }, "a")
                .to($(".introduce-sec .description-area"), { x: 0, opacity: 1 }, "a");
        } else {
            mainTitleAnimation
                .to($(".introduce-sec .introduce-title-area"), { y: 0, opacity: 1 })
                .to($(".introduce-sec .description-area"), { y: 0, opacity: 1 });
        }
    }

    document.fonts.ready.then(initMainAnimation);
    const debouncingInitMainAnimation = debounce(initMainAnimation, 200);
    window.addEventListener("resize", debouncingInitMainAnimation);

    // title 한 글자씩 자르기
    document.querySelectorAll(".title .split").forEach((element) => {
        element.innerHTML = element.textContent
            .split("")
            .map((char) => `<span>${char}</span>`)
            .join("");
    });

    // solution-sec
    let animateInterval;
    function initCicleAnimate() {
        if (animateInterval) {
            clearInterval(animateInterval);
        }

        if (window.innerWidth > 768) {
            function circleAnimate() {
                const randomX = Math.random() * 200 - 200; // -200 ~ 0
                const randomY = Math.random() * 200 - 50; // -50 ~ 150

                gsap.to(".solution-sec", {
                    duration: 4,
                    "--translate-x": `${randomX}%`,
                    "--translate-y": `${randomY}%`,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1,
                });
            }

            circleAnimate();
            animateInterval = setInterval(circleAnimate, 4000);
        } else {
            gsap.killTweensOf(".solution-sec");
            gsap.set(".solution-sec", { "--translate-x": 0, "--translate-y": 0 });
        }
    }

    initCicleAnimate();
    const debouncingInitCircleAnimate = debounce(initCicleAnimate, 200);
    window.addEventListener("resize", debouncingInitCircleAnimate);

    function initSolutionAnimation() {
        const mm = gsap.matchMedia();

        const titleAnimation = {
            stagger: 0.03,
            color: "#15C1D8",
            duration: 0.2,
            ease: "power2.inOut",
        };

        const heightAnimation = (percent) => ({
            scrollTrigger: {
                trigger: ".solution-list",
                start: `0% ${percent}%`,
                end: `100% ${percent}%`,
                toggleActions: "play none none reverse",
                // markers: true,
            },
            "--height": "60px",
        });

        function clearAnimations() {
            document.querySelectorAll(".solution-sec .title .split span").forEach((span) => {
                gsap.killTweensOf(span);
                span.style.color = ""; // 컬러링 초기화
            });
            const items = document.querySelectorAll(".solution-list li h4");
            items.forEach((item) => {
                gsap.killTweensOf(item);
                item.style.setProperty("--height", "0");
            });
        }

        document.querySelectorAll(".solution-sec .title .split").forEach((element) => {
            element.innerHTML = element.textContent
                .split("")
                .map((char) => `<span>${char}</span>`)
                .join("");
        });

        mm.add(
            {
                isDesktop: "(min-width: 769px)",
                isMobile: "(max-width: 768px)",
            },
            (context) => {
                const { isDesktop, isMobile } = context.conditions;

                function setupAnimations() {
                    clearAnimations();
                    if (isDesktop) {
                        const solutionAnimation = gsap.timeline({
                            scrollTrigger: {
                                trigger: ".solution-sec",
                                start: "0% 60%",
                                end: "100% 60%",
                                toggleActions: "play none none reverse",
                                // markers: true,
                            },
                        });
                        solutionAnimation
                            .to(".solution-sec .title .split span", titleAnimation, "a")
                            .fromTo(".solution-sec .solution-list h4", { "--height": 0 }, { "--height": "78px", stagger: 0.3 }, "a+=0.3");
                    } else if (isMobile) {
                        gsap.to(".solution-sec .title .split span", {
                            scrollTrigger: {
                                trigger: ".solution-sec",
                                start: "0% 70%",
                                end: "100% 70%",
                                toggleActions: "play none none reverse",
                                // markers: true,
                            },
                            ...titleAnimation,
                        });
                        gsap.fromTo(".solution-list .solution-item1 h4", { "--height": 0 }, heightAnimation(70));
                        gsap.fromTo(".solution-list .solution-item2 h4", { "--height": 0 }, heightAnimation(50));
                        gsap.fromTo(".solution-list .solution-item3 h4", { "--height": 0 }, heightAnimation(30));
                    }
                }

                setupAnimations();

                return () => {
                    clearAnimations();
                };
            }
        );
    }

    initSolutionAnimation();
    const debouncingInitSolutionAnimation = debounce(initSolutionAnimation, 200);
    window.addEventListener("resize", debouncingInitSolutionAnimation);

    // benefit-sec
    function initBenefitAnimation() {
        const mm = gsap.matchMedia();

        const titleAnimation = {
            stagger: 0.03,
            color: "#15C1D8",
            duration: 0.2,
            ease: "power2.inOut",
        };

        const lineAnimation = (percent) => ({
            scrollTrigger: {
                trigger: ".benefit-list",
                start: `0% ${percent}%`,
                end: `100% ${percent}%`,
                toggleActions: "play none none reverse",
                // markers: true,
            },
            "--width": "100%",
            duration: 1.2,
        });

        const counters = {
            buildCost: { selector: "#build-cost", value: 0, percent: 85, endValue: -50 },
            operationCost: { selector: "#operation-cost", value: 0, percent: 70, endValue: -70 },
            speed: { selector: "#speed", value: 0, percent: 55, endValue: 200 },
        };

        const counterAnimation = (element, percent, endValue) => ({
            scrollTrigger: {
                trigger: ".benefit-list",
                start: `0% ${percent}%`,
                end: `100% ${percent}%`,
                toggleActions: "play none none reverse",
                // markers: true,
            },
            value: endValue,
            onUpdate: function () {
                const value = this.targets()[0].value.toFixed();
                document.querySelector(element).innerHTML = value + "<sup>%</sup>";
            },
            duration: 1.2,
        });

        function clearAnimations() {
            document.querySelectorAll(".benefit-sec .title .split span").forEach((span) => {
                gsap.killTweensOf(span);
                span.style.color = ""; // 컬러링 초기화
            });
            document.querySelectorAll(".benefit-list li p").forEach((item) => {
                gsap.killTweensOf(item);
                item.style.setProperty("--width", "0");
            });
            Object.values(counters).forEach((counter) => {
                gsap.killTweensOf(counter.selector);
                document.querySelector(counter.selector).innerHTML = "0<sup>%</sup>"; // 초기화된 값 설정
            });
        }

        document.querySelectorAll(".benefit-sec .title .split").forEach((element) => {
            element.innerHTML = element.textContent
                .split("")
                .map((char) => `<span>${char}</span>`)
                .join("");
        });

        mm.add(
            {
                isDesktop: "(min-width: 769px)",
                isMobile: "(max-width: 768px)",
            },
            (context) => {
                const { isDesktop, isMobile } = context.conditions;

                function setupAnimations() {
                    clearAnimations();
                    if (isDesktop) {
                        const benefitAnimation = gsap.timeline({
                            scrollTrigger: {
                                trigger: ".benefit-sec",
                                start: "0% 50%",
                                end: "100% 50%",
                                toggleActions: "play none none reverse",
                                // markers: true,
                            },
                        });
                        benefitAnimation
                            .to(".benefit-sec .title .split span", titleAnimation, "a")
                            .to(".benefit-sec .benefit-list li p", { "--width": "100%", duration: 1.2 }, "a+=0.2");
                        Object.keys(counters).forEach((key) => {
                            benefitAnimation.fromTo(
                                counters[key],
                                { value: 0 },
                                {
                                    value: counters[key].endValue,
                                    onUpdate: function () {
                                        const value = this.targets()[0].value.toFixed();
                                        document.querySelector(counters[key].selector).innerHTML = value + "<sup>%</sup>";
                                    },
                                    duration: 1.2,
                                },
                                "a+=0.3"
                            );
                        });
                    } else if (isMobile) {
                        gsap.to(".benefit-sec .title .split span", {
                            scrollTrigger: {
                                trigger: ".benefit-sec",
                                start: "0% 60%",
                                end: "100% 60%",
                                toggleActions: "play none none reverse",
                                // markers: true,
                            },
                            ...titleAnimation,
                        });
                        gsap.to(".benefit-list .benefit-item1 p", lineAnimation(85));
                        gsap.to(".benefit-list .benefit-item2 p", lineAnimation(70));
                        gsap.to(".benefit-list .benefit-item3 p", lineAnimation(55));
                        Object.keys(counters).forEach((key) => {
                            gsap.fromTo(
                                counters[key],
                                { value: 0 },
                                counterAnimation(counters[key].selector, counters[key].percent, counters[key].endValue)
                            );
                        });
                    }
                }

                setupAnimations();

                return () => {
                    clearAnimations();
                };
            }
        );
    }

    initBenefitAnimation();
    const debouncingInitBenefitAnimation = debounce(initBenefitAnimation, 200);
    window.addEventListener("resize", debouncingInitBenefitAnimation);

    // technology-sec
    const technologyAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".technology-sec",
            start: "0% 80%",
            end: "100% 100%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        duration: 0.5,
    });
    technologyAnimation
        .from($(".technology-sec .common-title-area"), { y: 100, opacity: 0 }, "a")
        .to(
            $(".technology-sec .title .split span"),
            {
                stagger: 0.03,
                color: "#15C1D8",
                duration: 0.2,
                ease: "power2.inOut",
            },
            "a+=0.1"
        )
        .from($(".technology-sec .content-area"), { y: 100, opacity: 0 });

    const resizeModalAction = function () {
        if ($(window).width() <= 768) {
            $(".technology-list .item").on("click keydown", modalAction);
        } else {
            $(".technology-list .item").off("click keydown", modalAction);
        }
    };

    let focusItem;

    const modalAction = function (e) {
        if (e.type === "click" || e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();

            focusItem = document.activeElement; // 마지막으로 focus를 받은 element 저장

            document.querySelectorAll(".technology-list .item").forEach((item) => {
                const itemId = item.id;
                const content = $("#" + itemId + "-modal").find(".modal-content");
                content.html($("#" + itemId).html());
            });

            const clickItemId = $(this).attr("id");
            const modalId = clickItemId + "-modal";

            $(".item-modal").addClass("on");
            $(".dim").addClass("on");
            $("html, body").addClass("no-scroll");

            setTimeout(() => {
                $("#" + modalId)
                    .attr("tabindex", "-1")
                    .focus();
            }, 100);

            trapFocus($("#" + modalId));

            $(document).on("keydown.closeModal", function (e) {
                if (e.key === "Escape") {
                    closeModal();
                }
            });
        }
    };

    const trapFocus = function (modal) {
        const focusElements = modal.find("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        const firstFocusElements = focusElements.first();
        const lastFocusElements = focusElements.last();

        modal.on("keydown.focusTrap", function (e) {
            if (!e.key === "Tab" || !e.keyCode === 9) {
                return;
            }

            if (e.shiftKey) {
                // shift + tab
                if ($(document.activeElement).is(firstFocusElements)) {
                    e.preventDefault();
                    lastFocusElements.focus();
                }
            } else {
                // tab
                if ($(document.activeElement).is(lastFocusElements)) {
                    e.preventDefault();
                    firstFocusElements.focus();
                }
            }
        });

        $(document).on("focusin.focusTrap", function (e) {
            if (modal[0] !== e.target && !modal.has(e.target.length)) {
                // focus가 모달 내부에서만 이동하도록
                firstFocusElements.focus();
            }
        });
    };

    const closeModal = function () {
        $(".item-modal.on").removeClass("on");
        $(".dim").removeClass("on");
        $("html, body").removeClass("no-scroll");
        $(document).off("keydown.closeModal");
        $(document).off("focusin.focusTrap"); // focusTrap 이벤트 제거

        if (focusItem) $(focusItem).focus(); // 마지막으로 focus를 받은 element로 다시 초점 이동
    };

    $(".item-modal .btn-close")
        .click(function () {
            closeModal();
        })
        .keydown(function (e) {
            if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                $(this).click();
            }
        });

    // $(document).on("click", function (e) {
    //     if ($(".item-modal").hasClass("on") && !$(e.target).closest(".item-modal, .technology-list .item").length) {
    //         closeModal();
    //     }
    // });

    resizeModalAction();
    const debouncingResizeModalAction = debounce(resizeModalAction, 200);
    window.addEventListener("resize", debouncingResizeModalAction);

    const modalSwiper = new Swiper(".modal-swiper", {
        slidesPerView: 1,
        spaceBetween: 34,
        loop: true,
        navigation: {
            prevEl: ".btn-prev",
            nextEl: ".btn-next",
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        grabCursor: true,
        autoplay: false,
    });

    // pricing-sec
    const pricingAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".pricing-sec",
            start: "0% 70%",
            end: "100% 70%",
            toggleActions: "play none none reverse",
            // markers: true,
            onEnter: () => {
                pricingAnimation.timeScale(1).play();
            },
            onLeaveBack: () => {
                pricingAnimation.timeScale(2).reverse();
            },
        },
    });
    pricingAnimation
        .from($(".pricing-sec .detail-title-area"), { y: 100, opacity: 0 })
        .from($(".pricing-sec .list-area"), { y: 100, opacity: 0 })
        .from($(".pricing-sec .btn-area"), { y: 100, opacity: 0 });

    function initActiveItem() {
        const items = $(".pricing-sec .pricing-item");
        const indexArr = [1, 2, 0];
        let index = 0;
        let interval;

        function activeItem() {
            items.removeClass("active");
            items.eq(indexArr[index]).addClass("active");
            index = (index + 1) % indexArr.length;
        }

        function startInterval() {
            interval = setInterval(activeItem, 2000);
        }

        function stopInterval() {
            clearInterval(interval);
        }

        function resize() {
            if (window.innerWidth > 860) {
                stopInterval();
                activeItem();
                startInterval();
            } else {
                stopInterval();
                items.removeClass("active");
            }
        }

        if (window.innerWidth > 860) {
            items.eq(indexArr[index]).addClass("active");
            startInterval();

            items.mouseenter(stopInterval);
            items.mouseleave(startInterval);
        } else {
            items.removeClass("active");
        }

        const debouncingResize = debounce(resize, 200);
        window.addEventListener("resize", debouncingResize);
    }

    initActiveItem();
    const debouncingIntitActiveItem = debounce(initActiveItem, 200);
    window.addEventListener("resize", debouncingIntitActiveItem);

    $(document).on("click", ".btn-more", function () {
        $(this).hide();
        $(".pricing-sec .hide").delay(1000).show();
        $(".pricing-sec .link-inquire").css("display", "inline-block");
        $(".pricing-item").addClass("on");
    });

    $(document).on("click", ".mo-btn-more, .mo-btn-close", function () {
        const pricingItem = $(this).closest(".pricing-item");
        const isMoreBtn = $(this).hasClass("mo-btn-more");

        $(this).toggleClass("on");
        pricingItem.toggleClass("on");

        if (isMoreBtn) {
            pricingItem.find(".mo-btn-close").toggleClass("on");
        } else {
            pricingItem.find(".mo-btn-more").toggleClass("on");
        }

        pricingItem.find(".hide").delay(1000).toggle();
    });

    // diagram-sec
    gsap.from(".diagram-sec .detail-title-area", {
        scrollTrigger: {
            trigger: ".diagram-sec",
            start: "0% 60%",
            end: "100% 60%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        y: 100,
        opacity: 0,
    });

    function initDiagramAnimation() {
        const mm = gsap.matchMedia();

        const diagramAnimation = gsap.timeline({
            scrollTrigger: {
                trigger: ".diagram-sec .diagram-area",
                start: "0% 70%",
                end: "100% 70%",
                toggleActions: "play none none reverse",
                // markers: true,
                onEnter: () => {
                    diagramAnimation.timeScale(1).play();
                },
                onLeaveBack: () => {
                    diagramAnimation.timeScale(2).reverse();
                },
            },
            ease: "power2.inOut",
        });

        function clearAnimations() {
            diagramAnimation.kill();
        }

        mm.add(
            {
                isDesktop: "(min-width: 861px)",
                isMobile: "(max-width: 860px)",
            },
            (context) => {
                const { isDesktop, isMobile } = context.conditions;

                function setupAnimations() {
                    if (isDesktop) {
                        diagramAnimation
                            .fromTo($(".diagram-title"), { y: 100, opacity: 0 }, { y: 0, opacity: 1 }, "a")
                            .fromTo($(".diagram-center"), { y: 100, opacity: 0 }, { y: 0, opacity: 1 }, "a")
                            .fromTo($(".diagram-left"), { x: -100, opacity: 0 }, { x: 0, opacity: 1 })
                            .fromTo($(".left-line .circle1"), { opacity: 0 }, { opacity: 1 }, "-=0.2")
                            .fromTo($(".left-line .path"), { strokeDashoffset: -81 }, { strokeDashoffset: 0, duration: 0.4 }, "-=0.2")
                            .fromTo($(".left-line .circle2"), { opacity: 0 }, { opacity: 1 }, "-=0.2")
                            .fromTo($(".diagram-right"), { x: 100, opacity: 0 }, { x: 0, opacity: 1 })
                            .fromTo($(".right-line .circle1"), { opacity: 0 }, { opacity: 1 }, "-=0.2")
                            .fromTo($(".right-line .path"), { strokeDashoffset: 50 }, { strokeDashoffset: 0, duration: 0.4 }, "-=0.2")
                            .fromTo($(".right-line .circle2"), { opacity: 0 }, { opacity: 1 }, "-=0.2")
                            .fromTo($(".diagram-bottom"), { y: 100, opacity: 0 }, { y: 0, opacity: 1 })
                            .fromTo($(".bottom-line .path"), { strokeDashoffset: -100 }, { strokeDashoffset: 0, duration: 0.4 }, "-=0.2")
                            .fromTo($(".bottom-line .circle"), { opacity: 0 }, { opacity: 1 }, "-=0.2");
                    } else if (isMobile) {
                        diagramAnimation
                            .fromTo($(".diagram-title"), { y: 100, opacity: 0 }, { y: 0, opacity: 1 }, "a")
                            .fromTo($(".mo-diagram"), { y: 100, opacity: 0 }, { y: 0, opacity: 1 }, "a");
                    }
                }

                setupAnimations();

                return () => {
                    clearAnimations();
                };
            }
        );
    }

    initDiagramAnimation();
    const debouncingInitDiagramAnimation = debounce(initDiagramAnimation, 200);
    window.addEventListener("resize", debouncingInitDiagramAnimation);

    gsap.from(".consulting-sec", {
        scrollTrigger: {
            trigger: ".consulting-sec",
            start: "0% 70%",
            end: "100% 70%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        y: 100,
        opacity: 0,
        duration: 0.5,
    });

    // function-sec
    const upAnimation3 = gsap.timeline({
        scrollTrigger: {
            trigger: ".function-sec",
            start: "0% 80%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        duration: 0.5,
    });
    upAnimation3.from($(".function-sec .common-title-area"), { y: 100, opacity: 0 }).from($(".function-sec .swiper"), { y: 100, opacity: 0 });

    const swiper = new Swiper(".function-swiper", {
        slidesPerView: "auto",
        centeredSlides: true,
        loop: true,
        navigation: {
            prevEl: ".btn-prev",
            nextEl: ".btn-next",
        },
        pagination: {
            el: ".swiper-pagination",
            type: "custom",
            renderCustom: function (_, current, total) {
                return "<span class='current'>0" + current + "</span> / <span class='total'>" + "0" + total + "</span>";
            },
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        grabCursor: true,
    });

    swiper.autoplay.stop();

    const swiperElement = document.querySelector(".function-swiper");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    swiper.slideToLoop(0);
                    swiper.autoplay.start();
                } else {
                    swiper.autoplay.stop();
                }
            });
        },
        {
            threshold: 0.1,
        }
    );

    observer.observe(swiperElement);

    swiperElement.addEventListener("mouseenter", () => {
        swiper.autoplay.stop();
    });

    swiperElement.addEventListener("mouseleave", () => {
        swiper.autoplay.start();
    });

    const targetY = document.documentElement.scrollHeight * 0.1;

    window.addEventListener("scroll", function () {
        const currentY = document.documentElement.scrollTop;

        if (currentY > targetY) {
            $(".quick-btn").addClass("on");
            $(".top-btn").addClass("on");
        } else {
            $(".quick-btn").removeClass("on");
            $(".top-btn").removeClass("on");
        }
    });

    const footer = document.querySelector(".footer");

    const scrollObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    $(".quick-btn").addClass("bottom");
                    $(".top-btn").addClass("bottom");
                } else {
                    $(".quick-btn").removeClass("bottom");
                    $(".top-btn").removeClass("bottom");
                }
            });
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 0.3,
        }
    );

    scrollObserver.observe(footer);

    $(".top-btn a").click(function (e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "600");
        return false;
    });

    ScrollTrigger.refresh();
});
