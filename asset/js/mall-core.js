document.addEventListener("DOMContentLoaded", function () {
  function debounce(func, sec) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), sec);
    };
  }

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
      const items = document.querySelectorAll(".solution-list li h3");
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
              .fromTo(
                ".solution-sec .solution-list h3",
                { "--height": 0 },
                { "--height": "78px", stagger: 0.3 },
                "a+=0.3"
              );
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
            gsap.fromTo(".solution-list .solution-item1 h3", { "--height": 0 }, heightAnimation(70));
            gsap.fromTo(".solution-list .solution-item2 h3", { "--height": 0 }, heightAnimation(50));
            gsap.fromTo(".solution-list .solution-item3 h3", { "--height": 0 }, heightAnimation(30));
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
      if (window.innerWidth > 768) {
        stopInterval();
        activeItem();
        startInterval();
      } else {
        stopInterval();
        items.removeClass("active");
      }
    }

    if (window.innerWidth > 768) {
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

  $(document).on("click", ".pricing-sec .btn-more", function () {
    $(this).hide();
    $(".pricing-sec .hide").delay(1000).show();
    $(".pricing-sec .link-inquire").css("display", "inline-block");
    $(".pricing-item").addClass("on");
  });

  $(document).on("click", ".pricing-sec .mo-btn-more", function () {
    if ($(this).text() === "더보기") {
      $(this).text("접기");
    } else {
      $(this).text("더보기");
    }
    $(this).toggleClass("on");
    $(this).closest(".pricing-item").toggleClass("on");
    $(this).closest(".pricing-item").find(".hide").delay(1000).toggle();
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
              .fromTo(
                $(".bottom-line .path"),
                { strokeDashoffset: -100 },
                { strokeDashoffset: 0, duration: 0.4 },
                "-=0.2"
              )
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
  upAnimation3
    .from($(".function-sec .common-title-area"), { y: 100, opacity: 0 })
    .from($(".function-sec .swiper"), { y: 100, opacity: 0 });

  const swiper = new Swiper(".swiper", {
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

  const swiperElement = document.querySelector(".swiper");

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

  ScrollTrigger.refresh();
});
