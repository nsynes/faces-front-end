import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const GoogleButtons = (props) => {

  const clientId = '822628944241-25go8osgljjdaeu9fb03ibc7jofl917l.apps.googleusercontent.com';
  if ( props.loggedIn ) {
    return (
        <GoogleLogout
          className='google-button'
          clientId={clientId}
          buttonText="Log out"
          onLogoutSuccess={props.responseGoogleLogout}
          onFailure={props.responseGoogleFailure}
          isSignedIn={true}
          cookiePolicy={'single_host_origin'} />
    )
  }
  return (
    <GoogleLogin
      className='google-button'
      clientId={clientId}
      buttonText="Log in"
      onSuccess={props.responseGoogleSuccess}
      onFailure={props.responseGoogleFailure}
      isSignedIn={true}
      cookiePolicy={'single_host_origin'} />
  )
}

export default GoogleButtons;