import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 5,
    category: 'general',
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  apiKey = process.env.REACT_APP_NEWS_API_KEY;
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalArticles: 0,
      hasMore: true,
    };
    document.title = `${this.capitalise(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    this.props.setProgress(30);
    const data = await fetch(url);
    const parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.articles,
      totalArticles: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    await this.updateNews();
  }

  fetchMoreData = async () => {
  this.setState(
    (prevState) => ({ page: prevState.page + 1 }),
    async () => {
      this.props.setProgress(10);
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.props.setProgress(30);
      const data = await fetch(url);
      const parsedData = await data.json();
      const newArticles = parsedData.articles || [];
      this.props.setProgress(70);
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalArticles: parsedData.totalResults,
        hasMore: newArticles.length > 0,
      });
      this.props.setProgress(100);
    }
  );
};


  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{ margin: '35px 0px' }}>
          NewsMonkey - Top {this.capitalise(this.props.category)} Headlines
        </h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll dataLength={this.state.articles?.length}
          next={this.fetchMoreData} hasMore={this.state.hasMore}
          loader={<Spinner />}>
          <div className="row">
            {this.state.articles?.map((element) => {
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
}

export default News;
