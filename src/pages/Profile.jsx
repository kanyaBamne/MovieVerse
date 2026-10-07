import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProfileHeader from "./ProfileHeader";

import ProfileCard from "../components/ProfileCard";
import ProfileTabs from "../components/ProfileTabs";
import ProfileWatchlist from "../components/ProfileWatchlist";
import ProfileWatchedMovies from "../components/ProfileWatchedMovies";
import ProfileReviews from "../components/ProfileReviews";
import ProfileFavorites from "../components/ProfileFavorites";
import ProfileLists from "../components/ProfileLists";
import Footer from "../components/Footer";

function Profile() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();

        const validTabs = [
            "Films",
            "Favourites",
            "Reviews",
            "Watchlist",
            "Lists"
        ];

        const requestedTab = searchParams.get("tab");

        const [activeTab, setActiveTab] = useState(
            validTabs.includes(requestedTab)
                ? requestedTab
                : "Films"
        );


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const loggedInUser =
                    JSON.parse(sessionStorage.getItem("user"));

                if (!loggedInUser || !loggedInUser.id) {

                    setError(
                        "Please signin to view your profile."
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

            } catch (error) {

                console.error(
                    "Profile error:",
                    error
                );

                setError(
                    "Unable to load profile"
                );

            } finally {

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


            {/* Films */}

            {user && activeTab === "Films" && (

                <ProfileWatchedMovies
                    userId={user.id}
                />

            )}


            {/* Favourites */}

            {user && activeTab === "Favourites" && (

                <ProfileFavorites
                    userId={user.id}
                />

            )}


            {/* Reviews */}

            {user && activeTab === "Reviews" && (

                <ProfileReviews
                    userId={user.id}
                />

            )}


            {/* Watchlist */}

            {user && activeTab === "Watchlist" && (

                <ProfileWatchlist
                    userId={user.id}
                />

            )}


            {/* Lists */}

            {user && activeTab === "Lists" && (

                <ProfileLists />

            )}

            <Footer />

        </div>

    );

}

export default Profile;