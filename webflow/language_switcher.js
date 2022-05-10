/**
 * Setup the default options for the script

 * @returns {Object}
 */
const weglotDefaultOptions = {
  LANG_IDENTIFIER: "data-lang",
  DEFAULT_LANG: "en",
  WF_LANG_SELECTOR: ".weglot-lang-selection",
  WF_LANG_CURRENT: ".weglot-current",
  DEV: false,
  INSIGHTS: {
    enabled: false,
    domain: "",
    prefix: "insights",
  },
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
});

/**
 * On initial load of the weglot, here we just want to attach click events
 * to the buttons.
 */
Weglot.on("initialized", () => {
  weglotImpl.setupEventListeners();
});

const weglotImpl = {
  setup(newLang, prevLang) {
    weglotImpl.log(`Language changed from ${prevLang} to ${newLang}`);

    const otherLangOptions = document.querySelectorAll(
      weglotOptions.WF_LANG_SELECTOR
    );
    const wfCurrent = document.querySelector(weglotOptions.WF_LANG_CURRENT);
    const previous = prevLang || weglotOptions.DEFAULT_LANG;

    wfCurrent.textContent = newLang.toUpperCase();

    const otherLangOptionsArray = Array.from(otherLangOptions);

    const elementToUpdate = otherLangOptionsArray.find(
      (option) => option.getAttribute(weglotOptions.LANG_IDENTIFIER) === newLang
    );

    elementToUpdate.setAttribute(weglotOptions.LANG_IDENTIFIER, previous);
    elementToUpdate.textContent = previous.toUpperCase();

    if (weglotOptions.INSIGHTS.enabled) {
      weglotImpl.updateInsightsLinks(newLang, prevLang);
    }

    /**
     * Rerun the event listeners to update the language
     */
    weglotImpl.setupEventListeners();
  },
  /**
   * Using the WF_LANG_SELECTOR, we want to attach click events to all of the
   * language buttons.
   */
  setupEventListeners() {
    const otherLangOptions = document.querySelectorAll(
      weglotOptions.WF_LANG_SELECTOR
    );

    otherLangOptions.forEach((link) => {
      link.removeEventListener("click", weglotImpl.weglotClickAttacher);
      link.addEventListener("click", weglotImpl.weglotClickAttacher);
    });
  },
  weglotClickAttacher(e) {
    const lang = e.currentTarget.getAttribute(weglotOptions.LANG_IDENTIFIER);
    e.preventDefault();

    Weglot.switchTo(lang);
    weglotImpl.log("Setup listener for", lang);
  },
  /**
   * The implementation is built specifcally around how hubspot handle duplicate
   * articles that are shared across languages.
   *
   * @example
   * const url = 'https://article_url.com/${es}/article_title-${es}'
   *
   * @param {*} newLang
   * @param {*} prevLang
   */
  updateInsightsLinks(newLang, prevLang) {
    const links = document.getElementsByTagName("a");
    const insightsLinks = Array.from(links).filter((link) =>
      link.href.includes(weglotOptions.INSIGHTS.prefix)
    );

    weglotImpl.log(`Found ${insightsLinks.length} insights links`);

    insightsLinks.forEach((link) => {
      /**
       * Remove the text from the links that have the previous lang at the end of the url
       */
      const url = link.href.replace(new RegExp(`-${prevLang}$`), "");

      /**
       * Separate the url into into two parts
       */
      const [fullUrl, params = ""] = url.split("?");

      /**
       * Used to check if there is a article title in the url
       */
      const separateBlog = fullUrl.split("/blog");

      /**
       * We want to detect if there is an article name after the blog
       */
      const articleName = separateBlog[1] ? separateBlog[1] : "";

      if (newLang !== weglotOptions.DEFAULT_LANG) {
        link.href = `${weglotOptions.INSIGHTS.domain}/${newLang}/blog${
          articleName.length ? articleName : ""
        }${articleName.length ? `-${newLang}` : ""}${params}`;
      } else {
        link.href = `${weglotOptions.INSIGHTS.domain}/${newLang}/blog${
          articleName.length ? articleName : ""
        }${params}`;
      }
    });
  },
  log(message) {
    if (weglotOptions.DEV) {
      console.log(message);
    }
  },
};
