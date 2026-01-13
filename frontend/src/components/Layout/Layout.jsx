function Layout({ children }) {
    return (
        <div className="min-h-screen">
            <main className="max-w-5xl mx-auto px-6 md:px-8">
                {children}
            </main>
        </div>
    );
}

export default Layout;
