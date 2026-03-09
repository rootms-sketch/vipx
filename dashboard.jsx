import { useState, useEffect, useMemo } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyydxwPwgkJVPOlUGIA1K1BpcUVyy-gQoOTBoQVzXoXGccouHkL28K9JQ0_YO4PSdXU/exec"; // ← วาง URL ที่ได้จาก Apps Script ตรงนี้

const RANKS=[
  {lv:0,name:"Elite Rookie",to:0},{lv:1,name:"Elite Rookie",to:0},{lv:2,name:"Elite Rookie",to:0},{lv:3,name:"Elite Rookie",to:0},
  {lv:4,name:"Silver Monarch",to:10000000},{lv:5,name:"Golden Baron",to:30000000},{lv:6,name:"Platinum Duke",to:50000000},
  {lv:7,name:"Diamond King",to:100000000},{lv:8,name:"Emerald Emperor",to:300000000},{lv:9,name:"Obsidian Legend",to:500000000},
  {lv:10,name:"Celestial Overlord",to:1000000000},{lv:11,name:"VIPX Sovereign",to:3000000000},{lv:12,name:"The Immortal",to:5000000000},
];
const RI={"Elite Rookie":"⚔️","Silver Monarch":"🛡️","Golden Baron":"👑","Platinum Duke":"💠","Diamond King":"💎","Emerald Emperor":"🏆","Obsidian Legend":"🔮","Celestial Overlord":"⭐","VIPX Sovereign":"🌟","The Immortal":"♾️"};
const GI={"PG Soft":"🎰","JILI":"🎲","Pragmatic Play":"⚡","Pragmatic Play Live":"⚡","Evolution Gaming":"🃏","AE Sexy":"♠️","Joker":"🃏","SA Gaming":"🎴","Dream Gaming":"🎭","WM Casino":"🏛️","NextSpin":"🔄","IAM Lotto":"🎟️","SBO Sportsbook":"⚽","FaChai Gaming":"🐟","Spade Gaming":"♠️","Allbet":"🎲","Yggdrasil Gaming":"🧊","SBO Sportsbook":"⚽"};


const P_STATIC=[];

const getRank=lv=>RANKS.find(r=>r.lv===lv)||RANKS[0];
const getNext=lv=>{const c=RANKS.findIndex(r=>r.lv===lv);return c<RANKS.length-1?RANKS[c+1]:null};
const fmtM=n=>{if(n==null)return"0";const a=Math.abs(n);return a>=1e9?`${(n/1e9).toFixed(2)}B`:a>=1e6?`${(n/1e6).toFixed(1)}M`:a>=1e3?`${(n/1e3).toFixed(0)}K`:n.toLocaleString("th-TH",{maximumFractionDigits:0})};
const fmt=n=>n==null?"0":Number(n).toLocaleString("th-TH",{maximumFractionDigits:0});

// VIPX Color Palette
const C={
  bg:"#0d0b1a",
  bg2:"#120e24",
  bg3:"#1a1230",
  card:"rgba(26,16,50,0.95)",
  card2:"rgba(35,20,65,0.97)",
  purple:"#8b2be2",
  purpleL:"#a855f7",
  purpleD:"#6d1fc0",
  pink:"#e91e8c",
  pinkL:"#f472b6",
  accent:"linear-gradient(135deg,#8b2be2,#e91e8c)",
  accentR:"linear-gradient(90deg,#8b2be2,#c026d3,#e91e8c)",
  border:"rgba(139,43,226,0.25)",
  borderG:"rgba(233,30,140,0.3)",
  text:"#f0e6ff",
  textD:"rgba(210,180,255,0.6)",
  gold:"#ffd700",
};

const Bar=({pct,h=8,color})=><div style={{width:"100%",height:h,borderRadius:h/2,background:"rgba(139,43,226,0.15)",overflow:"hidden"}}><div style={{width:`${Math.min(Math.max(pct,0),100)}%`,height:"100%",borderRadius:h/2,background:color||C.accentR,backgroundSize:"200% 100%",animation:"shimmer 3s ease infinite",transition:"width 1.2s ease"}}/></div>;

const Card=({children,style={},glow,pink})=><div style={{background:C.card,border:`1px solid ${glow?C.borderG:pink?"rgba(233,30,140,0.2)":C.border}`,borderRadius:18,padding:20,boxShadow:glow?`0 0 30px rgba(233,30,140,0.12),0 0 60px rgba(139,43,226,0.08),inset 0 1px 0 rgba(168,85,247,0.15)`:pink?`0 4px 24px rgba(233,30,140,0.08),inset 0 1px 0 rgba(233,30,140,0.08)`:`0 4px 24px rgba(0,0,0,0.4),inset 0 1px 0 rgba(139,43,226,0.08)`,...style}}>{children}</div>;

const Insight=({icon,text})=><div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,background:"linear-gradient(90deg,rgba(139,43,226,0.08),rgba(233,30,140,0.04))",border:`1px solid rgba(139,43,226,0.12)`}}><span style={{fontSize:20}}>{icon}</span><span style={{fontSize:12,color:C.textD,lineHeight:1.4}}>{text}</span></div>;

export default function App(){
  const [P,setP]=useState([]);
  const [loading,setLoading]=useState(true);
  const [fetchError,setFetchError]=useState(false);
  const [si,setSi]=useState(-1);
  const [tab,setTab]=useState("overview");
  const [vis,setVis]=useState(false);
  const [loginInput,setLoginInput]=useState("");
  const [loginError,setLoginError]=useState(false);

  useEffect(()=>{
    setTimeout(()=>setVis(true),100);
    fetch(API_URL)
      .then(r=>r.json())
      .then(res=>{
        if(res.ok){setP(res.data);setLoading(false);}
        else{setFetchError(true);setLoading(false);}
      })
      .catch(()=>{setFetchError(true);setLoading(false);});
  },[]);

  const handleLogin=()=>{
    const found=P.findIndex(x=>x.u===loginInput.trim());
    if(found>=0){setSi(found);setLoginError(false);}
    else{setLoginError(true);}
  };

  const p=si>=0?P[si]:P[0];
  const bn=p.bn||{rb:0,rl2:0,pt:0,j:0,rd:0,u:0};
  const dp=p.dp||{m:0,l:0};
  const rank=getRank(p.rl);
  const next=getNext(p.rl);
  const ri=RI[rank.name]||"⚔️";
  const ni=next?RI[next.name]||"🛡️":"✨";
  const pct=next?Math.min(((p.tt-rank.to)/(next.to-rank.to))*100,99.9):100;
  const remain=next?next.to-p.tt:0;

  // ผู้เล่นระดับเดียวกัน
  const sameRankPlayers=useMemo(()=>P.filter(x=>x.rl===p.rl).sort((a,b)=>b.tt-a.tt),[p]);
  const rankPos=sameRankPlayers.findIndex(x=>x.d===p.d)+1;
  const rankTotal=sameRankPlayers.length;
  const avgRankTT=p.at||Math.round(sameRankPlayers.reduce((s,x)=>s+x.tt,0)/rankTotal);
  const avgRankMT=p.am||Math.round(sameRankPlayers.filter(x=>x.mt>0).reduce((s,x)=>s+x.mt,0)/Math.max(sameRankPlayers.filter(x=>x.mt>0).length,1));

  // ระยะห่างจากคนข้างหน้า
  const playerAhead=si>0?P[si-1]:null;
  const gapAhead=playerAhead?playerAhead.tt-p.tt:0;
  // คนข้างหน้าในกลุ่ม rank เดียวกัน
  const sameRankAhead=rankPos>1?sameRankPlayers[rankPos-2]:null;
  const gapSameRank=sameRankAhead?sameRankAhead.tt-p.tt:0;

  const hData=useMemo(()=>{
    const arr=Array.from({length:24},(_,i)=>({h:i,v:0}));
    if(p.hd)p.hd.forEach(d=>{arr[d.h].v=d.v});return arr;
  },[p]);
  const maxH=Math.max(...hData.map(d=>d.v),1);
  const goldenH=hData.reduce((a,b)=>b.v>a.v?b:a,{h:0,v:0}).h;
  const games=p.gm||[];
  const topGame=games[0];
  const totalPlays=games.reduce((s,g)=>s+g.c,0);

  const insights=[];
  if(p.ws>=2)insights.push({icon:"🔥",text:`คุณกำลังมาแรง! ชนะติดต่อกัน ${p.ws} ครั้ง ลุยต่อเลย!`});
  if(p.wr>=40)insights.push({icon:"🎯",text:`Win Rate ${p.wr}% ถือว่าเก่งมาก! อยู่ในกลุ่ม Top Player`});
  if(topGame&&topGame.w>=40)insights.push({icon:"⭐",text:`คุณเล่น ${topGame.n} ได้ดีมาก (${topGame.w}% win rate) ลองเล่นต่อดู!`});
  if(p.mt>0&&p.mt>avgRankMT)insights.push({icon:"📈",text:`Turnover เดือนนี้ ฿${fmtM(p.mt)} สูงกว่าค่าเฉลี่ม rank เดียวกัน (฿${fmtM(avgRankMT)}) 🏆`});
  else if(p.mt>0)insights.push({icon:"📈",text:`เดือนนี้ Turnover ฿${fmtM(p.mt)} เยี่ยมไปเลย!`});
  if(next&&pct>=70)insights.push({icon:"🚀",text:`อีกแค่ ฿${fmtM(remain)} จะอัพเป็น ${next.name}! สู้ๆ!`});
  if(totalPlays>=1000)insights.push({icon:"🏅",text:`เล่นไปแล้ว ${fmt(totalPlays)} ครั้ง คุณคือนักเล่นตัวจริง!`});
  if(p.gh)insights.push({icon:"⏰",text:`Golden Hour ของคุณคือ ${p.gh} เข้าเล่นช่วงนี้ได้ผลดีที่สุด!`});
  if(dp.m>0&&dp.m>dp.l)insights.push({icon:"🔆",text:`เล่นเดือนนี้ ${dp.m} วัน มากกว่าเดือนที่แล้ว (${dp.l} วัน) ดีมาก!`});
  if(sameRankAhead&&gapSameRank>0&&gapSameRank<p.tt*0.2)insights.push({icon:"⚔️",text:`อีก ฿${fmtM(gapSameRank)} จะแซง ${sameRankAhead.d} ในกลุ่ม ${rank.name}!`});
  if(insights.length===0)insights.push({icon:"💪",text:"เริ่มเล่นเพื่อสะสม Turnover และอัพระดับของคุณ!"});


  const loadingScreen=(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0d0b1a 0%,#120e24 40%,#0f0c20 70%,#0d0b1a 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',Tahoma,sans-serif",opacity:vis?1:0,transition:"opacity 0.8s ease"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:32,fontWeight:900,letterSpacing:3,background:"linear-gradient(90deg,#a855f7,#ffffff,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Arial Black',sans-serif",marginBottom:20}}>VIPX</div>
        <div style={{width:40,height:40,border:"3px solid rgba(139,43,226,0.3)",borderTop:"3px solid #a855f7",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/>
        <div style={{fontSize:12,color:"rgba(210,180,255,0.5)"}}>กำลังโหลดข้อมูล...</div>
      </div>
    </div>
  );
  const errorScreen=(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0d0b1a 0%,#120e24 40%,#0f0c20 70%,#0d0b1a 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',Tahoma,sans-serif"}}>
      <div style={{textAlign:"center",padding:32}}>
        <div style={{fontSize:40,marginBottom:16}}>⚠️</div>
        <div style={{fontSize:15,color:"#f0e6ff",marginBottom:8}}>ไม่สามารถเชื่อมต่อได้</div>
        <div style={{fontSize:11,color:"rgba(210,180,255,0.5)",marginBottom:20}}>กรุณาตรวจสอบ API_URL หรือลองใหม่อีกครั้ง</div>
        <button onClick={()=>window.location.reload()} style={{padding:"10px 24px",borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#8b2be2,#e91e8c)",color:"#fff",fontSize:13,fontFamily:"inherit"}}>ลองใหม่</button>
      </div>
    </div>
  );
  if(loading) return loadingScreen;
  if(fetchError) return errorScreen;
  if(si===-1) return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0d0b1a 0%,#120e24 40%,#0f0c20 70%,#0d0b1a 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',Tahoma,sans-serif",opacity:vis?1:0,transition:"opacity 0.8s ease"}}>
      <div style={{position:"fixed",top:-120,left:"50%",transform:"translateX(-50%)",width:500,height:300,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(139,43,226,0.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:360,padding:"0 24px",textAlign:"center"}}>
        <div style={{fontSize:32,fontWeight:900,letterSpacing:3,background:"linear-gradient(90deg,#a855f7,#ffffff,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Arial Black',sans-serif",marginBottom:4}}>VIPX</div>
        <div style={{fontSize:10,color:"rgba(168,85,247,0.5)",letterSpacing:3,textTransform:"uppercase",marginBottom:40}}>PLAYER DASHBOARD</div>
        <div style={{background:"rgba(26,16,50,0.95)",border:"1px solid rgba(139,43,226,0.3)",borderRadius:20,padding:"32px 24px",boxShadow:"0 0 60px rgba(139,43,226,0.12),inset 0 1px 0 rgba(168,85,247,0.15)"}}>
          <div style={{fontSize:24,marginBottom:8}}>🔐</div>
          <div style={{fontSize:15,fontWeight:600,color:"#f0e6ff",marginBottom:4}}>เข้าสู่ Dashboard</div>
          <div style={{fontSize:11,color:"rgba(210,180,255,0.5)",marginBottom:24}}>กรอกเบอร์โทรศัพท์ที่สมัครไว้</div>
          <input value={loginInput} onChange={e=>{setLoginInput(e.target.value);setLoginError(false);}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="เบอร์โทรศัพท์ เช่น 0812345678" style={{width:"100%",padding:"12px 16px",borderRadius:12,border:`1px solid ${loginError?"rgba(248,113,113,0.6)":"rgba(139,43,226,0.35)"}`,background:"rgba(139,43,226,0.08)",color:"#f0e6ff",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",textAlign:"center",letterSpacing:1}}/>
          {loginError&&<div style={{fontSize:11,color:"#f87171",marginTop:10}}>❌ ไม่พบเบอร์นี้ในระบบ กรุณาตรวจสอบอีกครั้ง</div>}
          <button onClick={handleLogin} style={{marginTop:16,width:"100%",padding:"13px",borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#8b2be2,#c026d3,#e91e8c)",color:"#fff",fontSize:14,fontWeight:700,letterSpacing:1,fontFamily:"inherit",boxShadow:"0 4px 24px rgba(139,43,226,0.35)"}}>ดูข้อมูลของฉัน →</button>
        </div>
        <div style={{marginTop:20,fontSize:10,color:"rgba(168,85,247,0.3)"}}>ข้อมูลของคุณปลอดภัยและเป็นส่วนตัว</div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0d0b1a 0%,#120e24 40%,#0f0c20 70%,#0d0b1a 100%)",color:"#f0e6ff",fontFamily:"'Segoe UI',Tahoma,sans-serif",opacity:vis?1:0,transition:"opacity 0.8s ease",position:"relative",overflow:"hidden"}}>
      <style>{`@keyframes shimmer{0%,100%{background-position:200% 0}50%{background-position:-200% 0}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes pulseglow{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes spin{to{transform:rotate(360deg)}}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#8b2be2;border-radius:4px}`}</style>
      <div style={{position:"fixed",top:-120,left:"50%",transform:"translateX(-50%)",width:600,height:350,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(139,43,226,0.14) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-80,right:-80,width:350,height:350,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(233,30,140,0.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"40%",left:-80,width:250,height:250,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(168,85,247,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {/* Badge อันดับ */}
      <div style={{padding:"10px 16px 0",maxWidth:560,margin:"0 auto",display:"flex",justifyContent:"flex-end"}}>
        <div style={{fontSize:10,color:"rgba(233,30,140,0.8)",background:"rgba(233,30,140,0.07)",border:"1px solid rgba(233,30,140,0.2)",padding:"3px 10px",borderRadius:20,letterSpacing:1}}>
          👑 Rank Lv.{p.rl} · #{si+1} / {P.length}
        </div>
      </div>

      {/* VIPX Header Bar */}
      <div style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid rgba(139,43,226,0.15)",background:"rgba(13,11,26,0.8)",backdropFilter:"blur(10px)",position:"relative",zIndex:10}}>
        <div style={{fontSize:20,fontWeight:900,letterSpacing:2,background:"linear-gradient(90deg,#a855f7,#ffffff,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Arial Black',sans-serif"}}>VIP<span style={{background:"linear-gradient(90deg,#e91e8c,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>X</span></div>
        <div style={{position:"absolute",right:16,fontSize:10,color:"rgba(168,85,247,0.5)",letterSpacing:1}}>PLAYER DASHBOARD</div>
      </div>

      {/* Header */}
      <div style={{padding:"20px 20px 0",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,43,226,0.08) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{fontSize:48,animation:"float 3s ease infinite",marginBottom:6}}>{ri}</div>
        <div style={{fontSize:10,letterSpacing:3,background:"linear-gradient(90deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>✦ {rank.name} ✦</div>
        <div style={{fontSize:26,fontWeight:700,color:"#f0e6ff",fontFamily:"Georgia,serif",marginBottom:14,textShadow:"0 0 20px rgba(168,85,247,0.4)"}}>{p.d}</div>

        {next&&<div style={{maxWidth:320,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:10,color:"rgba(168,85,247,0.7)"}}>{ri} {rank.name}</span>
            <span style={{fontSize:10,color:"rgba(168,85,247,0.7)"}}>{ni} {next.name}</span>
          </div>
          <Bar pct={pct} h={10}/>
          <div style={{textAlign:"center",marginTop:8,fontSize:11,color:"rgba(210,180,255,0.5)"}}>
            อีก <span style={{color:"#a855f7",fontWeight:600}}>฿{fmtM(remain)}</span> จะอัพระดับ
          </div>
        </div>}
        {!next&&<div style={{fontSize:12,color:"rgba(210,180,255,0.5)",marginTop:4}}>🏆 ระดับสูงสุดแล้ว!</div>}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",justifyContent:"center",gap:6,padding:"20px 12px 12px",flexWrap:"wrap"}}>
        {[{id:"overview",l:"✨ ภาพรวม"},{id:"golden",l:"⏰ เวลาทอง"},{id:"games",l:"🎮 เกมเด่น"},{id:"bonus",l:"🎁 โบนัส"},{id:"stats",l:"📊 สถิติ"},{id:"mission",l:"🎯 ภารกิจ"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 14px",borderRadius:22,border:`1px solid ${tab===t.id?"rgba(233,30,140,0.6)":"rgba(139,43,226,0.2)"}`,background:tab===t.id?"linear-gradient(135deg,rgba(139,43,226,0.35),rgba(233,30,140,0.2))":"rgba(139,43,226,0.04)",color:tab===t.id?"#f0e6ff":"rgba(210,180,255,0.4)",fontSize:11,cursor:"pointer",fontFamily:"inherit",transition:"all 0.3s",boxShadow:tab===t.id?"0 0 15px rgba(233,30,140,0.2)":"none"}}>{t.l}</button>
        ))}
      </div>

      <div style={{padding:"0 14px 32px",maxWidth:560,margin:"0 auto"}}>

        {tab==="overview"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card glow>
            <div style={{fontSize:10,color:"rgba(233,30,140,0.8)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>💡 Insight สำหรับคุณ</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {insights.map((ins,i)=><Insight key={i} icon={ins.icon} text={ins.text}/>)}
            </div>
          </Card>

          <Card>
            <div style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:22,marginBottom:4}}>🎰</div>
                <div style={{fontSize:9,color:"rgba(168,85,247,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Turnover สะสม</div>
                <div style={{fontSize:18,fontWeight:700,background:"linear-gradient(90deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"Georgia,serif"}}>฿{fmtM(p.tt)}</div>
              </div>
              {p.ws>0&&<div style={{flex:1}}>
                <div style={{fontSize:22,marginBottom:4}}>🔥</div>
                <div style={{fontSize:9,color:"rgba(168,85,247,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Win Streak</div>
                <div style={{fontSize:18,fontWeight:700,color:"#4ade80",fontFamily:"Georgia,serif"}}>{p.ws} ครั้ง</div>
              </div>}
              {p.wr>0&&<div style={{flex:1}}>
                <div style={{fontSize:22,marginBottom:4}}>🎯</div>
                <div style={{fontSize:9,color:"rgba(168,85,247,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Win Rate</div>
                <div style={{fontSize:18,fontWeight:700,color:p.wr>=40?"#4ade80":"#a855f7",fontFamily:"Georgia,serif"}}>{p.wr}%</div>
              </div>}
            </div>
          </Card>

          {p.hd&&p.hd.length>0&&<Card>
            <div style={{fontSize:10,color:"rgba(168,85,247,0.8)",letterSpacing:1,marginBottom:12,textTransform:"uppercase"}}>📊 ช่วงเวลาที่คุณเล่นบ่อย</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:1,height:80}}>
              {hData.map((d,i)=>{const hp=(d.v/maxH)*100;const isT=i===goldenH&&d.v>0;return(
                <div key={i} style={{flex:1,textAlign:"center",position:"relative"}}>
                  {isT&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",fontSize:8}}>⭐</div>}
                  <div style={{height:`${hp}%`,minHeight:d.v>0?2:1,borderRadius:"3px 3px 0 0",background:isT?"linear-gradient(180deg,#e91e8c,#8b2be2)":d.v>0?"linear-gradient(180deg,rgba(168,85,247,0.4),rgba(139,43,226,0.1))":"rgba(139,43,226,0.04)",boxShadow:isT?"0 0 10px rgba(233,30,140,0.5)":"none",transition:"height 1s ease"}}/>
                  {i%6===0&&<div style={{fontSize:6,color:"rgba(168,85,247,0.3)",marginTop:2}}>{String(i).padStart(2,"0")}</div>}
                </div>
              )})}
            </div>
          </Card>}

          {topGame&&<Card style={{cursor:"pointer",background:"linear-gradient(135deg,rgba(26,16,50,0.97),rgba(35,20,65,0.97))"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:52,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,rgba(139,43,226,0.2),rgba(233,30,140,0.1))",border:"1px solid rgba(139,43,226,0.25)",fontSize:26}}>{GI[topGame.p]||"🎰"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:9,color:"rgba(233,30,140,0.8)",textTransform:"uppercase",letterSpacing:1}}>เกมแนะนำสำหรับคุณ</div>
                <div style={{fontSize:16,fontWeight:700,color:"#f0e6ff",marginTop:2}}>{topGame.n}</div>
                <div style={{fontSize:10,color:"rgba(210,180,255,0.4)",marginTop:2}}>Win Rate {topGame.w}% · เล่นแล้ว {fmt(topGame.c)} ครั้ง</div>
              </div>
              <div style={{fontSize:24,color:"rgba(168,85,247,0.4)"}}>›</div>
            </div>
          </Card>}

          {/* ระยะห่างจากคนข้างหน้า */}
          {sameRankAhead&&<Card style={{background:"linear-gradient(135deg,rgba(30,12,55,0.97),rgba(50,15,40,0.97))"}}>
            <div style={{fontSize:10,color:"rgba(233,30,140,0.8)",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>⚔️ ระยะห่างจากคนข้างหน้า</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{flex:1,textAlign:"center"}}>
                <div style={{fontSize:22,marginBottom:2}}>{ri}</div>
                <div style={{fontSize:11,fontWeight:700,color:"#f0e6ff"}}>{p.d}</div>
                <div style={{fontSize:9,color:"rgba(210,180,255,0.4)",marginTop:2}}>คุณ (อันดับ {rankPos})</div>
              </div>
              <div style={{flex:2,textAlign:"center",padding:"0 4px"}}>
                <div style={{fontSize:9,color:"rgba(210,180,255,0.5)",marginBottom:4}}>ต้องเพิ่มอีก</div>
                <div style={{fontSize:20,fontWeight:800,background:"linear-gradient(90deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>฿{fmtM(gapSameRank)}</div>
                <div style={{marginTop:6}}><Bar pct={Math.min((p.tt/sameRankAhead.tt)*100,99)} h={6}/></div>
                <div style={{fontSize:8,color:"rgba(210,180,255,0.3)",marginTop:3}}>{((p.tt/sameRankAhead.tt)*100).toFixed(1)}% ของคนข้างหน้า</div>
              </div>
              <div style={{flex:1,textAlign:"center"}}>
                <div style={{fontSize:22,marginBottom:2}}>{RI[getRank(sameRankAhead.rl).name]||"⚔️"}</div>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(233,30,140,0.9)"}}>{sameRankAhead.d}</div>
                <div style={{fontSize:9,color:"rgba(210,180,255,0.4)",marginTop:2}}>อันดับ {rankPos-1}</div>
              </div>
            </div>
          </Card>}
        </div>}

        {tab==="golden"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card glow>
            <div style={{textAlign:"center",padding:"10px 0"}}>
              <div style={{fontSize:50,animation:"float 3s ease infinite"}}>⏰</div>
              <div style={{fontSize:10,background:"linear-gradient(90deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2,textTransform:"uppercase",marginTop:8,marginBottom:6,fontWeight:600}}>เวลาทองของคุณ</div>
              {p.hd&&p.hd.length>0?<>
                <div style={{fontSize:32,fontWeight:700,color:"#f0e6ff",fontFamily:"Georgia,serif",textShadow:"0 0 20px rgba(168,85,247,0.5)"}}>{p.gh||`${String(goldenH).padStart(2,"0")}:00 - ${String((goldenH+1)%24).padStart(2,"0")}:00`}</div>
                <div style={{fontSize:12,color:"rgba(210,180,255,0.55)",marginTop:6}}>ช่วงเวลาที่คุณเล่นได้ดีที่สุด!</div>
                <div style={{marginTop:16,padding:"10px 20px",borderRadius:20,display:"inline-block",background:"linear-gradient(90deg,rgba(139,43,226,0.1),rgba(233,30,140,0.06))",border:"1px solid rgba(139,43,226,0.2)"}}>
                  <span style={{fontSize:11,color:"rgba(210,180,255,0.7)"}}>💡 เข้าเล่นช่วง <span style={{color:"#a855f7",fontWeight:600}}>{p.gh||`${String(goldenH).padStart(2,"0")}:00`}</span> เพื่อผลลัพธ์ที่ดีที่สุด</span>
                </div>
              </>:<div style={{fontSize:14,color:"rgba(210,180,255,0.4)",marginTop:12}}>เล่นเพิ่มเพื่อค้นหาเวลาทองของคุณ!</div>}
            </div>
          </Card>
          {p.hd&&p.hd.length>0&&<Card>
            <div style={{fontSize:10,color:"rgba(168,85,247,0.8)",letterSpacing:1,marginBottom:14,textTransform:"uppercase"}}>กิจกรรมตลอด 24 ชั่วโมง</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:1,height:120}}>
              {hData.map((d,i)=>{const hp=(d.v/maxH)*100;const isG=i===goldenH&&d.v>0;return(
                <div key={i} style={{flex:1,textAlign:"center",position:"relative"}}>
                  {isG&&<div style={{position:"absolute",top:-15,left:"50%",transform:"translateX(-50%)",fontSize:10}}>⭐</div>}
                  <div style={{height:`${hp}%`,minHeight:d.v>0?2:1,borderRadius:"3px 3px 0 0",background:isG?"linear-gradient(180deg,#e91e8c,#8b2be2)":d.v>0?"linear-gradient(180deg,rgba(168,85,247,0.35),rgba(139,43,226,0.08))":"rgba(139,43,226,0.03)",boxShadow:isG?"0 0 12px rgba(233,30,140,0.5)":"none",transition:"height 1s ease"}}/>
                  {i%3===0&&<div style={{fontSize:6,color:isG?"#a855f7":"rgba(168,85,247,0.25)",marginTop:2}}>{String(i).padStart(2,"0")}</div>}
                </div>
              )})}
            </div>
          </Card>}
          {p.rs&&<Insight icon="⏱️" text={`เซสชั่นที่แนะนำ: ${p.rs} ต่อรอบ เล่นพอดีจะได้ผลดี!`}/>}
        </div>}

        {tab==="games"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
          {games.length===0?<Card><div style={{textAlign:"center",color:"rgba(210,180,255,0.4)",fontSize:13,padding:24}}>🎮 เริ่มเล่นเพื่อดูเกมที่เหมาะกับคุณ!</div></Card>
          :games.map((g,i)=><Card key={i} style={{cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:50,height:50,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,rgba(139,43,226,0.18),rgba(233,30,140,0.08))",border:"1px solid rgba(139,43,226,0.2)",fontSize:24,position:"relative"}}>
                {GI[g.p]||"🎰"}
                {i===0&&<div style={{position:"absolute",top:-6,right:-6,fontSize:12,background:"rgba(18,12,35,0.95)",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(233,30,140,0.4)"}}>🏆</div>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:"#f0e6ff"}}>{g.n}</div>
                <div style={{fontSize:10,color:"rgba(210,180,255,0.35)",marginTop:2}}>{g.p}</div>
                <div style={{marginTop:6,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1}}><Bar pct={g.w} h={5}/></div>
                  <span style={{fontSize:11,color:g.w>=40?"#4ade80":"#a855f7",fontWeight:600,minWidth:36}}>Win {g.w}%</span>
                </div>
                <div style={{fontSize:9,color:"rgba(210,180,255,0.3)",marginTop:4}}>เล่นแล้ว {fmt(g.c)} ครั้ง</div>
              </div>
              <div style={{fontSize:22,color:"rgba(168,85,247,0.3)"}}>›</div>
            </div>
          </Card>)}
          {games.length>0&&<Insight icon="💡" text="เล่นเกมที่ Win Rate สูงของคุณจะมีโอกาสได้ผลลัพธ์ดี!"/>}
        </div>}

        {/* ===== BONUS TAB ===== */}
        {tab==="bonus"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card glow>
            <div style={{fontSize:10,background:"linear-gradient(90deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14,fontWeight:600}}>🎁 โบนัสที่ได้รับเดือนนี้</div>
            {p.tb===0?<div style={{textAlign:"center",color:"rgba(210,180,255,0.4)",fontSize:13,padding:12}}>ยังไม่มีโบนัสเดือนนี้</div>:<>
              <div style={{textAlign:"center",marginBottom:16}}>
                <div style={{fontSize:10,color:"rgba(210,180,255,0.5)",marginBottom:4}}>รวมโบนัสทั้งหมด</div>
                <div style={{fontSize:28,fontWeight:800,background:"linear-gradient(90deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>฿{fmt(p.tb)}</div>
              </div>
              {[
                {label:"💸 Rebate คืนยอดเล่น",val:bn.rb,color:"linear-gradient(90deg,#a855f7,#c026d3)"},
                {label:"🔄 Reload โบนัสฝาก",val:bn.rl2,color:"linear-gradient(90deg,#e91e8c,#f472b6)"},
                {label:"⭐ Prime Time",val:bn.pt,color:"linear-gradient(90deg,#8b5cf6,#a855f7)"},
                {label:"🎯 Join Mission",val:bn.j,color:"linear-gradient(90deg,#6d28d9,#8b2be2)"},
                {label:"🎟️ Redeem",val:bn.rd,color:"linear-gradient(90deg,#db2777,#e91e8c)"},
                {label:"🔓 Unlock Level",val:bn.u,color:"linear-gradient(90deg,#7c3aed,#a78bfa)"},
              ].filter(b=>b.val>0).map((b,i)=>{
                const bpct=p.tb>0?Math.round((b.val/p.tb)*100):0;
                return(<div key={i} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:11,color:"rgba(210,180,255,0.7)"}}>{b.label}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:10,color:"rgba(210,180,255,0.4)"}}>{bpct}%</span>
                      <span style={{fontSize:12,fontWeight:600,color:"#f0e6ff"}}>฿{fmt(b.val)}</span>
                    </div>
                  </div>
                  <Bar pct={bpct} h={6} color={b.color}/>
                </div>);
              })}
            </>}
          </Card>
          <Card>
            <div style={{fontSize:10,color:"rgba(168,85,247,0.8)",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>📅 วันที่เล่น เดือนนี้ vs เดือนที่แล้ว</div>
            <div style={{display:"flex",gap:16,position:"relative"}}>
              {[{label:"เดือนนี้",val:dp.m,isThis:true},{label:"เดือนที่แล้ว",val:dp.l,isThis:false}].map((d,i)=>{
                const maxD=Math.max(dp.m,dp.l,1);
                const barH=Math.max(Math.round((d.val/maxD)*90),4);
                return(<div key={i} style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:d.isThis?"#f0e6ff":"rgba(210,180,255,0.45)",marginBottom:8}}>{d.val}<span style={{fontSize:11,fontWeight:400}}> วัน</span></div>
                  <div style={{height:90,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
                    <div style={{width:"55%",height:barH,borderRadius:"8px 8px 0 0",background:d.isThis?"linear-gradient(180deg,#e91e8c,#8b2be2)":"linear-gradient(180deg,rgba(139,43,226,0.35),rgba(139,43,226,0.1))",boxShadow:d.isThis?"0 0 15px rgba(233,30,140,0.3)":"none",transition:"height 1s ease"}}/>
                  </div>
                  <div style={{fontSize:10,color:d.isThis?"rgba(233,30,140,0.8)":"rgba(210,180,255,0.4)",borderTop:"1px solid rgba(139,43,226,0.12)",paddingTop:6,marginTop:4}}>{d.label}</div>
                </div>);
              })}
              <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",textAlign:"center"}}>
                {dp.m>dp.l&&<div style={{fontSize:10,color:"#4ade80",background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.2)",padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap"}}>↑ +{dp.m-dp.l} วัน</div>}
                {dp.m<dp.l&&<div style={{fontSize:10,color:"#f87171",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap"}}>↓ -{dp.l-dp.m} วัน</div>}
                {dp.m===dp.l&&dp.m>0&&<div style={{fontSize:10,color:"rgba(210,180,255,0.5)",background:"rgba(139,43,226,0.08)",border:"1px solid rgba(139,43,226,0.15)",padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap"}}>= เท่ากัน</div>}
              </div>
            </div>
          </Card>
        </div>}

        {/* ===== STATS TAB ===== */}
        {tab==="stats"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card glow>
            <div style={{fontSize:10,background:"linear-gradient(90deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14,fontWeight:600}}>🏆 อันดับในกลุ่ม {rank.name}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14}}>
              <div style={{fontSize:52,fontWeight:900,background:"linear-gradient(135deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>#{rankPos}</div>
              <div style={{fontSize:14,color:"rgba(210,180,255,0.5)"}}>/ {rankTotal} คน</div>
            </div>
            <Bar pct={Math.round(((rankTotal-rankPos)/Math.max(rankTotal-1,1))*100)} h={10}/>
            <div style={{textAlign:"center",fontSize:10,color:"rgba(210,180,255,0.5)",marginTop:8}}>
              {rankPos===1?"🥇 อันดับ 1 ในกลุ่ม!":rankPos<=3?`🥈 Top 3 จาก ${rankTotal} คน`:`Top ${Math.round((rankPos/rankTotal)*100)}% ของกลุ่ม`}
            </div>
            <div style={{marginTop:14,borderTop:"1px solid rgba(139,43,226,0.12)",paddingTop:12}}>
              <div style={{fontSize:9,color:"rgba(168,85,247,0.6)",marginBottom:8,letterSpacing:1}}>TOP 3 ในกลุ่ม</div>
              {sameRankPlayers.slice(0,3).map((pl,i)=>{
                const isMe=pl.d===p.d;
                const medal=["🥇","🥈","🥉"][i];
                return(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:10,marginBottom:4,background:isMe?"rgba(233,30,140,0.1)":"rgba(139,43,226,0.04)",border:`1px solid ${isMe?"rgba(233,30,140,0.25)":"rgba(139,43,226,0.08)"}`}}>
                  <span style={{fontSize:16}}>{medal}</span>
                  <div style={{flex:1}}><div style={{fontSize:12,color:isMe?"#f0e6ff":"rgba(210,180,255,0.65)",fontWeight:isMe?700:400}}>{pl.d}{isMe?" (คุณ)":""}</div></div>
                  <div style={{fontSize:11,color:isMe?"#a855f7":"rgba(210,180,255,0.45)",fontWeight:600}}>฿{fmtM(pl.tt)}</div>
                </div>);
              })}
              {rankPos>3&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:10,background:"rgba(233,30,140,0.08)",border:"1px solid rgba(233,30,140,0.2)"}}>
                <span style={{fontSize:16}}>#{rankPos}</span>
                <div style={{flex:1}}><div style={{fontSize:12,color:"#f0e6ff",fontWeight:700}}>{p.d} (คุณ)</div></div>
                <div style={{fontSize:11,color:"#a855f7",fontWeight:600}}>฿{fmtM(p.tt)}</div>
              </div>}
            </div>
          </Card>

          <Card>
            <div style={{fontSize:10,color:"rgba(168,85,247,0.8)",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>📊 เทียบกับค่าเฉลี่ยกลุ่ม {rank.name}</div>
            {[
              {label:"Total Turnover",you:p.tt,avg:avgRankTT},
              {label:"Monthly Turnover",you:p.mt,avg:avgRankMT},
            ].map((row,i)=>{
              const maxV=Math.max(row.you,row.avg,1);
              const diff=row.you-row.avg;
              return(<div key={i} style={{marginBottom:i<1?16:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:11,color:"rgba(210,180,255,0.6)"}}>{row.label}</span>
                  <span style={{fontSize:10,color:diff>=0?"#4ade80":"#f87171",fontWeight:600}}>{diff>=0?"▲":"▼"} ฿{fmtM(Math.abs(diff))}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:9,color:"rgba(233,30,140,0.7)"}}>คุณ</span>
                      <span style={{fontSize:9,color:"rgba(210,180,255,0.5)"}}>฿{fmtM(row.you)}</span>
                    </div>
                    <Bar pct={(row.you/maxV)*100} h={7} color="linear-gradient(90deg,#e91e8c,#a855f7)"/>
                  </div>
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:9,color:"rgba(139,43,226,0.7)"}}>ค่าเฉลี่ยกลุ่ม</span>
                      <span style={{fontSize:9,color:"rgba(210,180,255,0.5)"}}>฿{fmtM(row.avg)}</span>
                    </div>
                    <Bar pct={(row.avg/maxV)*100} h={7} color="linear-gradient(90deg,rgba(139,43,226,0.5),rgba(168,85,247,0.3))"/>
                  </div>
                </div>
              </div>);
            })}
          </Card>

          {sameRankAhead&&<Card style={{background:"linear-gradient(135deg,rgba(30,12,55,0.97),rgba(50,15,40,0.97))"}}>
            <div style={{fontSize:10,color:"rgba(233,30,140,0.8)",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>⚔️ ช่องว่างจากอันดับ {rankPos-1} ในกลุ่ม</div>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
              <div style={{width:46,height:46,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,background:"rgba(233,30,140,0.1)",border:"1px solid rgba(233,30,140,0.2)"}}>{RI[getRank(sameRankAhead.rl).name]||"⚔️"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:"rgba(233,30,140,0.9)"}}>{sameRankAhead.d}</div>
                <div style={{fontSize:11,color:"rgba(210,180,255,0.4)"}}>฿{fmtM(sameRankAhead.tt)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:9,color:"rgba(210,180,255,0.5)"}}>ต้องเพิ่มอีก</div>
                <div style={{fontSize:20,fontWeight:800,background:"linear-gradient(90deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>฿{fmtM(gapSameRank)}</div>
              </div>
            </div>
            <Bar pct={Math.min((p.tt/sameRankAhead.tt)*100,99)} h={8}/>
            <div style={{fontSize:10,color:"rgba(210,180,255,0.4)",textAlign:"center",marginTop:8}}>คุณอยู่ที่ {((p.tt/sameRankAhead.tt)*100).toFixed(1)}% ของ {sameRankAhead.d}</div>
          </Card>}
        </div>}

        {tab==="mission"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {icon:"🎰",name:"เล่นสะสม Turnover 1M",done:p.tt>=1e6,pct:Math.min((p.tt/1e6)*100,100),target:1e6},
            {icon:"💎",name:"เล่นสะสม Turnover 10M",done:p.tt>=1e7,pct:Math.min((p.tt/1e7)*100,100),target:1e7},
            {icon:"🏆",name:"เล่นสะสม Turnover 50M",done:p.tt>=5e7,pct:Math.min((p.tt/5e7)*100,100),target:5e7},
            {icon:"👑",name:"เล่นสะสม Turnover 100M",done:p.tt>=1e8,pct:Math.min((p.tt/1e8)*100,100),target:1e8},
            {icon:"🌟",name:"เล่นสะสม Turnover 300M",done:p.tt>=3e8,pct:Math.min((p.tt/3e8)*100,100),target:3e8},
            {icon:"♾️",name:"เล่นสะสม Turnover 1B",done:p.tt>=1e9,pct:Math.min((p.tt/1e9)*100,100),target:1e9},
          ].map((m,i)=><Card key={i} style={{opacity:m.done?1:m.pct>0?0.85:0.4}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:m.done?"linear-gradient(135deg,rgba(74,222,128,0.15),rgba(74,222,128,0.04))":"linear-gradient(135deg,rgba(139,43,226,0.12),rgba(139,43,226,0.04))",border:`1px solid ${m.done?"rgba(74,222,128,0.3)":"rgba(139,43,226,0.2)"}`,fontSize:20}}>{m.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,fontWeight:600,color:m.done?"#4ade80":"#f0e6ff"}}>{m.name}</span>
                  <span style={{fontSize:10,color:m.done?"#4ade80":"rgba(168,85,247,0.65)"}}>{m.done?"✓ สำเร็จ":`${m.pct.toFixed(1)}%`}</span>
                </div>
                <div style={{marginTop:6}}><Bar pct={m.pct} h={5} color={m.done?"linear-gradient(90deg,#22c55e,#4ade80)":undefined}/></div>
                {!m.done&&m.pct>0&&<div style={{fontSize:9,color:"rgba(210,180,255,0.3)",marginTop:4}}>อีก ฿{fmtM(m.target-p.tt)}</div>}
              </div>
            </div>
          </Card>)}

          {next&&<Card glow style={{marginTop:4}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:10,background:"linear-gradient(90deg,#a855f7,#e91e8c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,fontWeight:600}}>🎖️ ภารกิจอัพระดับ</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:12}}>
                <div style={{textAlign:"center"}}><div style={{fontSize:28}}>{ri}</div><div style={{fontSize:10,color:"rgba(210,180,255,0.5)",marginTop:2}}>{rank.name}</div></div>
                <div style={{fontSize:20,color:"rgba(168,85,247,0.35)"}}>→</div>
                <div style={{textAlign:"center"}}><div style={{fontSize:28}}>{ni}</div><div style={{fontSize:10,color:"rgba(210,180,255,0.5)",marginTop:2}}>{next.name}</div></div>
              </div>
              <Bar pct={pct} h={8}/>
              <div style={{fontSize:11,color:"rgba(210,180,255,0.5)",marginTop:8}}>
                ฿{fmtM(p.tt)} / ฿{fmtM(next.to)} <span style={{color:"#a855f7"}}>({pct.toFixed(1)}%)</span>
              </div>
            </div>
          </Card>}
        </div>}

        <div style={{textAlign:"center",marginTop:24,paddingBottom:8}}>
          <button style={{padding:"13px 44px",borderRadius:30,border:"none",cursor:"pointer",background:"linear-gradient(90deg,#8b2be2,#c026d3,#e91e8c,#c026d3,#8b2be2)",backgroundSize:"200% 100%",animation:"shimmer 3s ease infinite",color:"#fff",fontSize:14,fontWeight:700,letterSpacing:1,boxShadow:"0 4px 30px rgba(139,43,226,0.4),0 0 60px rgba(233,30,140,0.15)",fontFamily:"inherit"}}>🎰 เข้าเล่นเลย</button>
        </div>
      </div>
    </div>
  );
}
