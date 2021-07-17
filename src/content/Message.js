import React from 'react'
import { AiFillHeart, AiFillMessage, AiFillHome, AiOutlinePlus } from 'react-icons/ai'
import { BsPerson} from 'react-icons/bs'
import { BiMoon } from 'react-icons/bi'
import {RiLogoutBoxLine} from 'react-icons/ri'
import { useState, useEffect, useRef } from 'react'
import { db } from '../Firebase'
import firebase from 'firebase'
import { Dropdown } from './Main'

const Message = ({dtheme, username, onAddPhoto, setProfileName, setdTheme, onHome, onLog}) => {
    const [message, setMessage] = useState('')
    const [userFind, setUserFind] = useState('')
    const [receiver, setReceiver] = useState('')
    const [oldusers, setOldUsers] = useState([])
    const [messageList, setMessageList] = useState([])

    // db.collection('users').doc('leelk').collection('messaged').doc('leelk').get().then(s => {
    //     if (s.data()) {
    //         alert('data')
    //     } else {
    //         alert('no data')
    //     }
    // })

    const LogOut = () => {
        firebase.auth().signOut().then(() => {
            onLog();
            alert('Logging out was successful.')
        }).catch((error) => {
            alert('You are trapped here forever.')
        });
    }

    const messagesEndRef = useRef(null)
    const scrollToBottom =() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    }
    useEffect(() => {
        scrollToBottom()
    }, [messageList]);

    

    async function FindUser(e) {
        e.preventDefault();
        if (userFind === username) {
            alert("Sorry, you can't send a message to yourself!")
            return
        }

        if (!userFind) {
            alert('Please type in a username.')
            return
        }
        var ref = db.collection('users').doc(userFind)
        var ref2;
        await ref.get().then(s => {
            if (s.data()) {
                setReceiver(userFind)
                ref2 = db.collection('users').doc(username).collection('messaged').doc(userFind)
                ref2.get().then(s => {
                    if (s.data()) {
                    } else {
                        db.collection('users').doc(username).collection('messaged').doc(userFind).set({
                        })
                    }
                })
            } else {
                alert('Error: Username was not found.')
                return
            }
        })




    }

    async function SendMessage(e) {
        e.preventDefault();
        if (!receiver) {
            alert("You haven't selected a user yet!")
            return;
        } else {
            db.collection('users').doc(username).collection('messaged').doc(receiver).collection('messages').add({
                message: message,
                sender: username,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            db.collection('users').doc(receiver).collection('messaged').doc(username).collection('messages').add({
                message: message,
                sender: username,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            setMessage('');
        }
    }

    async function FindMessages() {
        var ref = db.collection('users').doc(username).collection('messaged').doc(receiver).collection('messages').orderBy('timestamp')
        ref.onSnapshot((s) => 
            setMessageList(s.docs.map((doc) => ({
                name: doc.data().sender,
                message: doc.data().message
            }))
        ))
    }

    useEffect(() => {
        db.collection('users').doc(username).collection('messaged').get().then(s => {
            setOldUsers(s.docs.map(doc => 
                doc.id
            ))
        })


    }, [])

    useEffect(() => {
        if (!receiver) {
            return;
        }
        FindMessages();
    }, [receiver])

    return (
        <div className='fake-main-container' style={dtheme ? {'background-color' : '#1F1F1F', 'color': '#DCDCDC'} : {'background-color' : '#F7F7F7'}}> 

            <div className='menu' style={dtheme ? {'background-color' : '#323232'} : {'background-color' : '#F7F7F7'}}>
                <div className='menu-text'>
                    <div className='menu-name'>Illust.</div>
                    <div className='menu-options'>
                        <AiFillHome onClick={onHome}/>
                        <AiFillMessage/>
                        <AiFillHeart/>
                        <Dropdown><Drop onAddPhoto = {() => {onHome(); onAddPhoto()}} LogOut={LogOut} setProfileName={setProfileName} username={username} setdTheme={setdTheme} dtheme={dtheme}/></Dropdown>
                    </div>
                </div>
            </div>
            <div className='fake' ><div className='fake-border' style={dtheme ? {'background-color' : '#1F1F1F'} : {'background-color' : '#F7F7F7'}}></div></div>
            <div className='fake-feed'>
                <div className='feed-messages' >
                    <div className='feed-messages-username'> <div className='feed-messages-username-container' style={dtheme ? {'background-color' : '#323232'} : {'background-color' : '#F7F7F7'}}><div className='feed-messages-username-style'>{receiver}</div></div></div>
                    <div className='message-list'>
                    {
                        messageList.map(({name, message}) => (
                            <div> {username === name ? <div className='message-right'><div className='message-right-child'>{message}</div></div> : <div className='message-left'><div className='message-left-child'><div>{message}</div></div></div>}</div>
                        ))
                    }
                        <div ref={messagesEndRef}/>
                    </div>
                    <form className='feed-messages-input-container' onSubmit={SendMessage} style={dtheme ? {'background-color' : '#323232'} : {'background-color' : '#F7F7F7'}}>
                        <input type='text' placeholder={receiver ? `Type a message to ${receiver}` : 'Choose a user first'} className='feed-messages-input-text' value={message} onChange={(e) => setMessage(e.target.value)} />
                        <input type='submit' className='feed-messages-input-button'/>
                    </form>
                </div>

                <div className='feed-messaged'>
                    <div className='feed-messaged-position'>
                    <form className='feed-messaged-find-user-container' onSubmit={FindUser}>
                        <input className='feed-messaged-find-user-input-text'placeholder='Find a user...' type='text' value={userFind} onChange={(e) => setUserFind(e.target.value)} />
                        <input type='submit' value='Find'/>
                    </form>
                    <div className='feed-messaged-users'>
                        <strong> Recently messaged</strong>
                        {
                            oldusers.map((user) => (
                                <div style={{'cursor':'pointer', 'margin': '4px 0px'}}onClick={() => {setReceiver(user)}}>{user}</div>
                            ))
                        }
                        <div style={{'color':'grey', 'font-size':'.9em', 'word-wrap':'break-word'}}>You can message my account at 'leelk'!</div>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )
}

export function Drop({onAddPhoto, LogOut, setProfileName, username, setdTheme, dtheme}) {
    return (
        <div className='drop' id={dtheme ? 'drop-dark' : ''}>
            <li onClick={() => setProfileName(username)}><BsPerson/>Profile</li>
            <li onClick={onAddPhoto}><AiOutlinePlus/>Add Photos</li>
            <li onClick={setdTheme}><BiMoon/>Theme</li>
            <li onClick={LogOut}><RiLogoutBoxLine/>Log Out</li>
        </div>
        // Profile, Add photos, nightmode, logout
    )
}

export default Message
