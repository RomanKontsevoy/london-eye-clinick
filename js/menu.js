/* Добавление к пункту меню значка наличия подменю   */

const menuItems = document.querySelectorAll('.menu-main-menu-container .menu-item');
const burgerItem = document.getElementById('burger');
const nav = document.querySelector('.menu-main-menu-container');
let hideMobileMenu = true;
const verticalMenu = document.querySelector("#nav");

function addSubMenu() {
    for (let i = 0; i < menuItems.length; i++) {
        for (let j = 0; j < menuItems[i].children.length; j++) {
            if (menuItems[i].children[j].classList.contains('sub-menu')) {
                menuItems[i].classList.add('not-empty');
            }
            if (menuItems[i].children[j].nodeName === 'A') {
                if (menuItems[i].children.length > 1) {
                    menuItems[i].children[j].removeAttribute('href');
                }
            }
        }
    }
}

addSubMenu();

/* Проверка ширины окна */

function getMonitorWidth() {
    let monWidth = window.innerWidth;
    window.addEventListener('resize', function () {
        monWidth = window.innerWidth;
    });
    return monWidth;
}

/* Меню на десктопе */

/* Спрятать субменю одного пункта */

function hideOneSub(el) {
    let monWidth = getMonitorWidth();
    if (monWidth < 767) {
        $(el).animate({height: 'hide'}, 150, function () {
        });
    } else {
        el.style = {};
    }
    el.parentElement.style = {};
    el.parentElement.classList.remove('opened');
};

/* Показать субменю одного пункта */

function showOneSub(el) {
    let monWidth = getMonitorWidth();
    if (monWidth < 767) {
        $(el).animate({height: 'show'}, 150, function () {
        });
    }
    el.style.height = "auto";
    el.style.opacity = "1";
    el.parentElement.style.overflow = 'visible';
    el.parentElement.classList.add('opened');
}

function resetAll() {
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].children[1]) {
            menuItems[i].children[1].style = {};
            if (menuItems[i].classList.contains('opened')) {
                menuItems[i].classList.remove('opened');
            }
        }
    }
    nav.style = {};
    verticalMenu.style = {};
}

function showSub(e) { // handling mouseenter on desctop
    let target = e.target;
    showOneSub(target.children[1]);
};

function hideSub(e) { // handling mouseleave on desctop
    let target = e.target;
    hideAllSubMenu();
    hideOneSub(target.children[1]);
};


function hideAllSubMenu() {
    for (var i = 0; i < el.length; i++) {
        if (el[i].children[1] && el[i].style.overflow === 'visible') {
            hideOneSub(el[i].children[1]);
        }
    }
}

/* Mobile menu */


function toggle() {  // switches whether the menu is displayed, or the page displays only the burger
    hideMobileMenu = !hideMobileMenu;
}

function clickShowSub() { // handling click on menu-item on adaptive
    if (!device.desktop()) {
        if (this.children.length > 1) {  // если есть дети
            if (this.style.overflow !== 'visible') { // и дети скрыты
                hideAllSubMenu();
                showOneSub(this.children[1]);
            } else { // а если дети открыты
                hideOneSub(this.children[1]);
            }
        } else {
            hideAllSubMenu();
            return false;
        }
    }
}

function handleVerticalMenu() { // switch is toggling and menu is showing or not according to a state of toggle
    toggle();
    if (hideMobileMenu) {
        burgerItem.classList.remove('burger-close');
        hideVerticalMenu(verticalMenu);
    } else {
        burgerItem.classList.add('burger-close');
        showVerticalMenu(verticalMenu);
        hideAllSubMenu();
    }
}

function closeMenu(e) {    // closing menu by clicking on body except burger and menu
    let target = e.target ? e.target : null;
    let targetIsMenu = false;
    while (target != this) {
        if (target.classList.contains('mobile-menu') || target.classList.contains('menu-main-menu-container')) {
            targetIsMenu = true;
            // нашли элемент, который нас интересует!
            return
        }
        target = target.parentNode;
    }
    if (!targetIsMenu) {  // if user clicked not on burger or menu, then function works
        hideAllSubMenu();
        mobileToBurger();
    }
}

function hideVerticalMenu(el) {
    el.classList.remove("active");
}

function showVerticalMenu(el) {
    el.classList.add("active");
}

function resetVerticalMenu(el) {
    el.style = {};
}

function mobileToBurger() {
    hideMobileMenu = true;
    nav.style.width = '';
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].children[1] && menuItems[i].children[1].style.display === 'none') {
            menuItems[i].children[1].style.display = '';
        }
    }
    burgerItem.classList.remove('burger-close');
    hideVerticalMenu(verticalMenu);
    hideAllSubMenu();
}


function handleWindowResize() {
    let monWidth = window.innerWidth;
    if (monWidth <= 767) {
        mobileToBurger();
        resetAll();
    } else {
        nav.style.width = 'auto';
        verticalMenu.style.display = "";
        resetVerticalMenu(verticalMenu);
        resetAll();
    }
}

/* Event Listeners */

const el = document.querySelectorAll('#menu-main-menu>.menu-item');

function clickOrHover() {
    for (var i = 0; i < el.length; i++) {
        if (el[i].children.length > 1) {
            el[i].addEventListener("mouseenter", function (e) { // Наведение мыши на элемент на десктопе
                let isDesctop = device.desktop();
                if (isDesctop) {
                    showSub(e);
                }
            }, false);
            el[i].addEventListener("mouseleave", function (e) { // Увод мыши с элемента на десктопе
                let isDesctop = device.desktop();
                if (isDesctop) {
                    hideSub(e);
                }
            }, false);
            el[i].addEventListener("click", function () {
                clickShowSub.call(this);
            }, false); // клик на элемент на адаптиве
        }
    }
}

clickOrHover();
burger.addEventListener("click", function () {
    handleVerticalMenu();
}); // клик на "бургер" на адаптиве
document.body.addEventListener("click", function (e) { // клик где-угодно
    if (device.desktop()) {
        hideAllSubMenu();
    } else {
        let monWidth = window.innerWidth;
        if (monWidth <= 767) {
            closeMenu.call(this, e);
        }
    }
});
window.addEventListener('resize', function () {
    handleWindowResize();
}); // переключение вида меню в зависимости от ширины окна

/*--------------*/