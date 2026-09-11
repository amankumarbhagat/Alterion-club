import React, { useState, useRef, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Terminal, Send, CheckCircle2, User, Mail, Phone, BookOpen, Layers, Award, Upload } from 'lucide-react';


export const JoinUs: React.FC = () => {
  const { divisions, submitApplication } = useDatabase();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('1st Year');
  const [division, setDivision] = useState(divisions[0]?.id || '');
  const [skills, setSkills] = useState('');
  const [motivation, setMotivation] = useState('');
  const [projects, setProjects] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Sync initial division selection when divisions load
  useEffect(() => {
    if (divisions.length > 0 && (!division || !divisions.some(d => d.id === division))) {
      setDivision(divisions[0].id);
    }
  }, [divisions, division]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Confetti Particle Explosion
  useEffect(() => {
    if (!isSubmitted || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }

    const particles: Particle[] = [];
    const colors = ['#00f0ff', '#3b82f6', '#818cf8', '#ffffff', '#e2e8f0'];

    // Spawn 150 particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: width / 2,
        y: height / 2 + 50,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.6) * 16 - 4, // Upwards bias
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.vx *= 0.98; // Friction
        p.rotation += p.rotationSpeed;

        if (p.y < height && p.x > 0 && p.x < width) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSubmitted]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required';
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errors.phone = '10-digit phone number is required';
    if (!branch.trim()) errors.branch = 'Branch/Department is required';
    if (!skills.trim()) errors.skills = 'Please mention key engineering skills';
    if (!motivation.trim()) errors.motivation = 'Please tell us why you want to join';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    submitApplication({
      name,
      email,
      phone,
      branch,
      year,
      division,
      skills,
      motivation,
      projects,
      github,
      linkedin,
      portfolio,
      resumeName: resumeFile ? resumeFile.name : 'Not provided'
    });

    setIsSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative min-h-screen pt-36 pb-16 flex items-center justify-center">
        {/* Particle Canvas */}
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />

        <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/10 text-center relative z-10 shadow-2xl animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center mx-auto mb-6 border border-[#00f0ff]/30">
            <CheckCircle2 size={36} className="animate-pulse" />
          </div>
          
          <h2 className="font-sans font-extrabold text-2xl text-white mb-2">
            APPLICATION LOGGED
          </h2>
          <p className="font-sans text-xs text-[#00f0ff] uppercase font-bold tracking-widest mb-6">
            Recruitment Server Sync Complete
          </p>
          <p className="font-sans text-sm text-slate-400 leading-relaxed mb-8">
            Thank you, <strong>{name}</strong>! Your application to join the <strong>{division}</strong> division has been saved. Our core committee will inspect your profiles and contact you via email shortly.
          </p>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setName('');
              setEmail('');
              setPhone('');
              setBranch('');
              setSkills('');
              setMotivation('');
              setProjects('');
              setGithub('');
              setLinkedin('');
              setPortfolio('');
              setResumeFile(null);
            }}
            className="w-full py-3 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all"
          >
            Apply Again / Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100 text-left">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-96 h-96 glow-orb bg-[#00f0ff] opacity-[0.03]" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-3 py-1 rounded-full border border-[#00f0ff]/10 mb-4 inline-block">
          RECRUITMENT 2026
        </span>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight">
          BUILD WITH US.
        </h1>
        <p className="font-sans text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          Don't just learn technology. Build something with it. Join our engineering ranks and craft systems deployed on campus.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 md:p-10 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
          <Terminal size={18} className="text-[#00f0ff]" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Registration System Input Terminal
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
                <User size={12} className="text-[#00f0ff]" /> Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Siddharth Rao"
                className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600 ${
                  formErrors.name ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
              />
              {formErrors.name && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.name}</span>}
            </div>

            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
                <Mail size={12} className="text-[#00f0ff]" /> Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. sid@bmsit.in"
                className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600 ${
                  formErrors.email ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
              />
              {formErrors.email && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.email}</span>}
            </div>
          </div>

          {/* Row 2: Phone & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
                <Phone size={12} className="text-[#3b82f6]" /> Phone Number (10 digit) *
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600 ${
                  formErrors.phone ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
              />
              {formErrors.phone && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.phone}</span>}
            </div>

            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
                <BookOpen size={12} className="text-[#3b82f6]" /> Department / Branch *
              </label>
              <input
                type="text"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                placeholder="e.g. Computer Science Engineering"
                className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600 ${
                  formErrors.branch ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
              />
              {formErrors.branch && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.branch}</span>}
            </div>
          </div>

          {/* Row 3: Year & Preferred Division */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
                <Layers size={12} className="text-[#00f0ff]" /> Year of Study *
              </label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-white bg-[#0a0a0f] border border-white/8 focus:border-[#00f0ff]/50 rounded-lg font-sans focus:outline-none"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
                <Layers size={12} className="text-[#00f0ff]" /> Preferred Division *
              </label>
              <select
                value={division}
                onChange={e => setDivision(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-white bg-[#0a0a0f] border border-white/8 focus:border-[#00f0ff]/50 rounded-lg font-sans focus:outline-none"
              >
                {divisions.length === 0 ? (
                  <>
                    <option value="">Select a division</option>
                  </>
                ) : (
                  divisions.map(div => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Row 4: Skills */}
          <div>
            <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
              <Award size={12} className="text-[#3b82f6]" /> Key Skills (Tech stacks, prototyping libraries) *
            </label>
            <textarea
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. Python, ESP32 programming, React, soldering, UI mockups, Git workflows..."
              rows={3}
              className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600 focus:outline-none ${
                formErrors.skills ? 'border-red-500/50 focus:border-red-500' : ''
              }`}
            />
            {formErrors.skills && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.skills}</span>}
          </div>

          {/* Row 5: Motivation */}
          <div>
            <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block flex items-center gap-1.5">
              <Award size={12} className="text-[#00f0ff]" /> Why do you want to join ALTERINO? *
            </label>
            <textarea
              value={motivation}
              onChange={e => setMotivation(e.target.value)}
              placeholder="Describe your motivation, what drives you to build innovation projects, and how you want to contribute."
              rows={4}
              className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600 focus:outline-none ${
                formErrors.motivation ? 'border-red-500/50 focus:border-red-500' : ''
              }`}
            />
            {formErrors.motivation && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.motivation}</span>}
          </div>

          {/* Row 6: Projects */}
          <div>
            <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block">
              Previous Projects (Link or describe key works)
            </label>
            <textarea
              value={projects}
              onChange={e => setProjects(e.target.value)}
              placeholder="Describe any apps, electronics hacks, IoT rigs, or websites you built in school or college."
              rows={3}
              className="w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600 focus:outline-none"
            />
          </div>

          {/* Row 7: Portfolios - Github / Linkedin / Portfolio links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block">GitHub Link</label>
              <input
                type="text"
                value={github}
                onChange={e => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600"
              />
            </div>
            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block">LinkedIn Profile</label>
              <input
                type="text"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600"
              />
            </div>
            <div>
              <label className="font-sans text-xs text-slate-400 font-semibold mb-2 block">Portfolio URL</label>
              <input
                type="text"
                value={portfolio}
                onChange={e => setPortfolio(e.target.value)}
                placeholder="https://portfolio.com"
                className="w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-600"
              />
            </div>
          </div>

          {/* Row 8: Resume upload (Mock) */}
          <div className="border border-white/5 bg-white/[0.01] rounded-xl p-6 text-center">
            <h5 className="font-sans font-bold text-xs text-slate-300 mb-2">Resume / Curriculum Vitae</h5>
            <p className="font-sans text-[11px] text-slate-500 mb-4">Upload PDF format file (Max size 5MB)</p>
            
            <div className="relative inline-block">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/20 hover:border-[#00f0ff]/50 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white cursor-pointer transition-all"
              >
                <Upload size={14} className="text-[#00f0ff]" />
                {resumeFile ? resumeFile.name : 'Select File PDF'}
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3 font-sans font-bold text-sm uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)]"
            >
              Submit Application <Send size={14} />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
