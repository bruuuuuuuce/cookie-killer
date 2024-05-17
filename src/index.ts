// This is the content-script, and has limited access to the browser extension API.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#webextension_ap
import { CookieBannerHidden } from './common/types';
import * as browser from 'webextension-polyfill';

const cookieRequestBannerSelectors: string[] = [
  '#onetrust-consent-sdk', // onetrust
  '#cookie-popup-with-overlay',
  '#cookie-information-template-wrapper',
  '.cky-consent-container', // cookieyes
  '.iubenda-cs-container', // iubenda
  '#termly-code-snippet-support', // termly
  '.osano-cm-dialog', // osano
  '.frame-content__inner', //securityprivacy.ai
];

class CookieKiller {
  constructor() {}

  /**
   * Sometimes the cookie banner is loaded after the page is loaded. This function
   * is a workaround to wait for the cookie banner to be loaded.
   * @param selector - The css selector to wait for
   * @private
   */
  private waitForElm(selector: string): Promise<Element | null> {
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

  private async incrementBadge(): Promise<void> {
    const message: CookieBannerHidden = {
      count: 1
    };
    // send message to background script to increment the badge
    await browser.runtime.sendMessage(message);
  }

  private async hideSelector(selector: string): Promise<void> {
    const bannerEle = await this.waitForElm(selector);
    if (bannerEle) {
      bannerEle.remove();
      await this.incrementBadge();
    }
  }

  public hideAll(): void {
    for (const selector of cookieRequestBannerSelectors) {
      // we don't want to wait for each selector since its possible that the
      // selector will never be present on the page
      void this.hideSelector(selector);
    }
  }
}

/**
 * Check and set a global guard variable.
 * If this content script is injected into the same page again,
 * it will do nothing next time.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!window.hasRunCookieKillerContentScript) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
  window.hasRunCookieKillerContentScript = true;
  const cookieKiller = new CookieKiller();
  cookieKiller.hideAll();
}
