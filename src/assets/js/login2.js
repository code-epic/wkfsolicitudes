

'use strict'


window.addEventListener('load', ()=>{
	var current = null;
	document.querySelector("#usuario").addEventListener("focus", function (e) {
	  if (current) current.pause();
	  current = anime({
	    targets: "path",
	    strokeDashoffset: {
	      value: 0,
	      duration: 700,
	      //easing: "easeOutQuart"
	    },
	    strokeDasharray: {
	      value: "240 1386",
	      duration: 700,
	    //  easing: "easeOutQuart"
	    }
	  });
	});
	document.querySelector("#clave").addEventListener("focus", function (e) {
	  if (current) current.pause();
	  current = anime({
	    targets: "path",
	    strokeDashoffset: {
	      value: -336,
	      duration: 700,
	      easing: "easeOutQuart"
	    },
	    strokeDasharray: {
	      value: "240 1386",
	      duration: 700,
	      easing: "easeOutQuart"
	    }
	  });
	});
	
});

console.log("Funciona")