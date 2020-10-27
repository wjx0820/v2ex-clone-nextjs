import Home from "../index"
import { filterJSONdata } from "../../utils"

export default function Node({ posts, current }) {
	return <Home posts={posts} current={current} />
}

async function getPosts() {
	const result = await fetch(
		`https://www.v2ex.com/api/topics/latest.json`
	).then((res) => res.json())

	const data = filterJSONdata(result)

	const posts = { all: data }

	return posts
}

export const getStaticProps = async () => {
	const posts = await getPosts()
	return {
		revalidate: 30,
		props: { posts: posts["all"], current: "all" },
	}
}
