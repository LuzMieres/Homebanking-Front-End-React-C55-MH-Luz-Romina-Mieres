import React from 'react'
import Icon  from './Icon'

const SocialNetworks = () => {
  return (
    <div className="SocialNetworks lg:w-52 flex lg:gap-2 ">
     <a href="#" className='p-3'> <Icon src="/public/instagram-brands-solid.svg"/></a>
     <a href="#" className='p-3'> <Icon src="/public/whatsapp-brands-solid.svg"/></a>
     <a href="#" className='p-3'> <Icon src="/public/facebook-brands-solid.svg"/></a>
    </div>
  )
}

export default SocialNetworks