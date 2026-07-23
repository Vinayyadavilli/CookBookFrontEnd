import { useState } from 'react'
import { ChefHat, ChevronRight, ChevronLeft, Check, TrendingUp, TrendingDown, Minus, Zap, Flame, Droplets } from 'lucide-react'

function ProgressBar({ step, total }) {
  const pct = (step / total) * 100
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#FF6B35' }}>Step {step} of {total}</span>
        <span style={{ fontSize: 12, color: '#A0AEC0' }}>{Math.round(pct)}% complete</span>
      </div>
      <div style={{ height: 6, background: '#EBEBEB', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #FF6B35 0%, #E55A2B 100%)', borderRadius: 99, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < step ? '#FF6B35' : '#EBEBEB', transition: 'background 0.3s', transform: i === step - 1 ? 'scale(1.3)' : 'scale(1)' }} />
        ))}
      </div>
    </div>
  )
}

const GOALS = [
  { key: 'lose', icon: <TrendingDown size={32} color="#FC5C65" />, iconBg: '#FFF0F1', border: '#FC5C65', title: 'Lose Weight', desc: 'Shed extra kilos with a calorie deficit plan and high-protein recipes tailored to your pace.', badge: '🔥 Most Popular' },
  { key: 'maintain', icon: <Minus size={32} color="#F6C90E" />, iconBg: '#FFFBEB', border: '#F6C90E', title: 'Maintain Weight', desc: 'Keep your current weight with balanced nutrition and recipes that fit your daily targets.', badge: null },
  { key: 'gain', icon: <TrendingUp size={32} color="#48BB78" />, iconBg: '#F0FFF4', border: '#48BB78', title: 'Gain Muscle', desc: 'Build lean muscle with high-protein, calorie-surplus meal plans and strength-focused nutrition.', badge: '💪 For Athletes' },
]

function StepGoal({ data, setData }) {
  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1A202C', margin: '0 0 6px', letterSpacing: '-0.02em' }}>What's your goal?</h2>
      <p style={{ fontSize: 15, color: '#718096', margin: '0 0 32px' }}>We'll build your personalized nutrition plan around this.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {GOALS.map((g) => {
          const selected = data.goal === g.key
          return (
            <div key={g.key} onClick={() => setData({ goal: g.key })}
              style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '20px 22px', borderRadius: 16, border: `2px solid ${selected ? g.border : '#EBEBEB'}`, background: selected ? g.iconBg : '#fff', cursor: 'pointer', transition: 'all 0.18s ease', boxShadow: selected ? '0 4px 20px rgba(0,0,0,0.07)' : '0 2px 8px rgba(0,0,0,0.04)', position: 'relative' }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: selected ? '#fff' : g.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#1A202C' }}>{g.title}</span>
                  {g.badge && <span style={{ fontSize: 11, fontWeight: 600, color: '#FF6B35', background: '#FFF0EA', padding: '2px 8px', borderRadius: 99 }}>{g.badge}</span>}
                </div>
                <p style={{ fontSize: 13, color: '#718096', margin: 0, lineHeight: 1.5 }}>{g.desc}</p>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selected ? g.border : '#EBEBEB'}`, background: selected ? g.border : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                {selected && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SliderField({ label, value, min, max, unit, onChange }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'baseline' }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#2D3748' }}>{label}</label>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#FF6B35', letterSpacing: '-0.02em' }}>
          {value}<span style={{ fontSize: 14, fontWeight: 500, color: '#A0AEC0', marginLeft: 2 }}>{unit}</span>
        </span>
      </div>
      <div style={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 6, background: '#EBEBEB', borderRadius: 99 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #FF6B35, #E55A2B)', borderRadius: 99 }} />
        </div>
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ position: 'absolute', left: 0, right: 0, width: '100%', opacity: 0, height: 28, cursor: 'pointer', margin: 0 }} />
        <div style={{ position: 'absolute', left: `calc(${pct}% - 10px)`, width: 20, height: 20, borderRadius: '50%', background: '#FF6B35', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(255,107,53,0.4)', pointerEvents: 'none', transition: 'left 0.05s' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: '#A0AEC0' }}>{min}{unit}</span>
        <span style={{ fontSize: 11, color: '#A0AEC0' }}>{max}{unit}</span>
      </div>
    </div>
  )
}

function StepPersonalInfo({ data, setData }) {
  const GENDERS = [{ key: 'male', label: 'Male', emoji: '♂' }, { key: 'female', label: 'Female', emoji: '♀' }, { key: 'other', label: 'Other', emoji: '⚧' }]
  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1A202C', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Tell us about yourself</h2>
      <p style={{ fontSize: 15, color: '#718096', margin: '0 0 32px' }}>We use this to calculate your daily calorie and nutrition targets.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <SliderField label="Age" value={data.age} min={14} max={80} unit=" yrs" onChange={(v) => setData({ age: v })} />
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2D3748', marginBottom: 10 }}>Gender</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {GENDERS.map((g) => (
              <button key={g.key} type="button" onClick={() => setData({ gender: g.key })}
                style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: `2px solid ${data.gender === g.key ? '#FF6B35' : '#EBEBEB'}`, background: data.gender === g.key ? '#FFF0EA' : '#fff', color: data.gender === g.key ? '#FF6B35' : '#718096', fontWeight: data.gender === g.key ? 700 : 500, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>{g.emoji}</span>{g.label}
              </button>
            ))}
          </div>
        </div>
        <SliderField label="Height" value={data.heightCm} min={140} max={210} unit=" cm" onChange={(v) => setData({ heightCm: v })} />
        <SliderField label="Current weight" value={data.weightKg} min={35} max={150} unit=" kg" onChange={(v) => setData({ weightKg: v })} />
        <SliderField label="Target weight" value={data.targetWeightKg} min={35} max={150} unit=" kg" onChange={(v) => setData({ targetWeightKg: v })} />
      </div>
    </div>
  )
}

const ACTIVITY_LEVELS = [
  { level: 0, emoji: '🛋️', title: 'Sedentary', desc: 'Little or no exercise, desk job', multiplier: 1.2 },
  { level: 1, emoji: '🚶', title: 'Lightly Active', desc: 'Light exercise 1–3 days/week', multiplier: 1.375 },
  { level: 2, emoji: '🏃', title: 'Moderately Active', desc: 'Moderate exercise 3–5 days/week', multiplier: 1.55 },
  { level: 3, emoji: '🏋️', title: 'Very Active', desc: 'Hard exercise 6–7 days/week', multiplier: 1.725 },
  { level: 4, emoji: '🏅', title: 'Athlete', desc: 'Intense daily training or physical job', multiplier: 1.9 },
]

function StepActivity({ data, setData }) {
  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1A202C', margin: '0 0 6px', letterSpacing: '-0.02em' }}>How active are you?</h2>
      <p style={{ fontSize: 15, color: '#718096', margin: '0 0 32px' }}>Activity level determines how many calories you actually burn each day.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ACTIVITY_LEVELS.map((a, i) => {
          const selected = data.activityLevel === a.level
          return (
            <div key={a.level} onClick={() => setData({ activityLevel: a.level })}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', borderRadius: 14, border: `2px solid ${selected ? '#FF6B35' : '#EBEBEB'}`, background: selected ? '#FFF0EA' : '#fff', cursor: 'pointer', transition: 'all 0.18s ease', boxShadow: selected ? '0 4px 16px rgba(255,107,53,0.12)' : 'none' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: selected ? '#fff' : '#F7F4F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{a.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: selected ? '#FF6B35' : '#1A202C', marginBottom: 2 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: '#718096' }}>{a.desc}</div>
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} style={{ width: 4, height: j <= i ? 16 + j * 3 : 8, borderRadius: 2, background: j <= i ? (selected ? '#FF6B35' : '#D1D5DB') : '#EBEBEB', alignSelf: 'flex-end' }} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const FOOD_PREFS = [
  { key: 'veg', emoji: '🥦', title: 'Pure Vegetarian', desc: 'No meat, fish, or eggs. Only plant-based ingredients.', color: '#48BB78', bg: '#F0FFF4', border: '#48BB78', tags: ['Dal', 'Paneer', 'Rajma', 'Palak', 'Aloo'] },
  { key: 'eggetarian', emoji: '🥚', title: 'Eggetarian', desc: 'Vegetarian plus eggs. No meat or fish in your meal plans.', color: '#F6C90E', bg: '#FFFBEB', border: '#F6C90E', tags: ['Egg Bhurji', 'Omelette', 'Egg Curry', 'Paneer'] },
  { key: 'nonveg', emoji: '🍗', title: 'Non-Vegetarian', desc: 'Full access — chicken, mutton, fish, eggs and everything in between.', color: '#FC5C65', bg: '#FFF0F1', border: '#FC5C65', tags: ['Biryani', 'Butter Chicken', 'Fish Curry', 'Keema'] },
]

function StepFoodPref({ data, setData }) {
  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1A202C', margin: '0 0 6px', letterSpacing: '-0.02em' }}>What do you eat?</h2>
      <p style={{ fontSize: 15, color: '#718096', margin: '0 0 32px' }}>We'll only show you recipes that match your food preferences.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {FOOD_PREFS.map((fp) => {
          const selected = data.foodPref === fp.key
          return (
            <div key={fp.key} onClick={() => setData({ foodPref: fp.key })}
              style={{ padding: '20px 22px', borderRadius: 16, border: `2px solid ${selected ? fp.border : '#EBEBEB'}`, background: selected ? fp.bg : '#fff', cursor: 'pointer', transition: 'all 0.18s ease', boxShadow: selected ? '0 4px 20px rgba(0,0,0,0.07)' : '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: selected ? '#fff' : '#F7F4F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{fp.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#1A202C', marginBottom: 3 }}>{fp.title}</div>
                  <div style={{ fontSize: 13, color: '#718096', lineHeight: 1.4 }}>{fp.desc}</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selected ? fp.border : '#EBEBEB'}`, background: selected ? fp.border : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {selected && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {fp.tags.map((t) => (
                  <span key={t} style={{ fontSize: 12, fontWeight: 500, color: fp.color, background: selected ? '#fff' : '#F7F4F1', border: `1px solid ${selected ? fp.border + '40' : '#EBEBEB'}`, borderRadius: 99, padding: '3px 10px' }}>{t}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BMIGauge({ bmi }) {
  const clamped = Math.min(40, Math.max(10, bmi))
  const pct = (clamped - 10) / 30
  const angle = -180 + pct * 180
  const r = 80, cx = 100, cy = 100
  const toXY = (deg) => {
    const rad = (deg * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }
  const arcPath = (startDeg, endDeg) => {
    const start = toXY(startDeg)
    const end = toXY(endDeg)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
  }
  
  const bmiToAngle = (b) => -180 + ((Math.min(40, Math.max(10, b)) - 10) / 30) * 180
  
  const segments = [
    { start: bmiToAngle(10), end: bmiToAngle(18.5), color: '#4299E1', label: 'Under' },
    { start: bmiToAngle(18.5), end: bmiToAngle(25), color: '#48BB78', label: 'Normal' },
    { start: bmiToAngle(25), end: bmiToAngle(30), color: '#F6C90E', label: 'Over' },
    { start: bmiToAngle(30), end: bmiToAngle(40), color: '#FC5C65', label: 'Obese' },
  ]
  
  const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  const bmiColor = bmi < 18.5 ? '#4299E1' : bmi < 25 ? '#48BB78' : bmi < 30 ? '#F6C90E' : '#FC5C65'

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 200 145" style={{ width: 200, overflow: 'visible' }}>
        {segments.map((s) => (
          <path key={s.label} d={arcPath(s.start, s.end)} fill="none" stroke={s.color} strokeWidth={14} strokeLinecap="round" opacity={0.85} />
        ))}
        <line x1={cx} y1={cy} x2={cx + (r - 14) * Math.cos((angle * Math.PI) / 180)} y2={cy + (r - 14) * Math.sin((angle * Math.PI) / 180)} stroke="#1A202C" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill="#1A202C" />
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize={24} fontWeight="800" fill={bmiColor} fontFamily="Inter, sans-serif">{bmi.toFixed(1)}</text>
        <text x={cx} y={cy + 40} textAnchor="middle" fontSize={12} fill="#718096" fontFamily="Inter, sans-serif" fontWeight="500">BMI</text>
        <text x={16} y={110} fontSize={10} fill="#718096" fontFamily="Inter, sans-serif" fontWeight="600">Under</text>
        <text x={170} y={110} fontSize={10} fill="#718096" fontFamily="Inter, sans-serif" fontWeight="600">Obese</text>
      </svg>
      <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: bmiColor + '18', borderRadius: 99, padding: '4px 12px' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: bmiColor }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: bmiColor }}>{bmiCategory}</span>
      </div>
    </div>
  )
}

function StepSummary({ data, onComplete }) {
  const bmr = data.gender === 'male'
    ? 10 * data.weightKg + 6.25 * data.heightCm - 5 * data.age + 5
    : 10 * data.weightKg + 6.25 * data.heightCm - 5 * data.age - 161
  const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9]
  const multiplier = data.activityLevel >= 0 ? activityMultipliers[data.activityLevel] : 1.375
  const tdee = Math.round(bmr * multiplier)
  const goalAdjust = { lose: -400, maintain: 0, gain: 300 }
  const calTarget = tdee + (data.goal ? goalAdjust[data.goal] : 0)
  const proteinTarget = Math.round(data.weightKg * 1.8)
  const waterTarget = Math.round(data.weightKg * 35 / 1000 * 10) / 10
  const bmi = data.weightKg / ((data.heightCm / 100) ** 2)
  const goalLabels = { lose: 'Lose Weight', maintain: 'Maintain Weight', gain: 'Gain Muscle' }
  const prefLabels = { veg: 'Pure Vegetarian', eggetarian: 'Eggetarian', nonveg: 'Non-Vegetarian' }
  const activityLabels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Athlete']

  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1A202C', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Your Health Summary</h2>
      <p style={{ fontSize: 15, color: '#718096', margin: '0 0 28px' }}>Based on your inputs, here's your personalized nutrition profile.</p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px 36px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid #EBEBEB' }}>
          <BMIGauge bmi={bmi} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { icon: <Flame size={20} color="#fff" />, val: calTarget.toLocaleString(), unit: 'kcal/day', label: 'Calories', bg: '#FFF0EA', iconBg: '#FF6B35' },
          { icon: <Zap size={20} color="#fff" />, val: `${proteinTarget}g`, unit: 'per day', label: 'Protein', bg: '#F0FFF4', iconBg: '#48BB78' },
          { icon: <Droplets size={20} color="#fff" />, val: `${waterTarget}L`, unit: 'per day', label: 'Water', bg: '#EBF8FF', iconBg: '#4299E1' },
        ].map((t) => (
          <div key={t.label} style={{ background: t.bg, borderRadius: 14, padding: '16px', textAlign: 'center', border: `1px solid ${t.iconBg}22` }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{t.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1A202C', letterSpacing: '-0.02em', lineHeight: 1 }}>{t.val}</div>
            <div style={{ fontSize: 11, color: '#A0AEC0', margin: '3px 0 2px' }}>{t.unit}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4A5568' }}>{t.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #EBEBEB', padding: '16px 18px', marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Your Profile</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Goal', val: data.goal ? goalLabels[data.goal] : '—' },
            { label: 'Activity', val: data.activityLevel >= 0 ? activityLabels[data.activityLevel] : '—' },
            { label: 'Diet', val: data.foodPref ? prefLabels[data.foodPref] : '—' },
            { label: 'Stats', val: `${data.heightCm}cm · ${data.weightKg}kg` },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 11, color: '#A0AEC0', fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontSize: 13, color: '#1A202C', fontWeight: 600 }}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onComplete}
        style={{ width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 6px 24px rgba(255,107,53,0.35)', letterSpacing: '0.01em' }}>
        Start Exploring Recipes <ChevronRight size={18} />
      </button>
    </div>
  )
}

const TOTAL_STEPS = 5
const STEP_META = [
  { title: 'Your Goal', hint: 'Choose what matters most' },
  { title: 'Personal Info', hint: 'Help us know you better' },
  { title: 'Activity Level', hint: 'How much do you move?' },
  { title: 'Food Preference', hint: 'What do you like to eat?' },
  { title: 'Health Summary', hint: 'Your personalized plan' },
]

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    goal: '',
    age: 28,
    gender: 'female',
    heightCm: 165,
    weightKg: 65,
    targetWeightKg: 58,
    activityLevel: -1,
    foodPref: '',
  })

  function patch(d) {
    setData((prev) => ({ ...prev, ...d }))
  }

  function canAdvance() {
    if (step === 1) return !!data.goal
    if (step === 2) return !!data.gender
    if (step === 3) return data.activityLevel >= 0
    if (step === 4) return !!data.foodPref
    return true
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChefHat size={18} color="#fff" strokeWidth={2} />
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, color: '#1A202C', letterSpacing: '-0.02em' }}>Cook<span style={{ color: '#FF6B35' }}>Book</span></span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#A0AEC0', fontWeight: 500 }}>{STEP_META[step - 1].hint}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '32px 16px 40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 20, border: '1px solid #EBEBEB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <ProgressBar step={step} total={TOTAL_STEPS} />
          </div>

          <div key={step} style={{ background: '#fff', borderRadius: 20, padding: '32px 32px 28px', border: '1px solid #EBEBEB', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', animation: 'fadeSlideIn 0.28s ease' }}>
            {step === 1 && <StepGoal data={data} setData={patch} />}
            {step === 2 && <StepPersonalInfo data={data} setData={patch} />}
            {step === 3 && <StepActivity data={data} setData={patch} />}
            {step === 4 && <StepFoodPref data={data} setData={patch} />}
            {step === 5 && <StepSummary data={data} onComplete={onComplete} />}
          </div>

          {step < 5 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, gap: 12 }}>
              <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 20px', borderRadius: 999, border: '2px solid #EBEBEB', background: '#fff', color: step === 1 ? '#D1D5DB' : '#718096', fontSize: 14, fontWeight: 600, cursor: step === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                <ChevronLeft size={16} />Back
              </button>
              <button onClick={() => { if (canAdvance()) setStep((s) => Math.min(TOTAL_STEPS, s + 1)) }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 24px', borderRadius: 999, border: 'none', background: canAdvance() ? 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)' : '#F7F4F1', color: canAdvance() ? '#fff' : '#A0AEC0', fontSize: 15, fontWeight: 700, cursor: canAdvance() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', boxShadow: canAdvance() ? '0 4px 16px rgba(255,107,53,0.3)' : 'none', transition: 'all 0.18s ease', letterSpacing: '0.01em' }}>
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step < 5 && (
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#A0AEC0' }}>
              Skip for now →{' '}
              <button onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))} style={{ background: 'none', border: 'none', color: '#A0AEC0', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', textDecoration: 'underline', padding: 0 }}>
                I'll do this later
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
