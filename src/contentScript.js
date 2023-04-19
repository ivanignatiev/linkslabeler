'use strict';

import md5 from 'crypto-js/md5';

console.log('contentScript.js: start');

const applyLabelsToLink = (hashes, link) => {

  if (link.getAttribute('data-linkslabeler') === 'true') {
    return;
  }

  const linkHref = link.getAttribute('href');
  const linkText = link.textContent;

  const hashableLinkText = linkText.replace(/\s+/g, '');

  const linkHrefHash = md5(linkHref).toString();
  const linkTextHash = md5(hashableLinkText).toString();
  const linkTotalHash = md5(linkHref + hashableLinkText).toString();

  const labeling =
    hashes[linkHrefHash] ||
    hashes[linkTextHash] ||
    hashes[linkTotalHash] ||
    null;

  if (labeling) {
    link.setAttribute("data-linkslabeler", "true");

    labeling.labels.forEach((label) => {
      const labelElement = document.createElement('span');
      labelElement.textContent = label.caption;
      labelElement.classList.add(
        'linklabeler-label',
        'linklabeler-label-' + label.style
      );

      link.appendChild(labelElement);
    });
  }
};

const applyLabels = (hashes) => {
  console.log('contentScript.js: applying labels');
  const links = document.querySelectorAll('a');

  links.forEach((link) => {
    applyLabelsToLink(hashes, link);
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('contentScript.js: message reseived ', request.type);

  if (request.type === 'NOTIFICATION_HASHES_UPDATED') {
    chrome.storage.local.get('hashes').then((result) => {
      applyLabels(result.hashes);
    });

    sendResponse({ receiver: 'contentScript.js' });
    return true;
  }

  sendResponse({ receiver: 'contentScript.js' });
  return true;
});

(async () => {
  const gettingCurrentHashesResult = await chrome.storage.local.get('hashes');
  const hashes = gettingCurrentHashesResult.hashes || {};
  applyLabels(hashes);

  var observer = new MutationObserver(function (mutations, observer) {
    for (let mutation of mutations) {

      if (mutation.type === "childList" && mutation.target.querySelectorAll) {
        mutation.target.querySelectorAll('a').forEach((link) => {
          applyLabelsToLink(hashes, link);
        });
      }

    }
  });

  observer.observe(document, {
    subtree: true,
    childList: true,
  });
})();
