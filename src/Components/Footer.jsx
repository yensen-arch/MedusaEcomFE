import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Footer = () => {
    return (
        <Container className='footer'>
            <div className='footer_display'>
                <div className='footer_rows'>
                    <h4>HELP</h4>
                    <div>SHOP AT ZARA.COM</div>
                    <div><Link to={'/help/items-and-sizes'}>ITEMS AND SIZES</Link></div>
                    <div><Link to={'/help/gift-card'}>GIFT CARD</Link></div>
                    <div>PAYMENT</div>
                    <div><Link to={'/help/shipping'}>SHIPPING</Link></div>
                    <div>EXCHANGE AND RETURNS</div>
                    <div>SHOPS AND COMPANY</div>
                    <div>CLOTHES COLLECTION</div>
                    <div>PROGRAMME</div>
                    <div>MY ACCOUNT</div>
                </div>
                <div className='footer_rows'>
                    <h4>FOLLOW US</h4>
                    <div><Link to={"/newsletter"}>NEWSLETTER</Link></div>
                    <div>INSTAGRAM</div>
                    <div>FACEBOOK</div>
                    <div>TWITTER</div>
                    <div>PINTEREST</div>
                    <div>YOUTUBE</div>
                </div>
                <div className='footer_rows'>
                    <h4>COMPANY</h4>
                    <div><Link to={'/about'}>ABOUT US</Link></div>
                    <div>JOIN US</div>
                    <div>OFFICES</div>
                    <div>STORES</div>
                    <div><Link to={'/career'}>WORK WITH US</Link></div>
                </div>
                <div className='footer_rows'>
                    <h4>POLICIES</h4>
                    <div>PRIVACY POLICY</div>
                    <div>PURCHASE CONDITIONS</div>
                    <div>GIFT CARD CONDITIONS</div>
                    <div>COOKIES SETTING</div>
                </div>
            </div>

            <div className='footer_bottom'>
                <div>
                    <div>NAME AND ADDRESS OF THE MANUFACTURER :</div>
                    <div>INDUSTRIA DE DISEÑO TEXTIL, S.A. (INDITEX, S.A.)</div>
                    <div>AVENIDA DE LA DIPUTACIÓN, EDIFICIO INDITEX, 15143, ARTEIXO (A CORUÑA), SPAIN</div>
                </div>
            </div>
        </Container>
    )
}
const Container = styled.div`
    width:90%;
    margin:auto;
    display:flex;
    flex-direction:column;
    gap:3rem;
    font-size:11px;
    margin: 8rem auto 4rem auto;
    line-height:20px;
    .footer_display{
        display:flex;
        align-items:flex-start;
        gap: 5rem;
    }

    .english_cookies_setting{
        display:flex;
        gap:20px;
    }

    .footer_bottom{
        display:flex;
        justify-content:flex-start;
        font-size:9px;
    }

    .footer_rows{
        display:flex;
        flex-direction:column;
        gap:0.5rem;
    }
`

export default Footer