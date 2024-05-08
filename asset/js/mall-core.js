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

$(document).on("click", ".pricing-sec .btn-more", function () {
  $(this).hide();
  $(".pricing-sec .hide").show();
  $(".pricing-sec .link-inquire").css("display", "inline-block");
  $(".detail-sec").addClass("on");
  $(".pricing-item").addClass("on");
});
