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
    let modalOpen = false;
    let lastScroll = 0;

    $(window).on("scroll", function () {
        if (menuOpen || modalOpen) return;

        let currentScroll = $(this).scrollTop();
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
            $(".header").removeClass("hide");
            $(".header").removeClass("white");
        }
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
            $("body").addClass("no-scroll");
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
            $("body").removeClass("no-scroll");
            menuOpen = false;
        });
        menuOpen = false;
    };

    $(document).on("keydown", function (e) {
        if (menuOpen && e.key === "Escape") {
            closeMenu();
        }
    });

    $(".gnb-solution-link")
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

    gsap.to(".solution-sec .title .split span", {
        scrollTrigger: {
            trigger: ".solution-sec .title",
            start: "0% 60%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        stagger: 0.03,
        color: "#15C1D8",
        duration: 0.2,
        ease: "power2.inOut",
    });

    const heightAnimation = (trigger, delay = 0) => ({
        scrollTrigger: {
            trigger: trigger,
            start: "0% 80%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        "--height": "calc(100% + 17px)",
        delay: delay,
    });

    const sItem1 = document.querySelector(".solution-list .solution-item1");
    const sItem2 = document.querySelector(".solution-list .solution-item2");
    const sItem3 = document.querySelector(".solution-list .solution-item3");

    gsap.to(sItem1.querySelector("h4"), heightAnimation(sItem1, 0));
    gsap.to(sItem2.querySelector("h4"), heightAnimation(sItem2, 0.3));
    gsap.to(sItem3.querySelector("h4"), heightAnimation(sItem3, 0.6));

    // benefit-sec
    gsap.to(".benefit-sec .title .split span", {
        scrollTrigger: {
            trigger: ".benefit-sec .title",
            start: "0% 60%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        stagger: 0.03,
        color: "#15C1D8",
        duration: 0.2,
        ease: "power2.inOut",
    });

    const lineAnimation = (trigger) => ({
        scrollTrigger: {
            trigger: trigger,
            start: "0% 80%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        "--width": "100%",
        duration: 1.2,
    });

    const bItem1 = document.querySelector(".benefit-list .benefit-item1");
    const bItem2 = document.querySelector(".benefit-list .benefit-item2");
    const bItem3 = document.querySelector(".benefit-list .benefit-item3");

    gsap.to(bItem1.querySelector("p"), lineAnimation(bItem1));
    gsap.to(bItem2.querySelector("p"), lineAnimation(bItem2));
    gsap.to(bItem3.querySelector("p"), lineAnimation(bItem3));

    const counters = {
        build: { selector: "#build-cost", trigger: bItem1, value: 0, endValue: -50 },
        operation: { selector: "#operation-cost", trigger: bItem2, value: 0, endValue: -70 },
        speed: { selector: "#speed", trigger: bItem3, value: 0, endValue: 200 },
    };

    const counterAnimation = (selector, trigger, endValue) => ({
        scrollTrigger: {
            trigger: trigger,
            start: "0% 80%",
            end: "100% 0%",
            toggleActions: "play none none reverse",
            // markers: true,
        },
        value: endValue,
        onUpdate: function () {
            const value = this.targets()[0].value.toFixed();
            document.querySelector(selector).innerHTML = value + "<sup>%</sup>";
        },
        duration: 1.2,
    });

    Object.keys(counters).forEach((key) => {
        gsap.to(counters[key], counterAnimation(counters[key].selector, counters[key].trigger, counters[key].endValue));
    });

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
            if ($(".mo-modal-item").hasClass("on")) closeModal();
        }
    };

    let focusItem;
    let modalSwiper;

    function adjustHeight() {
        const modalItem = document.querySelector(".mo-modal-item");
        const activeSlide = document.querySelector(".modal-swiper .swiper-slide-active");
        const closeBtn = document.querySelector(".mo-modal-item .btn-close");
        const controlArea = document.querySelector(".mo-modal-item .control-area");

        const updateHeight = () => {
            if (modalItem && activeSlide) {
                modalItem.style.height = "auto"; // 높이 초기화

                let totalHeight = activeSlide.scrollHeight;

                if (closeBtn) {
                    totalHeight += closeBtn.offsetHeight;
                }
                if (controlArea) {
                    totalHeight += controlArea.offsetHeight;
                }

                modalItem.style.height = totalHeight + 20 + "px";
            }
        };

        setTimeout(updateHeight, 0);
    }

    const modalAction = function (e) {
        if (e.type === "click" || e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();

            focusItem = document.activeElement; // 마지막으로 focus를 받은 element 저장

            $(".modal-swiper .swiper-wrapper").empty();

            const index = $(this).index(); // 클릭한 index
            updateClickContent(index);

            $(".mo-modal-item").addClass("on");
            $(".dim").addClass("on");
            initSwiper(index);
            modalOpen = true;
            disableScroll();

            setTimeout(() => {
                $(".mo-modal-item").find("button").focus();
            }, 100);

            trapFocus($(".mo-modal-item"));

            $(document).on("keydown.closeModal", function (e) {
                if (e.key === "Escape") {
                    closeModal();
                }
            });
        }
    };

    const updateClickContent = function (index) {
        const items = $(".technology-list .item");
        const slideContent = $(items).eq(index).html();
        $(".modal-swiper .swiper-wrapper").append(`
            <div class="swiper-slide">
                ${slideContent}
            </div>
        `);
    };

    const updateAllContent = function (index) {
        const items = $(".technology-list .item");
        const total = items.length;
        for (let i = 0; i < total; i++) {
            const nextIndex = (index + i) % total;
            const slideContent = $(items).eq(nextIndex).html();
            $(".modal-swiper .swiper-wrapper").append(`
                <div class="swiper-slide">
                    ${slideContent}
                </div>
            `);
        }
    };

    function updatePagination(swiper, index) {
        const total = swiper.slides.length;
        const current = ((index + swiper.realIndex) % total) + 1;

        document.querySelectorAll(".custom-pagination").forEach((item) => {
            item.innerHTML = `
                <span class="current">${String(current).padStart(2, "0")}</span> / <span class="total">${String(total).padStart(2, "0")}</span>
            `;
        });
    }

    const initSwiper = function (index) {
        if (modalSwiper) {
            modalSwiper.destroy(true, true);
        }

        $(".modal-swiper .swiper-wrapper").empty();
        updateAllContent(index);

        modalSwiper = new Swiper(".modal-swiper", {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            navigation: {
                prevEl: ".btn-prev",
                nextEl: ".btn-next",
            },
            autoplay: {
                delay: 3000,
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
            },
            grabCursor: true,
            on: {
                init: function (swiper) {
                    updatePagination(swiper, index);
                    adjustHeight();
                },
                slideChangeTransitionEnd: function (swiper) {
                    updatePagination(swiper, index);
                    adjustHeight();
                },
            },
        });
    };

    function disableScroll() {
        const scrollY = document.documentElement.style.getPropertyValue("--scroll-y");
        const body = document.body;
        body.style.position = "fixed";
        body.style.top = `-${scrollY}`;
        body.style.width = "100%";
        ScrollTrigger.getAll().forEach((st) => st.disable()); // 애니메이션 상태 저장
    }

    function ableScroll() {
        const body = document.body;
        const scrollY = body.style.top;
        const originalScrollbehavior = document.documentElement.style.scrollBehavior;

        body.style.position = "";
        body.style.top = "";
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
        ScrollTrigger.getAll().forEach((st) => {
            // 애니메이션 상태 복원
            st.enable();
            st.refresh();
        });

        setTimeout(() => {
            document.documentElement.style.scrollBehavior = originalScrollbehavior;
        }, 0);
    }

    window.addEventListener("scroll", () => {
        document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
    });

    const trapFocus = function (modal) {
        const focusElements = modal.find("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        const firstFocusElements = focusElements.first();
        const lastFocusElements = focusElements.last();

        modal.on("keydown.focusTrap", function (e) {
            if (e.key !== "Tab" || e.keyCode !== 9) {
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
        $(".mo-modal-item").removeClass("on");
        $(".dim").removeClass("on");
        modalOpen = false;
        ableScroll();

        $(document).off("keydown.closeModal");
        $(document).off("focusin.focusTrap"); // focusTrap 이벤트 제거

        if (modalSwiper) {
            modalSwiper.destroy(true, true);
            modalSwiper = null;
        }

        if (focusItem) $(focusItem).focus(); // 마지막으로 focus를 받은 element로 다시 초점 이동
    };

    $(document).on("click", ".btn-close", function () {
        closeModal();
    });
    $(document).on("keydown", "btn-close", function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            $(this).click();
        }
    });
    $(document).on("click", function (e) {
        if ($(".mo-modal-item").hasClass("on") && !$(e.target).closest(".mo-modal-item, .technology-list .item").length) {
            closeModal();
        }
    });

    resizeModalAction();
    const debouncingResizeModalAction = debounce(resizeModalAction, 200);
    window.addEventListener("resize", debouncingResizeModalAction);

    // pricing-sec
    const pricingAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: ".pricing-sec",
            start: "0% 60%",
            end: "100% 0%",
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
                end: "100% 0%",
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

    // consulting-sec
    const consultingSec = document.querySelector(".consulting-sec");

    const consultingAnimation = gsap.timeline({
        paused: true,
        duration: 0.5,
    });
    consultingAnimation.from($(".consulting-sec"), { y: 100, opacity: 0 });

    const consultingObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    consultingAnimation.play();
                } else {
                    consultingAnimation.reverse();
                }
            });
        },
        { threshold: 0.1 }
    );

    consultingObserver.observe(consultingSec);

    // function-sec
    const functionSec = document.querySelector(".function-sec");
    const functionSwiper = document.querySelector(".function-swiper");

    const functionAnimation = gsap.timeline({
        paused: true,
        duration: 0.5,
    });
    functionAnimation.from($(".function-sec .common-title-area"), { y: 100, opacity: 0 }).from($(".function-sec .swiper"), { y: 100, opacity: 0 });

    const swiper = new Swiper(functionSwiper, {
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
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
        },
        grabCursor: true,
    });

    swiper.autoplay.stop();

    const functionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    functionAnimation.play();
                    swiper.slideToLoop(0);
                    swiper.autoplay.start();
                } else {
                    functionAnimation.reverse();
                    swiper.autoplay.stop();
                }
            });
        },
        { threshold: 0.1 }
    );

    functionObserver.observe(functionSec);

    // side-btn
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

    const footerLink = document.querySelectorAll(".footer a");
    const quickBtnLink = document.querySelector(".quick-btn a");
    const topBtnLink = document.querySelector(".top-btn a");

    footerLink[footerLink.length - 1].addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
            e.preventDefault();
            quickBtnLink.focus();
        }
    });
    quickBtnLink.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
            e.preventDefault();
            topBtnLink.focus();
        }
    });

    ScrollTrigger.refresh();
});
