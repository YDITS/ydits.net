/*!
 *
 * YDITS Website
 *
 * Copyright (C) 2022-2026 よね/Yone
 * 
 * https://github.com/YDITS/ydits.net
 *
 */

const origin = "www.ydits.net";

const pageLangages = [
    "ja-jp",
    "en-us",
    "ko-kr",
    "zh-cn",
    "zh-tw",
];

const i18n = {
    "ja-jp": {
        "logoImgAlt": "YDITSのロゴ",
        "home": "ホーム",
        "contact": "お問い合わせ",
    },
    "en-us": {
        "logoImgAlt": "YDITS's logo",
        "home": "Home",
        "contact": "Contact Me",
    }
}

let headerMenuButton;
let headerMenu;

main();

function main() {
    checkOriginAndAlert();
    initializeCommonElements();
}

function checkOriginAndAlert() {
    if (!isOriginAlertClosed() && !checkOrigin(origin)) {
        alertOrigin();
    }
}

function isOriginAlertClosed() {
    return window.localStorage.getItem("origin-alert-closed") === "true";
}

function checkOrigin(hostname) {
    if (window.location.hostname !== hostname) {
        return false;
    }
    return true;
}

function alertOrigin() {
    const alertTextStrong = document.createElement("strong");
    alertTextStrong.textContent = "\"ydits.net\" ではないドメインからアクセスされています。このサイトでは、プライバシー情報やパスワードを送信しないでください。"
    const alertText = document.createElement("p");
    alertText.classList.add("origin-alert__text");
    alertText.appendChild(alertTextStrong);

    const closeButton = document.createElement("button");
    closeButton.classList.add("origin-alert__close-button");
    closeButton.textContent = "今後表示しない";
    closeButton.addEventListener("click", () => {
        alertElement.remove();
        document.body.style.paddingBottom = "0";
        window.localStorage.setItem("origin-alert-closed", "true");
    });

    const alertElement = document.createElement("div");
    alertElement.classList.add("origin-alert");
    alertElement.appendChild(alertText);
    alertElement.appendChild(closeButton);

    document.body.prepend(alertElement);
    document.body.style.paddingBottom = "var(--origin-alert-height)";
}

function initializeCommonElements() {
    const pageLanguage = getPageLanguage();
    loadCommonElements({ language: pageLanguage });
    initializeHeaderMenuEventHandler();
    initializeLanguageSelectorEventHandler();
}

function getPageLanguage() {
    const pathname = window.location.pathname;
    const pathArray = pathname.split("/");

    if (pageLangages.includes(pathArray[1])) {
        return pathArray[1];
    } else {
        return "ja-jp";
    }
}

function loadCommonElements({ language }) {
    const _headerProps = {
        i18n: i18n[language],
        toppage: language === "ja-jp" ? "/" : `/${language}/`,
    };
    const _footerProps = {
        language,
        i18n: i18n[language],
    };

    document.querySelector("header").innerHTML = header(_headerProps);
    document.querySelector("footer").innerHTML = footer(_footerProps);
    const trying = () => {
        try {
            headerMenuButton = document.getElementById("headerMenuButton");
            headerMenu = document.getElementById("headerMenu");
        } catch (error) {
            setTimeout(trying, 100);
        }
    }
    trying();
}

function header(props) {
    return (`<div class="header__content">
    <a class="header-logo" href="${props.toppage}">
        <img class="header-logo__img" src="https://cdn.ydits.net/images/ydits_logos/ydits_logo_white_transparent.png"
            alt="${props.i18n.logoImgAlt}">
    </a>

    <div id="headerMenuButton" class="header-menu-button">
        <span class="material-symbols-outlined header-menu-button__icon header-menu-button__icon--open">menu</span>
        <span class="material-symbols-outlined header-menu-button__icon header-menu-button__icon--close">close</span>
    </div>

    <nav id="headerMenu" class="header-menu">
        <ul class="header-menu__list">
            <li class="header-menu__item"><a href="${props.toppage}">${props.i18n.home}</a></li>
            <li class="header-menu__item"><a href="https://www.yoneyo.com/#contact">${props.i18n.contact}</a></li>
        </ul>
    </nav>
</div>`);
}

function footer(props) {
    return (`<div class="footer__content">
    <div id="lang" class="footer__language-selector">
        <span class="material-symbols-outlined footer__language-selector__open">
            language
        </span>
        <div class="pulldown-menu language-selector" id="langSelect" aria-expanded="false" aria-controls="langSelectOptions">
            <button class="pulldown-menu__selector" aria-controls="langSelectOptions">
                <span class="pulldown-menu__title">Language</span>
                <span class="pulldown-menu__expand-icon material-symbols-outlined">expand_more</span>
            </button>

            <ul id="langSelectOptions" class="pulldown-menu__options ${props.language}">
                <li class="pulldown-menu__option ja-jp">
                    <button>
                        日本語
                    </button>
                </li>
                <li class="pulldown-menu__option en-us">
                    <button>
                        English (US)
                    </button>
                </li>
                <li class="pulldown-menu__option ko-kr">
                    <button>
                        한국어
                    </button>
                </li>
                <li class="pulldown-menu__option zh-cn">
                    <button>
                        中文 (簡体)
                    </button>
                </li>
                <li class="pulldown-menu__option zh-tw">
                    <button>
                        中文 (繁体)
                    </button>
                </li>
            </ul>
        </div>
    </div>

    <div class="footer-logo">
        <img class="footer-logo__img"
            src="https://cdn.ydits.net/images/ydits_logos/ydits_logo_full_white_transparent.png" alt="YDITSのロゴ">
        <p>© よね/Yone</p>
    </div>
</div>`);
}

function initializeHeaderMenuEventHandler() {
    const trying = () => {
        try {
            headerMenuButton?.addEventListener("click", () => onClickHeaderMenuButton());
        } catch (error) {
            setTimeout(trying, 100);
        }
    }
    trying();
}

function initializeLanguageSelectorEventHandler() {
    const langSelectLabelQuery = '#langSelect .pulldown-menu__selector';
    document.querySelector(langSelectLabelQuery)?.addEventListener("click", () => {
        // document?.querySelector("#langSelect")?.classList?.toggle("expanded");
        const $langSelect = document?.querySelector("#langSelect");
        const toggleTo = $langSelect?.getAttribute("aria-expanded") === "true" ? "false" : "true";
        $langSelect?.setAttribute("aria-expanded", toggleTo);
    });
    pageLangages.forEach(lang => {
        document.querySelector(`.pulldown-menu__option.${lang}`)?.addEventListener("click", () => {
            changePageLanguage(lang);
        });
    });
}

function onClickHeaderMenuButton() {
    headerMenuButton?.classList?.toggle("opened");
    headerMenu?.classList?.toggle("active");
}

function changePageLanguage(targetLanguage) {
    const pathname = window.location.pathname;
    const pathArray = pathname.split("/");

    if (pageLangages.includes(pathArray[1])) {
        if (targetLanguage == "ja-jp") {
            location.pathname = pathname.slice(6);  // "/ja-jp" => Remove 6 letters
        } else {
            location.pathname = targetLanguage + pathname.slice(6);  // "/ja-jp" => Remove 6 letters
        }
    } else {
        if (targetLanguage == "ja-jp") {
            location.pathname = pathname;
        } else {
            location.pathname = targetLanguage + pathname;
        }
    }
}
