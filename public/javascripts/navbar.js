// Home button inside footer
let homeBtnInFooter = document.querySelector(".home-button");
// Search button inside footer
let searchBtnInFooter = document.querySelector(".bell-button");
// Message button inside footer
let messageBtnInFooter = document.querySelector(".message-button");
// All buttons inside footer
let allBtnInFooter = document.querySelectorAll(".button-in-footer");
// All anchor tags inside the footer
const footerLinks = document.querySelectorAll('footer .right button a');
// All anchor tags inside the navbar
const navLinks = document.querySelectorAll('nav .right .container-of-links span a');



//---------------------------------------------//
//        SHOWING NAVIGATOR INDIGATORS         //
//---------------------------------------------//
// This will tell current page url
const activePage = window.location.pathname;

//-- Part 1 => Navigator to navbar
navLinks.forEach((link)=>{
	if(link.href.includes(`${activePage}`)){
		link.classList.add('footer-indigator-on');
	}
});


//-- Part 1 => Navigator to footer
footerLinks.forEach((link)=>{
	if(link.href.includes(`${activePage}`)){
	  link.classList.add('footer-indigator-on');
	}
});
//=============================================//