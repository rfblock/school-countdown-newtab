chrome.runtime.onConnect.addListener(port => {
	port.onMessage.addListener(msg => {
		chrome.bookmarks.search({"title": "newtab"}, search => {
			let folder = search[0];
			chrome.bookmarks.getSubTree(folder.id, bookmarkSubTree => {
				let bookmarks = bookmarkSubTree[0].children;
				port.postMessage(bookmarks);
			});
		});
	});
});
