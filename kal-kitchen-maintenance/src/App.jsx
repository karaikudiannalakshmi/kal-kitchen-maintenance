import { useState, useEffect, useRef } from 'react'
import { INIT_EQ, INIT_REPAIRS, DEFAULT_TASKS, FREQ } from './data.js'
import { C } from './theme.js'
import { uid, addDays, todayStr } from './utils.js'
import { COLS, fsSet, fsUpdate, fsDel, fsBatchSet, fsBatchDel, fsSubscribe } from './firebase.js'
import DashboardTab from './tabs/DashboardTab.jsx'
import ScheduleTab  from './tabs/ScheduleTab.jsx'
import TodayTab     from './tabs/TodayTab.jsx'
import RepairsTab   from './tabs/RepairsTab.jsx'
import EquipmentTab from './tabs/EquipmentTab.jsx'
import HistoryTab   from './tabs/HistoryTab.jsx'

function buildSchedForEq(eq) {
  return (DEFAULT_TASKS[eq.catId]||[]).map(t=>({
    id:uid(), eqId:eq.id, taskId:t.id,
    task:t.task, freq:t.freq,
    lastDone:null, nextDue:null, enabled:true,
  }))
}

const TABS = [
  {id:'dashboard',label:'Dashboard',  icon:'📊'},
  {id:'schedule', label:'PM Schedule',icon:'📋'},
  {id:'today',    label:'Today',      icon:'✅'},
  {id:'repairs',  label:'Repairs',    icon:'🛠'},
  {id:'equipment',label:'Equipment',  icon:'🔧'},
  {id:'history',  label:'History',    icon:'🕐'},
]

export default function App() {
  const [tab,    setTab]    = useState('dashboard')
  const [eq,     setEq]     = useState([])
  const [sched,  setSched]  = useState([])
  const [repairs,setRepairs]= useState([])
  const [status, setStatus] = useState('connecting') // connecting | seeding | ready
  const seeded = useRef(false)

  useEffect(() => {
    // Wait for all 3 collections to respond, then decide
    let counts = { eq: null, sched: null, repairs: null }

    function checkReady() {
      if (counts.eq === null || counts.sched === null || counts.repairs === null) return
      // All 3 have responded
      if (counts.eq === 0 && !seeded.current) {
        // Firestore is empty — seed it
        seeded.current = true
        setStatus('seeding')
        const initSched = INIT_EQ.flatMap(buildSchedForEq)
        Promise.all([
          fsBatchSet(COLS.equipment, INIT_EQ),
          fsBatchSet(COLS.schedule,  initSched),
          fsBatchSet(COLS.repairs,   INIT_REPAIRS),
        ]).then(() => {
          console.log('Seed complete')
          setStatus('ready')
        }).catch(err => {
          console.error('Seed failed:', err)
          setStatus('ready')
        })
      } else {
        setStatus('ready')
      }
    }

    const u1 = fsSubscribe(COLS.equipment, d => {
      setEq(d)
      counts.eq = d.length
      checkReady()
    })
    const u2 = fsSubscribe(COLS.schedule, d => {
      setSched(d)
      counts.sched = d.length
      checkReady()
    })
    const u3 = fsSubscribe(COLS.repairs, d => {
      setRepairs(d)
      counts.repairs = d.length
      checkReady()
    })

    return () => { u1(); u2(); u3() }
  }, [])

  // Equipment CRUD
  async function saveEq(data) {
    if (data.id) {
      await fsSet(COLS.equipment, data.id, data)
    } else {
      const n = {...data, id:uid()}
      await fsSet(COLS.equipment, n.id, n)
      await fsBatchSet(COLS.schedule, buildSchedForEq(n))
    }
  }
  async function deleteEq(id) {
    if (!confirm('Delete equipment and all its PM tasks and repair logs?')) return
    await fsDel(COLS.equipment, id)
    await fsBatchDel(COLS.schedule, sched.filter(s=>s.eqId===id).map(s=>s.id))
    await fsBatchDel(COLS.repairs,  repairs.filter(r=>r.eqId===id).map(r=>r.id))
  }

  // Task CRUD
  async function saveTask(data) {
    if (data.id) {
      await fsUpdate(COLS.schedule, data.id, {task:data.task, freq:data.freq})
    } else {
      const n = {id:uid(), eqId:data.eqId, taskId:'c_'+uid(), task:data.task, freq:data.freq, lastDone:null, nextDue:null, enabled:true}
      await fsSet(COLS.schedule, n.id, n)
    }
  }
  async function deleteTask(id) {
    if (!confirm('Delete this PM task?')) return
    await fsDel(COLS.schedule, id)
  }
  async function markDone(id) {
    const row = sched.find(s=>s.id===id); if(!row) return
    await fsUpdate(COLS.schedule, id, {lastDone:todayStr(), nextDue:addDays(FREQ[row.freq]?.days||30)})
  }
  async function toggleEnabled(id) {
    const row = sched.find(s=>s.id===id); if(!row) return
    await fsUpdate(COLS.schedule, id, {enabled:!row.enabled})
  }

  // Repair CRUD
  async function saveRepair(data) {
    if (data.id) {
      await fsSet(COLS.repairs, data.id, data)
    } else {
      const n = {...data, id:uid()}
      await fsSet(COLS.repairs, n.id, n)
    }
  }
  async function deleteRepair(id) {
    if (!confirm('Delete this repair record?')) return
    await fsDel(COLS.repairs, id)
  }

  const ctx = {eq, sched, repairs, saveEq, deleteEq, saveTask, deleteTask, markDone, toggleEnabled, saveRepair, deleteRepair}

  if (status === 'connecting' || status === 'seeding') {
    const msg = status === 'connecting' ? 'Connecting to database…' : 'Setting up for first time…'
    return (
      <div style={{minHeight:'100vh',background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
        <style>{`@keyframes pulse{from{opacity:.3}to{opacity:1}}`}</style>
        <div style={{fontSize:36}}>🍳</div>
        <div style={{color:C.accent,fontWeight:700,fontSize:18}}>KAL Kitchen</div>
        <div style={{color:C.muted,fontSize:13}}>{msg}</div>
        <div style={{width:120,height:4,background:C.border,borderRadius:4,overflow:'hidden'}}>
          <div style={{width:'60%',height:'100%',background:C.accent,borderRadius:4,animation:'pulse 1s infinite alternate'}}/>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}`}</style>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:'11px 16px',display:'flex',alignItems:'center',gap:10,position:'sticky',top:0,zIndex:100}}>
        <span style={{fontSize:20}}>🍳</span>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:C.accent}}>KAL Kitchen</div>
          <div style={{fontSize:10,color:C.muted,textTransform:'uppercase',letterSpacing:'.08em'}}>Maintenance Manager</div>
        </div>
        <div style={{marginLeft:'auto',fontSize:11,color:C.muted}}>{new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
      </div>
      <div style={{display:'flex',background:C.surface,borderBottom:`1px solid ${C.border}`,overflowX:'auto'}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:'0 0 auto',padding:'8px 14px',background:'transparent',border:'none',color:tab===t.id?C.accent:C.muted,borderBottom:tab===t.id?`2px solid ${C.accent}`:'2px solid transparent',fontWeight:tab===t.id?700:400,fontSize:11,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
            <span style={{fontSize:16}}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div style={{padding:'16px 14px',maxWidth:960,margin:'0 auto'}}>
        {tab==='dashboard' && <DashboardTab {...ctx}/>}
        {tab==='schedule'  && <ScheduleTab  {...ctx}/>}
        {tab==='today'     && <TodayTab     {...ctx}/>}
        {tab==='repairs'   && <RepairsTab   {...ctx}/>}
        {tab==='equipment' && <EquipmentTab {...ctx}/>}
        {tab==='history'   && <HistoryTab   {...ctx}/>}
      </div>
    </div>
  )
}
