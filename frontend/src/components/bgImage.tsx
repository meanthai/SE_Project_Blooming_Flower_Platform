import backgroundImage from "../assets/flowers.png"

const BgImage = () => {
    return (
        <div>
            <img src={backgroundImage} className="w-full max-h-[600px] object-cover"/>
        </div>
    )
}

export default BgImage