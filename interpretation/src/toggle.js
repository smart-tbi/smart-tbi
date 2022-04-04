chrome.storage.sync.get('toggle', function (toggle) {
	console.log(toggle.toggle)
	var isTrueSet = (String(toggle.toggle) === 'true');
	console.log(isTrueSet)
	if (!isTrueSet) {
		// chrome.storage.sync.set({ toggle: 'off' });
		console.log("Toggle 1: " + toggle)
		let hover = document.getElementsByClassName("hover-box");
		
		if (hover.length > 0) {
			console.log("Inside 1")
			for (let el of hover) {
				el.style["display"] = "none";
			}
			// hover.setAttribute("style", "display: none");
		}
	} else {
		// chrome.storage.sync.set({ toggle: 'on' });
		console.log("Toggle 2: " + toggle)
		let hover = document.getElementsByClassName("hover-box");
		if (hover.length > 0) {
			console.log("Inside 2")
			for (let el of hover) {
				el.style.removeProperty('display');
			}
			// hover.setAttribute('style', element.getAttribute('style')+'; color: red');
			// hover.setAttribute("style", "");
		}
	}
});