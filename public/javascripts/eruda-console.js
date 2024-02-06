// Automatically show eruda console using it's package
function show_eruda_console_using_package(){
		javascript:(
				function () { 
						var script = document.createElement('script'); 
						script.src="/javascripts/eruda/eruda.js"; 
						document.body.append(script); script.onload = function () { 
							eruda.init();
						} 
				}
		)();
};
show_eruda_console_using_package();


// Automatically show eruda console using it's cdn
function show_eruda_console_using_cdn(){
		javascript:(
			function(){ 
			   var script = document.createElement('script'); 
			   script.src="https://cdn.jsdelivr.net/npm/eruda"; 
			   document.body.append(script); 
			   script.onload = function (){ 
				   eruda.init(); 
			   }
		  }
		)();
};


/* 
 > To include this console in your html =>
 > 1. Linking to node_modules eruda-console file
  <script src="node_modules/eruda/eruda.js"></script>
 > 2. Displaying eruda-console in your browser
  <script src="/javascripts/eruda-console.js"></script>
*/
