// Input tag of search box
const inputInsideSearch = document.querySelector('#myInput');
// Container where all search suggestions will be shown
const searchSuggestionContainer = document.querySelector('.suggestions');



let clutter = ""; 
inputInsideSearch.addEventListener('input', ()=>{
	axios.get(`/username/${inputInsideSearch.value}`)
  .then(function(data){
	   clutter = '';
	   // Generating html for all search suggestions data
	   data.data.forEach((elem)=>{
		   	clutter += `
			     <div class="suggested-search-box">
			       <a href="/preview/${elem.image}">
               <span class="suggest-search-span">
                 ${elem.imageText}
               </span>
               <img src="/images/uploads/${elem.image}" class="cutBtnInsideSearchSuggestionBox"/>
             </a>
           </div>
			  `;
		});
		searchSuggestionContainer.innerHTML = clutter;
  });
});