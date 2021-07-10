const Login = ({}) => {
    return (
        <div class='login-container'>
            <div class='login'>
                <div class='login-top'>
                    Illust.
                </div>

                <form class='login-middle'>
                <input type='text' placeholder='Email' class ='login-text-input'/>
                <input type='text' placeholder='Password' class ='login-text-input'/>
                <input type='submit' value='Log in' class = 'login-submit-input'/>
                </form>       

                <div class='login-bottom'>
                    <div>Forgot password?</div>
                    <div>Sign up</div>
                </div>        
            </div>
        </div>
    )
}

export default Login
