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
// All anchor tags inside the buttons of sidebar-for-menu-button
const sidebar_links = document.querySelectorAll('.container-of-buttons-inside-sidebar button a');



//---------------------------------------------//
//        SHOWING NAVIGATOR INDIGATORS         //
//---------------------------------------------//
// This will tell current page url
const activePage = window.location.pathname;

//-- Part 1 => Navigator to navbar
// navLinks.forEach((link)=>{
	/*if(link.href === window.location.origin + activePage || (activePage === '/' && link.pathname === '/')){
		/*link.classList.add('footer-indigator-on');
		console.log("activePage => " + activePage)*/
	//}
//}); 

sidebar_links.forEach((link)=>{
	if(link.href === window.location.origin + activePage || (activePage === '/' && link.pathname === '/')){
		link.parentNode.classList.add('side-bar-button-indigator-on');
		console.log("activePage => " + activePage)
	}
});


//-- Part 2 => Navigator to footer
footerLinks.forEach((link)=>{
	if(link.href === window.location.origin + activePage || (activePage === '/' && link.pathname === '/')){
	  link.classList.add('footer-indigator-on');
	}
});
//=============================================//






const menu_button_of_navbar = document.querySelector(".menu-button-of-top-navbar");
const sidebar_for_menu_buttton = document.querySelector(".sidebar-for-menu-button");
const close_button_of_sidebar = document.querySelector(".close-button-of-sidebar-for-menu-button");

// Sidebar open
menu_button_of_navbar.addEventListener("click", () => {
  sidebar_for_menu_buttton.classList.add("sidebar-for-menu-button-open");
});

// Sidebar close
close_button_of_sidebar.addEventListener("click", () => {
  sidebar_for_menu_buttton.classList.remove("sidebar-for-menu-button-open");
});