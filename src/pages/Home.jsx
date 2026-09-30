import LatestReviews from "./LatestReviews";
import TopLists from "./TopLists";

import UserNavbar from "../components/UserNavbar";
import Hero from "../components/Hero";
import TrendingThisWeek from "../components/TrendingThisWeek";
import TopReviews from "./TopReviews";
import AboutUsStrip from "../components/AboutUsStrip";
import "../UserHome.css";

function Home() {

    return (
        <div className="user-home">

            <section className="hero-wrapper">

                <UserNavbar />

                <Hero />

            </section>

            <TrendingThisWeek />

            <AboutUsStrip/>

            <LatestReviews />

            <TopLists />

            <TopReviews />

        </div>
    );
}

export default Home;