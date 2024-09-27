import React from 'react';
import Swal from 'sweetalert2';

function Promotions() {
    const promotions = {
        "Mimo & Co": "20% off on all clothing items.",
        "Lucciano's": "2x1 on ice cream cones every Friday.",
        "Cinemark Hoyts": "30% off on movie tickets on Wednesdays.",
        "Axion energy": "15% off on fuel purchases on weekends.",
        "Modo": "10% cashback on all purchases using Modo.",
        "Jumbo": "25% off on all groceries every Thursday.",
        "Disco": "Buy 1 get 1 free on selected items.",
        "Vea": "30% off on beverages every Monday.",
        "Burger King": "Free fries with any purchase on Tuesdays."
    };

    const handleShowPromotions = () => {
        const promoText = Object.entries(promotions)
            .map(([brand, promo]) => `<strong>${brand}:</strong> ${promo}`)
            .join("<br/><br/>");
    
        Swal.fire({
            title: 'Promotions Available',
            html: promoText,
            icon: 'info',
            confirmButtonText: 'Close',
            customClass: {
                popup: 'swal-wide'
            }
        });
    };

    return (
        <div className="flex flex-wrap w-full items-center justify-center p-6 bg-light-blue-100 text-center">
            <div className="w-[vw] justify-center gap-10 flex flex-wrap">
                <img src="promotiones.png" alt="City with brands" className="w-full xl:w-[100%] xl:h-[300px] h-auto mb-4" />
                <div className='flex flex-col items-center justify-center w-[100%] h-[300px]'>
                    <h2 className="text-2xl font-bold mb-4 text-black">Discover all the benefits you have with BigBank!</h2>
                    <p className="text-lg mb-6 text-black">Enjoy up to 30% cashback on dining, shopping, supermarkets, fuel, cinemas, and more.</p>
                    <button
                        onClick={handleShowPromotions}
                        className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                    >
                        Go to Go
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Promotions;
