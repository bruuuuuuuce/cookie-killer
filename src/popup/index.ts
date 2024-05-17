import * as browser from 'webextension-polyfill';

async function reportMissingDomain(url: string) {
  const response = await window.fetch('https://cookie-killer-poc-backend.vercel.app/api/v1/missing?domain=' + url);
  const data = await response.json();
  console.log(data);
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (_e: MouseEvent) => {
    const target = _e.target as HTMLElement;
    /**
     * Insert the page-hiding CSS into the active tab,
     * then get the beast URL and
     * send a "beastify" message to the content script in the active tab.
     */
    function beastify(tabs: browser.Tabs.Tab[]) {
      console.log('tabs', tabs, window.location.href);
      const gettingCurrent = browser.tabs.getCurrent();
      if (gettingCurrent) {
        gettingCurrent.then((tab) => {
          console.log('fafdasdf', tab);
        });
      }
      tabs.forEach(tab => {
        void reportMissingDomain(tab.url ?? 'unknown');
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error: unknown) {
      console.error(`Could not beastify: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "beastify()" or "reset()" as appropriate.
     */

    if (target.tagName !== "BUTTON" || !target.closest("#popup-content")) {
      // Ignore when click is not on a button within <div id="popup-content">.
      return;
    }
    if (_e.type === "reset") {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(() => console.log('reset'))
        .catch(reportError);
    } else {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(beastify)
        .catch(reportError);
    }
  });
}

listenForClicks();
