const Footer = () => {
    return (
        <div style={{ backgroundColor: "#B7BD3f" }} className="py-10">
            <div className="container mx-auto flex flex-col md:flex-row justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    Blooming.com
                </span>
                <span className="text-white font-bold tracking-tight flex gap-4">
                    <span>Privacy Policy</span>
                    <span>Terms of condition</span>
                </span>
            </div>
        </div>
    )
}

export default Footer
