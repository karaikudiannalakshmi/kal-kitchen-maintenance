import { C, SL } from '../theme.js'
import { FREQ, FREQ_ORDER } from '../data.js'
import { daysUntil, fmtDate } from '../utils.js'

const FREQ_PASTEL = {
  D:{ label:'Daily',     color:'#065F46', bg:'#D1FAE5', border:'#6EE7B7' },
  W:{ label:'Weekly',    color:'#1E40AF', bg:'#DBEAFE', border:'#93C5FD' },
  M:{ label:'Monthly',   color:'#92400E', bg:'#FEF3C7', border:'#FCD34D' },
  Q:{ label:'Quarterly', color:'#5B21B6', bg:'#EDE9FE', border:'#C4B5FD' },
}

export function FBadge({fk}){
  const f=FREQ_PASTEL[fk]||FREQ_PASTEL.M
  return <span style={{background:f.bg,color:f.color,fontSize:11,fontWeight:700,padding:'2px 9px',borderRadius:20,whiteSpace:'nowrap',flexShrink:0,border:`1px solid ${f.border}`}}>{f.label}</span>
}
export function StatusChip({row}){
  const du=daysUntil(row.nextDue)
  if(!row.lastDone) return <span style={{fontSize:11,color:C.muted,whiteSpace:'nowrap',background:'#F5F5F4',padding:'2px 8px',borderRadius:20,border:`1px solid ${C.border}`}}>Not done</span>
  if(du===null) return null
  if(du<0)  return <span style={{fontSize:11,color:C.red,  fontWeight:700,whiteSpace:'nowrap',background:C.redDim,  padding:'2px 8px',borderRadius:20}}>⚠ {Math.abs(du)}d overdue</span>
  if(du<=3) return <span style={{fontSize:11,color:'#92400E',fontWeight:700,whiteSpace:'nowrap',background:'#FEF3C7',padding:'2px 8px',borderRadius:20}}>Due in {du}d</span>
  return           <span style={{fontSize:11,color:C.green, whiteSpace:'nowrap',background:C.greenDim,padding:'2px 8px',borderRadius:20}}>Next {fmtDate(row.nextDue)}</span>
}
export function Dot({row}){
  const du=daysUntil(row.nextDue)
  const col=!row.lastDone?C.muted:du<0?C.red:du<=3?C.accent:C.green
  return <span style={{width:8,height:8,borderRadius:'50%',background:col,display:'inline-block',flexShrink:0,boxShadow:`0 0 0 2px ${col}33`}}/>
}
export function Pill({label,active,onClick,ac,ab}){
  return <button onClick={onClick} style={{
    padding:'5px 13px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',
    border:`1px solid ${active?(ac||C.accent):C.border}`,
    background:active?(ab||C.accentDim):'white',
    color:active?(ac||C.accent):C.muted,
    transition:'all .15s',
  }}>{label}</button>
}
export function Field({label,children}){
  return <div style={{marginBottom:14}}><label style={{...SL,display:'block',marginBottom:5}}>{label}</label>{children}</div>
}
export function StatCard({label,value,sub,color}){
  return(
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'14px 16px',flex:'1 1 120px',minWidth:0,boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
      <div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</div>
      <div style={{fontSize:22,fontWeight:700,color:color||C.text,letterSpacing:'-.02em'}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>{sub}</div>}
    </div>
  )
}
export function FreqBar({selFreq,setSelFreq}){
  return(
    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
      <Pill label="All" active={selFreq==='all'} onClick={()=>setSelFreq('all')}/>
      {FREQ_ORDER.map(fk=>{
        const f=FREQ_PASTEL[fk]
        return <Pill key={fk} label={f.label} active={selFreq===fk} onClick={()=>setSelFreq(fk)} ac={f.color} ab={f.bg}/>
      })}
    </div>
  )
}
