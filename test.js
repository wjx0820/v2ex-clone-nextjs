const fetch = require("isomorphic-fetch")

!(async function getData() {
	const data = await fetch(
		`https://www.v2ex.com/api/topics/latest.json`
	).then((res) => res.json())

	const result = data.map((item) => {
		return {
			title: item.title,
			author: item.member.username,
			avatar: item.member.avatar_large,
			node_name: item.node.title,
			comment_count: item.replies,
		}
	})

	const allData = { all: result }
	console.log("getData -> allData", allData)
})()
