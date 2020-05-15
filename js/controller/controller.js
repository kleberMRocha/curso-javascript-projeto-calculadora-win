let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

let display = $("#display");
let btns = $$("[data-btn]");
let calc = new Calc(display,btns);