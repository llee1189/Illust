const Photo = ({user, photo, caption}) => {
    return (
        <div className='feed-photos-border'>


            <img className="photo" src={photo}/>
            <div className='user'>{user}</div>
            <div className='caption'>{caption}</div>
        </div>
    )
}

export default Photo

  {/* <div>Username</div>
            <img class='photo' src="https://cdn.pixabay.com/photo/2015/09/02/13/10/rigging-918920_960_720.jpg"/> */}