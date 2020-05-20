let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

let display = $("#display");
let lastOperation = $('[data-display="lastOperation"]');
let displayError = $('[data-display="error"]');
let btns = $$("[data-btn]");
let sideMenu = $$('[data-others]');
let audio = new Audio("./sound/pop.mp3");
let calc = new Calc(display,btns,lastOperation,displayError,audio,sideMenu);
