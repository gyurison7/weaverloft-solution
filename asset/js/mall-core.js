const counter = { counter: 0 };

function countAnimation(selector, value) {
  const target = document.querySelector(selector);
  gsap.to(counter, {
    counter: value,
    scrollTrigger: {
      trigger: ".benefit-sec",
      start: "0% 80%",
      end: "100% 0%",
      toggleActions: "play none none none",
      // markers: true,
    },
    onUpdate: () => {
      target.innerHTML = (value > 0 ? "+" : "") + counter.counter.toFixed() + "<sup>%</sup>";
    },
    duration: 1,
  });
}

countAnimation("#build-cost", -50);
countAnimation("#operation-cost", -70);
countAnimation("#speed", 200);

$(".pricing-sec .btn-more").on("click", function () {
  const element = $(".pricing-sec .hide");
  element.toggle();
  if (element.css("display") === "none") {
    $(".detail-sec").removeClass("on");
    $(".pricing-item").removeClass("on");
    $(this).text("자세히 알아보기");
  } else {
    $(".detail-sec").addClass("on");
    $(".pricing-item").addClass("on");
    $(this).text("도입 문의하기");
  }
});
