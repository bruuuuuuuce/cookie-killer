//browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
//    console.log("Received response: ", response);
//});
//
//browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//    console.log("Received request: ", request);
//});

const cookieRequestBannerSelectors = [
  '#onetrust-consent-sdk', // onetrust
  '#cookie-popup-with-overlay',
  '#cookie-information-template-wrapper',
  '.cky-consent-container', // cookieyes
  '.iubenda-cs-container', // iubenda
  '#termly-code-snippet-support', // termly
  '.osano-cm-dialog', // osano
  '.frame-content__inner', //securityprivacy.ai
  '#CybotCookiebotDialog', // goodtimes.io
];

const waitForElm = (selector) => {
  return new Promise(resolve => {
    // if the selector takes longer than 15 seconds to load, we will just assume it will never load
    const timeout = setTimeout(() => {
      resolve(null);
    }, 15000);
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(_mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        clearTimeout(timeout);
        console.log('found selector', selector);
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

const hideSelector = async (selector) => {
    const bannerEle = await waitForElm(selector);
    if (bannerEle) {
      bannerEle.remove();
    }
  }

const hideAll = () => {
    for (const selector of cookieRequestBannerSelectors) {
      // we don't want to wait for each selector since its possible that the
      // selector will never be present on the page
      void hideSelector(selector);
    }
  }

/**
 * Check and set a global guard variable.
 * If this content script is injected into the same page again,
 * it will do nothing next time.
 */
if (!window.hasRunCookieKillerContentScript) {
  window.hasRunCookieKillerContentScript = true;
  hideAll()
}
