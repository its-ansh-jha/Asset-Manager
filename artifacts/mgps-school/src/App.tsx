import { useEffect, useState, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CalendarDays, Check, ChevronRight, CircleAlert, Compass, Heart, Layers3, Mail, MapPin, Menu, MessageCircle, Phone, Send, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { galleryItems, navItems, school, trustItems, whyChooseItems } from './siteData';

const queryClient = new QueryClient();

type FormValues = {
  guardian: string;
  student: string;
  currentClass: string;
  seekingClass: string;
  phone: string;
  email: string;
  message: string;
};

const initialForm: FormValues = {
  guardian: '',
  student: '',
  currentClass: '',
  seekingClass: '',
  phone: '',
  email: '',
  message: '',
};

function iconFor(name: string) {
  switch (name) {
    case 'calendar': return CalendarDays;
    case 'book': return Sparkles;
    case 'users': return Users;
    case 'layers': return Layers3;
    case 'heart': return Heart;
    default: return MapPin;
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function Brand() {
  return (
    <a className="brand-mark" href="/" data-testid="link-brand" aria-label="Maa Gayatri Public School home">
      <span className="brand-seal" aria-hidden="true">MGPS</span>
      <span>
        <span className="brand-name">{school.name}</span>
        <span className="brand-caption">Muzaffarpur · Bihar</span>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const updateScrollState = () => setScrolled(window.scrollY > 10);
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('scroll', updateScrollState);
    };
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="announcement" data-testid="banner-announcement">
        <div className="container-wide announcement-inner">
          <span><ShieldCheck size={14} aria-hidden="true" /> A considered beginning for every child</span>
          <a href={school.phoneHref} data-testid="link-announcement-phone">Call {school.phoneDisplay}</a>
        </div>
      </div>
      <header className={`nav-bar${scrolled ? ' is-scrolled' : ''}`}>
        <div className="container-wide nav-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => <a className="nav-link" href={item.href} key={item.href} data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}</a>)}
          </nav>
          <a className="button-primary desktop-admission" href="#admissions" data-testid="link-nav-admission">Admission Enquiry <ChevronRight size={16} aria-hidden="true" /></a>
          <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen(!open)} data-testid="button-mobile-menu">
            {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </header>
      <div className="nav-placeholder" aria-hidden="true" />
      <nav id="mobile-navigation" className={`mobile-menu${open ? ' open' : ''}${scrolled ? ' is-scrolled' : ''}`} aria-label="Mobile navigation">
        <div className="container-wide">
          {navItems.map((item) => <a href={item.href} onClick={closeMenu} key={item.href} data-testid={`link-mobile-${item.label.toLowerCase()}`}>{item.label}</a>)}
          <a className="button-primary" href="#admissions" onClick={closeMenu} data-testid="link-mobile-admission">Admission Enquiry <ChevronRight size={16} aria-hidden="true" /></a>
        </div>
      </nav>
    </>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true">
        <span className="hero-art-label">Approved school photography can be added here</span>
      </div>
      <div className="container-wide hero-content">
        <div className="hero-kicker">A school for the road ahead</div>
        <h1 id="hero-title" className="display-font">Building bright futures through education.</h1>
        <p>{school.name} is an English-medium co-educational school in Muzaffarpur committed to providing a supportive environment for academic growth, character development and lifelong learning.</p>
        <div className="hero-actions">
          <a className="button-primary" href="/admissions" data-testid="link-hero-admission">Admission Enquiry <ChevronRight size={17} aria-hidden="true" /></a>
          <a className="button-quiet" href="/about" data-testid="link-hero-explore">Explore Our School</a>
        </div>
        <div className="hero-note"><MapPin size={14} aria-hidden="true" /> Purani Darbhanga Road · Sahwajpur, Muzaffarpur</div>
      </div>
      <div className="container-wide quick-contact" aria-label="Quick contact links">
        <a href={school.phoneHref} data-testid="link-quick-call"><Phone size={16} aria-hidden="true" /> Call School</a>
        <a href={school.whatsappHref} target="_blank" rel="noreferrer" data-testid="link-quick-whatsapp"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>
        <a href={school.directionsHref} target="_blank" rel="noreferrer" data-testid="link-quick-directions"><Compass size={16} aria-hidden="true" /> Get Directions</a>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="School identity">
      <div className="container-wide trust-grid">
        {trustItems.map((item) => {
          const Icon = iconFor(item.icon);
          return <div className="trust-item" key={item.label} data-testid={`text-trust-${item.icon}`}><Icon className="trust-icon" size={19} aria-hidden="true" /><span><span className="trust-label">{item.label}</span><span className="trust-detail">{item.detail}</span></span></div>;
        })}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section-pad" id="about" aria-labelledby="about-title">
      <div className="container-wide about-grid">
        <div className="about-copy">
          <div className="eyebrow">01 / The school</div>
          <h2 className="section-heading" id="about-title">A steady place to begin well.</h2>
          <div className="gold-rule" style={{ marginTop: 26 }} />
          <p>{school.name} (M.G.P.S.) is an English-medium co-educational school located on Purani Darbhanga Road in Sahwajpur, Muzaffarpur. The school focuses on creating a supportive learning environment where students can develop academically while growing in confidence, discipline and character.</p>
          <ul className="about-list">
            <li><MapPin size={17} aria-hidden="true" /> Located in Muzaffarpur, Bihar</li>
            <li><Sparkles size={17} aria-hidden="true" /> English-medium education</li>
            <li><Users size={17} aria-hidden="true" /> Co-educational environment</li>
            <li><ShieldCheck size={17} aria-hidden="true" /> Reported management by {school.management}</li>
            <li><Layers3 size={17} aria-hidden="true" /> Education through the secondary level</li>
          </ul>
          <a className="text-link" style={{ marginTop: 28 }} href="/about#beliefs" data-testid="link-about-beliefs">Learn more about our school <ChevronRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="about-visual" aria-label="Editorial placeholder for approved school history or campus image">
          <div className="editorial-frame">
            <div className="frame-pattern" />
            <div className="frame-copy"><div className="frame-number">13</div><div className="frame-label">A local school identity<br />rooted in Muzaffarpur</div></div>
          </div>
          <div className="about-tag"><strong>2013</strong><span>Publicly<br />listed / reported</span></div>
        </div>
      </div>
    </section>
  );
}

function Beliefs() {
  return (
    <section className="beliefs section-pad" id="beliefs" aria-labelledby="beliefs-title">
      <div className="container-wide">
        <div className="eyebrow eyebrow-light">02 / What guides us</div>
        <h2 className="section-heading" id="beliefs-title">Learning that reaches beyond the lesson.</h2>
        <div className="belief-grid" style={{ marginTop: 48 }}>
          <article className="belief-card"><div className="belief-index">01</div><h3>Our Vision</h3><p>To nurture confident, knowledgeable and responsible young individuals who are prepared to contribute positively to society.</p></article>
          <article className="belief-card"><div className="belief-index">02</div><h3>Our Mission</h3><p>To provide students with a supportive and engaging learning environment that encourages academic curiosity, discipline, creativity, character and holistic development.</p></article>
        </div>
        <p className="disclaimer">These are website positioning statements for this digital front door, not claimed as the school’s official statements.</p>
      </div>
    </section>
  );
}

function Academics() {
  return (
    <section className="section-pad" id="academics" aria-labelledby="academics-title">
      <div className="container-wide academics-grid">
        <div className="academic-intro">
          <div className="eyebrow">03 / Academics</div>
          <h2 className="section-heading" id="academics-title">Foundations for a curious mind.</h2>
          <p className="section-copy" style={{ marginTop: 25 }}>A thoughtful school journey gives children room to understand, practise, ask better questions and grow in confidence.</p>
           <a className="button-primary" style={{ marginTop: 26 }} href="/contact" data-testid="link-academics-contact">Ask about academics <ChevronRight size={16} aria-hidden="true" /></a>
        </div>
        <div>
          <div className="academic-board">
            <article className="academic-row"><h3>Learning</h3><p>Focus on conceptual understanding, academic foundations, communication, critical thinking, discipline and curiosity.</p></article>
            <article className="academic-row"><h3>Student Development</h3><p>Encouraging confidence, communication, teamwork, responsibility, creativity and problem solving alongside academic learning.</p></article>
            <article className="academic-row"><h3>Secondary Education</h3><p>Based on currently available public information, the school provides education through the secondary level.</p></article>
          </div>
          <div className="academic-note"><strong>Curriculum information</strong> — Please contact the school for the latest board, affiliation, classes and academic programme details.</div>
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className="choice-section section-pad" id="why-mgps" aria-labelledby="why-title">
      <div className="container-wide choice-layout">
        <div className="choice-intro">
          <div className="eyebrow">04 / The MGPS difference</div>
          <h2 className="section-heading" id="why-title">The everyday things that matter.</h2>
          <p className="section-copy" style={{ marginTop: 25 }}>A warm, purposeful learning environment is built through small habits: attention, respect, participation and care.</p>
        </div>
        <div className="choice-grid">
          {whyChooseItems.map(([title, copy], index) => <article className="choice-card" key={title} data-testid={`card-why-${index + 1}`}><div className="choice-num">0{index + 1}</div><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="section-pad" id="gallery" aria-labelledby="gallery-title">
      <div className="container-wide">
        <div className="gallery-head"><div><div className="eyebrow">05 / The environment</div><h2 className="section-heading" id="gallery-title">A visual story, ready to be filled.</h2></div><p className="section-copy">School photography will make this space truly yours. For now, each panel is clearly marked for an approved image.</p></div>
        <div className="gallery-grid">
          {galleryItems.map((item, index) => <div className="gallery-placeholder" key={item.label} data-testid={`placeholder-gallery-${index + 1}`}><div className="gallery-label">{item.label}<small>{item.caption}</small></div></div>)}
        </div>
        <div className="gallery-foot"><CircleAlert size={14} aria-hidden="true" /> No school photographs have been fabricated. Replace these CMS-ready panels with approved images.</div>
      </div>
    </section>
  );
}

function AdmissionForm() {
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const update = (key: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status !== 'idle') setStatus('idle');
  };

  const validate = () => {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.guardian.trim()) next.guardian = 'Please enter a parent or guardian name.';
    if (!values.student.trim()) next.student = 'Please enter the student’s name.';
    if (!values.seekingClass.trim()) next.seekingClass = 'Please tell us the class you are considering.';
    if (!/^[0-9+\s()-]{8,}$/.test(values.phone.trim())) next.phone = 'Please enter a valid phone number.';
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Please enter a valid email address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    window.setTimeout(() => setStatus('success'), 900);
  };

  return (
    <form className="form-card" onSubmit={submit} noValidate aria-label="Admission enquiry form">
      {status === 'success' && <div className="form-status success" role="status" aria-live="polite" data-testid="status-enquiry-success"><Check size={15} style={{ verticalAlign: 'middle', marginRight: 7 }} aria-hidden="true" /> This preview enquiry has been recorded locally. It is not connected to the school yet.</div>}
      {status === 'error' && Object.keys(errors).length > 0 && <div className="form-status error" role="alert" data-testid="status-enquiry-error"><CircleAlert size={15} style={{ verticalAlign: 'middle', marginRight: 7 }} aria-hidden="true" /> Please review the highlighted fields and try again.</div>}
      <div className="form-grid">
        <Field id="guardian" label="Parent / Guardian Name" value={values.guardian} error={errors.guardian} required onChange={(value) => update('guardian', value)} />
        <Field id="student" label="Student Name" value={values.student} error={errors.student} required onChange={(value) => update('student', value)} />
        <Field id="current-class" label="Student’s Current Class" value={values.currentClass} onChange={(value) => update('currentClass', value)} />
        <Field id="seeking-class" label="Class Seeking Admission" value={values.seekingClass} error={errors.seekingClass} required onChange={(value) => update('seekingClass', value)} />
        <Field id="phone" label="Phone Number" type="tel" value={values.phone} error={errors.phone} required onChange={(value) => update('phone', value)} />
        <Field id="email" label="Email" type="email" value={values.email} error={errors.email} onChange={(value) => update('email', value)} />
        <div className="field full"><label htmlFor="message">Message <span aria-hidden="true">(optional)</span></label><textarea id="message" value={values.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us what you would like to know." data-testid="input-message" /></div>
      </div>
      <button className="button-primary" style={{ border: 0, cursor: status === 'loading' ? 'wait' : 'pointer', marginTop: 22 }} type="submit" disabled={status === 'loading'} data-testid="button-submit-enquiry">{status === 'loading' ? 'Preparing preview…' : 'Send Admission Enquiry'} <Send size={15} aria-hidden="true" /></button>
      <p className="preview-note">Preview only — this form does not send data to Maa Gayatri Public School until an email, WhatsApp, backend API, Google Sheet or CRM connection is configured.</p>
    </form>
  );
}

function Field({ id, label, value, error, required, type = 'text', onChange }: { id: string; label: string; value: string; error?: string; required?: boolean; type?: string; onChange: (value: string) => void }) {
  return <div className="field"><label htmlFor={id}>{label} {required && <span aria-hidden="true">*</span>}</label><input id={id} type={type} value={value} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(event.target.value)} data-testid={`input-${id}`} />{error && <span className="field-error" id={`${id}-error`} role="alert">{error}</span>}</div>;
}

function Admissions() {
  return (
    <section className="admission-wrap section-pad" id="admissions" aria-labelledby="admission-title">
      <div className="container-wide admission-grid">
        <div className="admission-aside"><div className="eyebrow eyebrow-light">06 / Admissions</div><h2 className="section-heading" id="admission-title">Give your child a strong start.</h2><p>Interested in Maa Gayatri Public School? Contact the school to learn about current admissions, available classes, requirements and important dates.</p><a className="button-quiet" href={school.whatsappHref} target="_blank" rel="noreferrer" data-testid="link-admission-whatsapp"><MessageCircle size={16} aria-hidden="true" /> Ask on WhatsApp</a></div>
        <AdmissionForm />
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section section-pad" id="contact" aria-labelledby="contact-title">
      <div className="container-wide contact-grid">
        <div>
          <div className="eyebrow eyebrow-light">07 / Find us</div>
          <h2 className="section-heading" id="contact-title">A conversation is the next step.</h2>
          <p className="section-copy" style={{ marginTop: 24 }}>For the latest information about admissions, classes, curriculum, requirements and office timings, please contact the school directly.</p>
          <div className="contact-list">
            <div className="contact-item"><MapPin size={19} aria-hidden="true" /><div><strong>Address</strong>{school.addressLines.map((line) => <span key={line}>{line}</span>)}</div></div>
            <div className="contact-item"><Phone size={19} aria-hidden="true" /><div><strong>Phone</strong><a href={school.phoneHref} data-testid="link-contact-phone">{school.phoneDisplay}</a></div></div>
            <div className="contact-item"><Mail size={19} aria-hidden="true" /><div><strong>Email</strong><a href={school.emailHref} data-testid="link-contact-email">{school.email}</a></div></div>
          </div>
          <div className="contact-actions"><a className="button-primary" href={school.phoneHref} data-testid="link-contact-call"><Phone size={15} aria-hidden="true" /> Call Now</a><a className="button-quiet" href={school.whatsappHref} target="_blank" rel="noreferrer" data-testid="link-contact-whatsapp"><MessageCircle size={15} aria-hidden="true" /> WhatsApp</a><a className="button-quiet" href={school.directionsHref} target="_blank" rel="noreferrer" data-testid="link-contact-directions"><Compass size={15} aria-hidden="true" /> Get Directions</a></div>
        </div>
        <aside className="contact-card"><h3>Plan your visit</h3><p>School Office Hours — Please contact the school for current timings. Public listings currently contain inconsistent opening-hour information.</p><div className="map-placeholder"><MapPin size={24} aria-hidden="true" /><p>Map embed intentionally omitted until the correct school location can be verified. Use the directions link to open a location search.</p><a className="button-quiet" href={school.directionsHref} target="_blank" rel="noreferrer" data-testid="link-map-directions">Open directions <ChevronRight size={15} aria-hidden="true" /></a></div></aside>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div><Brand /><p>{school.name} is an English-medium co-educational school in Muzaffarpur, Bihar. A temporary text identity is used until an official logo is supplied.</p></div>
          <div><h3>Explore</h3><div className="footer-links">{navItems.map((item) => <a href={item.href} key={item.href} data-testid={`link-footer-${item.label.toLowerCase()}`}>{item.label}</a>)}</div></div>
          <div className="footer-contact"><h3>Contact</h3><a href={school.phoneHref} data-testid="link-footer-phone">{school.phoneDisplay}</a><a href={school.emailHref} data-testid="link-footer-email">{school.email}</a><span>{school.addressLines.map((line) => <span key={line}>{line}<br /></span>)}</span></div>
        </div>
        <div className="footer-bottom"><span data-testid="text-copyright">© 2026 {school.name}. All Rights Reserved.</span><span>{school.developer ? `Website designed and developed by ${school.developer}` : 'Website content and developer details can be configured here.'}</span></div>
      </div>
    </footer>
  );
}

function MobileCta() {
  return <div className="mobile-cta" aria-label="Quick contact"><a href={school.phoneHref} data-testid="link-mobile-call"><Phone aria-hidden="true" />Call</a><a href={school.whatsappHref} target="_blank" rel="noreferrer" data-testid="link-mobile-whatsapp"><MessageCircle aria-hidden="true" />WhatsApp</a><a href={school.directionsHref} target="_blank" rel="noreferrer" data-testid="link-mobile-directions"><Compass aria-hidden="true" />Directions</a></div>;
}

function PageHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="container-wide">
        <div className="eyebrow eyebrow-light">{eyebrow}</div>
        <h1 id="page-title" className="section-heading">{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}

function HomeWelcome() {
  return (
    <section className="section-pad section-band home-welcome" aria-labelledby="welcome-title">
      <div className="container-wide home-welcome-grid">
        <div>
          <div className="eyebrow">01 / Start here</div>
          <h2 className="section-heading" id="welcome-title">A steady place to begin well.</h2>
          <div className="gold-rule" style={{ marginTop: 26 }} />
          <p className="section-copy" style={{ marginTop: 24 }}>
            Maa Gayatri Public School is an English-medium co-educational school in Muzaffarpur, focused on academic growth, confidence, discipline and character.
          </p>
          <a className="button-primary" style={{ marginTop: 26 }} href="/about" data-testid="link-home-about">About the school <ChevronRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="home-welcome-card">
          <div className="home-welcome-card-label">A parent’s first look</div>
          <h3>Everything you need to take the next step.</h3>
          <div className="home-welcome-links">
            <a href="/academics">Explore academics <ChevronRight size={15} aria-hidden="true" /></a>
            <a href="/gallery">See the learning environment <ChevronRight size={15} aria-hidden="true" /></a>
            <a href="/contact">Contact the school <ChevronRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeNextStep() {
  return (
    <section className="section-pad home-next-step" aria-labelledby="next-step-title">
      <div className="container-wide home-next-step-grid">
        <div>
          <div className="eyebrow">02 / Your next step</div>
          <h2 className="section-heading" id="next-step-title">Have a question? Start a conversation.</h2>
        </div>
        <div>
          <p className="section-copy">For current admissions, classes, curriculum, requirements and office timings, please contact the school directly.</p>
          <div className="contact-actions">
            <a className="button-primary" href="/admissions">Admission Enquiry <ChevronRight size={16} aria-hidden="true" /></a>
            <a className="text-link" href="/contact">Call or message the school <ChevronRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return <div className="site-shell"><Header /><main><Hero /><TrustStrip /><HomeWelcome /><HomeNextStep /></main><Footer /><MobileCta /></div>;
}

function AboutPage() {
  return <div className="site-shell"><Header /><main><PageHeader eyebrow="01 / The school" title="A school journey built on steady foundations." copy="Get to know Maa Gayatri Public School, its setting in Muzaffarpur and the values that shape this digital front door." /><About /><Beliefs /><WhyChoose /></main><Footer /><MobileCta /></div>;
}

function AcademicsPage() {
  return <div className="site-shell"><Header /><main><PageHeader eyebrow="02 / Academics" title="Foundations for a curious mind." copy="Explore the learning focus, student development priorities and secondary-level education described in currently available public information." /><Academics /></main><Footer /><MobileCta /></div>;
}

function AdmissionsPage() {
  return <div className="site-shell"><Header /><main><PageHeader eyebrow="03 / Admissions" title="Give your child a strong start." copy="Contact the school to learn about current admissions, available classes, requirements and important dates." /><Admissions /></main><Footer /><MobileCta /></div>;
}

function GalleryPage() {
  return <div className="site-shell"><Header /><main><PageHeader eyebrow="04 / The environment" title="A visual story, ready to be filled." copy="Approved campus, classroom and activity photography can make this space truly yours. Until then, every panel is clearly marked for replacement." /><Gallery /></main><Footer /><MobileCta /></div>;
}

function ContactPage() {
  return <div className="site-shell"><Header /><main><PageHeader eyebrow="05 / Find us" title="A conversation is the next step." copy="Reach Maa Gayatri Public School directly for the latest information about admissions, classes, curriculum, requirements and office timings." /><Contact /></main><Footer /><MobileCta /></div>;
}

function NotFound() {
  const [, setLocation] = useLocation();
  return <div className="not-found"><div><div className="eyebrow">Page not found</div><h1 className="section-heading">Let’s return to the school.</h1><button className="button-primary" style={{ border: 0, cursor: 'pointer', marginTop: 28 }} type="button" onClick={() => { setLocation('/'); window.setTimeout(scrollToTop, 20); }} data-testid="button-not-found-home">Back to home <ChevronRight size={16} aria-hidden="true" /></button></div></div>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/about" component={AboutPage} /><Route path="/academics" component={AcademicsPage} /><Route path="/admissions" component={AdmissionsPage} /><Route path="/gallery" component={GalleryPage} /><Route path="/contact" component={ContactPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;