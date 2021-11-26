import setDarkMode from "./dark.js";

const toggleDarkMode = (isItDark) => {
    if (isItDark) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "not-dark");
    }

    setDarkMode();
};
