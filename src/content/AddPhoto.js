import { AiFillHeart, AiFillMessage, AiFillHome} from 'react-icons/ai'
import {BsPerson} from 'react-icons/bs'
import { BiMoon } from 'react-icons/bi'
import {RiLogoutBoxLine} from 'react-icons/ri'
import { useState } from 'react'
import {Dropdown} from './Main'
import { storage, db } from '../Firebase'
import firebase from 'firebase'


const AddPhoto = ({onAddPhoto, username, onHome, onLog, setdTheme, dtheme, setProfileName, setShowMessage}) => {
    const LogOut = () => {
        firebase.auth().signOut().then(() => {
            onLog();
            alert('Logging out was successful.')
        }).catch((error) => {
            alert('You are trapped here forever.')
            console.log(error)
        });
    }

    const [image, setImage] = useState(null);
    const [url, setURL] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('')
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setURL(URL.createObjectURL(e.target.files[0]))
        }

    }
    const handleUpload = (e) => {
        e.preventDefault()
        if (image === null) {
            alert('Please choose a file.')
            return;
        }

        let id = firebase.firestore().collection('photos').doc().id;
        const uploadTask = storage.ref(`images/${id}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref('images')
                    .child(id)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('photos').doc(id).set({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            photo: url,
                            user: username
                        })
                        .then(function(pDoc){
                            db.collection('users').doc(username).collection('user-photos').add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                pid: id
                            })
                        })
                        .catch((e) => console.log('There was an error uploading your photo'))
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                        alert('Photo has been published successfully.')
                        onAddPhoto();
                        return;
                    })
            }
        )

    }
    

    return (
        <div className='main-container-2' style={dtheme ? {'background-color' : '#1F1F1F', 'color': '#DCDCDC'} : {'background-color' : '#F7F7F7'}}> 

        <div className='menu' style={dtheme ? {'background-color' : '#323232'} : {'background-color' : '#F7F7F7'}}>
            <div className='menu-text'>
                <div className='menu-name'>Illust.</div>
                <div className='menu-options'>
                    <AiFillHome onClick = {onHome}/>
                    <AiFillMessage onClick={() => {onHome(); setShowMessage()}} />
                    <AiFillHeart/>
                    <Dropdown><Drop LogOut={LogOut} setdTheme={setdTheme} dtheme={dtheme} setProfileName={setProfileName} username={username}/></Dropdown>
                </div>
            </div>
        </div>
        <div className='add-photo-container' >
            <form className='add-photo' onSubmit={handleUpload} >
                <div className='stock-photo' >{ url !== null ? <div className={dtheme ? 'temp-photo-div-dark' :'temp-photo-div'}><img className='temp-photo'                 style={dtheme ? {
                    'borderColor':'#111111 ',} : {'borderColor':'white'}} src={url}/></div> : <div className={dtheme ? 'temp-photo-div-dark' :'temp-photo-div'}><div className='no-photo'
                style={dtheme ? {
                    'borderColor':'#111111 ',} : {'borderColor':'white'}}
                ></div></div>}
                <input className='choose-file' type="file" onChange={handleChange}/>
                </div>
                <input className='caption-text' type="text" placeholder='Write a caption...' value = {caption} onChange={(e)=> setCaption(e.target.value)} 
                style={dtheme ? {
                    'background-color':'#1F1F1F', 'color':'white'} : {}}/>
                <input className='upload-button' type='submit' value='Upload'/>
                <progress value={progress} max='100'/>
            </form>
            </div>
        </div>
    )
}

export function Drop({LogOut, setdTheme, dtheme, setProfileName, username}) {
    return (
        <div className='drop' id={dtheme ? 'drop-dark' : ''}>
            <li onClick={() => setProfileName(username)}><BsPerson/>Profile</li>
            <li onClick={setdTheme}><BiMoon/>Theme</li>
            <li onClick={LogOut}><RiLogoutBoxLine/>Log Out</li>
        </div>
        // Profile, Add photos, nightmode, logout
    )
}

export default AddPhoto
