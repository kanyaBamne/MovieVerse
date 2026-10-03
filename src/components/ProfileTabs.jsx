import { useState } from "react";

function ProfileTabs({ onTabChange }) {

    const [activeTab, setActiveTab] = useState("Films");

    const tabs = [
        "Films",
        "Favourites",
        "Reviews",
        "Watchlist",
        "Lists"
    ];

    const handleTabChange = (tab) => {

        setActiveTab(tab);

        if (onTabChange) {
            onTabChange(tab);
        }

    };

    return (

        <div className="profile-tabs">

            {tabs.map((tab) => (

                <button
                    key={tab}
                    className={
                        activeTab === tab
                            ? "profile-tab active"
                            : "profile-tab"
                    }
                    onClick={() => handleTabChange(tab)}
                >

                    {tab}

                </button>

            ))}

        </div>

    );

}

export default ProfileTabs;