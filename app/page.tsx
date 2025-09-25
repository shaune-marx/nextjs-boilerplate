export default function Home() {
  return (
    <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:'32px'}}>
      <div style={{maxWidth:720}}>
        <h1 style={{fontSize:'40px',lineHeight:1.1,margin:'0 0 12px'}}>Playdate</h1>
        <p style={{fontSize:'20px',margin:'0 0 24px'}}>
          Get one good 1:1 conversation started every day. We pick a friend, send a fun prompt, and make it easy to say hello.
        </p>
        <a
          href="#"
          style={{
            display:'inline-block',
            padding:'12px 18px',
            borderRadius:10,
            textDecoration:'none',
            border:'1px solid #000',
            fontWeight:600
          }}
        >
          Get early access
        </a>
        <p style={{marginTop:12,fontSize:14,opacity:.7}}>
          Coming soon to todaysplaydate.com
        </p>
      </div>
    </main>
  );
}

