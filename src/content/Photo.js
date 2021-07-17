import { FaRegComment } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { db } from '../Firebase'
import firebase from 'firebase'
import { FaRegHeart, FaHeart } from 'react-icons/fa'


const Photo = ({ user, photo, caption, pid, username, guest, aFunction, dtheme}) => {

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(false);
    const [data, setData] = useState(false);
    const name = 'leelk'


    useEffect(() => {
        if (username) {
            db.collection('photos').doc(pid).collection('likedBy').doc(username).onSnapshot(snapshot => {
                if (snapshot.data()) {
                    setLiked(true)
                } else {
                    setLiked(false)
                }
            })
        }
    }, [data])

    const onLike = () => {
        db.collection('photos').doc(pid).collection('likedBy').doc(username).set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        db.collection('users').doc(username).collection('likedPhotos').doc(pid).set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        db.collection('users').doc(username).get().then(snapshot => {
            if (snapshot.data().notifications) {
                console.log('data')
                db.collection('users').doc(username).update({
                    notifications: snapshot.data().notifications + 1,
                    hasCheckedNotifications: false
                })
            } else {
                db.collection('users').doc(username).update({
                    notifications: 1
                })
            }
        })
        setData(!data)
    }

    const onUnlike = () => {
        db.collection('photos').doc(pid).collection('likedBy').doc(username).delete()
        db.collection('users').doc(username).collection('likedPhotos').doc(pid).delete()
        setData(!data)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (comment === '') {
            alert('You must type something before submitting.')
            return
        }
        db.collection('photos').doc(pid).collection('comments').add({
            text: comment,
            username: username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    useEffect(() => {
        let unsubscribe;
        if (pid) {
            unsubscribe = db
                .collection('photos')
                .doc(pid)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc => doc.data())));
                });
        }

        return () => {
            unsubscribe();
        }
    }, [pid]);



    return (
        <div>
            <div className='feed-photos-border' style={dtheme ? {'background-color' : '#111111 ', 'borderColor':'#4F4F4F'} : {'background-color' : 'white'}}>


                <img alt='' className="photo" src={photo} style={dtheme ? {
                    'borderColor':'#111111 ',} : {'borderColor':'white'}}/>
                <div className='heart-like'>
                    {!liked ? <div className ='heart-like-icon'><FaRegHeart onClick={() => onLike()}/></div> : <div className ='heart-like-icon'><FaHeart onClick={() => onUnlike()}/></div>}
                </div>
                <div className='info'>
                    <strong className='user' onClick={() => aFunction(user)}>{user}</strong>&nbsp;<div>{caption}</div>
                </div>

                {
                    showComments ? <div className='comments-show'> {comments.map((comment) => (
                        <p className>
                            <strong>{comment.username}&nbsp;</strong> {comment.text}
                        </p>
                    ))}
                    </div> : <div  className='comments'>{comments.length > 0 ? <div className='view-all-comments' onClick={() => setShowComments(!showComments)} style={{'cursor':'pointer'}}> <FaRegComment className='FaRegComment'  />&nbsp;View All Comments</div>: <div>No Comments to Show</div>} </div>}
            </div>
            {!guest && <form className='add-comment-container' onSubmit={onSubmit}>
                <input type='text' className='add-comment' placeholder='Add a comment...' value={comment} onChange={(e) => setComment(e.target.value)}  style={dtheme ? {'background-color' : '#1F1F1F', 'color': '#DCDCDC'} : {'background-color' : '#F7F7F7'}} />
                <input className='add-comment-post' type='submit' value='Post' />
            </form>}

        </div>
    )
}

export default Photo

{/* <div>Username</div>
            <img class='photo' src="https://cdn.pixabay.com/photo/2015/09/02/13/10/rigging-918920_960_720.jpg"/> */}