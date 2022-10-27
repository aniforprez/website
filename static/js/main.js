const setDarkMode = (isItDark) => {
  let theme = null;
  if (isItDark === null || isItDark === undefined) {
    theme = localStorage.getItem("theme");
    if (theme === null) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  } else {
    theme = isItDark ? "dark" : "light";
  }

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    document.getElementById("light-toggle").classList.remove("hidden");
    document.getElementById("dark-toggle").classList.add("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    document.getElementById("light-toggle").classList.add("hidden");
    document.getElementById("dark-toggle").classList.remove("hidden");
  }
};

const toggleDarkMode = (isItDark) => {
  setDarkMode(isItDark);
};

setDarkMode();
