chrome.runtime.onMessage.addListener((request) => request.type === 'tabUpdated' && searchNyaa());

const awaitLoadOf = (selector) => {
    return new Promise((resolve) => {
        const mutObs = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                mutObs.disconnect();
            }
        });
        mutObs.observe(document.body, { childList: true, subtree: true });
    });
};

const searchNyaa = () => {
    const domain = window.location.href;
    const media = window.location.pathname.includes('manga') ? 'manga' : 'anime';

    chrome.storage.sync.get('settings', (load) => {
        const filter = load.settings.filter_setting;
        let category = load.settings.category_setting;
        const queryType = load.settings.query_setting;
        const sort = load.settings.sort_setting;
        const order = load.settings.order_setting;

        if (media === 'manga') {
            const searchManga = (cat) => {
                const categories = { '0_0': '3_0', '1_2': '3_1', '1_3': '3_2', '1_4': '3_3' };
                return categories[cat];
            };
            category = searchManga(category);
        }

        let titleJap, titleEng, btnSpace, btn;
        const createBtn = () => {
            btn = btnSpace.appendChild(document.createElement('a'));
            btn.classList.add('nyaaBtn');
        };

        switch (true) {
            case domain.includes(`myanimelist.net/${media}/`):
                const engCheck = document.querySelector('.title-english');
                engCheck && (titleEng = engCheck.textContent);

                if (media === 'manga') {
                    const titleElm = document.querySelector('[itemprop="name"]');
                    titleJap = titleElm.textContent;
                    if (engCheck) {
                        (engCheck.textContent = ''), (titleJap = titleElm.textContent), (engCheck.textContent = titleEng);
                    }
                } else {
                    titleJap = document.querySelector('.title-name > strong').textContent;
                }

                btnSpace = document.getElementById('broadcast-block')
                    ? document.getElementById('broadcast-block')
                    : document.querySelector('.leftside').children[0];
                createBtn();
                btn.style.marginTop = '4px';
                btn.classList.add('left-info-block-broadcast-button');
                break;

            case domain.includes(`anime-planet.com/${media}/`):
                setTimeout(() => {
                    const titleMain = document.querySelector('[itemprop=name]').textContent;
                    const titleAlt = document.getElementsByClassName('aka')[0];
                    titleEng = titleMain;
                    titleAlt ? (titleJap = titleAlt.innerText.split(': ').pop()) : (titleJap = titleMain);

                    btnSpace = document.querySelector('.mainEntry');
                    createBtn();
                    btn.classList.add('button');
                    const buttons = document.querySelectorAll('.mainEntry > .button');
                    for (const button in buttons) {
                        typeof buttons[button] === 'object' && (buttons[button].style.width = '180px');
                    }
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
                    createBtn();
                    btn.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 35px;
                        border-radius: 3px;
                        background: #2d50a7;
                        color: #fff;
                        border: 1px solid black;
                        text-decoration: none;`;
                    btnSpace.children[0].tagName === 'TABLE' && (btn.style.marginTop = '4px');
                }, 50);
                break;

            case domain.includes(`anidb.net/${media}/`):
                titleJap = document.querySelector(".value > [itemprop='name']").textContent;
                titleEng = document.querySelector(".value > [itemprop='alternateName']").textContent;

                btnContainer = document.querySelector('.resources > .value .english');
                btnSpace = btnContainer.appendChild(document.createElement('div'));
                btnSpace.classList.add('icons');
                createBtn();
                btn.classList.add('i_icon');
                btn.style.backgroundImage = "url('https://i.imgur.com/YG6H2nF.png')";
                btn.style.backgroundSize = 'contain';
                btn.title = 'Search on Nyaa';
                break;

            case domain.includes(`anilist.co/${media}/`):
                awaitLoadOf('div.data-set > div.value').then(() => {
                    const dataList = document.getElementsByClassName('type');
                    for (const data of dataList) {
                        const setTitle = data.parentNode.children[1].textContent;
                        data.textContent.includes('Romaji') && (titleJap = setTitle);
                        data.textContent.includes('English') && (titleEng = setTitle);
                    }

                    !titleJap && !titleEng && searchNyaa();

                    btnSpace = document.querySelector('.cover-wrap-inner');
                    document.querySelector('.nyaaBtn') && document.querySelector('.nyaaBtn').remove();
                    createBtn(btnSpace);
                    btn.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 35px;
                        border-radius: 3px;
                        background: rgb(var(--color-blue));
                        color: #fff;
                        margin-bottom: 20px;`;
                });
                break;

            case domain.includes(`kitsu.io/${media}/`):
                awaitLoadOf('.media--information').then(() => {
                    let titleUsa;
                    for (const typeCheck of document.querySelectorAll('.media--information > ul > li')) {
                        const usaCheck = typeCheck.textContent.includes('English (American)');
                        const setTitle = typeCheck.getElementsByTagName('span')[0];
                        typeCheck.textContent.includes('Japanese (Romaji)') && (titleJap = setTitle.textContent);
                        typeCheck.textContent.includes('English') && !usaCheck && (titleEng = setTitle.textContent);
                        usaCheck && (titleUsa = setTitle.textContent);
                    }

                    !titleEng && titleUsa && (titleEng = titleUsa);
                    !titleJap && titleEng && (titleJap = titleEng);
                    !titleJap && !titleEng && searchNyaa();

                    btnSpace = document.querySelector('.entry-state-status > div');
                    document.querySelector('.nyaaBtn') && document.querySelector('.nyaaBtn').remove();
                    createBtn();
                    btn.classList.add('button', 'button--secondary');
                    btn.style.background = '#f5725f';
                });
                break;

            case domain.includes('livechart.me'):
                setTimeout(() => {
                    if (domain.includes(`livechart.me/${media}/`)) {
                        titleJap = document.querySelector('.grow .text-xl').innerText;
                        titleEng = document.querySelector('.grow .text-lg').innerText;

                        btnSpace = document.querySelector('.lc-poster-col');
                        createBtn(btnSpace);
                        btn.classList.add('lc-btn', 'lc-btn-sm', 'lc-btn-outline');
                    } else if (domain.includes('livechart.me/franchises/')) {
                        for (const card of document.querySelectorAll('.lc-anime')) {
                            titleJap = card.getAttribute('data-romaji');
                            titleEng = card.getAttribute('data-english');

                            let tempQuery;
                            titleEng == null ? (tempQuery = titleJap) : (tempQuery = `"${titleJap}"|"${titleEng}"`);

                            btnSpace = card.querySelector('.lc-anime-card--related-links');
                            createBtn(btnSpace);
                            btn.style.backgroundImage = 'url(https://i.imgur.com/9Fr2BRG.png)';
                            btn.style.backgroundSize = '20px';
                            btn.style.backgroundRepeat = 'no-repeat';
                            btn.style.backgroundPosition = 'center';
                            btn.classList.add('lc-anime-card--related-links--action-button');
                            btn.title = 'Search on Nyaa';
                            btn.href = `https://nyaa.si/?f=${filter}&c=${category}&q=${tempQuery}&s=${sort}&o=${order}`;
                            btn.target = '_blank';
                        }
                    } else {
                        for (const card of document.querySelectorAll('.anime')) {
                            titleJap = card.getAttribute('data-romaji');
                            titleEng = card.getAttribute('data-english');

                            let tempQuery;
                            titleEng == null ? (tempQuery = titleJap) : (tempQuery = `"${titleJap}"|"${titleEng}"`);

                            btnSpace = card.querySelector('.related-links');
                            createBtn(btnSpace);
                            btn.style.backgroundImage = 'url(https://i.imgur.com/9Fr2BRG.png)';
                            btn.style.backgroundSize = '20px';
                            btn.style.backgroundRepeat = 'no-repeat';
                            btn.style.backgroundPosition = 'center';
                            btn.classList.add('action-button');
                            btn.title = 'Search on Nyaa';
                            btn.href = `https://nyaa.si/?f=${filter}&c=${category}&q=${tempQuery}&s=${sort}&o=${order}`;
                            btn.target = '_blank';
                        }
                    }
                }, 50);
                break;
        }

        awaitLoadOf('.nyaaBtn').then(() => {
            let query = `"${titleJap}"|"${titleEng}"`;
            let baseJap = titleJap;
            let baseEng = titleEng;

            const getBase = () => {
                const hasSeason = /(?<![\w])(season)(?![\w])/i;
                const hasNum = /(?<![\w])[0-9]+(?:st|[nr]d|th)(?![\w])/i;
                const hasWord = /(?<![\w])(first|second|third|fourth|fifth|(the final|final))(?![\w])/i;
                const hasPart = /(?<![\w])(part )/i;
                const hasEndPunc = /[?!.]$/;

                if (baseJap.includes(': ') || baseJap.includes(' - ')) {
                    baseJap.includes(': ') && (baseJap = baseJap.split(': ').shift());
                    baseJap.includes(' - ') && (baseJap = baseJap.split(' - ').pop());
                } else {
                    if (hasSeason.test(baseJap)) {
                        if (hasNum.test(baseJap) || hasWord.test(baseJap)) {
                            let japNum, japWord;
                            hasNum.test(baseJap) && (japNum = baseJap.match(hasNum)[0]);
                            hasWord.test(baseJap) && (japWord = baseJap.match(hasWord)[0]);
                            japNum && (baseJap = baseJap.split(` ${japNum}`).shift());
                            japWord && (baseJap = baseJap.split(` ${japWord}`).shift());
                        } else {
                            baseJap = baseJap.split(/( season)/i).shift();
                        }
                    } else if (hasPart.test(baseJap)) {
                        baseJap = baseJap.split(/( part)/i).shift();
                    } else if (hasEndPunc.test(baseJap)) {
                        let japEndPunc = baseJap.match(hasEndPunc)[0];
                        baseJap = baseJap.split(japEndPunc).shift();
                    }
                }

                if (baseEng.includes(': ') || baseEng.includes(' - ')) {
                    baseEng.includes(': ') && (baseEng = baseEng.split(': ').shift());
                    baseEng.includes(' - ') && (baseEng = baseEng.split(' - ').pop());
                } else {
                    if (hasSeason.test(baseEng)) {
                        if (hasNum.test(baseEng) || hasWord.test(baseEng)) {
                            let engNum, engWord;
                            hasNum.test(baseEng) && (engNum = baseEng.match(hasNum)[0]);
                            hasWord.test(baseEng) && (engWord = baseEng.match(hasWord)[0]);
                            engNum && (baseEng = baseEng.split(` ${engNum}`).shift());
                            engWord && (baseEng = baseEng.split(` ${engWord}`).shift());
                        } else {
                            baseEng = baseEng.split(/( season)/i).shift();
                        }
                    } else if (hasPart.test(baseEng)) {
                        baseEng = baseEng.split(/( part)/i).shift();
                    } else if (hasEndPunc.test(baseEng)) {
                        let engEndPunc = baseEng.match(hasEndPunc)[0];
                        baseEng = baseEng.split(engEndPunc).shift();
                    }
                }
            };

            if (!titleEng || titleJap.toLowerCase() === titleEng.toLowerCase()) {
                query = titleJap;
            } else {
                getBase();

                switch (queryType) {
                    case 'default':
                        if (baseJap == titleJap && baseEng == titleEng) {
                            break;
                        } else {
                            query = `"${titleJap}"|"${titleEng}"|"${baseJap}"|"${baseEng}"`;
                        }
                        break;
                    case 'fuzzy':
                        query = titleJap;
                        break;
                    case 'exact':
                        break;
                    case 'base':
                        if (baseJap == baseEng) {
                            break;
                        } else {
                            query = `"${baseJap}"|"${baseEng}"`;
                        }
                        break;
                }
            }

            if (btn) {
                !btn.title && (btn.textContent = 'Search on Nyaa');
                btn.href = `https://nyaa.si/?f=${filter}&c=${category}&q=${query}&s=${sort}&o=${order}`;
                btn.target = '_blank';
            }
        });
    });
};

searchNyaa();
