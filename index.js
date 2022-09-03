const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const date = new Date();
const currDay = date.getDay();
const day = DAYS[currDay];
const month = date.getMonth() + 1;
const numDate = date.getDate();

const holidays = [
	'09-26-2022',
	'10-05-2022',
	'10-24-2022',
	'11-10-2022',
	'11-11-2022',
	'12-26-2022',
	'12-27-2022',
	'12-28-2022',
	'12-29-2022',
	'12-30-2022',
	'01-02-2023',
	'01-16-2023',
	'01-23-2023',
	'02-20-2023',
	'04-10-2023',
	'04-11-2023',
	'04-12-2023',
	'04-13-2023',
	'04-14-2023',
	'05-29-2023',

]

const halfDay = [
	'11-23-2022',
	'06-16-2023',
	'06-19-2023',
	'06-20-2023',
	'06-21-2023',
	'06-22-2023'
]

const schedule = [
	'07:20', '08:15',
	'08:21', '09:14',
	'09:20', '10:13',
	'10:18', '11:07',
	'10:52', '11:12',
	'11:12', '12:05',
	'12:11', '13:04',
	'13:10', '14:03',
]

let port = chrome.runtime.connect({name: "bookmarks"});

let getFavicon = url => {
	//return `chrome://favicon/${url}`
	//return `chrome://favicon2/?page_url=${url}&size=128&scale_factor=1x&allow_google_server_fallback=0`
	return `https://www.google.com/s2/favicons?domain=${url}&sz=256`
}

let loadBookmarks = () => {
	const bookmarksContainer = document.getElementById("bookmarks-container");
	port.postMessage("bookmarks");
	port.onMessage.addListener(msg => {
		const bookmarks = msg;
		bookmarks.forEach(bookmark => {
			const url = bookmark.url;

			const bookmarkLink = document.createElement("a");
			bookmarkLink.setAttribute("href", `${url}`)
			
			const newBookmark = document.createElement("div");
			newBookmark.classList.add("bookmark");
			const faviconUrl = getFavicon(url);
			newBookmark.style.backgroundImage = `url("${faviconUrl}")`;

			//<a href="bookmark.url"><div class="bookmark"></div></a>
			bookmarkLink.appendChild(newBookmark)
			bookmarksContainer.appendChild(bookmarkLink);
		});
		port.disconnect();
	});
}

let loadTimeRemaining = () => {
	schedule.forEach((d, i, arr) => {
		arr[i] = new Date().setHours(
			d.substring(0, 2),
			d.substring(3, 5),
			0,
			0
		)
	});

	let secondsRemaining = 60000 - new Date() % 60000;
	let clock = document.getElementById("time-remaining");
	let update = () => {
		let nextDate = schedule.find(date => {
			let timeRemaining = date - new Date();
			if (timeRemaining < 0) { console.log("SKIP"); return false; }
			return true;
		});
		let currentTime = new Date();
		let minutesRemaining = new Date(nextDate - currentTime).getMinutes() + 1;
		clock.textContent = minutesRemaining;
	}

	

	update();
	setTimeout(() => {
		update();
		setInterval(update, 60000);
	}, secondsRemaining);
}

let loadClock = () => {	
	holidays.forEach((d, i, arr) => {arr[i] = new Date(d).toDateString()})
	let daysLeft = getBusinessDatesCount(date, new Date('06/23/2022')); 

	document.getElementById("clock").textContent = `${daysLeft}`;
	document.getElementById("day").textContent = day;
	document.getElementById("month").textContent = month;
	document.getElementById("num-date").textContent = numDate;
}

window.addEventListener("load", () => {
	loadClock();
	loadTimeRemaining();
	loadBookmarks();
});

function getBusinessDatesCount(startDate, endDate) {
	let count = 0;
	const curDate = new Date(startDate.getTime());
	while (curDate <= endDate) {
		curDate.setDate(curDate.getDate() + 1);
		const dayOfWeek = curDate.getDay();
		if(dayOfWeek == 0 || dayOfWeek == 6) continue;
		if(holidays.includes(curDate.toDateString())) continue;
		count++
		
	}
	return count;
}
