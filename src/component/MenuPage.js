
import '../App.css';
import Menu from "../menu/Menu";
import { pastries, cakes, hotDrinks, coldDrinks } from '../menu/MenuData';
import { Routes, Route, NavLink } from 'react-router-dom';

export default function MenuPage() {

    return (
        <div className="App d-flex flex-column min-vh-100">
            <h3>Café Menu</h3>
            <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top" style={{ fontSize: '1.2em' }}>
                <div className="container-fluid">

                    {/* Toggle button for mobile */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarMenu"
                        aria-controls="navbarMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navbar links */}
                    <div className="collapse navbar-collapse" id="navbarMenu">
                        <ul className="navbar-nav d-flex gap-5 mx-auto">
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold text-primary' : '')} to="/menu/pastries">
                                    Pastries                            
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold text-primary' : '')} to="/menu/cakes">
                                    Cakes
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold text-primary' : '')} to="/menu/hot-drinks">
                                    Hot Drinks
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold text-primary' : '')} to="/menu/cold-drinks">
                                    Cold Drinks
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="pastries" element={<Menu menu="Pastries" action="menu" data={pastries} />} />
                <Route path="cakes" element={<Menu menu="Cakes" action="menu" data={cakes} />} />
                <Route path="hot-drinks" element={<Menu menu="Hot Drinks" action="menu" data={hotDrinks} />} />
                <Route path="cold-drinks" element={<Menu menu="Cold Drinks" action="menu" data={coldDrinks} />} />
            </Routes>
        </div>
    );
}
