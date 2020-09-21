import { Amplify, API, withSSRContext, Auth } from "aws-amplify";
import Head from "next/head";
import { useRouter } from "next/router";
import awsExports from "../../src/aws-exports";
import { deletePost } from "../../src/graphql/mutations";
import { getPost, listPosts } from "../../src/graphql/queries";
import Layout from "../../components/Layout";
import { useUser } from '../../context/UserContext';

Amplify.configure({ ...awsExports, ssr: true });

export async function getStaticPaths() {
  console.log("Calling getStaticPaths");
  const SSR = withSSRContext();
  const { data } = await SSR.API.graphql({ query: listPosts });
  const paths = data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));

  return {
    fallback: true,
    paths,
  };
}

export async function getStaticProps({ params }) {
  console.log("Calling getStaticProps", params);
  const SSR = withSSRContext();
  const { data } = await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id,
    },
  });

  return {
    props: {
      post: data.getPost
    },
  };
}

export default function Post({ post }) {
  const router = useRouter();
  const {user} = useUser();

  if (router.isFallback) {
    return (
        <div className={styles.container}>
          <h1 className={styles.title}>Loading&hellip;</h1>
        </div>
    );
  }

  async function handleDelete() {
    try {
      await API.graphql({
        authMode: "AMAZON_COGNITO_USER_POOLS",
        query: deletePost,
        variables: {
          input: { id: post.id },
        },
      });

      window.location.href = "/";
    } catch ({ errors }) {
      console.error(...errors);
      throw new Error(errors[0].message);
    }
  }
  
  return (
      <Layout>
        <Head>
          <title>{post.title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main id="page-post">
          <article>
          <h1>{post.title}</h1>
          <div>{post.content}</div>
          </article>
          <footer>
          <a href="/">Back</a>
          {user ? <button onClick={handleDelete} className="danger">Delete post</button> : ''}
          </footer>
        </main>
      </Layout>
  );
}
