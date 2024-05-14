document.addEventListener("DOMContentLoaded", function () {
  // introduce-sec
  document.fonts.ready.then(function () {
    const mainTitleAnimation = gsap.timeline();
    mainTitleAnimation
      .to($(".introduce-sec .introduce-title-area"), { xPercent: 20, opacity: 1 }, "a")
      .to($(".introduce-sec .description-area"), { xPercent: -20, opacity: 1 }, "a");
  });

  // titleAnimation 공통
  // 한 글자씩 자르기
  document.querySelectorAll(".title .split").forEach((element) => {
    element.innerHTML = element.textContent
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
  });

  document.querySelectorAll(".titleAnimation").forEach(function (section) {
    gsap.to(section.querySelectorAll(".title .split span"), {
      scrollTrigger: {
        trigger: section,
        start: "0% 50%",
        end: "100% 0%",
        toggleActions: "play none none reverse",
        // markers: true,
      },
      stagger: 0.1,
      color: "#15C1D8",
      duration: 1,
      ease: "power2.in",
    });
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

  const lineAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".solution-list",
      start: "0% 60%",
      end: "100% 0%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
  });
  lineAnimation.from($(".solution-list h3"), { "--height": 0, stagger: 0.5 });

  // benefit-sec
  const counter = { counter: 0 };

  function countAnimation(selector, value) {
    const target = document.querySelector(selector);
    gsap.to(counter, {
      counter: value,
      scrollTrigger: {
        trigger: ".benefit-sec .list-area",
        start: "0% 60%",
        end: "100% 0%",
        toggleActions: "play none none reverse",
        // markers:  true,
      },
      onUpdate: () => {
        target.innerHTML = (value > 0 ? "+" : "") + counter.counter.toFixed() + "<sup>%</sup>";
      },
      duration: 2,
    });
  }

  countAnimation("#build-cost", -50);
  countAnimation("#operation-cost", -70);
  countAnimation("#speed", 200);

  gsap.to(".benefit-sec .benefit-list li p", {
    scrollTrigger: {
      trigger: ".benefit-sec .list-area",
      start: "0% 60%",
      end: "100% 0%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
    "--width": "100%",
    duration: 2,
  });

  // technology-sec
  var $grid = $(".grid").masonry({
    itemSelector: ".grid-item",
    columnWidth: 1,
    gutter: ".gutter-sizer",
    horizontalOrder: true,
    percentPosition: true,
    // fitWidth: true,
    resize: true,
  });

  $(window).resize(function () {
    $grid.masonry("layout");
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
  upAnimation.from($(".technology-sec .common-title-area"), { y: 100, opacity: 0 });
  upAnimation.from($(".technology-sec .grid"), { y: 100, opacity: 0 });

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
  upAnimation2.from($(".pricing-sec .detail-title-area"), { y: 100, opacity: 0 });
  upAnimation2.from($(".pricing-sec .list-area"), { y: 100, opacity: 0 });
  upAnimation2.from($(".pricing-sec .btn-area"), { y: 100, opacity: 0 });

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
    $(".pricing-sec .hide").delay(400).show();
    $(".pricing-sec .link-inquire").css("display", "inline-block");
    $(".detail-sec").addClass("on");
    $(".pricing-item").addClass("on");
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
  diagramAnimation.from($(".diagram-sec .detail-title-area"), { y: 100, opacity: 0 });
  diagramAnimation.from($(".diagram-title"), { y: 100, opacity: 0 }, "a");
  diagramAnimation.from($(".diagram-center"), { y: 100, opacity: 0 }, "a");
  diagramAnimation.from($(".diagram-left"), { x: -100, opacity: 0 });
  diagramAnimation.from($(".left-line #circle1"), { opacity: 0 }, "-=0.1");
  diagramAnimation.from($(".left-line #path"), { strokeDashoffset: -81, duration: 0.5 }, "-=0.1");
  diagramAnimation.from($(".left-line #circle2"), { opacity: 0 }, "-=0.1");
  diagramAnimation.from($(".diagram-right"), { x: 100, opacity: 0 });
  diagramAnimation.from($(".right-line #circle1"), { opacity: 0 }, "-=0.1");
  diagramAnimation.from($(".right-line #path"), { strokeDashoffset: 50, duration: 0.5 }, "-=0.1");
  diagramAnimation.from($(".right-line #circle2"), { opacity: 0 }, "-=0.1");
  diagramAnimation.from($(".diagram-bottom"), { y: 100, opacity: 0 });
  diagramAnimation.from($(".bottom-line #path"), { strokeDashoffset: -100, duration: 0.5 }, "-=0.1");
  diagramAnimation.from($(".bottom-line #circle"), { opacity: 0 }, "-=0.1");

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
  upAnimation3.from($(".function-sec .common-title-area"), { y: 100, opacity: 0 });
  upAnimation3.from($(".function-sec .swiper"), { y: 100, opacity: 0 });

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
    // autoplay: false,
  });

  ScrollTrigger.refresh();
});
