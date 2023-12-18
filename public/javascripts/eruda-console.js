// This will  automatically show eruda console
// If this will show automaticatty then it can able to show any error inconsole
javascript:(
		function () { 
				var script = document.createElement('script'); 
				script.src="https://cdn.jsdelivr.net/npm/eruda"; 
				document.body.append(script); script.onload = function () { 
					eruda.init(); 
				} 
		}
)();