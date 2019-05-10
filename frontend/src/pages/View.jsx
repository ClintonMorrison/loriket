import React from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import Details from "../components/passwords/Details";

export default function View({ services, params }) {
  const document = services.getDocument();

  if (!document) {
    return <Redirect to="/login"/>
  }

  const item = _(document.passwords)[0];

  return (
    <div className="cp-view">
      <h1>Details</h1>
      <Details item={item} />
    </div>
  )
}