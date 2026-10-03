
function ProfileTabs({ activeTab, setActiveTab }) {

    const tabs = [
        "Films",
        "Favourites",
        "Reviews",
        "Watchlist",
        "Lists"
    ];

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
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </button>

            ))}

        </div>

    );
}

export default ProfileTabs;

