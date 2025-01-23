const FooterLP = () => {
  return (
    <footer className=" p-5 text-center flex flex-col h-[80vh] justify-around  font-system-ui">
      <p className="mb-2.5 text-lg"> JOIN OUR NEWSLETTER </p>
      <nav>
        {['INSTAGRAM', 'FACEBOOK', 'X', 'PINTEREST', 'YOUTUBE', 'SPOTIFY'].map((platform) => (
          <a 
            key={platform}
            href={`https://www.${platform.toLowerCase() === 'x' ? 'twitter' : platform.toLowerCase()}.com/${platform === 'X' ? 'zara' : platform === 'YOUTUBE' ? 'user/ZARA' : 'zara'}`}
            className="mx-2.5 text-[#333] no-underline text-xs hover:underline"
          >
            {platform}
          </a>
        ))}
      </nav>
      <div className="flex justify-start text-left text-[9px] ml-7">
        <div>
          <div>NAME AND ADDRESS OF THE MANUFACTURER :</div>
          <div>INDUSTRIA DE DISEÑO TEXTIL, S.A. (INDITEX, S.A.)</div>
          <div>AVENIDA DE LA DIPUTACIÓN, EDIFICIO INDITEX, 15143, ARTEIXO (A CORUÑA), SPAIN</div>
        </div>
      </div>
    </footer>
  )
}

export default FooterLP