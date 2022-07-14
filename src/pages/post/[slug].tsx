import { GetStaticPaths, GetStaticProps } from 'next';

import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';

// import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const { isFallback } = useRouter();
  console.log('Post', post);
  const date = new Date(post.first_publication_date);
  const publicationdateFormated = format(date, 'd LLL yyyy', {
    locale: ptBR,
  });

  // const wordCount = post.data.content.map(content => {
  //   const headCount = content.heading.split(' ');
  //   const bodyCount = content.body[0].text.split(' ');
  //   const num = headCount.length + bodyCount.length;
  //   return { num };
  // });

  // console.log(wordCount);

  const contentHtml = post.data.content.map(content => {
    return RichText.asHtml(content.body);
  });

  const total = contentHtml.reduce((sumTotal, words) => {
    return sumTotal + words;
  });

  const wordCount = Math.ceil(total.split(' ').length / 200);
  console.log(wordCount);

  return (
    <>
      <div className={styles.headerContainer}>
        <Header />
      </div>

      {isFallback ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        <>
          <div className={styles.imageContainer}>
            <img src={post?.data.banner.url} alt={post?.data.banner.alt} />
          </div>
          <main className={styles.contentContainer}>
            <h1>{post?.data.title}</h1>
            <div className={styles.contentIcons}>
              <FiCalendar size={20} />
              <span>{publicationdateFormated}</span>
              <FiUser size={20} />
              <span>{post?.data.author}</span>
              <FiClock size={20} />
              <span>{wordCount} min</span>
            </div>
            {post ? (
              post.data.content.map(content => {
                return (
                  <div key={content.heading}>
                    <h2>{content.heading}</h2>
                    <p>{content.body[0].text}</p>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </main>
        </>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('my-desafio-type');

  return {
    fallback: true,
    paths: posts.results.map(post => ({
      params: {
        slug: post.uid!,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});

  const { slug } = params;

  const post = await prismic.getByUID('my-desafio-type', String(slug));

  // TODO

  return {
    props: { post },
  };
};
