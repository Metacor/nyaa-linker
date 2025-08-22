let btn, currentPage, previousPage, hotkeyListener;
chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'tabUpdated') {
        currentPage = window.location.href.split('/')[4];
        (!btn || currentPage !== previousPage) && init();
    }
});

async function init() {
    const loadUserSettings = await new Promise((resolve) => {
        chrome.storage.sync.get('settings', (res) => {
            resolve(res);
        });
    });

    previousPage = currentPage;
    const settings = loadUserSettings.settings;
    searchNyaa(settings);
}

function searchNyaa(settings) {
    const domain = window.location.href;
    const media = window.location.pathname.includes('manga') ? 'manga' : 'anime';
    let titleJap, titleEng, btnSpace, cardType, cardFlag, isSpicy;
    let categorySetting = settings.category_setting;
    let queryType = settings.query_setting;
    let customQuery = settings.custom_text_toggle_setting ? settings.custom_text_setting : '';

    const setCategory = (cat) => {
        if (media === 'manga') {
            const categories = { '0_0': '3_0', '1_2': '3_1', '1_3': '3_2', '1_4': '3_3' };
            return categories[cat];
        } else {
            return cat;
        }
    };

    categorySetting = setCategory(settings.category_setting);

    function createBtn(btnSpace) {
        !cardFlag && document.querySelector('.nyaaBtn') && document.querySelectorAll('.nyaaBtn').forEach((e) => e.remove()), (cardFlag = true);
        btn = btnSpace.appendChild(document.createElement('a'));
        btn.classList.add('nyaaBtn');
        settings.hide_button_setting && (btn.style.display = 'none');
        !cardType && settings.hotkey_key_setting && startHotkeyListener();
    }

    function createSearch(query) {
        let subDomain, siteText;
        isSpicy
            ? ((subDomain = 'Sukebei.'), (siteText = 'Sukebei'), media === 'manga' ? (categorySetting = '0_0') : (categorySetting = '1_1'))
            : ((subDomain = ''), (siteText = 'Nyaa'));

        !btn.title && (btn.textContent = `Search on ${siteText}`);
        (query.includes('&') || query.includes('+')) && (query = query.replace(/&/g, '%26').replace(/\+/g, '%2B'));
        btn.href = `https://${subDomain}nyaa.si/?f=${settings.filter_setting}&c=${categorySetting}&q=${query}${customQuery}&s=${settings.sort_setting}&o=${settings.order_setting}`;
        btn.target = '_blank';
    }

    function startHotkeyListener() {
        hotkeyListener && document.removeEventListener('keydown', hotkeyListener);
        hotkeyListener = (e) => {
            if (
                (btn && e[settings.hotkey_modifier_setting] && e.key.toLowerCase() === settings.hotkey_key_setting) ||
                (btn && settings.hotkey_modifier_setting === '' && !e.ctrlKey && !e.shiftKey && !e.altKey && e.key === settings.hotkey_key_setting)
            ) {
                if (settings.hotkey_query_setting !== 'inherit') {
                    queryType = settings.hotkey_query_setting;
                    createSearch(getQuery(titleJap, titleEng, queryType));
                }
                btn.dispatchEvent(new MouseEvent('click', { ctrlKey: settings.focus_setting }));
                e.preventDefault();
                queryType = settings.query_setting;
                createSearch(getQuery(titleJap, titleEng, queryType));
            }
        };
        document.addEventListener('keydown', hotkeyListener);
    }

    switch (true) {
        case domain.includes(`myanimelist.net`):
            const malMain = new RegExp(`myanimelist\\.net/${media}/\\d+`);
            if (malMain.test(domain)) {
                const engCheck = document.querySelector('.title-english');
                engCheck && (titleEng = engCheck.textContent);

                if (media === 'manga') {
                    const titleElm = document.querySelector('[itemprop="name"]');
                    titleJap = titleElm.textContent;
                    if (engCheck) {
                        engCheck.textContent = '';
                        titleJap = titleElm.textContent;
                        engCheck.textContent = titleEng;
                    }
                } else {
                    titleJap = document.querySelector('.title-name').textContent;
                }

                isSpicy = [...document.querySelectorAll('span[itemprop="genre"]')].some((el) => el.textContent.trim().toLowerCase() === 'hentai');

                btnSpace = document.getElementById('broadcast-block') || document.querySelector('.leftside').children[0];
                createBtn(btnSpace);
                btn.style.marginTop = '4px';
                btn.classList.add('left-info-block-broadcast-button');
                createSearch(getQuery(titleJap, titleEng, queryType));
            }

            const cardPaths = ['/genre', '/season', '/magazine', '/adapted'];
            if (cardPaths.some((path) => domain.includes(path))) {
                if (domain.includes('/adapted') && document.querySelector('.list.on')) return;

                for (const card of document.querySelectorAll('.seasonal-anime')) {
                    cardType = true;
                    titleJap = card.querySelector('.title h2').innerText;
                    titleEng = card.querySelector('.title h3')?.innerText;
                    isSpicy = [...card.querySelectorAll('.explicit a')].some((el) => el.title.toLowerCase().includes('hentai'));
                    !isSpicy && (categorySetting = setCategory(settings.category_setting));

                    createBtn(card.querySelector('.broadcast'));
                    btn.title = 'Search on Nyaa';
                    btn.style.background = 'url(https://i.imgur.com/9Fr2BRG.png) center/20px no-repeat';
                    btn.style.padding = '0 11px';
                    isSpicy && ((btn.title = 'Search on Sukebei'), (btn.style.border = '2px solid red'), (btn.style.borderRadius = '50%'));
                    createSearch(getQuery(titleJap, titleEng, queryType));
                }
            }
            break;

        case domain.includes(`anime-planet.com/${media}/`) && domain !== `https://www.anime-planet.com/${media}/`:
            const skipPages = ['all', 'top-', 'recommendations', 'tags'];
            let skipExtra =
                media == 'anime' ? ['seasons', 'watch-online', 'studios'] : ['read-online', 'publishers', 'magazines', 'webtoons', 'light-novels'];

            if (skipPages.some((page) => domain.includes(`/${media}/${page}`)) || skipExtra.some((page) => domain.includes(`/${media}/${page}`))) {
                break;
            }

            setTimeout(() => {
                const titleMain = document.querySelector('[itemprop=name]').textContent;
                const titleAlt = document.getElementsByClassName('aka')[0];
                titleEng = titleMain;
                titleAlt ? (titleJap = titleAlt.innerText.split(': ').pop()) : (titleJap = titleMain);

                createBtn(document.querySelector('.mainEntry'));
                btn.classList.add('button');
                document.querySelectorAll('.mainEntry > .button').forEach((button) => {
                    typeof button === 'object' && (button.style.width = '180px');
                });
                createSearch(getQuery(titleJap, titleEng, queryType));
            }, 50);
            break;

        case domain.includes(`animenewsnetwork.com/encyclopedia/${media}.php?id=`):
            setTimeout(() => {
                titleEng = document.getElementById('page_header').innerText.split(' (').shift();
                for (const altTitle of document.querySelectorAll('#infotype-2 > .tab')) {
                    altTitle.textContent.includes('Japanese') && !titleJap && (titleJap = altTitle.textContent.split(' (').shift());
                }
                !titleJap && titleEng && (titleJap = titleEng);

                btnSpace = document.querySelector('.fright') ? document.querySelector('.fright') : document.querySelector('#big-video');
                createBtn(btnSpace);
                btn.style.display !== 'none' && (btn.style.display = 'flex');
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.height = '35px';
                btn.style.borderRadius = '3px';
                btn.style.background = '#2d50a7';
                btn.style.color = '#fff';
                btn.style.border = '1px solid black';
                btn.style.textDecoration = 'none';
                btnSpace.children[0].tagName === 'TABLE' && (btn.style.marginTop = '4px');
                createSearch(getQuery(titleJap, titleEng, queryType));
            }, 50);
            break;

        case domain.includes(`anidb.net/${media}/`):
            const hasID = /anidb\.net\/\w+\/(\d+)/;
            if (domain.match(hasID)) {
                titleJap = document.querySelector(".value > [itemprop='name']").textContent;
                titleEng = document.querySelector(".value > [itemprop='alternateName']").textContent;

                isSpicy = [...document.querySelectorAll('.tagname')].some((el) => el.textContent.trim().toLowerCase() === '18 restricted');

                btnSpace = document.querySelector('.resources > .value .english').appendChild(document.createElement('div'));
                btnSpace.classList.add('icons');
                createBtn(btnSpace);
                btn.classList.add('i_icon');
                btn.style.backgroundImage = "url('https://i.imgur.com/YG6H2nF.png')";
                btn.style.backgroundSize = 'contain';
                isSpicy ? (btn.title = 'Search on Sukebei') : (btn.title = 'Search on Nyaa');
                createSearch(getQuery(titleJap, titleEng, queryType));
            }
            break;

        case domain.includes(`anilist.co/${media}/`):
            awaitLoadOf('.sidebar .type', 'Romaji', () => {
                for (const data of document.getElementsByClassName('type')) {
                    const setTitle = data.parentNode.children[1].textContent;
                    data.textContent.includes('Romaji') && (titleJap = setTitle);
                    data.textContent.includes('English') && (titleEng = setTitle);
                    data.textContent.includes('Genres') ? (isSpicy = setTitle.toLowerCase().includes('hentai')) : null;
                }

                createBtn(document.querySelector('.cover-wrap-inner'));
                btn.style.display !== 'none' && (btn.style.display = 'flex');
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.height = '35px';
                btn.style.borderRadius = '3px';
                btn.style.marginBottom = '20px';
                btn.style.background = 'rgb(var(--color-blue))';
                btn.style.color = 'rgb(var(--color-white))';
                createSearch(getQuery(titleJap, titleEng, queryType));
            });
            break;

        case domain.includes(`kitsu.app/${media}/`):
            awaitLoadOf('.media--information', 'Status', () => {
                let titleUsa;
                document.querySelector('a.more-link')?.click();
                for (const data of document.querySelectorAll('.media--information > ul > li')) {
                    const usaCheck = data.textContent.includes('English (American)');
                    const setTitle = data.getElementsByTagName('span')[0];
                    data.textContent.includes('Japanese (Romaji)') && (titleJap = setTitle.textContent);
                    data.textContent.includes('English') && !usaCheck && (titleEng = setTitle.textContent);
                    usaCheck && (titleUsa = setTitle.textContent);
                    if (data.textContent.includes('Rating')) {
                        isSpicy = data.querySelector('span')?.textContent.replace(/\s+/g, ' ').trim() === 'R18 - Hentai';
                    }
                }
                document.querySelector('a.more-link')?.click();

                !titleEng && titleUsa && (titleEng = titleUsa);
                !titleJap && titleEng && (titleJap = titleEng);

                createBtn(document.querySelector('.library-state'));
                btn.classList.add('button', 'button--secondary');
                btn.style.background = '#f5725f';
                btn.style.marginTop = '10px';
                createSearch(getQuery(titleJap, titleEng, queryType));
            });
            break;

        case domain.includes('livechart.me'):
            if (domain.includes(`livechart.me/${media}/`)) {
                titleJap = document.querySelector('.grow .text-xl').innerText;
                titleEng = document.querySelector('.grow .text-lg').innerText;

                createBtn(document.querySelector('.lc-poster-col'));
                btn.classList.add('lc-btn', 'lc-btn-sm', 'lc-btn-outline');
                createSearch(getQuery(titleJap, titleEng, queryType));
            } else {
                let cardSelector, cardSpace;
                domain.includes('livechart.me/franchises/') ? (cardSelector = '.lc-anime') : (cardSelector = '.anime');
                domain.includes('livechart.me/franchises/') ? (cardSpace = '.lc-anime-card--related-links') : (cardSpace = '.related-links');

                for (const card of document.querySelectorAll(cardSelector)) {
                    cardType = true;
                    titleJap = card.getAttribute('data-romaji');
                    card.getAttribute('data-english') ? (titleEng = card.getAttribute('data-english')) : (titleEng = undefined);

                    createBtn(card.querySelector(cardSpace));
                    btn.style.background = 'url(https://i.imgur.com/9Fr2BRG.png) center/20px no-repeat';
                    btn.style.padding = '15px';
                    btn.style.margin = 0;
                    btn.classList.add('action-button');
                    btn.title = 'Search on Nyaa';
                    createSearch(getQuery(titleJap, titleEng, queryType));
                }
            }
            break;
    }
}

function getQuery(titleJap, titleEng, queryType) {
    !titleJap && !titleEng && init();
    titleJap && (titleJap = titleJap.replace(/["]/g, ''));
    titleEng && (titleEng = titleEng.replace(/["]/g, ''));
    query = `"${titleJap}"|"${titleEng}"`;

    if (!titleEng || titleJap.toLowerCase() === titleEng.toLowerCase()) {
        query = titleJap;
        return query;
    } else {
        let baseJap = getBaseTitle(titleJap);
        let baseEng = getBaseTitle(titleEng);

        if (queryType == 'default') {
            baseJap == titleJap && baseEng == titleEng ? (query = query) : (query = `"${titleJap}"|"${titleEng}"|"${baseJap}"|"${baseEng}"`);
        }

        if (queryType == 'base') {
            baseJap == baseEng ? (query = query) : (query = `"${baseJap}"|"${baseEng}"`);
        }

        queryType == 'fuzzy' && (query = titleJap);
        return query;
    }
}

function getBaseTitle(baseTitle) {
    const hasSeason = /(?<![\w])(season)(?![\w])/i;
    const hasNum = /(?<![\w])[0-9]+(?:st|[nr]d|th)(?![\w])/i;
    const hasWord = /(?<![\w])(first|second|third|fourth|fifth|(the final|final))(?![\w])/i;
    const hasPart = /(?<![\w])(part )/i;
    const hasEndPunc = /[?!.]$/;

    baseTitle = baseTitle
        .replace(/[\(\)\[\]\{\}][^()\[\]\{\}]*[\)\]\{\}]/g, '')
        .replace(/([♡♥☆★♪∞])(?=\w)/g, ' ')
        .replace(/[♡♥☆★♪∞](?!\w)/g, '')
        .trim();

    baseTitle.includes(': ') && (baseTitle = baseTitle.split(': ').shift());
    baseTitle.includes(' - ') && (baseTitle = baseTitle.split(' - ').pop());
    hasPart.test(baseTitle) && (baseTitle = baseTitle.split(/( part)/i).shift());

    if (hasSeason.test(baseTitle)) {
        if (hasNum.test(baseTitle) || hasWord.test(baseTitle)) {
            let titleNum, titleWord;
            hasNum.test(baseTitle) && (titleNum = baseTitle.match(hasNum)[0]);
            hasWord.test(baseTitle) && (titleWord = baseTitle.match(hasWord)[0]);
            titleNum && (baseTitle = baseTitle.split(` ${titleNum}`).shift());
            titleWord && (baseTitle = baseTitle.split(` ${titleWord}`).shift());
        } else {
            baseTitle = baseTitle.split(/( season)/i).shift();
        }
    }

    while (hasEndPunc.test(baseTitle)) {
        baseTitle = baseTitle.split(baseTitle.match(hasEndPunc)[0]).shift();
    }

    return baseTitle;
}

const awaitLoadOf = (selector, text, func) => {
    return new Promise((resolve) => {
        const mutObs = new MutationObserver(() => {
            const elms = document.querySelectorAll(selector);
            elms.forEach((elm) => {
                if (elm.textContent.includes(text)) {
                    resolve(elm);
                    mutObs.disconnect();
                    func();
                }
            });
        });
        mutObs.observe(document.body, { childList: true, subtree: true });
    });
};
