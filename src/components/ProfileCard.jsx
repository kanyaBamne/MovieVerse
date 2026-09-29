function ProfileCard({ user }) {

    return (

        <div className="profile-card">

            {/* Profile Picture */}

            <div className="profile-picture-container">

                <img
                    src={user.profileImage}
                    alt={user.name}
                    className="profile-picture"
                />

            </div>


            {/* Username */}

            <div className="profile-username">

                {user.username}

            </div>


            {/* Name */}

            <h1 className="profile-name">

                {user.name}

            </h1>


            {/* Bio */}

            <div className="profile-bio">

                {user.bio}

            </div>

        </div>

    );

}

export default ProfileCard;