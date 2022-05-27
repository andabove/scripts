/**
 * Setup the default options for the script

 * @returns {Object}
 */
const weglotDefaultOptions = {
  LANG_IDENTIFIER: "data-lang",
  DEFAULT_LANG: "en",
  WF_LANG_SELECTOR: ".weglot-lang-selection",
  WF_LANG_CURRENT: ".weglot-current",
};

/**
 * Allows the user to override the default options.
 *
 * @param {Object} options
 * @returns {Object}
 * @example
 * window.weglotCustomOptions = {
 *  DEV: true,
 * }
 */
const weglotOptions = Object.assign(
  {},
  weglotDefaultOptions,
  window.weglotCustomOptions
);

/**
 * Example of initializing the library.
 *
 * Weglot.initialize({
 *  api_key: "api_key",
 *  hide_switcher: true,
 *  cache: true,
 * });
 */

/**
 * When the language changes we want to update the dropdown to display the new language.
 * This will swap the current language with the new language in both the dropdown
 * and the page.
 *
 * @docs https://developers.weglot.com/javascript/javascript-functions#languagechanged
 */
Weglot.on("languageChanged", (newLang, prevLang) => {
  weglotImpl.setup(newLang, prevLang);
  weglotImpl.saveToStorage(newLang);
  weglotImpl.redirectUser(newLang, prevLang);
});

Weglot.on("initialized", () => {
  // weglotImpl.setWeglotLanguageFromPathname();
});

const weglotImpl = {
  setup(newLang, prevLang) {
    console.log(`Language changed from ${prevLang} to ${newLang}`);
    /**
     * Updating Refs for links
     */
    weglotImpl.updateRefs(newLang, prevLang);
  },
  setWeglotLanguageFromPathname() {
    const { pathname } = window.location;
    const [lang] = pathname.split("/").filter((path) => path);
    const POSSIBLE_LANGS = ["fr"];

    if (POSSIBLE_LANGS.includes(lang)) {
      Weglot.switchTo(lang);
      weglotImpl.saveToStorage(lang);
    }
  },
  saveToStorage(lang) {
    localStorage.setItem("wglang", lang);
    console.log("Saved to storage: " + lang);
  },
  updateRefs(newLang, prevLang) {
    const { origin: locationOrigin, pathname: locationPathname } =
      window.location;

    // Pages that we want to replace locations
    const REFS_TO_UPDATE = ["/about"];

    // Split paths into an array and remove blanks
    const paths = locationPathname.split("/").filter((path) => path);

    /**
     * Example link:
     *  https://rcco.uk/about
     *
     * Translation link:
     *  https://rcco.uk/fr/about
     */

    // Get all of the links that need to be updated
    const links = document.getElementsByTagName("a");
    const linksToUpdate = Array.from(links).filter((link) => {
      const href = link.getAttribute("href");

      return REFS_TO_UPDATE.some((ref) => href.includes(ref));
    });

    if (newLang !== weglotOptions.DEFAULT_LANG) {
      linksToUpdate.forEach((link) => {
        const { pathname: linkPathname } = new URL(link.href);
        const addPrefix = `/${newLang}${linkPathname}`;

        link.setAttribute("href", addPrefix);
      });
    } else {
      linksToUpdate.forEach((link) => {
        /**
         * remove the previous lang from the path
         */
        const { pathname: linkPathname } = new URL(link.href);
        const removePrefix = linkPathname.replace(`/${prevLang}`, "");

        link.setAttribute("href", removePrefix);
      });
    }
  },
  redirectUser(newLang, prevLang = null) {
    const REFS_TO_UPDATE = ["/about"];
    const { origin: locationOrigin, pathname: locationPathname } =
      window.location;

    if (!prevLang) return;

    if (
      prevLang === weglotOptions.DEFAULT_LANG &&
      locationPathname.includes(REFS_TO_UPDATE[0])
    ) {
      console.log("Previous language was default, redirecting to lang");
      window.location.replace(`${newLang}/${locationPathname}`);

      return;
    }

    if (
      locationPathname.includes(prevLang) &&
      newLang !== weglotOptions.DEFAULT_LANG &&
      locationPathname.includes(REFS_TO_UPDATE[0])
    ) {
      if (prevLang === newLang) return;
      console.log("Previous language was not default, redirecting to lang");

      const replacePathname = locationPathname.replace(
        `/${prevLang}/`,
        `/${newLang}/`
      );
      window.location.replace(replacePathname);

      return;
    }

    if (
      locationPathname.includes(prevLang) &&
      newLang === weglotOptions.DEFAULT_LANG &&
      locationPathname.includes(REFS_TO_UPDATE[0])
    ) {
      if (prevLang === newLang) return;

      const replacePathname = locationPathname.replace(`/${prevLang}/`, `/`);
      window.location.replace(replacePathname);
    }
  },
};
