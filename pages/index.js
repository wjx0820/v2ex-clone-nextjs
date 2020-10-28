import Link from "next/link"
import styled from "styled-components"
import { filterJSONdata } from "../utils"

const Tabs = styled.div`
	padding: 0.2 rem;
	display: flex;
	flex-wrap: wrap;
	a {
		padding: 0 0.5rem;
		border-radius: 0.2rem;
		margin-right: 1rem;
	}
	a:link,
	a:visited {
		text-decoration: none;
		color: #555;
	}

	a:hover {
		background: #eee;
	}

	.active {
		&:visited {
			color: white;
		}
		background-color: ${({ theme }) => theme.tabBgColor};
	}
`

const Item = styled.div`
	margin: 0.5rem 0;
	&::before {
		display: block;
		content: "";
		background-color: ${({ theme }) => theme.tagBgColor};
		height: 1px;
		margin: 0.5rem -0.8rem;
	}
	.item {
		display: flex;
		align-items: center;
	}

	img {
		border-radius: 0.3rem;
		align-self: flex-start;
		width: 48px;
		height: 48px;
	}

	.info {
		flex: 1 1 auto;
		margin: 0 1rem;
		.title {
			font-size: 1.1rem;
		}

		.tag {
			font-size: 0.8rem;
			background-color: ${({ theme }) => theme.tagBgColor};
			padding: 0.2rem;
			border-radius: 0.2rem;
			margin-right: 8px;
			a {
				color: #999;
			}
		}

		.author {
			a {
				font-size: 0.8rem;
				font-weight: bold;
				color: #778087;
				text-decoration: none;
				word-break: break-word;
			}
		}
	}

	.comment_count {
		margin-left: 1rem;
		a {
			border-radius: 0.6rem;
			background-color: ${({ theme }) => theme.countBgColor};
			padding: 0 0.5rem;
			color: white;
		}

		a:visited {
			background-color: ${({ theme }) => theme.tagBgColor};
		}
	}
`

export const tabs = [
	{ name: "技术", id: "tech" },
	{ name: "创意", id: "creative" },
	{ name: "好玩", id: "play" },
	{ name: "Apple", id: "apple" },
	{ name: "酷工作", id: "jobs" },
	{ name: "交易", id: "deals" },
	{ name: "城市", id: "city" },
	{ name: "问与答", id: "qna" },
	// { name: "最热", id: "hot" },
	// { name: "全部", id: "all" },
]

const TabsBar = ({ current }) => {
	return (
		<Tabs>
			{tabs.map((tab) => (
				<Link key={tab.id} href="/tab/[id]" as={`/tab/${tab.id}`}>
					<a className={current === tab.id ? "active" : ""}>{tab.name}</a>
				</Link>
			))}
		</Tabs>
	)
}

export default function Home({ posts, current }) {
	return (
		<div className="card">
			<TabsBar current={current} />
			{posts.map((p) => (
				<Item key={p.id}>
					<div className="item">
						<img alt={p.author} src={p.avatar_url} />
						<div className="info">
							<Link href="/t/[id]" as={`/t/${p.id}`}>
								<a className="title">{p.title}</a>
							</Link>
							<div>
								<span className="tag">
									<Link href="/go/[id]" as={`${p.node_id}`}>
										<a>{p.node_name}</a>
									</Link>
								</span>
								<span className="author">
									<Link href="/member/[id]" as={`/member/${p.author}`}>
										<a>{p.author}</a>
									</Link>
								</span>
							</div>
						</div>
						<div className="comment_count">
							<Link href="/t/[id]" as={`${p.id}`}>
								<a>{p.comment_count}</a>
							</Link>
						</div>
					</div>
				</Item>
			))}
		</div>
	)
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
