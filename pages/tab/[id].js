import Home, { tabs } from "../index"
import { sortByDate, filterJSONdata } from "../../utils"

export default function Node({ posts, current }) {
	return <Home posts={posts} current={current} />
}

async function getPosts(id) {
	function getTabRelatedNodesArray(id) {
		const table = {
			tech: ["programmer", "fe", "js", "nodejs", "vue", "react"],
			creative: ["create", "design", "ideas"],
			play: ["share", "bb", "games", "travel", "hardware"],
			apple: ["apple", "macos", "ios", "ipad", "iphone", "mbp"],
			jobs: ["jobs", "cv", "career"],
			deals: ["all4all", "exchange", "free", "dn", "tuan"],
			city: ["beijing", "shanghai", "shenzhen", "hangzhou", "life"],
			qna: ["qna"],
		}
		return table[id]
	}

	const nodes = getTabRelatedNodesArray(id)

	const resultArray = await Promise.all(
		nodes.map((node) =>
			fetch(
				`https://www.v2ex.com/api/topics/show.json?node_name=${node}`
			).then((res) => res.json())
		)
	)
	const result = [].concat.apply([], resultArray)

	const sortedRes = sortByDate(result)

	const data = filterJSONdata(sortedRes)

	const posts = { [id]: data }

	return posts
}

export const getStaticProps = async ({ params }) => {
	const posts = await getPosts(params.id)

	return {
		revalidate: 30,
		props: { posts: posts[params.id], current: `${params.id}` },
	}
}

export const getStaticPaths = () => {
	const paths = tabs.map(({ id }) => {
		return {
			params: { id },
		}
	})

	return {
		paths,
		fallback: false,
	}
}
