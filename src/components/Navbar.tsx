import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div className="text-white text-lg font-bold">Sahar Nails</div>
                    <div>
                        <ul className="flex space-x-4">
                            <li>
                                <a href="/" className="text-gray-300 hover:text-white">Home</a>
                            </li>
                            <li>
                                <a href="/services" className="text-gray-300 hover:text-white">Services</a>
                            </li>
                            <li>
                                <a href="/about" className="text-gray-300 hover:text-white">About</a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;