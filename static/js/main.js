const getTheme = () => {
  theme = localStorage.getItem("theme");
  if (theme === null) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme;
};

const setDarkMode = (isItDark) => {
  const theme = isItDark ? "dark" : "light";

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    document.getElementById("light-toggle").classList.remove("opacity-0");
    document.getElementById("light-toggle").classList.add("z-10");
    document.getElementById("dark-toggle").classList.add("opacity-0");
    document.getElementById("dark-toggle").classList.remove("z-10");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    document.getElementById("light-toggle").classList.add("opacity-0");
    document.getElementById("light-toggle").classList.remove("z-10");
    document.getElementById("dark-toggle").classList.remove("opacity-0");
    document.getElementById("dark-toggle").classList.add("z-10");
  }
};

const toggleDarkMode = () => {
  setDarkMode(getTheme() !== "dark");
};

setDarkMode(getTheme() === "dark");
