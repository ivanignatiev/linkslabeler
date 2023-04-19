'use strict';

import './popup.css';

(async () => {

  console.log('popup.js: start');

  const setupPopup = () => {

    chrome.storage.sync.get(['sources'], (result) => {
      const sourcesListText = result.sources.map(source => source.url).join('\n');

      document.getElementById('sourcesTxtarea').value = sourcesListText;
    });

    document.getElementById('refreshBtn').addEventListener('click', () => {
      console.log("popup.js: refreshBtn click");

      const sourceURLList = document.getElementById('sourcesTxtarea').value.split('\n');

      const sources = sourceURLList.filter(url => url.length > 0).map(url => ({ url }));

      chrome.runtime.sendMessage(
        {
          type: 'UPDATE_SOURCES',
          payload: {
            sources: sources
          },
        },
        (response) => {
          console.log(response);
        }
      );
    });

    document.getElementById('clearHashesBtn').addEventListener('click', async () => {
      console.log("popup.js: clearHashesBtn click");

      await chrome.storage.local.set({ hashes: {} });

      chrome.runtime.sendMessage(
        {
          type: 'NOTIFICATION_HASHES_UPDATED',
        },
        (response) => {
          console.log(response);
        }
      );
    });

  }

  document.addEventListener('DOMContentLoaded', setupPopup);

})();
