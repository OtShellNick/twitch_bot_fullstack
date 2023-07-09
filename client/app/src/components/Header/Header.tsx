import './Header.scss';

import HeaderProfile from './HeaderProfile';

export const Header = (): JSX.Element => {

    return <header>
        <div>Logo</div>
        <HeaderProfile />
    </header>
};