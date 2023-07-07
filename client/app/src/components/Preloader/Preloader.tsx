import Image from 'next/image';

import "./Preloader.scss";

const Preloader = () => {
	return <div className='appPreloader'>
		<Image
			src='/preloader.svg'
			alt='loading...'
			width={50}
			height={50}
		/>
	</div>
};

export default Preloader;
