import Photo from './Photo'
import { AiFillHeart, AiFillMessage, AiFillHome, AiOutlinePlus } from 'react-icons/ai'
import { BsFillPersonFill, BsPerson} from 'react-icons/bs'
import { BiMoon } from 'react-icons/bi'
import {RiLogoutBoxLine} from 'react-icons/ri'
import { useState } from 'react'
import firebase from 'firebase'
import { db } from '../Firebase'

const Main = ({photos, username, onAddPhoto, onMain, aFunction, dtheme, setdTheme, setShowMessage}) => {
    const [misc, setMisc] = useState('')
    const [search, setSearch] = useState('')
    // const [dtheme, setdTheme] = useState(false)

    const LogOut = () => {
        firebase.auth().signOut().then(() => {
            onMain();
            alert('Logging out was successful.')
        }).catch((error) => {
            alert('You are trapped here forever.')
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!search) {
            alert('Type something in the search field first.')
        }
        db.collection('users').doc(search).get().then(s => {
            if (s.data()) {
                aFunction(search)
            } else {
                alert('User not found.')
                return;
            }
        })
    }

    return (
        <div className='main-container' style={dtheme ? {'background-color' : '#1F1F1F', 'color': '#DCDCDC'} : {'background-color' : '#F7F7F7'}}> 

            <div className='menu' style={dtheme ? {'background-color' : '#323232'} : {'background-color' : '#F7F7F7'}}>
                <div className='menu-text'>
                    <div className='menu-name'>Illust.</div>
                    <form onSubmit={onSubmit}>
                    <input type='text' placeholder='Search for a user...' className='search' value={search} onChange={(e) => setSearch(e.target.value)} onSubmit={() => alert('hey')}/>
                    <input type='submit' style={{'width': '0%', 'height':'0px', 'background': 'transparent', 'border': 'none', 'position':'fixed'}}/>
                    </form>
                    <div className='menu-options'>
                        <AiFillHome/>
                        <AiFillMessage onClick={setShowMessage}/>
                        <AiFillHeart/>
                        <Dropdown><Drop onAddPhoto = {onAddPhoto} LogOut={LogOut} Profile={aFunction} username={username} setdTheme={setdTheme} dtheme={dtheme}/></Dropdown>
                    </div>
                </div>
            </div>
            <div className='feed'>
                <div className ='feed-photos'>
                    {
                        photos.map(({id, photo}) => (
                            <Photo key={id} pid={id} user={photo.user} photo={photo.photo} caption={photo.caption} username={username} 
                            aFunction={(x) => aFunction(x)} dtheme={dtheme}/>
                        ))
                    }
                </div>
                <div className ='feed-misc'>
                    <div className ='feed-misc-text'>
                        <div className='account-name'><div>Logged in as: </div><div>{username}</div></div>
                        <div className='about'>
                            <div onClick={() => {if (misc !== 'about') {setMisc('about')} else{ setMisc('')}}}>About</div>
                            <div onClick={() => {if (misc !== 'contact') {setMisc('contact')} else{ setMisc('')}}}>Contact</div>
                            <div onClick={() => {if (misc !== 'notes') {setMisc('notes')} else{ setMisc('')}}}>Notes</div>
                        </div>
                        {misc === 'about' ? <About/>:
                        misc === 'contact' ? <Contact/>:
                        misc === 'notes' ? <Notes/>:
                        ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export function Drop({onAddPhoto, LogOut, Profile, username, setdTheme, dtheme}) {
    return (
        <div className='drop' id={dtheme ? 'drop-dark' : ''}>
            <li onClick={() => Profile(username)}><BsPerson/>Profile</li>
            <li onClick={onAddPhoto}><AiOutlinePlus/>Add Photos</li>
            <li onClick={setdTheme}><BiMoon/>Theme</li>
            <li onClick={LogOut}><RiLogoutBoxLine/>Log Out</li>
        </div>
        // Profile, Add photos, nightmode, logout
    )
}

export function Dropdown(props) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <BsFillPersonFill onClick = {() => setOpen(!open)}/>
            {open && props.children}
        </div>
    )
}

export function About() {
    return (
        <div className='about-text'>
            <div>Hey! This is an early stage of a website I am designing to practice web development with React for the front and with Firebase for the back.</div>
            <div>The basis for this website was to be a clone of Instagram, but I ended up going towards creating an online image sharing community like Pinterest with an instant film theme.</div>
            <div>Since I'm still rather green, I've still got many things I want to add as well as issues I need to address down the road, which can all be seen under the 'Notes' option.</div>
            <div>If you got down to here, thanks for stopping by and reading!</div>
        </div>
    )
}

export function Contact() {
    return (
        <div className='about-text'>
            <div>If you're trying to reach me, you can email me at k.lance.lee@gmail.com</div>
            <div>I also have more simpler projects on my github: https://github.com/llee1189</div>
        </div>
    )
}

export function Notes() {
    return(
        <div className='about-text'>
            <div>Major things to add:
                <li>Following system</li>
                <li>Notifications</li>
                <li>More Profile Options</li>
                <li>Picture Resize</li>
                <li>Delete/Archive Pics</li>
                <li>User Profile Picture</li>
                <li>Smarter Search System?</li>
                <li>Tags?</li>
                <li>Preview Comments</li>
            </div>
            <div>
                Current issues:
                <li>
                    When switching between the 'Home' page and 'Add Photos' page, the menu bar shifts about 20 pixels. Unsure why, but the most efficient solution is to tie the menu to the App.js and not continually add 
                    it for each page. I have applied a margin to mitigate the slant for now.
                </li>
                <li>
                    FIXED: There's an issue of reuploading the same photo that causes any previous uploads of that photo to break. This may be due to the nature of how I have stored the photos in Firebase and need to reformat.
                </li>
            </div>
        </div>
        
    )
}



export default Main
