// ── Frequency config ─────────────────────────────────────────────────────
export const FREQ = {
  D: { label: 'Daily',     days: 1,  color: '#86EFAC', bg: '#14532D' },
  W: { label: 'Weekly',    days: 7,  color: '#60A5FA', bg: '#1E3A5F' },
  M: { label: 'Monthly',   days: 30, color: '#F59E0B', bg: '#78350F' },
  Q: { label: 'Quarterly', days: 91, color: '#A78BFA', bg: '#3B1F6E' },
}
export const FREQ_ORDER = ['D', 'W', 'M', 'Q']

// ── Equipment categories ──────────────────────────────────────────────────
export const CATS = [
  {
    id: 'cooking', label: 'Cooking', icon: '🍳',
    subtypes: ['Combi Oven','Deck Oven','Convection Oven','Deep Fryer','Tilting Fry Pan','Tandoor','Salamander Grill','Induction Range'],
  },
  {
    id: 'boiling', label: 'Boiling & Heating', icon: '♨️',
    subtypes: ['Electric Kettle','Boiling Pan','Steam Jacketed Kettle','Tilting Boiling Pan','Rice Cooker','Idly Steamer','Bain Marie','Soup Kettle'],
  },
  {
    id: 'grinding', label: 'Grinding & Cutting', icon: '⚙️',
    subtypes: ['Wet Grinder','Dry Grinder','Mixer Grinder','Vegetable Peeler','Vegetable Cutting Machine','Slicer','Dough Kneader','Coconut Scraper'],
  },
  {
    id: 'motors', label: 'Motors & Pumps', icon: '🔌',
    subtypes: ['Pressure Pump','Booster Pump','Exhaust Fan','Ventilation Fan','Blower Motor','Sump Pump','Chimney Motor'],
  },
]
export function getCat(id) { return CATS.find(c => c.id === id) }

// ── Default PM task templates per category ────────────────────────────────
export const DEFAULT_TASKS = {
  cooking: [
    { id: 'ck01', task: 'Clean interior chamber — remove food residue & grease',   freq: 'D' },
    { id: 'ck02', task: 'Wipe exterior surfaces and control panel',                 freq: 'D' },
    { id: 'ck03', task: 'Check door closes fully and seals properly',               freq: 'D' },
    { id: 'ck04', task: 'Degrease door seals / gaskets with warm soapy water',      freq: 'W' },
    { id: 'ck05', task: 'Clean burners / heating elements — clear blockages',       freq: 'W' },
    { id: 'ck06', task: 'Clean grease filter / drip tray',                          freq: 'W' },
    { id: 'ck07', task: 'Check steam injection nozzles — no blockage',              freq: 'W' },
    { id: 'ck08', task: 'Descale water tank / steam generator',                     freq: 'M' },
    { id: 'ck09', task: 'Inspect door hinge for wear — tighten if loose',           freq: 'M' },
    { id: 'ck10', task: 'Check thermostat accuracy with calibrated thermometer',    freq: 'M' },
    { id: 'ck11', task: 'Apply food-grade grease to door hinges & moving parts',    freq: 'M' },
    { id: 'ck12', task: 'Check all electrical connections — tighten loose screws',  freq: 'M' },
    { id: 'ck13', task: 'Inspect heating element — check for damage',               freq: 'Q' },
    { id: 'ck14', task: 'Replace door gasket if cracked / heat-leaking',            freq: 'Q' },
    { id: 'ck15', task: 'Full calibration — thermostat & temperature probe',        freq: 'Q' },
    { id: 'ck16', task: 'Check exhaust / ventilation connection to hood',           freq: 'Q' },
    { id: 'ck17', task: 'AMC service — full component & wiring inspection',         freq: 'Q' },
  ],
  boiling: [
    { id: 'bl01', task: 'Drain and rinse interior after last use of the day',       freq: 'D' },
    { id: 'bl02', task: 'Wipe heating element exterior — ensure power is OFF',      freq: 'D' },
    { id: 'bl03', task: 'Check water inlet valve — no drips or blockage',           freq: 'D' },
    { id: 'bl04', task: 'Clean steam outlet nozzles — clear with small brush',      freq: 'W' },
    { id: 'bl05', task: 'Check lid / cover seal — no steam leaking from sides',     freq: 'W' },
    { id: 'bl06', task: 'Flush interior with clean water — remove sediment',        freq: 'W' },
    { id: 'bl07', task: 'Descale interior surfaces with citric acid / descaler',    freq: 'M' },
    { id: 'bl08', task: 'Inspect safety pressure relief valve — functional test',   freq: 'M' },
    { id: 'bl09', task: 'Check water outlet valve — opens and closes fully',        freq: 'M' },
    { id: 'bl10', task: 'Apply food-grade grease to lid hinges / locking arm',      freq: 'M' },
    { id: 'bl11', task: 'Check electrical terminals — no corrosion or looseness',   freq: 'M' },
    { id: 'bl12', task: 'Check heating element continuity (multimeter test)',       freq: 'Q' },
    { id: 'bl13', task: 'Inspect wiring insulation — no fraying or discolouration', freq: 'Q' },
    { id: 'bl14', task: 'Full service by AMC — element & thermostat inspection',    freq: 'Q' },
  ],
  grinding: [
    { id: 'gr01', task: 'Clean grinding drum / blades after every use',             freq: 'D' },
    { id: 'gr02', task: 'Rinse feed chute / hopper — no food particles remaining',  freq: 'D' },
    { id: 'gr03', task: 'Wipe motor housing exterior — dry cloth only',             freq: 'D' },
    { id: 'gr04', task: 'Check blade / stone sharpness — visual inspection',        freq: 'W' },
    { id: 'gr05', task: 'Clean motor air vents with soft brush / compressed air',   freq: 'W' },
    { id: 'gr06', task: 'Check all fasteners on machine body — tighten if loose',   freq: 'W' },
    { id: 'gr07', task: 'Apply food-grade grease to drive shaft / gear points',     freq: 'M' },
    { id: 'gr08', task: 'Check and tighten motor mounting bolts',                   freq: 'M' },
    { id: 'gr09', task: 'Inspect ON/OFF switch and safety guard — functional',      freq: 'M' },
    { id: 'gr10', task: 'Check power cord and plug — no damage or heat marks',      freq: 'M' },
    { id: 'gr11', task: 'Check blade / grinding stone alignment — adjust if off',   freq: 'Q' },
    { id: 'gr12', task: 'Inspect motor wiring and switch contacts',                 freq: 'Q' },
    { id: 'gr13', task: 'Sharpen or replace worn blades / grinding stones',         freq: 'Q' },
    { id: 'gr14', task: 'AMC service — motor bearing check & lubrication',          freq: 'Q' },
  ],
  motors: [
    { id: 'mo01', task: 'Check motor for unusual vibration or noise during run',    freq: 'D' },
    { id: 'mo02', task: 'Check pump outlet — adequate pressure / flow rate',        freq: 'D' },
    { id: 'mo03', task: 'Verify exhaust fan is drawing air effectively',            freq: 'D' },
    { id: 'mo04', task: 'Clean motor exterior and air vents — remove dust/grease',  freq: 'W' },
    { id: 'mo05', task: 'Check coupling / belt — no cracking or excessive slack',   freq: 'W' },
    { id: 'mo06', task: 'Inspect pump inlet strainer — clean if blocked',           freq: 'W' },
    { id: 'mo07', task: 'Lubricate motor bearings — food-grade grease',             freq: 'M' },
    { id: 'mo08', task: 'Check all electrical connections and terminal tightness',  freq: 'M' },
    { id: 'mo09', task: 'Check belt tension — adjust if slipping or over-tight',    freq: 'M' },
    { id: 'mo10', task: 'Test capacitor / starter — motor starts without struggle', freq: 'M' },
    { id: 'mo11', task: 'Insulation resistance test (megger) — record values',      freq: 'Q' },
    { id: 'mo12', task: 'Check amp draw vs motor nameplate — flag if high',         freq: 'Q' },
    { id: 'mo13', task: 'Inspect and clean impeller / fan blades',                  freq: 'Q' },
    { id: 'mo14', task: 'AMC service — full motor and wiring inspection',           freq: 'Q' },
  ],
}

// ── Seed equipment ────────────────────────────────────────────────────────
export const INIT_EQ = [
  { id: 'e1', name: 'Combi Oven (Main Hall)',        catId: 'cooking',  subtype: 'Combi Oven',            loc: 'Main Kitchen', make: 'Rational', model: 'SCC 61',  installDate: '2023-01-10' },
  { id: 'e2', name: 'Deep Fryer',                    catId: 'cooking',  subtype: 'Deep Fryer',             loc: 'Main Kitchen', make: 'Pitco',    model: 'SG14',    installDate: '2022-06-01' },
  { id: 'e3', name: 'Steam Jacketed Kettle (200L)',  catId: 'boiling',  subtype: 'Steam Jacketed Kettle',  loc: 'Main Kitchen', make: 'Hobart',   model: 'HKE-120', installDate: '2022-06-01' },
  { id: 'e4', name: 'Idly Steamer',                  catId: 'boiling',  subtype: 'Idly Steamer',           loc: 'Main Kitchen', make: '',         model: '',        installDate: '' },
  { id: 'e5', name: 'Wet Grinder',                   catId: 'grinding', subtype: 'Wet Grinder',            loc: 'Prep Area',    make: 'LG',       model: 'WG-30',   installDate: '2021-03-15' },
  { id: 'e6', name: 'Vegetable Peeler',              catId: 'grinding', subtype: 'Vegetable Peeler',       loc: 'Prep Area',    make: '',         model: '',        installDate: '' },
  { id: 'e7', name: 'Pressure Pump (water supply)',  catId: 'motors',   subtype: 'Pressure Pump',          loc: 'Utility Room', make: 'Grundfos', model: 'CM5-6',   installDate: '2021-01-01' },
  { id: 'e8', name: 'Exhaust Fan (main kitchen)',    catId: 'motors',   subtype: 'Exhaust Fan',            loc: 'Main Kitchen', make: '',         model: '',        installDate: '' },
]

// ── Seed repairs ──────────────────────────────────────────────────────────
export const INIT_REPAIRS = [
  { id: 'r1', eqId: 'e2', date: '2025-03-05', problem: 'Thermostat failure — temperature not holding',  action: 'Replaced thermostat unit',              parts: 'Thermostat unit',  vendor: 'Fryer Pro Services',  labour: 800,  parts_cost: 2400, total: 3200, status: 'Closed' },
  { id: 'r2', eqId: 'e1', date: '2025-03-22', problem: 'Steam injection not working',                   action: 'Solenoid valve replaced',               parts: 'Solenoid valve',   vendor: 'AMC Team',            labour: 1000, parts_cost: 4500, total: 5500, status: 'Closed' },
  { id: 'r3', eqId: 'e7', date: '2025-02-10', problem: 'Low pressure — pump not building pressure',     action: 'Replaced worn impeller',                parts: 'Impeller kit',     vendor: 'Grundfos Service',    labour: 600,  parts_cost: 1600, total: 2200, status: 'Closed' },
  { id: 'r4', eqId: 'e5', date: '2025-04-02', problem: 'Grinding drum vibrating excessively',           action: 'Tightened bolts, replaced bearing',     parts: 'Bearing set',      vendor: 'In-house + AMC',      labour: 500,  parts_cost: 900,  total: 1400, status: 'Closed' },
  { id: 'r5', eqId: 'e2', date: '2025-04-10', problem: 'Basket lift mechanism jammed',                  action: 'Lubricated and adjusted mechanism',     parts: '',                 vendor: 'In-house',            labour: 200,  parts_cost: 0,    total: 200,  status: 'Closed' },
  { id: 'r6', eqId: 'e8', date: '2025-04-15', problem: 'Exhaust fan making loud noise',                 action: 'Fan blade cracked — replacement ordered',parts: 'Fan blade',        vendor: 'Vendor',              labour: 0,    parts_cost: 0,    total: 0,    status: 'Open' },
]
