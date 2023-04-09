// 
// main.js | YDITS Official site
//
// (c) YDITS
//
// No modification or reproduction of any kind is permitted.
// 改変や複製を一切禁じます。
// 

const pageLangages = [
    "ja-jp",
    "en-us",
    "zh-cn"
]

$(() => {
    let isActive_headerLink = false;

    $("header").load("./elements/header.html");

    $(document).on('click', 'header .btn_link', () => {
        if (!isActive_headerLink) {
            isActive_headerLink = true;

            $('header .btn_link>.open').removeClass('active');
            $('header .btn_link>.close').addClass('active');

            $('header nav').addClass('active');
        } else if (isActive_headerLink) {
            isActive_headerLink = false;

            $('header .btn_link>.close').removeClass('active');
            $('header .btn_link>.open').addClass('active');

            $('header nav').removeClass('active');
        }
    });

    $("footer").load("./elements/footer.html");

    $(document).on('change', '#langSelectBox', () => {
        const langSelectBox = document.getElementById('langSelectBox');
        let path = location.pathname;
        let pathArray = path.split("/");
        let langValue = langSelectBox.value;

        if (pageLangages.includes(pathArray[1])) {
            if (langValue == "ja-jp") {
                location.pathname = path.slice(6);
            } else {
                location.pathname = langValue + path.slice(6);
            }
        } else {
            if (langValue == "ja-jp") {
                location.pathname = path;
            } else {
                location.pathname = langValue + path;
            }
        }
    });
});
