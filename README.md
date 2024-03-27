![](https://i.imgur.com/MVR68qM.jpg)

## What the Extension Does

-   Adds a "Search on Nyaa" Button to Anime and Manga pages
    -   Sites: **[MyAnimeList](https://i.imgur.com/1hymaOS.png), [AniList](https://i.imgur.com/DtNugQF.png), [Kitsu](https://i.imgur.com/TVKqRcK.png), [Anime-Planet](https://i.imgur.com/zohAYbs.png), [AnimeNewsNetwork](https://i.imgur.com/xOYS17r.png), [AniDB](https://i.imgur.com/pRDcUVh.png), [LiveChart](https://imgur.com/plZxpBN)**
-   Search Parameters can be changed and saved in the [Extension Popup window](https://i.imgur.com/bzaChNf.png)

    -   For Manga pages, the Category setting will search for the "Literature" equivalent
    -   All tabs with a supported website currently open will automatically refresh on Save

-   By default the search will include both the Japanese(Romaji) & English titles — if they exist, and they are different
    -   the search will also add the base titles, if they include: ("Season"|"Part"|": "|" - ")
        -   for example, clicking the button on [Shingeki no Kyojin Season 3 Part 2](https://myanimelist.net/anime/38524/Shingeki_no_Kyojin_Season_3_Part_2) will return the search query:
        -   _"Shingeki no Kyojin Season 3 Part 2"|"Attack on Titan Season 3 Part 2"|"Shingeki no Kyojin"|"Attack on Titan"_
    -   _**additional "Query" types are available**: the Default combines both "Exact" and "Base"._
        -   Fuzzy: Searches for the site's default title only, without quotes ~ allows fuzzy matching
        -   Exact: Japanese and English full titles ~ searches for exact title names as written
        -   Base: Japanese and English base titles ~ searches with Seasons and Parts removed

# Firefox - [Extension Page](https://addons.mozilla.org/en-US/firefox/addon/nyaa-linker/)

# Chrome - ~~Extension Page~~

> I don't have a Chrome Developer Account, Chrome Users will need to manually install the Extension for now

-   Download Chrome.zip from the [Latest Release](https://github.com/Metacor/nyaa-linker/releases)
-   [Enable "Developer mode" in Chrome](https://i.imgur.com/h7kvj1h.png)
-   [Drag and Drop](https://i.imgur.com/u9LzP57.png) "nyaa-linker.zip" onto the "chrome://extensions" page

## If the Extension only activates after you click the Popup:

-   Enable Permissions
    -   **Firefox**: about:addons
        -   Click on the "Nyaa Linker" Extension
        -   Click on the "Permissions" tab
        -   [Enable Permissions for the websites you use](https://i.imgur.com/DWbinsN.png)
    -   **Chrome**: chrome://extensions
        -   Click on "Details" under the "Nyaa Linker" Extension
        -   [Enable Permissions for the websites you use](https://i.imgur.com/Qe3TD7i.png)
-   Optionally: Right-click the Extension icon and enable for each site: [Firefox](https://i.imgur.com/XHziPTB.png) | [Chrome](https://i.imgur.com/RjMCZSK.png)

### If you wish to submit a Pull Request, please read the [Contributing Guide](https://github.com/Metacor/nyaa-linker/blob/main/.github/CONTRIBUTING.md)
