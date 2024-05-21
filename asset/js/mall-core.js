document.addEventListener("DOMContentLoaded", function () {
  // introduce-sec
  let mainTitleAnimation;

  function init() {
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

  document.fonts.ready.then(init);
  window.addEventListener("resize", init);

  // title 한 글자씩 자르기
  document.querySelectorAll(".title .split").forEach((element) => {
    element.innerHTML = element.textContent
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
  });

  // solution-sec
  if (window.innerWidth > 768) {
    function animate() {
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

    animate();
    setInterval(animate, 4000);
  }

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
    .to(
      $(".solution-sec .title .split span"),
      {
        stagger: 0.03,
        color: "#15C1D8",
        duration: 0.2,
        ease: "power2.inOut",
      },
      "a"
    )
    .from($(".solution-sec .solution-list h3"), { "--height": 0, stagger: 0.25 }, "a+=0.2");

  // benefit-sec
  const benefitAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".benefit-sec",
      start: "0% 50%",
      end: "100% 60%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
  });

  const counters = {
    buildCost: { selector: "#build-cost", value: 0 },
    operationCost: { selector: "#operation-cost", value: 0 },
    speed: { selector: "#speed", value: 0 },
  };

  benefitAnimation
    .to(
      $(".benefit-sec .title .split span"),
      {
        stagger: 0.03,
        color: "#15C1D8",
        duration: 0.2,
        ease: "power2.inOut",
      },
      "a"
    )
    .to($(".benefit-sec .benefit-list li p"), { "--width": "100%", duration: 1.1 }, "a+=0.2");
  Object.keys(counters).forEach((key) => {
    benefitAnimation.fromTo(
      counters[key],
      { value: 0 },
      {
        value: key === "buildCost" ? -50 : key === "operationCost" ? -70 : 200,
        onUpdate: function () {
          const value = this.targets()[0].value.toFixed();
          document.querySelector(counters[key].selector).innerHTML = value + "<sup>%</sup>";
        },
        duration: 1.1,
      },
      "a+=0.2"
    );
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

    if (window.innerWidth > 768) {
      items.eq(indexArr[index]).addClass("active");
      startInterval();

      items.mouseenter(stopInterval);
      items.mouseleave(startInterval);

      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
          stopInterval();
          activeItem();
          startInterval();
        } else {
          stopInterval();
          items.removeClass("active");
        }
      });
    } else {
      items.removeClass("active");
    }
  }

  initActiveItem();
  window.addEventListener("resize", initActiveItem);

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

  const diagramAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".diagram-sec .diagram-area",
      start: "0% 70%",
      end: "100% 100%",
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

  diagramAnimation.from($(".diagram-title"), { y: 100, opacity: 0 }, "a");
  if (window.innerWidth > 860) {
    diagramAnimation
      .from($(".diagram-center"), { y: 100, opacity: 0 }, "a")
      .from($(".diagram-left"), { x: -100, opacity: 0 })
      .from($(".left-line .circle1"), { opacity: 0 }, "-=0.2")
      .from($(".left-line .path"), { strokeDashoffset: -81, duration: 0.4 }, "-=0.2")
      .from($(".left-line .circle2"), { opacity: 0 }, "-=0.2")
      .from($(".diagram-right"), { x: 100, opacity: 0 })
      .from($(".right-line .circle1"), { opacity: 0 }, "-=0.2")
      .from($(".right-line .path"), { strokeDashoffset: 50, duration: 0.4 }, "-=0.2")
      .from($(".right-line .circle2"), { opacity: 0 }, "-=0.2")
      .from($(".diagram-bottom"), { y: 100, opacity: 0 })
      .from($(".bottom-line .path"), { strokeDashoffset: -100, duration: 0.4 }, "-=0.2")
      .from($(".bottom-line .circle"), { opacity: 0 }, "-=0.2");
  } else {
    diagramAnimation.from($(".mo-diagram"), { y: 100, opacity: 0 }, "a");
  }

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

  let swiper;
  function initSwiper() {
    swiper = new Swiper(".swiper", {
      slidesPerView: "auto",
      centeredSlides: true,
      loop: true,
      navigation: {
        prevEl: ".btn-prev",
        nextEl: ".btn-next",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        769: {
          pagination: {
            el: ".swiper-pagination",
            type: "custom",
            renderCustom: function (_, current, total) {
              return "<span class='current'>0" + current + "</span> / <span class='total'>" + "0" + total + "</span>";
            },
          },
        },
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      grabCursor: true,
    });
    swiper.autoplay.stop();
  }

  initSwiper();

  window.addEventListener("resize", function () {
    swiper.destroy(true, true);
    initSwiper();
  });

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
