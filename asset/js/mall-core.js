document.addEventListener("DOMContentLoaded", function () {
  // introduce-sec
  document.fonts.ready.then(function () {
    const mainTitleAnimation = gsap.timeline();

    if (window.innerWidth > 768) {
      mainTitleAnimation
        .to($(".introduce-sec .introduce-title-area"), { xPercent: 20, opacity: 1 }, "a")
        .to($(".introduce-sec .description-area"), { xPercent: -20, opacity: 1 }, "a");
    } else {
      mainTitleAnimation
        .to($(".introduce-sec .introduce-title-area"), { yPercent: -30, opacity: 1 })
        .to($(".introduce-sec .description-area"), { yPercent: -30, opacity: 1 });
    }
  });

  // title 한 글자씩 자르기
  document.querySelectorAll(".title .split").forEach((element) => {
    element.innerHTML = element.textContent
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
  });

  // solution-sec
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

  const solutionAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".solution-sec",
      start: "0% 50%",
      end: "100% 0%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
  });
  solutionAnimation
    .to($(".solution-sec .title .split span"), {
      stagger: 0.05,
      color: "#15C1D8",
      duration: 0.3,
      ease: "power2.inOut",
    })
    .from($(".solution-sec .solution-list h3"), { "--height": 0, stagger: 0.3 });

  // benefit-sec
  const benefitAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".benefit-sec",
      start: "0% 50%",
      end: "100% 0%",
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
    .to($(".benefit-sec .title .split span"), {
      stagger: 0.05,
      color: "#15C1D8",
      duration: 0.3,
      ease: "power2.inOut",
    })
    .to($(".benefit-sec .benefit-list li p"), { "--width": "100%", duration: 2 }, "a");
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
        duration: 2,
      },
      "a"
    );
  });

  // technology-sec
  gsap.to(".technology-sec .title .split span", {
    scrollTrigger: {
      trigger: ".technology-sec",
      start: "0% 60%",
      end: "100% 0%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
    stagger: 0.05,
    color: "#15C1D8",
    duration: 0.3,
    ease: "power2.inOut",
  });

  const upAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".technology-sec",
      start: "0% 80%",
      end: "100% 0%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
    duration: 0.5,
  });
  upAnimation
    .from($(".technology-sec .common-title-area"), { y: 100, opacity: 0 })
    .from($(".technology-sec .content-area"), { y: 100, opacity: 0 });

  // pricing-sec
  const upAnimation2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".pricing-sec",
      start: "0% 80%",
      end: "100% 0%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
  });
  upAnimation2
    .from($(".pricing-sec .detail-title-area"), { y: 100, opacity: 0 })
    .from($(".pricing-sec .list-area"), { y: 100, opacity: 0 })
    .from($(".pricing-sec .btn-area"), { y: 100, opacity: 0 });

  const items = $(".pricing-sec .pricing-item");
  const indexArr = [1, 2, 0];
  let index = 0;
  let intervel;

  function activeItem() {
    items.removeClass("active");
    items.eq(indexArr[index]).addClass("active");
    index = (index + 1) % indexArr.length;
  }
  items.eq(indexArr[index]).addClass("active");

  intervel = setInterval(activeItem, 2000);

  items.mouseenter(() => {
    clearInterval(intervel);
  });
  items.mouseleave(() => {
    intervel = setInterval(activeItem, 2000);
  });

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
  const diagramAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".diagram-sec",
      start: "0% 70%",
      end: "100% 0%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
    ease: "power2.inOut",
  });
  diagramAnimation
    .from($(".diagram-sec .detail-title-area"), { y: 100, opacity: 0 })
    .from($(".diagram-title"), { y: 100, opacity: 0 }, "a");
  if (window.innerWidth > 768) {
    diagramAnimation
      .from($(".diagram-center"), { y: 100, opacity: 0 }, "a")
      .from($(".diagram-left"), { x: -100, opacity: 0 })
      .from($(".left-line #circle1"), { opacity: 0 }, "-=0.1")
      .from($(".left-line #path"), { strokeDashoffset: -81, duration: 0.5 }, "-=0.1")
      .from($(".left-line #circle2"), { opacity: 0 }, "-=0.1")
      .from($(".diagram-right"), { x: 100, opacity: 0 })
      .from($(".right-line #circle1"), { opacity: 0 }, "-=0.1")
      .from($(".right-line #path"), { strokeDashoffset: 50, duration: 0.5 }, "-=0.1")
      .from($(".right-line #circle2"), { opacity: 0 }, "-=0.1")
      .from($(".diagram-bottom"), { y: 100, opacity: 0 })
      .from($(".bottom-line #path"), { strokeDashoffset: -100, duration: 0.5 }, "-=0.1")
      .from($(".bottom-line #circle"), { opacity: 0 }, "-=0.1");
  } else {
    diagramAnimation.from($(".mo-diagram"), { y: 100, opacity: 0 }, "a");
  }

  gsap.from(".consulting-sec", {
    scrollTrigger: {
      trigger: ".consulting-sec",
      start: "0% 80%",
      end: "100% 0%",
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
    autoplay: false,
    grabCursor: true,
  });

  ScrollTrigger.refresh();
});
