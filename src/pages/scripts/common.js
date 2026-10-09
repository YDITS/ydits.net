/*!
 *
 * YDITS Website
 *
 * Copyright (C) 2022-2026 よね/Yone
 * 
 * https://github.com/YDITS/ydits.net
 *
 */

import { Render } from "https://cdn.yoneyo.com/scripts/render-js@1.0.0-beta.2/dist/render.js";

class Page {
    /**
     * @type {string}
     */
    static #ORIGIN = "www.ydits.net";

    /**
     * @type {Array<string>}
     */
    static #PAGE_LANGUAGES = [
        "ja-jp",
        "en-us",
        "ko-kr",
        "zh-cn",
        "zh-tw",
    ];

    /**
     * @type {object}
     */
    static #i18n = {
        "ja-jp": {
            "logoImgAlt": "YDITSのロゴ",
            "home": "ホーム",
            "contact": "お問い合わせ",
        },
        "en-us": {
            "logoImgAlt": "YDITS's logo",
            "home": "Home",
            "contact": "Contact Me",
        },
        "ko-kr": {
            "logoImgAlt": "YDITS's logo",
            "home": "홈",
            "contact": "문의",
        },
        "zh-cn": {
            "logoImgAlt": "YDITS's logo",
            "home": "首页",
            "contact": "联络",
        },
        "zh-tw": {
            "logoImgAlt": "YDITS's logo",
            "home": "首頁",
            "contact": "聯絡",
        },
    }

    /**
     * @type {Render}
     */
    #render;

    /**
     * @type {HTMLElement}
     */
    #$headerMenu;

    /**
     * @type {HTMLElement}
     */
    #$headerMenuButton;

    /**
     * @param {{
     *     render: Render,
     * }} 
     */
    constructor({ render }) {
        this.#render = render;
    }

    /**
     * @returns {void}
     */
    initialize() {
        this.#checkOriginAndAlert();
        this.#initializeCommonElements();
    }

    /**
     * @returns {void}
     */
    #checkOriginAndAlert() {
        if (!this.#isOriginAlertClosed() && !this.#checkOrigin(Page.#ORIGIN)) {
            this.#alertOrigin();
        }
    }

    /**
     * @returns {boolean}
     */
    #isOriginAlertClosed() {
        return window.localStorage.getItem("origin-alert-closed") === "true";
    }

    /**
     * @param {string} hostname 
     * @returns {boolean}
     */
    #checkOrigin(hostname) {
        if (window.location.hostname !== hostname) {
            return false;
        }
        return true;
    }

    /**
     * @returns {void}
     */
    #alertOrigin() {
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

    /**
     * @returns {void}
     */
    #initializeCommonElements() {
        const pageLanguage = this.#getPageLanguage();
        this.#loadCommonElements({ language: pageLanguage });
        this.#initializeHeaderMenuEventHandler();
        this.#initializeLanguageSelectorEventHandler();
    }

    /**
     * @returns {Array<string> | string | undefined}
     */
    #getPageLanguage() {
        const pathname = window.location.pathname;
        const pathArray = pathname.split("/");

        if (Page.#PAGE_LANGUAGES.includes(pathArray[1])) {
            return pathArray[1];
        } else {
            return "ja-jp";
        }
    }

    /** 
     * @param {{
     *     language: string,
     * }}
     * @returns {void}
     */
    #loadCommonElements({ language }) {
        const _headerProps = {
            i18n: Page.#i18n[language],
            toppage: language === "ja-jp" ? "/" : `/${language}/`,
        };
        const _footerProps = {
            language,
            i18n: Page.#i18n[language],
        };

        this.#render.build({
            target: document.querySelector("header"),
            children: this.#header(_headerProps),
        });

        this.#render.build({
            target: document.querySelector("footer"),
            children: this.#footer(_footerProps),
        });

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

    /**
     * @param {any} props 
     * @returns {Array<HTMLElement>}
     */
    #header(props) {
        const { $div, $a, $img } = this.#render;

        return [
            $div({
                className: "header__content",
                children: [
                    $a({
                        className: "header-logo",
                        href: props.toppage,
                        children: [
                            $img({
                                className: "header-logo__img",
                                src: "https://cdn.ydits.net/images/ydits_logos/ydits_logo_white_transparent.png",
                                alt: props.i18n.logoImgAlt,
                            }),
                        ],
                    }),
                    this.#headerMenuButton(),
                    this.#headerMenu(props),
                ],
            }),
        ];
    }

    /**
     * @returns {HTMLElement}
     */
    #headerMenuButton() {
        const { $div } = this.#render;

        this.#$headerMenuButton = $div({
            id: "headerMenuButton",
            className: "header-menu-button",
            children: [
                this.#materialIcon({ name: "menu", className: "header-menu-button__icon header-menu-button__icon--open" }),
                this.#materialIcon({ name: "close", className: "header-menu-button__icon header-menu-button__icon--close" }),
            ],
        });

        return this.#$headerMenuButton;
    }

    /**
     * @param {any} props 
     * @returns {HTMLElement}
     */
    #headerMenu(props) {
        const { $nav, $ul, $li, $a } = this.#render;

        this.#$headerMenu = $nav({
            id: "headerMenu",
            className: "header-menu",
            children: [
                $ul({
                    className: "header-menu__list",
                    children: [
                        $li({
                            className: "header-menu__item",
                            children: [
                                $a({
                                    href: props.toppage,
                                    textContent: props.i18n.home,
                                }),
                            ],
                        }),
                        $li({
                            className: "header-menu__item",
                            children: [
                                $a({
                                    href: "https://www.yoneyo.com/#contact",
                                    textContent: props.i18n.contact,
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });

        return this.#$headerMenu;
    }

    /**
     * @param {any} props 
     * @returns {Array<HTMLElement>}
     */
    #footer(props) {
        const { $nav, $a, $div, $span, $button, $ul, $li, $img, $p } = this.#render;

        /**
         * @type {HTMLButtonElement}
         */
        const $pulldownMenuSelector = $button({
            className: "pulldown-menu__selector",
            children: [
                $span({
                    className: "pulldown-menu__title",
                    textContent: "Language",
                }),
                this.#materialIcon({ name: "expand_more", className: "pulldown-menu__expand-icon" })
            ],
        });

        $pulldownMenuSelector.setAttribute("aria-controls", "langSelectOptions");

        const langToUIText = {
            "ja-jp": "日本語",
            "en-us": "English (US)",
            "ko-kr": "한국어",
            "zh-cn": "中文 (簡体)",
            "zh-tw": "中文 (繁体)",
        }

        /**
         * 
         * @param {string} lang 
         * @returns {HTMLLIElement}
         */
        const langSelectOption = (lang) => {
            const langUIText = langToUIText[lang];

            return $li({
                className: `pulldown-menu__option ${lang}`,
                children: [
                    $button({
                        textContent: langUIText,
                    }),
                ],
            });
        };

        /**
         * @type {HTMLDivElement}
         */
        const $langSelector = $div({
            id: "langSelect",
            className: "pulldown-menu language-selector",
            children: [
                $pulldownMenuSelector,
                $ul({
                    id: "langSelectOptions",
                    className: `pulldown-menu__options ${props.language}`,
                    children: [
                        langSelectOption("ja-jp"),
                        langSelectOption("en-us"),
                        langSelectOption("ko-kr"),
                        langSelectOption("zh-cn"),
                        langSelectOption("zh-tw"),
                    ],
                }),
            ],
        });

        $langSelector.setAttribute("aria-expanded", "false");
        $langSelector.setAttribute("aria-controls", "langSelectOptions");

        return [
            $div({
                className: "footer__content",
                children: [
                    $div({
                        id: "lang",
                        className: "footer__language-selector",
                        children: [
                            this.#materialIcon({ name: "language", className: "footer__language-selector__open" }),
                            $langSelector,
                        ],
                    }),
                    $div({
                        className: "footer-logo",
                        children: [
                            $img({
                                className: "footer-logo__img",
                                src: "https://cdn.ydits.net/images/ydits_logos/ydits_logo_full_white_transparent.png",
                                alt: props.i18n.logoImgAlt,
                            }),
                            $p({
                                textContent: "© よね/Yone",
                            }),
                        ],
                    }),
                ],
            }),
        ];
    }

    /**
     * @param {{
     *     name: string,
     *     className: string,
     * }}
     * @returns {HTMLElement}
     */
    #materialIcon({
        name,
        className,
    }) {
        const { $span } = this.#render;

        return $span({
            className: `material-symbols-outlined ${className}`,
            textContent: name,
        });
    }

    /**
     * @returns {void}
     */
    #initializeHeaderMenuEventHandler() {
        const trying = () => {
            try {
                this.#$headerMenuButton?.addEventListener("click", () => this.#onClickHeaderMenuButton());
            } catch (error) {
                setTimeout(trying, 100);
            }
        }
        trying();
    }

    /**
     * @returns {void}
     */
    #initializeLanguageSelectorEventHandler() {
        const langSelectLabelQuery = '#langSelect .pulldown-menu__selector';
        document.querySelector(langSelectLabelQuery)?.addEventListener("click", () => {
            // document?.querySelector("#langSelect")?.classList?.toggle("expanded");
            const $langSelect = document?.querySelector("#langSelect");
            const toggleTo = $langSelect?.getAttribute("aria-expanded") === "true" ? "false" : "true";
            $langSelect?.setAttribute("aria-expanded", toggleTo);
        });
        Page.#PAGE_LANGUAGES.forEach(lang => {
            document.querySelector(`.pulldown-menu__option.${lang}`)?.addEventListener("click", () => {
                this.#changePageLanguage(lang);
            });
        });
    }

    /**
     * @returns {void}
     */
    #onClickHeaderMenuButton() {
        this.#$headerMenuButton?.classList?.toggle("opened");
        this.#$headerMenu?.classList?.toggle("active");
    }

    /**
     * @param {string} targetLanguage
     * @returns {void}
     */
    #changePageLanguage(targetLanguage) {
        const pathname = window.location.pathname;
        const pathArray = pathname.split("/");

        if (Page.#PAGE_LANGUAGES.includes(pathArray[1])) {
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
}

/**
 * @type {Render}
 */
const render = new Render();

/**
 * @type {Page}
 */
const page = new Page({ render });

page.initialize();
