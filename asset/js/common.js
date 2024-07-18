document.addEventListener("DOMContentLoaded", function () {
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
    $(document).on("click", ".menu-btn", function () {
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

    $(document)
        .on("click", ".gnb-solution-link", function () {
            $(".sub-gnb").slideToggle();
        })
        .on("keydown", ".gnb-solution-link", function (e) {
            if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                $(this).click();
            }
        });

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
    }
});
