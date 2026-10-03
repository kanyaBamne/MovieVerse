
import { useEffect, useState } from "react";

import ProfileHeader from "./ProfileHeader";

import ProfileCard from "../components/ProfileCard";

import ProfileTabs from "../components/ProfileTabs";

import ProfileWatchlist from "../components/ProfileWatchlist";

import ProfileWatchedMovies from "../components/ProfileWatchedMovies";

import ProfileReviews from "../components/ProfileReviews";

import ProfileFavorites from "../components/ProfileFavorites";


function Profile() {

    const [user, setUser] = useState(null);

    const [activeTab, setActiveTab] = useState("Films");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const loggedInUser =
                    JSON.parse(sessionStorage.getItem("user"));

                if (!loggedInUser || !loggedInUser.id) {

                    setError(
                        "Please sign in to view your profile."
                    );

                    setLoading(false);

                    return;

                }


                const userId = loggedInUser.id;


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


    if (loading) {

        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );

    }


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


            <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />


            {user && activeTab === "Films" && (

                <ProfileWatchedMovies
                    userId={user.id}
                />

            )}


            {user && activeTab === "Favourites" && (

                <ProfileFavorites
                    userId={user.id}
                />

            )}


            {user && activeTab === "Reviews" && (

                <ProfileReviews
                    userId={user.id}
                />

            )}


            {user && activeTab === "Watchlist" && (

                <ProfileWatchlist
                    userId={user.id}
                />

            )}

        </div>

    );

}


export default Profile;

