import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './LandingPage.css';

const LandingPage = () => {
    const carBannerUrl = 'https://empiremotorworld.com.my/wp-content/uploads/2017/10/car-banner1.jpg';

    useEffect(() => {
        AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms
    }, []);

    return (
        <div className="landing-page">
            <header className="header" style={{ backgroundImage: `url(${carBannerUrl})` }}>
                <h1 data-aos="fade-down">Car Companion</h1>
                <p data-aos="fade-up">Transforming Car Manual Interactions with AI</p>
                <button className="button" data-aos="zoom-in">Get Started</button>
            </header>

            <section className="features" data-aos="fade-up">
                <h2>Features</h2>
                <div className="feature-cards">
                    <div className="card" data-aos="fade-up" data-aos-delay="100">
                        <h3>AI-Driven Assistance</h3>
                        <p>Get detailed information and guidance about your car using our AI-driven assistant.</p>
                    </div>
                    <div className="card" data-aos="fade-up" data-aos-delay="200">
                        <h3>Image and Text Extraction</h3>
                        <p>Extract and interpret images, tables, and text from car manuals for quick answers.</p>
                    </div>
                    <div className="card" data-aos="fade-up" data-aos-delay="300">
                        <h3>Intelligent Query Handling</h3>
                        <p>Ask any question and receive the most relevant information instantly.</p>
                    </div>
                </div>
            </section>

            <section className="about" data-aos="fade-up">
                <h2>About Us</h2>
                <p>
                    CarCompanion is your ultimate assistant for all car-related queries. Our AI-driven virtual assistant provides you with detailed information about your car, including user manuals, maintenance schedules, and more. Whether you're a new car owner or a seasoned driver, CarCompanion is here to help you every step of the way.
                </p>
            </section>


            <footer>
                <p>&copy; 2024 Car Companion. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
