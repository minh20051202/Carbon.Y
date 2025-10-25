import logo from '../assets/logo.png';

function Header( { companyName } ) {
    return (
        <>
            <div className='brand'>
                <img id="logo" src={logo} alt="Carbon.Y Logo" />
                <div>Carbon.Y</div>
            </div>
            <div className='company-name'>{companyName}</div>
        </>
    );
}

export default Header;