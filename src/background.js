'use strict';

const sendMessageToContentScript = (message, response) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs) {
      return;
    }

    const tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, message, response);
  });
};

const commitSources = (sources) => {
  chrome.storage.sync.set({ sources }).then(() => {
    console.log('Sources list updated in sync storage');
  });
};

const commitHashes = (hashes) => {
  chrome.storage.local.set({ hashes }).then(() => {
    console.log('Hashes updated in local storage');
  });
};

const updateHashesFromSources = async (sources) => {
  for (const source of sources) {
    console.log(
      'background.js/updateHashesFromSources: processing source: ',
      source.url,
      ''
    );

    const response = await fetch(source.url, {
      method: 'GET',
      headers: {
        'X-Request-Origin': 'linkslabeler'
      },
      cors: 'no-cors',
      cache: 'no-cache',
    });

    if (!response.ok) {
      // TODO: Mark source as failed
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    console.log({
      data
    })

    const gettingCurrentHashesResult = await chrome.storage.local.get('hashes');
    const hashes = gettingCurrentHashesResult.hashes || {};

    commitHashes({ ...hashes, ...data.hashes });
  }

  sendMessageToContentScript(
    {
      type: 'NOTIFICATION_HASHES_UPDATED',
    },
    (response) => {
      console.log(response);
    }
  );
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background.js: message received: ', request.type, '');

  if (request.type === 'UPDATE_SOURCES') {
    const { sources } = request.payload;

    commitSources(sources);
    updateHashesFromSources(sources);

    sendResponse({ receiver: 'background.js' });
    return true;
  }

  sendResponse({ receiver: 'background.js' });
  return true;
});
