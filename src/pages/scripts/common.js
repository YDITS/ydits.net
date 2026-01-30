/*!
 *
 * YDITS Website
 *
 * Copyright (C) よね/Yone
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
    const alertText = document.createElement("strong");
    alertText.textContent = "\"ydits.net\" ではないドメインからアクセスされています。このサイトでは、プライバシー情報やパスワードを送信しないでください。"
    alertText.classList.add("origin-alert__text");

    const closeButton = document.createElement("button");
    closeButton.textContent = "今後表示しない";
    closeButton.classList.add("origin-alert__close-button");
    closeButton.addEventListener("click", () => {
        alertElement.remove();
        document.body.style.paddingBottom = "0";
        window.localStorage.setItem("origin-alert-closed", "true");
    });

    const alertElement = document.createElement("div");
    alertElement.appendChild(alertText);
    alertElement.appendChild(closeButton);
    alertElement.classList.add("origin-alert");

    document.body.prepend(alertElement);
    document.body.style.paddingBottom = "var(--origin-alert-height)";
}

function initializeCommonElements() {
    loadCommonElements();
    initializeHeaderMenuEventHandler();
    initializeLanguageSelectorEventHandler();
}

function loadCommonElements() {
    document.querySelector("header").innerHTML = header();
    document.querySelector("footer").innerHTML = footer();
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

function header() {
    return (`<div class="header__content">
    <a class="header-logo" href="/">
        <img class="header-logo__img" src="https://cdn.ydits.net/images/ydits_logos/ydits_logo_white_transparent.png"
            alt="YDITSのロゴ">
    </a>

    <div id="headerMenuButton" class="header-menu-button">
        <span class="material-symbols-outlined header-menu-button__icon header-menu-button__icon--open">menu</span>
        <span class="material-symbols-outlined header-menu-button__icon header-menu-button__icon--close">close</span>
    </div>

    <nav id="headerMenu" class="header-menu">
        <ul>
            <li><a href="/">ホーム</a></li>
            <li><a href="https://www.yoneyo.com/#contact">お問い合わせ</a></li>
        </ul>
    </nav>
</div>`);
}

function footer() {
    return (`<div class="footer__content">
    <div id="lang" class="footer__language-selector">
        <span class="material-symbols-outlined footer__language-selector__open">
            language
        </span>
        <div class="pulldownMenu language-selector" id="langSelect">
            <div class="label">
                <span class="title">Language</span>
                <span class="material-symbols-outlined icon">expand_more</span>
            </div>

            <ul class="list">
                <li class="ja-jp" style="font-weight: bold;">日本語</li>
                <li class="en-us">English (US)</li>
                <li class="ko-kr">한국어</li>
                <li class="zh-cn">中文 (簡体)</li>
                <li class="zh-tw">中文 (繁体)</li>
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
    const langSelectLabelQuery = '#langSelect .label';
    document.querySelector(langSelectLabelQuery)?.addEventListener("click", () => {
        document?.querySelector("#langSelect")?.classList?.toggle("active");
    });
    pageLangages.forEach(lang => {
        document.querySelector(`#langSelect .${lang}`)?.addEventListener("click", () => {
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
