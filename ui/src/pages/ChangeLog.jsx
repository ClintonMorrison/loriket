import React from 'react';
import { Helmet } from "react-helmet";

export default class ChangeLog extends React.Component {
  render() {
    return (
      <div className="cp-change-log">
        <Helmet>
          <title>Change Log - Lorikeet</title>
        </Helmet>

        <h1>Change Log</h1>

        <h2>Monday, November 9, 2020</h2>
        <p>
          <ul className="browser-default">
            <li>fixed bug with text area contrast on dark mode</li>
          </ul>
        </p>


        <h2>Monday, October 5, 2020</h2>
        <p>
          <ul className="browser-default">
            <li>added changelog</li>
            <li>added dark mode</li>
            <li>fixed some server-side bugs related to concurrency</li>
            <li>added more options for generating passwords</li>
          </ul>
        </p>
      </div>
    );

  }
}