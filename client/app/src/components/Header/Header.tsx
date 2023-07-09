import './Header.scss';

import HeaderProfile from './HeaderProfile';

export const Header = (): JSX.Element => {

    return <header className='header'>
        <h1 className='header__heading'>LazyBot</h1>
        <div className='header__right'>
            <div className='header__profile-info'>
                <HeaderProfile />
            </div>
        </div>
    </header>
};