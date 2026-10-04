import { useEffect, useState } from "react";

import ProfileHeader from "./ProfileHeader";

import ProfileCard from "../components/ProfileCard";
import ProfileTabs from "../components/ProfileTabs";
import ProfileWatchlist from "../components/ProfileWatchlist";
import ProfileFavorites from "../components/ProfileFavorites";
import Footer from "../components/Footer";

function Profile() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("Films");


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
                onTabChange={setActiveTab}
            />


            {user && activeTab === "Films" && (

                <ProfileWatchlist
                    userId={user.id}
                />

            )}


            {user && activeTab === "Favourites" && (

                <ProfileFavorites
                    userId={user.id}
                />

            )}

            <Footer/>

        </div>

    );

}

export default Profile;