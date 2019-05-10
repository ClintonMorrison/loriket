import React from 'react';
import moment from 'moment';
import BasicField from "./BasicField";

export default function DateField({ title, value }) {
  const date = moment(value).format("MMMM D, YYYY");
  return (
    <BasicField title={title} value={date} />
  );
}