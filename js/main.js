(function () {
  const page = document.getElementById("page");
  const wrap = document.querySelector(".page-scale");
  const DESIGN_W = 1920;
  const DESIGN_H = 7419;

  function scalePage() {
    const scale = window.innerWidth / DESIGN_W;
    page.style.transform = "scale(" + scale + ")";
    wrap.style.height = DESIGN_H * scale + "px";
  }

  scalePage();
  window.addEventListener("resize", scalePage);

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (link.classList.contains("js-open-booking") || link.classList.contains("js-open-course")) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const scale = window.innerWidth / DESIGN_W;
      const top = target.offsetTop * scale;
      window.scrollTo(0, top);
    });
  });

  const slides = [
    "assets/images/work-2.png",
    "assets/images/work-1.png",
    "assets/images/work-3.png",
    "assets/images/work-4.png",
  ];
  const slots = Array.prototype.slice.call(document.querySelectorAll(".work-slide"));
  const prevBtn = document.querySelector(".works-arrow-left");
  const nextBtn = document.querySelector(".works-arrow-right");
  let index = 0;

  function render() {
    const n = slides.length;
    slots.forEach(function (img, i) {
      img.src = slides[(index + i + n) % n];
    });
  }

  function go(step) {
    if (!slots.length) return;
    const n = slides.length;
    index = (index + step + n) % n;
    render();
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });

  var reviews = [
    {
      name: "Алевтина",
      avatar: "assets/images/review-alevtina.png",
      stars: "assets/icons/stars-alevtina.svg",
      text: "Хожу на лазерную эпиляцию уже не первый месяц и могу сказать, что результат действительно есть. Волос стало значительно меньше, процедура ...",
      full: "Хожу на лазерную эпиляцию уже не первый месяц и могу сказать, что результат действительно есть. Волос стало значительно меньше, процедура проходит комфортно, мастер работает аккуратно."
    },
    {
      name: "Наталья",
      avatar: "assets/images/review-natalya.png",
      stars: "assets/icons/stars-natalya.svg",
      text: "Делала перманентный макияж бровей и осталась в полном восторге. Очень аккуратная работа, мастер всё объяснила перед процедурой ...",
      full: "Делала перманентный макияж бровей и осталась в полном восторге. Очень аккуратная работа, мастер всё объяснила перед процедурой и учла мои пожелания. Форма получилась естественной, как я и хотела. Отдельно хочу отметить атмосферу — спокойно, чисто и очень комфортно."
    },
    {
      name: "Марина",
      avatar: "assets/images/review-marina.png",
      stars: "assets/icons/stars-marina.svg",
      text: "Записывалась на косметологический уход, потому что были проблемы с сухостью кожи. После процедуры кожа стала заметно более ...",
      full: "Записывалась на косметологический уход, потому что были проблемы с сухостью кожи. После процедуры кожа стала заметно более увлажнённой и ровной, результат держится."
    }
  ];
  var reviewSlots = [
    document.querySelector(".review-left"),
    document.querySelector(".review-center"),
    document.querySelector(".review-right")
  ];
  var reviewPrev = document.querySelector(".reviews-arrow-left");
  var reviewNext = document.querySelector(".reviews-arrow-right");
  var reviewDots = Array.prototype.slice.call(document.querySelectorAll(".reviews-dot"));
  var reviewIndex = 0;

  function fillReview(slot, data, featured) {
    if (!slot || !data) return;
    slot.querySelector(".review-name").textContent = data.name;
    slot.querySelector(".review-text").textContent = featured ? data.full : data.text;
    slot.querySelector(".review-avatar img").src = data.avatar;
    slot.querySelector(".review-stars img").src = data.stars;
  }

  function featuredIndex() {
    return (reviewIndex + 1) % reviews.length;
  }

  function updateDots() {
    var current = featuredIndex();
    reviewDots.forEach(function (dot, i) {
      var on = i === current;
      dot.classList.toggle("is-active", on);
      if (on) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function renderReviews() {
    var n = reviews.length;
    reviewSlots.forEach(function (slot, i) {
      fillReview(slot, reviews[(reviewIndex + i + n) % n], i === 1);
    });
    updateDots();
  }

  function goReview(step) {
    step = Number(step);
    if (!step) return;
    var n = reviews.length;
    reviewIndex = (reviewIndex + ((step % n) + n) % n) % n;
    renderReviews();
  }

  if (reviewPrev) reviewPrev.addEventListener("click", function () { goReview(-1); });
  if (reviewNext) reviewNext.addEventListener("click", function () { goReview(1); });
  reviewDots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      var n = reviews.length;
      var step = (i - featuredIndex() + n) % n;
      if (step > n / 2) step -= n;
      goReview(step);
    });
  });
  updateDots();

  var overlay = document.getElementById("booking");
  var modal = overlay && overlay.querySelector(".booking-modal");
  var form = document.getElementById("booking-form");
  var datetimeSelect = document.getElementById("booking-datetime");
  var closeBtn = overlay && overlay.querySelector(".booking-close");
  var lastFocus = null;
  var months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];
  var times = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

  function fillDatetime() {
    if (!datetimeSelect) return;
    var now = new Date();
    var i;
    for (i = 0; i < 14; i++) {
      var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      var dateLabel = day.getDate() + " " + months[day.getMonth()];
      times.forEach(function (time) {
        var opt = document.createElement("option");
        opt.value = dateLabel + ", " + time;
        opt.textContent = dateLabel + ", " + time;
        datetimeSelect.appendChild(opt);
      });
    }
  }

  function openBooking(e) {
    if (e) e.preventDefault();
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("booking-open");
    var first = overlay.querySelector(".booking-input");
    if (first) first.focus();
  }

  function closeBooking() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("booking-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  fillDatetime();

  document.querySelectorAll(".js-open-booking").forEach(function (btn) {
    btn.addEventListener("click", openBooking);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeBooking);

  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeBooking();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay && !overlay.hidden) closeBooking();
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var text =
        "Здравствуйте! Хочу записаться онлайн." +
        "\nИмя: " + data.get("name") +
        "\nТелефон: " + data.get("phone") +
        "\nУслуга: " + data.get("service") +
        "\nДата и время: " + data.get("datetime");
      window.open(
        "https://wa.me/79951128252?text=" + encodeURIComponent(text),
        "_blank",
        "noopener"
      );
      form.reset();
      closeBooking();
    });
  }

  var courseOverlay = document.getElementById("course");
  var courseForm = document.getElementById("course-form");
  var courseClose = courseOverlay && courseOverlay.querySelector(".booking-close");

  function openCourse(e) {
    if (e) e.preventDefault();
    if (!courseOverlay) return;
    lastFocus = document.activeElement;
    courseOverlay.hidden = false;
    document.body.classList.add("booking-open");
    var first = courseOverlay.querySelector(".booking-input");
    if (first) first.focus();
  }

  function closeCourse() {
    if (!courseOverlay) return;
    courseOverlay.hidden = true;
    if (!overlay || overlay.hidden) document.body.classList.remove("booking-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.querySelectorAll(".js-open-course").forEach(function (btn) {
    btn.addEventListener("click", openCourse);
  });

  if (courseClose) courseClose.addEventListener("click", closeCourse);

  if (courseOverlay) {
    courseOverlay.addEventListener("click", function (e) {
      if (e.target === courseOverlay) closeCourse();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (courseOverlay && !courseOverlay.hidden) closeCourse();
  });

  if (courseForm) {
    courseForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!courseForm.reportValidity()) return;
      var data = new FormData(courseForm);
      var text =
        "Здравствуйте! Хочу записаться на курс." +
        "\nИмя: " + data.get("name") +
        "\nТелефон: " + data.get("phone") +
        "\nКурс: " + data.get("course") +
        "\nПовышение квалификации: " + (data.get("upgrade") ? "да" : "нет");
      window.open(
        "https://wa.me/79951128252?text=" + encodeURIComponent(text),
        "_blank",
        "noopener"
      );
      courseForm.reset();
      closeCourse();
    });
  }
})();
