// pages/index.js
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { Amplify, API, Auth, withSSRContext } from "aws-amplify";
import awsExports from "../src/aws-exports";
import { createPost } from "../src/graphql/mutations";
import { listPosts } from "../src/graphql/queries";
import Layout from "../components/Layout";

Amplify.configure({ ...awsExports, ssr: true });

/** 
  getServerSideProps: server-side rendering component in Next.Js
  The framework will pre-render these pages on each request passing in any data that is returned as props.

  Using the new withSSRContext utility you can make authenticated API calls to GraphQL and REST back ends from these server-rendered routes.
*/
export async function getServerSideProps({ req }) {
  console.log("Calling getServerSideProps", req.url );
  const SSR = withSSRContext({ req });
  const response = await SSR.API.graphql({ query: listPosts });

  return {
    props: {
      posts: response.data.listPosts.items,
    },
  };
}

async function handleCreatePost(event) {
  event.preventDefault();

  const form = new FormData(event.target);

  try {
    const { data } = await API.graphql({
      authMode: "AMAZON_COGNITO_USER_POOLS",
      query: createPost,
      variables: {
        input: {
          title: form.get("title"),
          content: form.get("content"),
        },
      },
    });

    window.location.href = `/posts/${data.createPost.id}`;
  } catch ({ errors }) {
    console.error(errors);
    throw new Error(errors[0].message);
  }
}

export default function Home({ posts = [] }) {
  return (
    <Layout>
        <main>
          <h2>{posts.length} posts <small>(Posts is loaded with SSR)</small></h2>
          
          <div className="posts">
              {posts.map((post) => (
                  <a className="card" href={`/posts/${post.id}`} key={post.id}>
                    <h3>{post.title}</h3>
                    <div className="post-content">{post.content}</div>
                  </a>
              ))}
          </div>
        </main>
        <div className="sidebar">
            <AmplifyAuthenticator>
              <h3>New Post</h3>
              <form onSubmit={handleCreatePost}>
                <div className="field">
                  <label>Title</label>
                  <input defaultValue={`Post, ${new Date().toDateString()}, ${new Date().toLocaleTimeString()}`} name="title" placeholder="Post title" />
                </div>

                <div className="field">
                  <label>Content</label>
                  <textarea defaultValue="lorem ipsum" name="content" />
                </div>

                <button>Create Post</button>
               
              </form>
            </AmplifyAuthenticator>
        </div>
    </Layout>  
  );
}
