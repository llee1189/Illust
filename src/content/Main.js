import Photo from './Photo'
import { AiFillHeart, AiFillMessage, AiFillHome, AiOutlinePlus } from 'react-icons/ai'
import { BsFillPersonFill, BsMoon, BsPerson} from 'react-icons/bs'
import { BiMoon } from 'react-icons/bi'
import {RiLogoutBoxLine} from 'react-icons/ri'
import { useState } from 'react'
import firebase from 'firebase'

const Main = ({photos, username, onAddPhoto, onMain}) => {
    const [misc, setMisc] = useState('')

    const LogOut = () => {
        firebase.auth().signOut().then(() => {
            onMain();
            alert('Logging out was successful.')
        }).catch((error) => {
            alert('You are trapped here forever.')
        });
    }

    return (
        <div className='main-container'> 

            <div className='menu'>
                <div className='menu-text'>
                    <div className='menu-name'>Illust.</div>
                    <input type='text' placeholder='Search' className='search'/>
                    <div className='menu-options'>
                        <AiFillHome/>
                        <AiFillMessage/>
                        <AiFillHeart/>
                        <Dropdown><Drop onAddPhoto = {onAddPhoto} LogOut={LogOut} /></Dropdown>
                    </div>
                </div>
            </div>
            <div className='feed'>
                <div className ='feed-photos'>
                    {
                        photos.map(({id, photo}) => (
                            <Photo key={id} user={photo.user} photo={photo.photo} caption={photo.caption}></Photo>
                        ))
                    }
                </div>
                <div className ='feed-misc'>
                    <div className ='feed-misc-text'>
                        <div className='account-name'>Logged in as: {username}</div>
                        <div className='about'>
                            <div onClick={() => {if (misc !== '') {setMisc('')} else{ setMisc('about')}}}>About</div>
                            <div onClick={() => {if (misc !== '') {setMisc('')} else{ setMisc('contact')}}}>Contact</div>
                            <div onClick={() => {if (misc !== '') {setMisc('')} else{ setMisc('notes')}}}>Notes</div>
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
export function Drop({onAddPhoto, LogOut}) {
    return (
        <div className='drop'>
            <li><BsPerson/>Profile</li>
            <li onClick={onAddPhoto}><AiOutlinePlus/>Add Photos</li>
            <li><BiMoon/>Theme</li>
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

function About() {
    return (
        <div className='about-text'>
            <div>Hey! This is an early stage of a website I am designing to practice web development with React for the front and with Firebase for the back.</div>
            <div>The basis for this website was to be a clone of Instagram, but I ended up going towards creating an online image sharing community like Pinterest with an instant film theme.</div>
            <div>Since I'm still rather green, I've still got many things I want to add as well as issues I need to address down the road, which can all be seen under the 'Notes' option.</div>
            <div>If you got down to here, thanks for stopping by and reading!</div>
        </div>
    )
}

function Contact() {
    return (
        <div className='about-text'>
            <div>If you're trying to reach me, you can email me at k.lance.lee@gmail.com</div>
            <div>I also have more simpler projects on my github: https://github.com/llee1189</div>
        </div>
    )
}

function Notes() {
    return(
        <div className='about-text'>
            <div>Major things to add:
                <li>Messaging system</li>
                <li>Following system</li>
                <li>Notifications</li>
                <li>Dark-mode Theme</li>
                <li>Profile Options</li>
                <li>Picture Resize</li>
                <li>Delete/Archive Pics</li>
                <li>User Profile Picture</li>
                <li>Comments</li>
                <li>Search system</li>
            </div>
            <div>
                Current issues:
                <li>
                    When switching between the 'Home' page and 'Add Photos' page, the menu bar shifts about 20 pixels. Unsure why, but the most efficient solution is to tie the menu to the App.js and not continually add 
                    it for each page.
                </li>
                <li>
                    There's an issue of reuploading the same photo that causes any previous uploads of that photo to break. This may be due to the nature of how I have stored the photos in Firebase and need to reformat.
                </li>
            </div>
        </div>
        
    )
}


export default Main
