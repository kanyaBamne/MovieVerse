import { useEffect, useState } from "react";

import ProfileHeader from "./ProfileHeader";

import ProfileCard from "../components/ProfileCard";
import ProfileTabs from "../components/ProfileTabs";
import ProfileWatchlist from "../components/ProfileWatchlist";

function Profile() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // Temporary user ID
    // Later we will get this from login

    const userId = "6aa391bcca7f9c2f1f91b817";


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/profile/${userId}`
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to load profile"
                    );

                }


                const data = await response.json();


                setUser(data.user);

            }

            catch (error) {

                console.error(
                    "Profile error:",
                    error
                );

                setError(
                    "Unable to load profile"
                );

            }

            finally {

                setLoading(false);

            }

        };


        fetchProfile();

    }, []);


    // Loading

    if (loading) {

        return (

            <div className="profile-loading">

                Loading profile...

            </div>

        );

    }


    // Error

    if (error) {

        return (

            <div className="profile-error">

                {error}

            </div>

        );

    }


    return (

    <div className="profile-page">

        <ProfileHeader />

        {user && (
            <ProfileCard user={user} />
        )}

        <ProfileTabs />

        {user && (
            <ProfileWatchlist
                userId={user.id}
            />
        )}

    </div>

);

}


export default Profile;