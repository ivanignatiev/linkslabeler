# <img src="public/icons/app-icon-48.png" width="45" align="left"> Link Labeler

Link Labeler is a browser extension designed to enhance information related to links on web pages. By using this extension, users can gain more insight into the underlying resources that a link is pointing to.

## Features

- Labels library retrieval: The extension is capable of retrieving labels from multiple sources. Labels need to be organized in JSON format and hosted on an HTTP server or accessible via API. The JSON schema is described in the extension's GitHub repository documentation.
- Auto-labeling on page load: Labels are automatically displayed for identified links when the extension is enabled. The information from libraries is stored locally and needs to be refreshed if changes are made.
- Local storage clearing: Data can be easily removed at any time.

## Roadmap 

- Library editor
- Authentication

Please feel free to contribute or provide feedback in the [issues](https://github.com/ivanignatiev/linkslabeler/issues)

## Use cases

- Marking danger links: Users can label links that are potentially dangerous or malicious.
- Providing information about resources in Cloud or Hosting providers portals: Links to resources in cloud or hosting provider portals can be labeled to provide additional information.
- Marking broken links: Links that are broken or no longer functional can be labeled for easy identification.


# User Guide

## Label links

1. Install (Publishing to Google Chrome Web Store is in progress) [**Chrome** extension](https://chrome.google.com/webstore/category/extensions) <!-- TODO: Add chrome extension link inside parenthesis -->

2. Make avalable a library of labels in JSON format over HTTP/HTTPS (See [Data Structure](#data-structure))

3. Add URL to the library in the extension pop-up, each separate URL in a new line

4. Click "Refresh & Label links" button

5. From this moment links will be labeled each time you open any web page. Auto-refresh from sources is not supported yet. If any of sources are changed you need to click "Refresh & Label Links" button manually.

## Remove Labels

1. Click "Clear Hashes" button

# Data Structure

## Chrome Storage - Sync

```json
{
  "sources": [ 
    {
      "url": "<remote json url>"
    }
  ]
}
```

## Chrome Storage - Local

```json
"hashes": {
  "<md5-hash>": {
    "labels": [
      {
        "caption": "<label-text>",
        "style": "primary|success|info|warning|danger|light|dark",
      }
    ]
  }
}
```

## Labels library in remote JSON (file, or API)

```json
{
  "version": 1,
  "hashes": {
    "<md5-hash-1-of-href-attribure>": {
        "metadata": {
          "hash": {
            "href": "https://*****/****/***.json"
          }
        },
        "labels": [
          {
            "caption": "<label-1-1-text>",
            "style": "primary"
          },
          {
            "caption": "<label-1-2-text>",
            "style": "success"
          }
        ]
    },
    "<md5-hash-2-of-link-text>": {
        "metadata": {
          "hash": {
            "text": "<link-2-text>"
          },
        },
        "labels": [
          {
            "caption": "<label-2-1-text>",
            "style": "info"
          }
        ]
    },
    "<md5-hash-3-of-href-attribure-and-text>": {
        "metadata": {
          "hash": {
            "href": "https://*****/****/***.json",
            "text": "<link-3-text>"
          }
        },
        "labels": [
          {
            "caption": "<label-3-1-text>",
            "style": "warning"
          },
          {
            "caption": "<label-3-2-text>",
            "style": "danger"
          },
          {
            "caption": "<label-3-3-text>",
            "style": "light"
          },
          {
            "caption": "<label-3-4-text>",
            "style": "dark"
          },
        ]
    }
  }
}
```

Sample library can be found [here](test/json-samples/).

## Contribution

Suggestions and pull requests are welcomed!.

---

This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)

# License

[MIT](LICENSE)