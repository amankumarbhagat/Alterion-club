import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, ShieldCheck, Compass } from 'lucide-react';

export const Contact: React.FC = () => {
  const { submitContactMessage } = useDatabase();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSent, setIsSent] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required';
    if (!subject.trim()) errors.subject = 'Subject is required';
    if (!message.trim()) errors.message = 'Message body cannot be empty';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    submitContactMessage({
      name,
      email,
      subject,
      message
    });

    setIsSent(true);
  };

  return (
    <div className="relative pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100 text-left">
      
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-96 h-96 glow-orb bg-[#00f0ff] opacity-[0.03]" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase tracking-widest bg-[#00f0ff]/5 px-3 py-1 rounded-full border border-[#00f0ff]/10 mb-4 inline-block">
          GET IN TOUCH
        </span>
        <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-white tracking-tight">
          CONNECT WITH ALTERINO
        </h1>
        <p className="font-sans text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
          Have an inquiry, collaborative proposal, or wish to schedule a lab visit? Send us a network transmission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Direct Contacts & Map */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          {/* Information cards */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-sans font-bold text-lg text-white mb-4">Official Channels</h3>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <span className="font-sans text-[10px] text-slate-500 uppercase block">Email Address</span>
                <a href="mailto:alterino@bmsit.in" className="font-sans text-sm text-white hover:text-[#00f0ff] font-medium mt-1 inline-block">
                  alterino@bmsit.in
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <span className="font-sans text-[10px] text-slate-500 uppercase block">Hotline Phone</span>
                <span className="font-sans text-sm text-white font-medium mt-1 inline-block">
                  +91 80 2847 8221 (Ext. Innovation)
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <span className="font-sans text-[10px] text-slate-500 uppercase block">Lab Location</span>
                <span className="font-sans text-sm text-white font-medium mt-1 leading-relaxed inline-block">
                  Innovation Cell, Computer Science Block,<br />
                  BMSIT&M Campus, Yelahanka, Bengaluru - 560064
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Mock Map Vector Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex-1 flex flex-col justify-between relative overflow-hidden group">
            {/* Grid overlay */}
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-32 h-32 glow-orb bg-[#00f0ff] opacity-[0.05]" />

            <div className="relative z-10">
              <h3 className="font-sans font-bold text-lg text-white mb-2 flex items-center gap-2">
                <Compass size={18} className="text-[#00f0ff] animate-pulse" /> Radar Coords
              </h3>
              <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-[260px] mb-4">
                13.1341° N, 77.5649° E. Locate us inside the main institutional tech labs.
              </p>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden aspect-[16/9] bg-black/60 flex items-center justify-center relative z-10 group-hover:border-[#00f0ff]/20 transition-all">
              {/* Styled clean mock map */}
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-3 h-3 rounded-full bg-[#00f0ff] animate-ping absolute" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] absolute" />
                
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mt-6">
                  Google Map Embed Placeholder
                </span>
                <a
                  href="https://maps.google.com/?q=BMSIT%26M"
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-[10px] text-[#00f0ff] hover:underline font-bold mt-2"
                >
                  Open in Maps App →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transmission Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 h-full flex flex-col justify-between">
            {isSent ? (
              <div className="text-center py-16 space-y-6 flex flex-col justify-center items-center h-full">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-xl text-white">Transmission Sent</h3>
                  <p className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest mt-1">
                    System logs confirmed
                  </p>
                </div>
                <p className="font-sans text-xs text-slate-400 leading-relaxed text-center max-w-sm">
                  Thank you, <strong>{name}</strong>! Your inquiry regarding <strong>{subject}</strong> has been transmitted. We will reply to your network coordinate (email) shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-6 py-2.5 font-mono text-[10px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 hover:border-[#00f0ff]/30 text-slate-300 hover:text-white rounded-lg transition-all"
                >
                  Write New Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left flex flex-col justify-between h-full">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                    <MessageSquare size={16} className="text-[#00f0ff]" />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      Send Secure Network Inquiry
                    </span>
                  </div>

                  {/* Name field */}
                  <div>
                    <label htmlFor="contact-name" className="font-sans text-xs text-slate-400 font-semibold mb-2 block">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Siddharth Rao"
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.name}
                      className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] ${
                        formErrors.name ? 'border-red-500/50' : ''
                      }`}
                    />
                    {formErrors.name && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.name}</span>}
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="contact-email" className="font-sans text-xs text-slate-400 font-semibold mb-2 block">
                      Your Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. sid@domain.com"
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.email}
                      className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] ${
                        formErrors.email ? 'border-red-500/50' : ''
                      }`}
                    />
                    {formErrors.email && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.email}</span>}
                  </div>

                  {/* Subject field */}
                  <div>
                    <label htmlFor="contact-subject" className="font-sans text-xs text-slate-400 font-semibold mb-2 block">
                      Transmission Subject *
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="e.g. Sponsorship Proposal / Project Inquiry"
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.subject}
                      className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] ${
                        formErrors.subject ? 'border-red-500/50' : ''
                      }`}
                    />
                    {formErrors.subject && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.subject}</span>}
                  </div>

                  {/* Message body */}
                  <div>
                    <label htmlFor="contact-message" className="font-sans text-xs text-slate-400 font-semibold mb-2 block">
                      Message Details *
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Type your message description here..."
                      rows={5}
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.message}
                      className={`w-full px-4 py-2.5 text-sm text-white glass-input rounded-lg font-sans placeholder-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] ${
                        formErrors.message ? 'border-red-500/50' : ''
                      }`}
                    />
                    {formErrors.message && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.message}</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-6 mt-6">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                    <ShieldCheck size={12} className="text-emerald-500" /> Safe SSL Tunneling Active
                  </div>
                  
                  <button
                    type="submit"
                    aria-label="Send Transmission"
                    className="flex items-center gap-2 px-6 py-2.5 font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#00f0ff] hover:bg-[#00e0ef] rounded-lg transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]"
                  >
                    Send Transmission <Send size={12} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
