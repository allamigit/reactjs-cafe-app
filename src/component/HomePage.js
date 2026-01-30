
import '../App.css';

export default function HomePage() {

    return (
        <div 
            className="App d-flex justify-content-center align-items-center flex-column"       
            style={{
                backgroundImage: `url(${require('../assets/home-bg.jpg')})`,
                backgroundSize: 'cover',        // fill the screen
                backgroundPosition: 'center',   // center the image
                backgroundRepeat: 'no-repeat',  // avoid tiling
                minHeight: '100vh',             // take full screen height
            }}
        >
        </div>
    );
}
