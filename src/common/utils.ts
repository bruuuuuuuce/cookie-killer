// The apis between firefox and chrome are different, so we need to make sure we use the correct browser object
// depending on the browser we are using.
import * as browser from 'webextension-polyfill';

type GetBadgeTextProps = {
  tabId: number | undefined;
};
export async function getBadgeText(props: GetBadgeTextProps): Promise<string> {
  const {tabId} = props;
  const manifest = browser.runtime.getManifest();
  if (manifest.manifest_version == 2) {
    return (await browser.browserAction.getBadgeText({tabId})) ?? '';
  }
  return (await browser.action.getBadgeText({tabId})) ?? '';
}

type SetBadgeTextProps = {
  text: string;
  tabId: number | undefined;
};
export async function setBadgeText(props: SetBadgeTextProps): Promise<void> {
  const {text, tabId} = props;
  const manifest = browser.runtime.getManifest();
  if (manifest.manifest_version == 2) {
    await browser.browserAction.setBadgeText({text, tabId});
    return;
  }
  await browser.action.setBadgeText({text, tabId});
}

type SetBadgeBackgroundColorProps = {
  color: string;
  tabId: number | undefined;
};
export async function setBadgeBackgroundColor(props: SetBadgeBackgroundColorProps): Promise<void> {
  const {color, tabId} = props;
  const manifest = browser.runtime.getManifest();
  if (manifest.manifest_version == 2) {
    await browser.browserAction.setBadgeBackgroundColor({color, tabId});
    return;
  }
  await browser.action.setBadgeBackgroundColor({color, tabId});
}