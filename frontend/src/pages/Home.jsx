import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFacebook, 
    faTwitter, 
    faInstagram, 
    faLinkedin, 
    faWhatsapp, 
    faYoutube 
} from '@fortawesome/free-brands-svg-icons';
import './Home.css';

const Home = () => {
    const navBoxes = [
        {
            title: 'User Registration',
            description: 'Create your profile and join our community of singles looking for their perfect match.',
            link: '/register',
            buttonText: 'Register Now'
        },
        {
            title: 'Search Profiles',
            description: 'Browse through our extensive database of profiles to find your ideal partner.',
            link: '/search',
            buttonText: 'Search Profiles'
        },
        {
            title: 'Matching Algorithm',
            description: 'Discover how our advanced matching system helps you find compatible partners.',
            link: '/matching',
            buttonText: 'Learn More'
        },
        {
            title: 'Success Stories',
            description: 'Read inspiring stories from couples who found love through our platform.',
            link: '/stories',
            buttonText: 'View Stories'
        }
    ];

    const socialLinks = [
        {
            icon: faFacebook,
            platform: 'Facebook',
            username: '@marriagematching',
            link: 'https://facebook.com/marriagematching',
            color: '#1877f2'
        },
        {
            icon: faTwitter,
            platform: 'Twitter',
            username: '@marriagematching',
            link: 'https://twitter.com/marriagematching',
            color: '#1da1f2'
        },
        {
            icon: faInstagram,
            platform: 'Instagram',
            username: '@marriagematching',
            link: 'https://instagram.com/marriagematching',
            color: '#e4405f'
        },
        {
            icon: faLinkedin,
            platform: 'LinkedIn',
            username: 'Marriage Matching',
            link: 'https://linkedin.com/company/marriagematching',
            color: '#0077b5'
        },
        {
            icon: faWhatsapp,
            platform: 'WhatsApp',
            username: '+1 (234) 567-890',
            link: 'https://wa.me/1234567890',
            color: '#25d366'
        },
        {
            icon: faYoutube,
            platform: 'YouTube',
            username: 'Marriage Matching',
            link: 'https://youtube.com/marriagematching',
            color: '#ff0000'
        }
    ];

    return (
        <div className="home">
            <header>
                <div className="container">
                    <h1>Marriage Matching System</h1>
                    <p>Find your perfect match with our advanced matching system</p>
                </div>
            </header>

            <div className="container">
                <div className="nav-boxes">
                    {navBoxes.map((box, index) => (
                        <div key={index} className="nav-box">
                            <h2>{box.title}</h2>
                            <p>{box.description}</p>
                            <a href={box.link}>{box.buttonText}</a>
                        </div>
                    ))}
                </div>

                <div className="social-section">
                    <h2>Connect With Us</h2>
                    <div className="social-links">
                        {socialLinks.map((social, index) => (
                            <div key={index} className="social-item">
                                <FontAwesomeIcon 
                                    icon={social.icon} 
                                    style={{ color: social.color }}
                                    className="social-icon"
                                />
                                <h3>{social.platform}</h3>
                                <a 
                                    href={social.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {social.username}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home; 