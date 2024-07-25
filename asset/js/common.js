export function debounce(func, sec) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), sec);
    };
}

window.addEventListener("load", function () {
    $(".loading").addClass("hide");

    window.menuOpen = false;
    window.modalOpen = false;
    window.lastScroll = 0;

    // header
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
    $(document).on("click", ".menu-btn", function () {
        if (!$(".mo-gnb").hasClass("on")) {
            if ($(".header").hasClass("white")) {
                $(".header").removeClass("white");
            }
            $(".menu-btn").addClass("on");
            $(".mo-gnb").addClass("on");
            $(".mo-gnb .mo-gnb-area .mo-gnb-list li span").addClass("on");
            $(".mo-gnb .mo-gnb-bottom").addClass("on");
            disableScroll();
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
        $(".mo-gnb").removeClass("on");
        ableScroll();
        menuOpen = false;
    };

    let scrollY = 0;

    function disableScroll() {
        scrollY = window.scrollY;
        const body = document.body;
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";
        ScrollTrigger.getAll().forEach((st) => st.disable()); // 애니메이션 상태 저장
    }

    function ableScroll() {
        const body = document.body;
        const originalScrollbehavior = document.documentElement.style.scrollBehavior;

        body.style.position = "";
        body.style.top = "";
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, scrollY);
        ScrollTrigger.getAll().forEach((st) => {
            // 애니메이션 상태 복원
            st.enable();
            st.refresh();
        });

        setTimeout(() => {
            document.documentElement.style.scrollBehavior = originalScrollbehavior;
        }, 0);
    }

    $(document).on("keydown", function (e) {
        if (menuOpen && e.key === "Escape") {
            closeMenu();
        }
    });

    // TODO :: 솔루션 페이지 링크 생성 후 주석 해제(삭제 금지)
    // $(document)
    //     .on("click", ".gnb-solution-link", function () {
    //         $(".sub-gnb").slideToggle();
    //     })
    //     .on("keydown", ".gnb-solution-link", function (e) {
    //         if (e.keyCode === 13 || e.keyCode === 32) {
    //             e.preventDefault();
    //             $(this).click();
    //         }
    //     });

    // side-btn
    let footerLoad = false;
    let sideBtnLoad = false;

    function checkLoad() {
        if (footerLoad && sideBtnLoad) {
            initFooterAndSideBtn();
        }
    }

    $(".footer-area").load("include/footer.html", function () {
        footerLoad = true;
        checkLoad();
    });
    $(".side-btn-area").load("include/side-btn.html", function () {
        sideBtnLoad = true;
        checkLoad();
    });

    function initFooterAndSideBtn() {
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
                threshold: 0,
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
    }
});
