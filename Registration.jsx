import './registration.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link, useNavigate } from "react-router-dom";
import {useState} from "react";


function Registration() {
    const [user,setUser]=useState({

        fullname:"",
        phone:"",
        email:"",
        password:"",
        confirmPassword:""
        }); 

    const navigate = useNavigate();
    const registerUser = async(e)=>{

e.preventDefault();


if(user.password !== user.confirmPassword)
{
    alert("Password does not match");
    return;
}


const response = await fetch(
"http://localhost:5000/api/auth/register",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(user)

});


const data = await response.json();


alert(data.message);


if(response.ok)
{
    navigate("/");
}

}

    return (
        <>
            <div id="main_container">

                {/* LEFT LOGIN BOX */}
                <div id="side_container">

                    {/* LOGO */}
                    <div id="logo_section">

                        <div id="logo_circle">
                            ⚙
                        </div>

                        <div>
                            <h2 id="logo_text">ATS</h2>
                            <p id="logo_subtext">Mini Application tracker</p>
                        </div>

                    </div>

                    {/* HEADING */}
                    <h1 id="header_login">
                        Create Account 👋
                    </h1>

                    <p id="sub_text">
                        Register to continue ...
                    </p>
                    <form onSubmit={registerUser}>
                    {/* FULL NAME */}
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        className="input_box"
                        onChange={(e)=>
                        setUser({...user,fullname:e.target.value})
                        }
                        required
                    />

                    {/* PHONE */}
                    <input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="input_box"
                        onChange={(e)=>
                        setUser({...user,phone:e.target.value})
                        }

                        required
                    />

                    {/* EMAIL */}
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="input_box"
                         onChange={(e)=>
                        setUser({...user,email:e.target.value})
                            }
                        required
                    />

                    {/* PASSWORD */}
                    <input
                        type="password"
                        placeholder="Create a password"
                        className="input_box"
                        onChange={(e)=>
                        setUser({...user,password:e.target.value})
                        }
                        required
                    />

                    {/* CONFIRM PASSWORD */}
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        className="input_box"
                          onChange={(e)=>
                            setUser({...user,confirmPassword:e.target.value})
                            }
                        required
                    />

                    {/* PASSWORD RULES */}
                    <p id="password_rules">
                        ***Password must contain at least 8 characters,
                        one uppercase letter and one number.
                    </p>

                    {/* REGISTER BUTTON */}
                    <button id="login_button" type="submit">
                        Register
                    </button>
                    </form>
                    {/* DIVIDER */}
                    <div id="divider">
                        <span></span>
                        OR
                        <span></span>
                    </div>

                    {/* LOGIN */}
                    <p id="register_text">
                        Already have an account?
                        <Link to="/"> Login</Link>
                    </p>

                </div>

                {/* RIGHT SIDE LOTTIE */}
                <div id="animation_container">

    <DotLottieReact
        src="https://lottie.host/c2731230-298f-4c24-a104-033bfaf1ffa3/pXu3fHS13m.lottie"
        loop
        autoplay
    />

    {/* INFO BOX */}
    <div className="info_box">
        <h3>Welcome to ATS 🚀</h3>
        <p>
            ATS helps you build professional, ATS-friendly resumes using ready-made templates.
            It analyzes your resume against job descriptions and generates an ATS score.
            Make your job application smarter, faster, and more effective.
        </p>
    </div>

</div>

            </div>
        </>
    )
}

export default Registration