
import { AiFillHeart, AiFillMessage, AiFillHome, AiOutlinePlus } from 'react-icons/ai'
import { Dropdown } from './Main'
import { BsPerson } from 'react-icons/bs'
import { BiMoon } from 'react-icons/bi'
import { RiLogoutBoxLine } from 'react-icons/ri'
import firebase from 'firebase'
import ProfilePhotos from './ProfilePhotos'
import React, { useState, useEffect } from 'react';
import { db } from '../Firebase'


const Profile = ({ onAddPhoto, onProfile, onLog, username, profilePhotos, profileName, profileReady, setProfileName, dtheme, setdTheme, onHome, setShowMessage}) => {

    const LogOut = () => {
        firebase.auth().signOut().then(() => {
            onLog();
            alert('Logging out was successful.')
        }).catch((error) => {
            alert('You are trapped here forever.')
        });
    }

    return (
        <div>
            <div className='main-container-2' style={dtheme ? {'background-color' : '#1F1F1F', 'color': '#DCDCDC'} : {'background-color' : '#F7F7F7'}}>

                <div className='menu' style={dtheme ? {'background-color' : '#323232'} : {'background-color' : '#F7F7F7'}}>
                    <div className='menu-text'>
                        <div className='menu-name'>Illust.</div>
                        <div className='menu-options'>
                            <AiFillHome onClick={() => {onProfile(); setProfileName(''); onHome();}} />
                            <AiFillMessage onClick={() => {onHome(); setShowMessage(); setProfileName('');}} />
                            <AiFillHeart />
                            <Dropdown><Drop onAddPhoto={() => {onHome(); onAddPhoto(); setProfileName('');}} LogOut={LogOut} setdTheme={setdTheme} dtheme={dtheme} setProfileName={setProfileName}/></Dropdown>
                        </div>
                    </div>
                </div>
                <div className='feed-profile'>
                    <div className='feed-profile-text'>{profileName}'s Profile</div>
                    <div className='feed-profile-photos' >
                    {
                        profilePhotos.map(({id, photo}) => (
                            <ProfilePhotos key = {id} photo={photo} dtheme={dtheme}/>
                        ))
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Drop({ onAddPhoto, LogOut, setdTheme, dtheme, setProfileName}) {
    return (
        <div className='drop' id={dtheme ? 'drop-dark' : ''}>
            <li onClick={onAddPhoto}><AiOutlinePlus />Add Photos</li>
            <li onClick={setdTheme}><BiMoon />Theme</li>
            <li onClick={() => {LogOut(); setProfileName('') }}><RiLogoutBoxLine />Log Out</li>
        </div>
        // Profile, Add photos, nightmode, logout
    )
}

export default Profile
