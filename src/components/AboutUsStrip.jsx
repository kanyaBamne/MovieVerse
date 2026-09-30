import { useNavigate } from "react-router-dom";

function AboutUsStrip() {
    const navigate = useNavigate();

    return (
        <section className="about-strip">

            <h2>About Us</h2>

            <div className="about-strip-cta">
                <span>→</span>

                <button onClick={() => navigate("/about")}>
                    Why join?
                </button>
            </div>

        </section>
    );
}

export default AboutUsStrip;