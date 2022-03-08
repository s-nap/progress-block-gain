class ProgressBar {
  constructor(value = "", elementName = "") {
    this.value = value;
    this.circle = this.getCircleElement(elementName);
    const radius = this.circle.r.baseVal.value;
    this.circumference = 2 * Math.PI * radius;
    this.animateInterval = undefined;
    this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.circle.style.strokeDashoffset = this.circumference;
    this.setProgress(this.value);
  }

  getCircleElement(elementName) {
    const element = document.getElementById(elementName);

    if (!element) {
      throw new Error("No circle element found.");
    }

    return element;
  }

  setValue(value) {
    let valueInt = parseInt(value);

    if (isNaN(valueInt) || valueInt < 0) {
      valueInt = 0;
    } else if (valueInt > 100) {
      valueInt = 100;
    }

    this.setProgress(valueInt);
  }

  getValue() {
    return this.value;
  }

  setProgress(percent) {
    this.value = percent;
    const offset = this.circumference - (percent / 100) * this.circumference;
    this.circle.style.strokeDashoffset = offset;
  }

  hideBar() {
    this.circle.classList.add("hide");
  }

  showBar() {
    this.circle.classList.remove("hide");
  }

  startAnimateBar(callback) {
    if (this.animateInterval) {
      return;
    }

    this.circle.classList.add("animate");
    this.animateInterval = setInterval(() => {
      const percent = this.value < 100 ? this.value + 1 : 0;
      if (percent === 0) this.circle.classList.add("blink");
      else if (percent === 1) this.circle.classList.remove("blink");
      this.setProgress(percent);

      typeof callback === "function" && callback(percent);
    }, 500);
  }

  stopAnimateBar() {
    clearInterval(this.animateInterval);
    this.circle.classList.remove("animate");
    this.animateInterval = undefined;
  }
}

const progressBar = new ProgressBar(0, "progress-ring__circle1");

let input = document.querySelector(".percent");
input.addEventListener("change", e => {
  progressBar.setValue(input.value);
});

let hide = document.getElementById("toggle-button-hide");
hide.addEventListener("click", e => {
  if (hide.checked) {
    progressBar.hideBar();
  } else {
    progressBar.showBar();
  }
});

const animateCallback = percent => {
  input.value = percent.toString();
};

let animate = document.getElementById("toggle-button-animate");
animate.addEventListener("click", e => {
  if (animate.checked) {
    progressBar.startAnimateBar(animateCallback);
  } else {
    progressBar.stopAnimateBar();
  }
});
