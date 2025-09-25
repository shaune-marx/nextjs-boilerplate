export default function Home() {
  return (
    <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:'32px'}}>
      <div style={{maxWidth:720}}>
        <h1 style={{fontSize:'40px',lineHeight:1.1,margin:'0 0 12px'}}>playdate</h1>
        <p style={{fontSize:'20px',margin:'0 0 24px'}}>
          want to keep your friends in your orbit? we'll send you an invitation to play every day with a fun question addressed to a friend you want to talk to more often ✨ 
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
          sign up
        </a>
        <p style={{marginTop:12,fontSize:14,opacity:.7}}>
          Coming soon to todaysplaydate.com
        </p>
      </div>
    </main>
  );
}

