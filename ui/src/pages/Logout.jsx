import React from 'react';
import { Redirect } from 'react-router-dom';

export default function Logout({ services}) {
  services.authService.logout();
  return <Redirect to="/login" />;
}
