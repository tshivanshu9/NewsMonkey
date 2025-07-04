import React, { Component } from 'react';

export class NewsItem extends Component {
    render() {
        const { title, description, imageUrl, newsUrl, publishedAt, author, source } = this.props;
        return (
            <div className="my-3">
                <div className="card">
                    <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger" style={{ left: '90%', zIndex: 1 }}>
                            {source}
                            <span className="visually-hidden">unread messages</span>
                        </span>
                    <img src={imageUrl} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{title}...</h5>
                        <p className="card-text">{description}...</p>
                        <p className='card-text'><small className="text-muted">{`Published by ${author ?? 'Unknown'} on ${publishedAt}`}</small></p>
                        <a
                            rel="noreferrer"
                            href={newsUrl}
                            target="_blank"
                            className="btn btn-sm btn-dark"
                        >
                            Read More
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewsItem;
