import { useEffect } from "react"
import FacebookLogin from 'react-facebook-login';

export default () => {
    const responseFacebook = (response) => {
        console.log(response);
      }

    return (
        <>
            <FacebookLogin
                appId="646755399219667"
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook} />,
        </>
    )
}