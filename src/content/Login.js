import { useState } from "react"
import firebase from "firebase"

const Login = ({onSignup, onMain, onUsername}) => {

    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        if (!email || !password) {
            alert('Please fill out both forms.');
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log(user.user.displayName);
            console.log(user.user.uid);
            onUsername(user.user.displayName);
            onMain();
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          window.alert(errorMessage);
        });
    }

    return (
        <div className='login-container'>
            <div className='login'>
                <div className='login-top'>
                    Illust.
                </div>

                <form className='login-middle' onSubmit={onSubmit}>
                    <input type='text' placeholder='Email' className ='login-text-input' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type='password' placeholder='Password' className ='login-text-input' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input type='submit' value='Log in' className = 'login-submit-input login-submit-input-button'/>
                </form>       

                <div className='login-bottom'>
                    <div>Forgot password?</div>
                    <div onClick={onSignup}>Sign up</div>
                    <div>View as guest</div>
                </div>        
            </div>
        </div>
    )
}

export default Login
