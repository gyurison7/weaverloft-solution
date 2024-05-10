// introduce-sec
const mainTitleAnimation = gsap.timeline();
mainTitleAnimation
  .from($(".introduce-sec .introduce-title-area"), { xPercent: -100, opacity: 0 }, "a")
  .from($(".introduce-sec .description-area"), { xPercent: 100, opacity: 0 }, "a");

// titleAnimation 공통
// 한 글자씩 자르기
document.querySelectorAll(".title .split").forEach((element) => {
  element.innerHTML = element.textContent
    .split("")
    .map((char) => `<span>${char}</span>`)
    .join("");
});

document.querySelectorAll(".titleAnimation").forEach(function (section) {
  gsap.from(section.querySelectorAll(".title .split span"), {
    scrollTrigger: {
      trigger: section,
      start: "0% 80%",
      end: "100% 0%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
    stagger: 0.01,
    color: "#ccc",
    duration: 1,
    ease: "power2.out",
  });
});

// solution-sec
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(CSSRulePlugin);
  const rule = CSSRulePlugin.getRule(".solution-sec::before");

  function animate() {
    const randomX = Math.random() * 200 - 200; // -200 ~ 0
    const randomY = Math.random() * 200 - 50; // -50 ~ 150

    gsap.to(rule, {
      duration: 4,
      cssRule: {
        transform: `translateX(${randomX}%) translateY(${randomY}%)`,
      },
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  animate();
  setInterval(animate, 4000);
});

const lineAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: ".solution-list",
    start: "0% 75%",
    end: "100% 0%",
    toggleActions: "play none none reverse",
    // markers: true,
  },
});
lineAnimation.from($(".solution-list li"), { "--height": 0, stagger: 0.1 });
lineAnimation.from($(".solution-list h3"), { "--height": 0, stagger: 0.1 });

// benefit-sec
const counter = { counter: 0 };

function countAnimation(selector, value) {
  const target = document.querySelector(selector);
  gsap.to(counter, {
    counter: value,
    scrollTrigger: {
      trigger: ".benefit-sec",
      start: "0% 80%",
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

gsap.from(".benefit-sec .benefit-list li p", {
  scrollTrigger: {
    trigger: ".benefit-sec",
    start: "0% 80%",
    end: "100% 0%",
    toggleActions: "play none none reverse",
    // markers: true,
  },
  "--width": 0,
  duration: 2,
});

// pricing-sec
gsap.from(".pricing-sec .pricing-list", {
  scrollTrigger: {
    trigger: ".pricing-sec",
    start: "0% 80%",
    end: "100% 0%",
    toggleActions: "play none none reverse",
    // markers: true,
  },
  yPercent: 100,
  opacity: 0,
});

$(document).ready(function () {
  const items = $(".pricing-sec .pricing-item");
  const indexArr = [1, 2, 0];
  let index = 0;

  function activeItem() {
    items.removeClass("active");
    items.eq(indexArr[index]).addClass("active");
    index = (index + 1) % indexArr.length;
  }
  items.eq(indexArr[index]).addClass("active");

  setInterval(activeItem, 2000);
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
    start: "0% 60%",
    end: "100% 0%",
    toggleActions: "play none none reverse",
    // markers: true,
  },
  ease: "power2.inOut",
});
diagramAnimation.from($(".diagram-title"), { yPercent: 100, opacity: 0 }, "a");
diagramAnimation.from($(".diagram-center"), { yPercent: 100, opacity: 0 }, "a");
diagramAnimation.from($(".diagram-left"), { xPercent: -100, opacity: 0 });
diagramAnimation.from($(".left-line #circle1"), { opacity: 0 });
diagramAnimation.from($(".left-line #path"), { strokeDashoffset: -81 });
diagramAnimation.from($(".left-line #circle2"), { opacity: 0 });
diagramAnimation.from($(".diagram-right"), { xPercent: 100, opacity: 0 });
diagramAnimation.from($(".right-line #circle1"), { opacity: 0 });
diagramAnimation.from($(".right-line #path"), { strokeDashoffset: 50 });
diagramAnimation.from($(".right-line #circle2"), { opacity: 0 });
diagramAnimation.from($(".diagram-bottom"), { yPercent: 100, opacity: 0 });
diagramAnimation.from($(".bottom-line #path"), { strokeDashoffset: -100 });
diagramAnimation.from($(".bottom-line #circle"), { opacity: 0 });