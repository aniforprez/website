const setDarkMode = () => {
    const theme = localStorage.getItem("theme");
    if (
        theme === "dark" ||
        (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
};

setDarkMode();

export default setDarkMode;
