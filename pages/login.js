import { TweenMax } from 'gsap';
import LayoutSetup from '../components/layoutSetup';

export default () => {
    return (
        <>
            <LayoutSetup />
            <main>
                <div className="login-window">
                    <form>
                        <label for="email-input">E-mail:</label>
                        <input id="email-input" type="text" name="email" />
                        <label for="email-input">Parola:</label>
                        <input type="password" name="password" />
                    </form>
                    <div className="horizontal-centered">
                        <button id="login-button" className="fancy-shiny-button">Autentificare</button>
                    </div>
                </div>
            </main>

            <style jsx>
                {`
                main {
                    background: linear-gradient(270deg, rgba(0,27,103,1) 0%, rgba(78,103,235,1) 100%);
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .login-window {
                    width: 400px;
                    height: 400px;
                    border-radius: 5px;
                    background-color: white;
                    box-shadow: 0px 0px 10px grey;
                    padding: 30px;
                    position: relative;
                }

                .login-window > form {
                    display: flex;
                    flex-direction: column;
                }

                .login-window > form > input {
                    outline: none;
                    height: 30px;
                    border-radius: 10px;
                    border: none;
                    box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
                    transition: all 0.3s;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    font-family: 'Oswald', sans-serif;
                    font-size: 1em;
                    padding: 10px;
                    font-weight: 300;
                    
                }

                .login-window > form > input:hover {
                    box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
                }

                .login-window > form > input:focus {
                    box-shadow: 0px 0px 10px rgba(0,0,255,0.5);
                }

                #login-button.fancy-shiny-button {
                    height: 40px;
                    padding-left: 20px;
                    padding-right: 20px;
                    background: none;
                    background-color: #E74C54;
                    box-shadow: 0px 0px 9px rgba(255,0,0,0.5);
                    font-size: 1.2em;
                }

                #login-button.fancy-shiny-button:hover {
                    box-shadow: 0px 0px 9px rgba(0,0,255,0.5);
                    background: none;
                    background-color: #092477;
                }
            
                
            `}
            </style>
        </>
    )
}