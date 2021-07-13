import {useState} from 'react'
import Photo from './Photo'
import { About, Contact, Notes, Dropdown } from './Main'
import {RiLoginBoxLine} from 'react-icons/ri'

const Guest = ({photos, username, guest, onGuest}) => {
    const [misc, setMisc] = useState('')

    const LogOut = () => {
        onGuest();
    }
    
    return (
        <div className='main-container'> 

            <div className='menu'>
                <div className='menu-text'>
                    <div className='menu-name'>Illust.</div>
                    <input type='text' placeholder='Search Currently Unavailable' className='search'/>
                    <div className='menu-options'>
                        <Dropdown><Drop LogOut={LogOut} /></Dropdown>
                    </div>
                </div>
            </div>
            <div className='feed'>
                <div className ='feed-photos'>
                    {
                        photos.map(({id, photo}) => (
                            <Photo key={id} pid={id} user={photo.user} photo={photo.photo} caption={photo.caption} username={username} guest={guest}></Photo>
                        ))
                    }
                </div>
                <div className ='feed-misc'>
                    <div className ='feed-misc-text'>
                        <div className='account-name'>Logged in as: Guest</div>
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

export function Drop({LogOut}) {
    return (
        <div className='dropper'>
            <li onClick={LogOut}><RiLoginBoxLine/>Sign in</li>
        </div>
        // Profile, Add photos, nightmode, logout
    )
}

export default Guest
