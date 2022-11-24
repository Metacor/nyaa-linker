### Local Setup

-   **Fork the Project**
-   **Clone the Repository:** `git clone https://github.com/<YOUR-USERNAME>/nyaa-linker.git`
-   **Install Dependencies:** `yarn`
-   **Create a Feature Branch:** `git checkout -b feature/feature-name` _or_ `git checkout -b fix/problem-name`

### Test Changes

**Firefox**: `about:debugging#/runtime/this-firefox`

-   _rename `manifest-firefox.json` to `manifest.json`_
-   _click on the `Load Temporary Add-on...` button_
-   _select the `manifest.json` file_

**Chrome**: `chrome://extensions/`

-   _rename `manifest-chrome.json` to `manifest.json`_
-   _click on the `Load unpacked` button_
-   _select the `src` folder_

### Submit Changes

-   **Stage changes:** `git add .`
-   **Commit changes:** `git commit -m "add: Feature Name"`
    _or_ `git commit -m "fix: Problem Name"`
    -   _for simple documentation changes, use Github's default `"Update file.name"`_
-   **Push changes:** `git push origin feature/feature-name` _or_ `git push origin head`
-   **Submit a Pull Request on Github:** _if your Feature resolves an Issue, add `fix #XXX` in the description_
