import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const GoogleButtons = (props) => {

    return (
        <div>
          <GoogleLogin
            className='google-button'
            clientId="822628944241-25go8osgljjdaeu9fb03ibc7jofl917l.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={props.responseGoogleSuccess}
            onFailure={props.responseGoogleFailure}
            isSignedIn={true}
            cookiePolicy={'single_host_origin'} />
          <GoogleLogout
            className='google-button'
            clientId="822628944241-25go8osgljjdaeu9fb03ibc7jofl917l.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={props.responseGoogleLogout}
            onFailure={props.responseGoogleFailure}
            isSignedIn={true} />
        </div>
    )

}

export default GoogleButtons;