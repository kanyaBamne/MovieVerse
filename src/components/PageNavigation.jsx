import { useNavigate } from "react-router-dom";

function PageNavigation({ to }) {

    const navigate = useNavigate();

    const handleBack = () => {

        if (to) {
            navigate(to);
            return;
        }

        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }

    };

    return (
        <div className="page-navigation">

            <button
                type="button"
                className="page-navigation-back"
                onClick={handleBack}
            >
                <span className="page-navigation-arrow">
                    ←
                </span>

                <span>
                    Back
                </span>
            </button>

        </div>
    );
}

export default PageNavigation;