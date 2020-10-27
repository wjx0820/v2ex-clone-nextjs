export function largeAvatar(url) {
	if (url.includes("avatar") && url.includes("mini")) {
		return url.replace("mini", "large")
	}

	if (url.includes("gravatar") && url.includes("s=24")) {
		return url.replace("s=24", "s=60")
	}

	return url
}

export function sortByDate(arr) {
	return arr.sort((a, b) =>
		parseInt(a.created) < parseInt(b.created)
			? 1
			: parseInt(a.created) === parseInt(b.created)
			? 0
			: -1
	)
}

export function filterJSONdata(data) {
	return data.map((item) => {
		return {
			title: item.title,
			id: item.id,
			author: item.member.username,
			avatar_url: largeAvatar(item.member.avatar_large),
			node_name: item.node.title,
			comment_count: item.replies,
		}
	})
}
