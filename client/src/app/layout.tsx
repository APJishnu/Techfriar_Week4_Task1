import React from 'react';

import './globals.css'; // Global styles can be added here



const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
};

export default Layout;
