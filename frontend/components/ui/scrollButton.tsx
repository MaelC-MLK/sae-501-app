'use client';

import Image from 'next/image';

const ScrollButton = () => {
    const handleScroll = () => {
        const element = document.getElementById('scroll-btn');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <div id='scroll-btn' onClick={handleScroll} className="w-fit flex flex-col items-center justify-center mx-auto gap-1 cursor-pointer mt-52 hover:translate-y-2 transition-transform duration-300">
            <span className="text-sm text-primary">Voir plus d'évènements</span>
            <Image
                src="/images/ScrollDown.svg"
                alt="scroll-button"
                width={48}
                height={48}
            />
        </div>
    );
};

export default ScrollButton;
