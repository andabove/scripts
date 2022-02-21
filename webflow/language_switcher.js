const LANG_IDENTIFIER = "data-lang";
const DEFAULT_LANG = "en";
const WF_LANG_SELECTOR = ".weglot-lang-selection";
const WF_LANG_CURRENT = ".weglot-current";
const DEV = false;

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
  log(`Language changed from ${prevLang} to ${newLang}`);

  const otherLangOptions = document.querySelectorAll(WF_LANG_SELECTOR);
  const wfCurrent = document.querySelector(WF_LANG_CURRENT);
  const previous = prevLang || DEFAULT_LANG;

  wfCurrent.textContent = newLang.toUpperCase();

  const otherLangOptionsArray = Array.from(otherLangOptions);

  const elementToUpdate = otherLangOptionsArray.find(
    (option) => option.getAttribute(LANG_IDENTIFIER) === newLang
  );

  elementToUpdate.setAttribute(LANG_IDENTIFIER, previous);
  elementToUpdate.textContent = previous.toUpperCase();

  /**
   * Rerun the event listeners to update the language
   */
  setupEventListeners();
});

/**
 * On initial load of the weglot, here we just want to attach click events
 * to the buttons.
 */
Weglot.on("initialized", () => {
  setupEventListeners();
});

/**
 * Using the WF_LANG_SELECTOR, we want to attach click events to all of the
 * language buttons.
 */
function setupEventListeners() {
  const otherLangOptions = document.querySelectorAll(WF_LANG_SELECTOR);

  otherLangOptions.forEach((link) => {
    link.removeEventListener("click", weglotClickAttacher);
    link.addEventListener("click", weglotClickAttacher);
  });
}

function weglotClickAttacher(e) {
  const lang = e.currentTarget.getAttribute(LANG_IDENTIFIER);
  e.preventDefault();

  Weglot.switchTo(lang);
  log("Setup listener for", lang);
}

function log(message) {
  if (DEV) {
    console.log(message);
  }
}
