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
  const [tab,     setTab]    = useState('dashboard')
  const [eq,      setEq]     = useState([])
  const [sched,   setSched]  = useState([])
  const [repairs, setRepairs]= useState([])
  const [loading, setLoading]= useState(true)

  useEffect(() => {
    let done = {eq:false, sched:false, repairs:false}
    function check() { if(done.eq && done.sched && done.repairs) setLoading(false) }
    const u1 = fsSubscribe(COLS.equipment, d => { setEq(d);      done.eq=true;      check() })
    const u2 = fsSubscribe(COLS.schedule,  d => { setSched(d);   done.sched=true;   check() })
    const u3 = fsSubscribe(COLS.repairs,   d => { setRepairs(d); done.repairs=true; check() })
    return () => { u1(); u2(); u3() }
  }, [])

  async function saveEq(data) {
    if (data.id) { await fsSet(COLS.equipment, data.id, data) }
    else { const n={...data,id:uid()}; await fsSet(COLS.equipment,n.id,n); await fsBatchSet(COLS.schedule,buildSchedForEq(n)) }
  }
  async function deleteEq(id) {
    if (!confirm('Delete equipment and all its PM tasks and repair logs?')) return
    await fsDel(COLS.equipment, id)
    await fsBatchDel(COLS.schedule, sched.filter(s=>s.eqId===id).map(s=>s.id))
    await fsBatchDel(COLS.repairs,  repairs.filter(r=>r.eqId===id).map(r=>r.id))
  }
  async function saveTask(data) {
    if (data.id) { await fsUpdate(COLS.schedule,data.id,{task:data.task,freq:data.freq}) }
    else { const n={id:uid(),eqId:data.eqId,taskId:'c_'+uid(),task:data.task,freq:data.freq,lastDone:null,nextDue:null,enabled:true}; await fsSet(COLS.schedule,n.id,n) }
  }
  async function deleteTask(id) { if(!confirm('Delete this PM task?')) return; await fsDel(COLS.schedule,id) }
  async function markDone(id) {
    const row=sched.find(s=>s.id===id); if(!row) return
    await fsUpdate(COLS.schedule,id,{lastDone:todayStr(),nextDue:addDays(FREQ[row.freq]?.days||30)})
  }
  async function toggleEnabled(id) {
    const row=sched.find(s=>s.id===id); if(!row) return
    await fsUpdate(COLS.schedule,id,{enabled:!row.enabled})
  }
  async function saveRepair(data) {
    if (data.id) { await fsSet(COLS.repairs,data.id,data) }
    else { const n={...data,id:uid()}; await fsSet(COLS.repairs,n.id,n) }
  }
  async function deleteRepair(id) { if(!confirm('Delete this repair record?')) return; await fsDel(COLS.repairs,id) }


  // Duplicate equipment — copies equipment + all its current PM tasks
  async function duplicateEq(source) {
    const newEq = { ...source, id: uid(), name: source.name + " (Copy)" }
    await fsSet(COLS.equipment, newEq.id, newEq)
    const sourceTasks = sched.filter(s => s.eqId === source.id)
    if (sourceTasks.length > 0) {
      const newTasks = sourceTasks.map(t => ({...t, id: uid(), eqId: newEq.id, lastDone: null, nextDue: null}))
      await fsBatchSet(COLS.schedule, newTasks)
    }
  }

  const ctx={eq,sched,repairs,saveEq,deleteEq,saveTask,deleteTask,markDone,toggleEnabled,saveRepair,deleteRepair,duplicateEq}

  if (loading) return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:40}}>🍳</div>
      <div style={{color:C.accent,fontWeight:700,fontSize:18,fontFamily:'Georgia,serif'}}>KAL Kitchen</div>
      <div style={{color:C.muted,fontSize:13}}>Loading…</div>
      <div style={{width:32,height:32,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.accent}`,borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
        ::-webkit-scrollbar-track{background:${C.bg};}
      `}</style>

      {/* Header */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:'12px 20px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:100,boxShadow:'0 1px 4px rgba(0,0,0,.06)'}}>
        <div style={{width:36,height:36,borderRadius:10,background:'#FEF3C7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🍳</div>
        <div>
          <div style={{fontWeight:700,fontSize:15,color:C.text,letterSpacing:'-.01em'}}>KAL Kitchen</div>
          <div style={{fontSize:10,color:C.muted,textTransform:'uppercase',letterSpacing:'.08em'}}>Maintenance Manager</div>
        </div>
        <div style={{marginLeft:'auto',fontSize:12,color:C.muted,fontWeight:500}}>
          {new Date().toLocaleDateString('en-IN',{weekday:'short',day:'2-digit',month:'short',year:'numeric'})}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{display:'flex',background:C.surface,borderBottom:`1px solid ${C.border}`,overflowX:'auto',paddingLeft:8}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:'0 0 auto',padding:'10px 16px',background:'transparent',border:'none',
            color:tab===t.id?C.accent:C.muted,
            borderBottom:tab===t.id?`2px solid ${C.accent}`:'2px solid transparent',
            fontWeight:tab===t.id?700:500,fontSize:12,cursor:'pointer',
            display:'flex',flexDirection:'column',alignItems:'center',gap:3,
            transition:'color .15s',
          }}>
            <span style={{fontSize:17}}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{padding:'20px 16px',maxWidth:960,margin:'0 auto'}}>
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
