import styled from "styled-components"

const FooterLP = () => {
  return (
    <FooterContainer>
      <p> JOIN OUR NEWSLETTER </p>
      <nav>
        <a href="https://www.instagram.com/zara/">INSTAGRAM</a>
        <a href="https://www.facebook.com/Zara/">FACEBOOK</a>
        <a href="https://x.com/zara">X</a>
        <a href="https://www.pinterest.com/zaraofficial/">PINTEREST</a>
        <a href="https://www.youtube.com/user/ZARA">YOUTUBE</a>
        <a href="https://open.spotify.com/user/r6ivwuv0ebk346hhxo446pbfv">SPOTIFY</a>
      </nav>
      <div className='footer_bottom'>
        <div>
          <div>NAME AND ADDRESS OF THE MANUFACTURER :</div>
          <div>INDUSTRIA DE DISEÑO TEXTIL, S.A. (INDITEX, S.A.)</div>
          <div>AVENIDA DE LA DIPUTACIÓN, EDIFICIO INDITEX, 15143, ARTEIXO (A CORUÑA), SPAIN</div>
        </div>
      </div>
    </FooterContainer>
  )
}

const FooterContainer = styled.footer`
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 80vh;
  justify-content: space-around;
  font-weight: 200;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  
  p {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
  
  nav {
    a {
      margin: 0 10px;
      color: #333;
      text-decoration: none;
      font-size: 0.8rem;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .footer_bottom{
        display:flex;
        justify-content:flex-start;
        text-align:left;
        font-size:9px;
        margin-left: 30px;
    }
`

export default FooterLP

