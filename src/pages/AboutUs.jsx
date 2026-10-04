import bannerImage from "../assets/banner.jpg";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";



function AboutUs() {
    return (
        
        <main className="about-page">

<UserNavbar/>

            {/* Banner */}
            <section className="about-banner"
            style={{ backgroundImage: `url(${bannerImage})` }}>
                <div className="about-banner-overlay">
                    <span className="banner-label">WELCOME TO</span>
                    <h1>MovieVerse</h1>
                    <p>Your world of movies, all in one place.</p>
                </div>
            </section>


            {/* Introduction */}
            <section className="about-intro">
                <p className="intro-label">OUR SPACE FOR CINEMA</p>


                <h2>
                    More than a place to find movies.
                    <br />
                    A place to remember them.
                </h2>


                <p className="intro-text">
                    MovieVerse is a space for movie lovers to discover stories,
                    keep track of what they watch, save what they love, and
                    build their own collections. Whether you're looking for
                    something new or revisiting an old favourite, MovieVerse
                    keeps your movie journey in one place.
                </p>
            </section>


            {/* Features */}
            <section className="about-features">


                <div className="feature-card feature-discover">
                    <span className="feature-number">01</span>


                    <div className="feature-content">
                        <span className="feature-mini">FIND YOUR NEXT</span>
                        <h3>Discover</h3>
                        <p>
                            Explore movies and find stories that are worth
                            adding to your watchlist.
                        </p>
                    </div>


                    <span className="feature-arrow">↗</span>
                </div>


                <div className="feature-card feature-track">
                    <span className="feature-number">02</span>


                    <div className="feature-content">
                        <span className="feature-mini">KEEP A RECORD</span>
                        <h3>Track</h3>
                        <p>
                            Keep your cinematic journey together and never
                            forget what you've watched.
                        </p>
                    </div>


                    <div className="track-line">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>


                <div className="feature-card feature-collect">
                    <span className="feature-number">03</span>


                    <div className="collect-decoration">
                        <span></span>
                        <span></span>
                    </div>


                    <div className="feature-content">
                        <span className="feature-mini">MAKE IT YOURS</span>
                        <h3>Collect</h3>
                        <p>
                            Create personal lists and gather the movies that
                            mean something to you.
                        </p>
                    </div>


                    <span className="feature-arrow">↗</span>
                </div>


                <div className="feature-card feature-favourite">
                    <span className="feature-number">04</span>


                    <div className="favourite-symbol">♡</div>


                    <div className="feature-content">
                        <span className="feature-mini">KEEP THE FAVOURITES</span>
                        <h3>Favourite</h3>
                        <p>
                            Save the movies you love most and keep them close
                            whenever you're ready for a rewatch.
                        </p>
                    </div>
                </div>


            </section>

            <Footer/>


        </main>
    );
}


export default AboutUs;
