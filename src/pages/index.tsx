import Head from 'next/head';

import { GetStaticProps } from 'next';

import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useEffect, useState } from 'react';
import { getPrismicClient } from '../services/prismic';

// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [renderPost, setRenderPost] = useState<Post[]>(postsPagination.results);

  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function carregaMais(): Promise<void> {
    const oldPost = [...renderPost];

    const response = await fetch(postsPagination.next_page);
    const posts = await response.json();

    console.log(posts);

    setNextPage(posts.next_page);

    const result: Post = posts.results.map(post => {
      const date = new Date(post.first_publication_date);
      const publicationdateFormated = format(date, 'd LLL yyyy', {
        locale: ptBR,
      });
      return {
        uid: post.uid,
        first_publication_date: publicationdateFormated,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    const novosPosts = oldPost.concat(result);
    setRenderPost(novosPosts);
  }

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <title>spacetraveling</title>
      </Head>

      <div className={styles.headerContainer}>
        <Header />
      </div>
      <main className={styles.contentContainer}>
        <div className={styles.posts}>
          {renderPost.length > 0 ? (
            renderPost.map(result => {
              return (
                <div className={styles.link} key={result.uid}>
                  <Link href={`/post/${result?.uid}`}>
                    <a>
                      <h1>{result.data?.title}</h1>
                      <h2>{result.data?.subtitle}</h2>
                      <div className={styles.contentIcons}>
                        <FiCalendar size={20} />
                        <p>{result.first_publication_date}</p>
                        <FiUser size={20} />
                        <p>{result.data?.author}</p>
                      </div>
                    </a>
                  </Link>
                </div>
              );
            })
          ) : (
            <></>
          )}
          {nextPage ? (
            <button type="button" onClick={carregaMais}>
              Carregar mais posts
            </button>
          ) : (
            <></>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('my-desafio-type', {
    pageSize: 1,
  });
  console.log(postsResponse);
  // TODO
  const results = postsResponse.results.map(post => {
    const date = new Date(post.first_publication_date);
    const publicationdateFormated = format(date, 'd LLL yyyy', {
      locale: ptBR,
    });
    return {
      uid: post.uid,
      first_publication_date: publicationdateFormated,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  const postsPagination = {
    next_page: postsResponse.next_page,
    results,
  };

  return {
    props: { postsPagination },
  };
};
