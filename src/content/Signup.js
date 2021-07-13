import { useState } from 'react'
import firebase from 'firebase'
import {auth} from '../Firebase';

const Signup = ({onSignup, onMain, onUsername}) => {
    const[email, setEmail] = useState('')
    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')
    const[rpassword, setrPassword] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        if (!email || !username || !password || !rpassword) {
            alert('Please fill out all forms.');
            return;
        }

        if(password !== rpassword) {
            alert('Passwords do not match')
            return
        }
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            user.user.updateProfile({
                displayName: username
            })
            onUsername(username);
            onSignup();
            onMain();
        })
        .catch((error) => {
          var errorCode = error.code;
          console.log(errorCode);
          var errorMessage = error.message;
          window.alert(errorMessage);
        });
    }


    return (
        <div>
            <div className='signup-container'>
                <div className='signup'>
                    <div className='signup-top'>
                        Illust.
                    </div>
                    <div className='signup-top-after'>
                        Sign up to see photos from users everywhere.
                    </div>
                    <form className='signup-middle' onSubmit={onSubmit} >
                        <input type='text' placeholder='Email' className ='signup-text-input' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input type='text' placeholder='Username' className ='signup-text-input' value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <input type='password' placeholder='Password' className ='signup-text-input' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <input type='password' placeholder='Retype Password' className ='signup-text-input' value={rpassword} onChange={(e) => setrPassword(e.target.value)}/>                        
                        <input type='submit' value='Sign up' className = 'signup-submit-input signup-submit-input-button'/>
                    </form>       

                    <div className='signup-bottom'>
                        <div onClick={onSignup}>Already have an account? Log in.</div>
                    </div>        
                </div>
            </div>           
        </div>
    )
}

export default Signup
