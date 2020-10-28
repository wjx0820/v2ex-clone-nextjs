import Head from "next/head"
import Link from "next/link"
import styled from "styled-components"
import { largeAvatar } from "../../utils"

import dateDiff from "../../utils/date"

const PostComponent = styled.article`
	.title {
		h1 {
			font-size: 1.8rem;
			font-weight: 500;
			margin: 0;
		}

		&::after {
			display: block;
			content: "";
			background-color: ${({ theme }) => theme.tagBgColor};
			height: 1px;
			margin: 0.5rem -0.8rem;
		}
	}

	.content {
		word-break: break-all;
	}
`
const Comments = styled.div`
	margin: 1rem 0;
	.reply_count {
		color: #ddd;
		padding: 0.5rem;

		&::after {
			display: block;
			content: "";
			background-color: ${({ theme }) => theme.tagBgColor};
			height: 1px;
			margin: 0.5rem -0.8rem;
		}
	}
	.comment {
		display: flex;
		align-items: center;
		padding: 0 0.5rem;
		.avatar {
			border-radius: 0.3rem;
			align-self: flex-start;
			width: 48px;
			height: 48px;
		}

		.middle {
			flex: 1 1 auto;
			margin: 0 1rem;

			.ago {
				font-size: 12px;
				margin: 0 8px;
				color: #ccc;
			}

			.content {
				margin-top: 8px;
				word-break: break-all;
			}
		}

		.no {
			align-self: flex-start;
			color: #ccc;
			font-size: 0.8rem;
			span {
				padding: 3px 6px;
				border-radius: 12px;
				background: ${({ theme }) => theme.tagBgColor};
			}
		}
	}

	.noComments {
		padding: 1rem;
		color: #ddd;
		text-align: center;
	}

	.item::after {
		display: block;
		content: "";
		background-color: ${({ theme }) => theme.tagBgColor};
		height: 1px;
		margin: 0.5rem -0.8rem;
	}
`

const Paginate = styled.div`
	text-align: center;
	a {
		padding: 5px 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
		margin: 5px;
	}

	.active {
		background: #ddd;
	}
`

function createMarkup(content) {
	return { __html: content }
}

export default function Post(props) {
	const { title, content, author, replies, reply_count } = props
	return (
		<>
			<Head>
				<title> {title} - V2EX</title>
			</Head>
			<PostComponent className="card">
				<div className="title">
					<h1>{title}</h1>
					<Link href="/member/[id]" as={`/member/${author}`}>
						<a>{author}</a>
					</Link>
				</div>
				<div
					className="content"
					dangerouslySetInnerHTML={createMarkup(`${content}`)}
				/>
			</PostComponent>
			<Comments className="card">
				<div className="reply_count">{`${reply_count}条回复`}</div>
				{replies &&
					replies.length &&
					replies.map((r) => {
						return (
							<div className="item" key={r.no}>
								<div className="comment">
									<img className="avatar" alt={r.author} src={r.avatar_url} />
									<div className="middle">
										<span>
											<Link href="/member/[id]" as={`/member/${r.author}`}>
												<a>{r.author}</a>
											</Link>
											<span className="ago">{r.ago}</span>
										</span>
										<div
											className="content"
											dangerouslySetInnerHTML={createMarkup(`${r.content}`)}
										/>
									</div>
									<div className="no">
										<span>{r.no}</span>
									</div>
								</div>
							</div>
						)
					})}
			</Comments>
		</>
	)
}

const getDetail = async (id) => {
	const result = await fetch(
		`https://www.v2ex.com/api/topics/show.json?id=${id}`
	).then((res) => res.json())
	return result
}

const getComments = async (id) => {
	const result = await fetch(
		`https://www.v2ex.com/api/replies/show.json?topic_id=${id}`
	).then((res) => res.json())
	return result
}

export const getStaticProps = async ({ params }) => {
	const detail = await getDetail(params.id)

	const comments = await getComments(params.id)

	const totalPage = Math.ceil(comments.length / 100)

	const props = {
		title: detail[0].title,
		author: detail[0].member.username,
		content: detail[0].content_rendered,
		replies: comments.map((c, index) => {
			return {
				avatar_url: largeAvatar(c.member.avatar_normal),
				author: c.member.username,
				ago: dateDiff(c.created),
				content: c.content_rendered,
				no: index + 1,
			}
		}),
		reply_count: detail[0].replies,
	}

	return {
		revalidate: 30,
		props,
	}
}

export const getStaticPaths = () => {
	return {
		paths: [],
		fallback: true,
	}
}
