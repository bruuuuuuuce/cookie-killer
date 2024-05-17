// background-script.js
import { CookieBannerHidden } from "../common/types";
import * as browser from 'webextension-polyfill';
import { getBadgeText, setBadgeBackgroundColor, setBadgeText } from '../common/utils';
import { Runtime } from 'webextension-polyfill';
import MessageSender = Runtime.MessageSender;

async function handleMessage(request: CookieBannerHidden, sender: MessageSender) {
  const currText = await getBadgeText({tabId: sender.tab?.id}) || '0';
  await setBadgeBackgroundColor({color: '#696969', tabId: sender.tab?.id});
  const currNum = parseInt(currText);
  await setBadgeText(
    {
      text: (currNum + 1).toString(),
      tabId: sender.tab?.id,
    }
  );
}

browser.runtime.onMessage.addListener(handleMessage);
