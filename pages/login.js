import LayoutSetup from '../components/layoutSetup';
import TextInput from '../components/TextInput';
import React from 'react';
import PrimaryButton from '../components/PrimaryButton';

export default () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    return (
        <>
            <LayoutSetup />
            <main>
                <div className="login-window fade-and-slide-in">
                    <h1>Quizio</h1>
                    <form>
                        <TextInput title="Username:" width="100%" value={username} valueSetter={setUsername} />
                        <TextInput title="Password:" width="100%" value={password} valueSetter={setPassword} password />
                    </form>
                    <PrimaryButton title="Login" centered marginTop />
                </div>
            </main>

            <style jsx>
                {`
                main {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                h1 {
                    padding: 0;
                    margin: 0;
                    border-bottom: 2px solid black;
                }
                .login-window {
                    width: 93%;
                    max-width: 450px;
                    min-width: 300px;
                    border-radius: 5px;
                    background-color: white;
                    box-shadow: 0px 0px 4px grey;
                    padding: 20px;
                    padding-top: 10px;
                    position: relative;
                }

                .login-window > form {
                    display: flex;
                    flex-direction: column;
                    padding-top: 25px;
                }
            `}
            </style>
        </>
    )
}