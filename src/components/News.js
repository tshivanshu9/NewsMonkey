import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const apiKey = process.env.REACT_APP_NEWS_API_KEY;


  const capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  document.title = `${capitalise(props.category)} - NewsMonkey`;

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    props.setProgress(30);
    const data = await fetch(url);
    const parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalArticles(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }

  useEffect(() => {
    updateNews();
  }, []);

  const fetchMoreData = async () => {
    setPage(page + 1);
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${apiKey}&page=${page}&pageSize=${props.pageSize}`;
    props.setProgress(30);
    const data = await fetch(url);
    const parsedData = await data.json();
    const newArticles = parsedData.articles || [];
    props.setProgress(70);
    setArticles((articles) => articles.concat(newArticles));
    setTotalArticles(parsedData.totalResults);
    setHasMore(newArticles.length > 0);
    props.setProgress(100);
  };

  return (
    <div className="container my-3">
      <h1 className="text-center" style={{ margin: '35px 0px' }}>
        NewsMonkey - Top {capitalise(props.category)} Headlines
      </h1>
      {/* {loading && <Spinner />} */}
      <InfiniteScroll dataLength={articles?.length}
        next={fetchMoreData} hasMore={hasMore}
        loader={<Spinner />}>
        <div className="row">
          {articles?.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title?.slice(0, 45)}
                  description={element.description?.slice(0, 88)}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  publishedAt={new Date(element.publishedAt).toDateString()}
                  author={element.author}
                  source={element.source.name}
                ></NewsItem>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

News.defaultProps = {
  country: 'in',
  pageSize: 5,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
