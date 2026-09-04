import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Compass,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Layers3,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  Save,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";
import schoolLogo from "./assets/mgps-school-logo.jpg";
import {
  defaultContent,
  type Admission,
  type GalleryItem,
  type Notice,
  type SiteContent,
} from "./siteContent";

const queryClient = new QueryClient();

type ContentContextValue = {
  content: SiteContent;
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  reset: () => void;
  connected: boolean;
  saving: boolean;
  authenticated: boolean;
  authReady: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
};
const ContentContext = createContext<ContentContextValue | null>(null);

function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [ready, setReady] = useState(false);
  const [connected, setConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((response) => response.json() as Promise<{ authenticated: boolean }>)
      .then((session) => setAuthenticated(session.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthReady(true));
  }, []);
  useEffect(() => {
    fetch("/api/site-content")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load content");
        return response.json() as Promise<SiteContent>;
      })
      .then((remoteContent) => {
        setContent({ ...defaultContent, ...remoteContent });
        setConnected(true);
      })
      .catch(() => setConnected(false))
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (!ready || !authenticated) return;
    const saveTimer = window.setTimeout(() => {
      setSaving(true);
      fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Unable to save content");
          setConnected(true);
        })
        .catch(() => setConnected(false))
        .finally(() => setSaving(false));
    }, 300);
    return () => window.clearTimeout(saveTimer);
  }, [content, ready]);
  const value = useMemo(
    () => ({
      content,
      update: <K extends keyof SiteContent>(key: K, next: SiteContent[K]) =>
        setContent((current) => ({ ...current, [key]: next })),
      reset: () => setContent(defaultContent),
      connected,
      saving,
      authenticated,
      authReady,
      login: async (email: string, password: string) => {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!response.ok) {
            const body = (await response.json().catch(() => null)) as { message?: string } | null;
            return { ok: false, message: body?.message || "Unable to sign in." };
          }
          setAuthenticated(true);
          return { ok: true };
        } catch {
          return { ok: false, message: "Unable to reach the server. Try again." };
        }
      },
      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => undefined);
        setAuthenticated(false);
      },
    }),
    [content, connected, saving, authenticated, authReady],
  );
  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

function useContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error("useContent must be used inside ContentProvider");
  return value;
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

type SeoPage = {
  title: string;
  description: string;
};

const seoPages: Record<string, SeoPage> = {
  "/": {
    title: "Maa Gayatri Public School | English-Medium School in Muzaffarpur, Bihar",
    description:
      "Maa Gayatri Public School is an English-medium co-educational school in Muzaffarpur, Bihar. Explore academics, admissions, notices, facilities and school life.",
  },
  "/about": {
    title: "About Us | Maa Gayatri Public School, Muzaffarpur",
    description:
      "Learn about Maa Gayatri Public School, its values and its supportive English-medium learning environment in Muzaffarpur, Bihar.",
  },
  "/academics": {
    title: "Academics & Classes | Maa Gayatri Public School",
    description:
      "Explore the primary, middle and secondary learning journey at Maa Gayatri Public School in Muzaffarpur.",
  },
  "/faculty": {
    title: "Faculty & Staff | Maa Gayatri Public School",
    description:
      "Meet the teachers and staff who guide, teach and support students at Maa Gayatri Public School, Muzaffarpur.",
  },
  "/admissions": {
    title: "Online Admission Enquiry | Maa Gayatri Public School",
    description:
      "Submit an online admission enquiry for Maa Gayatri Public School, Muzaffarpur, and receive the latest information from the school office.",
  },
  "/notices": {
    title: "Notices & Announcements | Maa Gayatri Public School",
    description:
      "Read the latest school notices, admission updates, events, circulars and announcements from Maa Gayatri Public School.",
  },
  "/gallery": {
    title: "Photo Gallery | Maa Gayatri Public School",
    description:
      "Browse campus, classroom, activity and celebration moments from Maa Gayatri Public School in Muzaffarpur.",
  },
  "/achievements": {
    title: "Achievements | Maa Gayatri Public School",
    description:
      "Discover the milestones and proud moments of the Maa Gayatri Public School community in Muzaffarpur.",
  },
  "/facilities": {
    title: "Facilities | Maa Gayatri Public School",
    description:
      "Explore the school spaces and resources that support learning at Maa Gayatri Public School, Muzaffarpur.",
  },
  "/contact": {
    title: "Contact & Location | Maa Gayatri Public School",
    description:
      "Contact Maa Gayatri Public School on Purani Darbhanga Road, Sahwajpur/Shahbazpur, Muzaffarpur, Bihar for school information and admissions.",
  },
};

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
    document.head.appendChild(element);
  }
  element.content = content;
}

function SeoMetadata({ path, noIndex = false }: { path: string; noIndex?: boolean }) {
  const { content } = useContent();
  useEffect(() => {
    const page = seoPages[path] || {
      title: `Page not found | ${content.schoolName}`,
      description: "The page you requested could not be found.",
    };
    const origin = window.location.origin.replace(/\/$/, "");
    const canonicalPath = path === "/" ? "" : path.replace(/\/$/, "");
    const pageUrl = `${origin}${canonicalPath || "/"}`;
    const logoUrl = `${origin}/images/mgps-school-logo.jpg`;
    const robots = noIndex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    document.title = page.title;
    upsertMeta('meta[name="description"]', { name: "description" }, page.description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, page.title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, page.description);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, pageUrl);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, logoUrl);
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, `${content.schoolName} logo`);
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, page.title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, page.description);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, logoUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    const previousSchema = document.getElementById("school-seo-schema");
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "School",
          "@id": `${origin}/#school`,
          name: content.schoolName,
          alternateName: "MGPS",
          url: origin,
          logo: logoUrl,
          image: logoUrl,
          description: seoPages["/"].description,
          telephone: content.phone,
          email: content.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: content.address,
            addressLocality: "Muzaffarpur",
            addressRegion: "Bihar",
            postalCode: "842004",
            addressCountry: "IN",
          },
          areaServed: { "@type": "City", name: "Muzaffarpur" },
          knowsLanguage: ["English", "Hindi"],
        },
        {
          "@type": "WebSite",
          "@id": `${origin}/#website`,
          url: origin,
          name: content.schoolName,
          publisher: { "@id": `${origin}/#school` },
          inLanguage: "en-IN",
        },
        {
          "@type": "WebPage",
          "@id": `${pageUrl}#webpage`,
          url: pageUrl,
          name: page.title,
          description: page.description,
          isPartOf: { "@id": `${origin}/#website` },
          about: { "@id": `${origin}/#school` },
          inLanguage: "en-IN",
        },
      ],
    };
    const schemaTag = previousSchema || document.createElement("script");
    schemaTag.id = "school-seo-schema";
    schemaTag.setAttribute("type", "application/ld+json");
    schemaTag.textContent = JSON.stringify(schema);
    if (!previousSchema) document.head.appendChild(schemaTag);
  }, [content, noIndex, path]);
  return null;
}

const publicNav = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Academics & Classes", "/academics"],
  ["Faculty & Staff", "/faculty"],
  ["Notices", "/notices"],
  ["Gallery", "/gallery"],
  ["Achievements", "/achievements"],
  ["Facilities", "/facilities"],
  ["Contact", "/contact"],
];

function Brand() {
  const { content } = useContent();
  return (
    <a
      className="brand-mark"
      href="/"
      aria-label={`${content.schoolName} home`}
    >
      <span className="brand-seal" aria-hidden="true">
        <img src={schoolLogo} alt="" />
      </span>
      <span>
        <span className="brand-name">{content.schoolName}</span>
        <span className="brand-caption">Muzaffarpur · Bihar</span>
      </span>
    </a>
  );
}

function Header() {
  const { content } = useContent();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <div className="announcement">
        <div className="container-wide announcement-inner">
          <span>
            <ShieldCheck size={14} /> {content.tagline}
          </span>
          <a href={`tel:${content.phone.replace(/\D/g, "")}`}>
            Call {content.phone}
          </a>
        </div>
      </div>
      <header className={`nav-bar${scrolled ? " is-scrolled" : ""}`}>
        <div className="container-wide nav-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {publicNav.map(([label, href]) => (
              <a
                className={`nav-link${location === href ? " active" : ""}`}
                href={href}
                key={href}
                aria-current={location === href ? "page" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <a className="button-primary desktop-admission" href="/admissions">
            Admission Enquiry <ChevronRight size={16} />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>
      <div className="nav-placeholder" aria-hidden="true" />
      <nav
        className={`mobile-menu${open ? " open" : ""}${scrolled ? " is-scrolled" : ""}`}
        aria-label="Mobile navigation"
      >
        <div className="container-wide">
          {publicNav.map(([label, href]) => (
            <a
              className={location === href ? "active" : undefined}
              href={href}
              onClick={() => setOpen(false)}
              key={href}
              aria-current={location === href ? "page" : undefined}
            >
              {label}
            </a>
          ))}
          <a
            className="button-primary"
            href="/admissions"
            onClick={() => setOpen(false)}
          >
            Admission Enquiry <ChevronRight size={16} />
          </a>
        </div>
      </nav>
    </>
  );
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}
function whatsappHref(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=Hello%20Maa%20Gayatri%20Public%20School`;
}
function mapHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const icons: Record<string, typeof BookOpen> = {
    book: BookOpen,
    sparkles: Sparkles,
    shield: ShieldCheck,
    map: MapPin,
    award: Award,
    calendar: CalendarDays,
    layers: Layers3,
    users: Users,
  };
  const Component = icons[name] || Sparkles;
  return <Component size={size} aria-hidden="true" />;
}

function PageHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <section className="page-hero">
      <div className="container-wide">
        <div className="page-hero-crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <ChevronRight size={14} aria-hidden="true" />
          <span>{eyebrow.replace(/^\d+\s*\/\s*/, "")}</span>
        </div>
        <div className="eyebrow eyebrow-light">{eyebrow}</div>
        <h1 className="section-heading">{title}</h1>
        <p>{copy}</p>
        <div className="page-hero-details" aria-label="School information">
          <span><ShieldCheck size={15} aria-hidden="true" /> Established 2013</span>
          <span><MapPin size={15} aria-hidden="true" /> Muzaffarpur, Bihar</span>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const { content } = useContent();
  return (
    <section className="hero" id="home">
      <div className="hero-art" aria-hidden="true">
        <span className="hero-art-label">
          A welcoming place to learn, grow and belong
        </span>
      </div>
      <div className="container-wide hero-content">
        <div className="hero-copy">
          <div className="hero-kicker">A school for the road ahead</div>
          <h1 className="display-font">{content.heroTitle}</h1>
          <p>{content.heroCopy}</p>
          <div className="hero-actions">
            <a className="button-primary" href="/admissions">
              Online Admission Enquiry <ChevronRight size={17} />
            </a>
            <a className="button-quiet" href="/about">
              Explore Our School
            </a>
          </div>
          <div className="hero-ledger" aria-label="School at a glance">
            <div>
              <strong>2013</strong>
              <span>Established</span>
            </div>
            <div>
              <strong>English</strong>
              <span>Medium school</span>
            </div>
            <div>
              <strong>Secondary</strong>
              <span>Learning journey</span>
            </div>
          </div>
          <div className="hero-note">
            <MapPin size={14} /> {content.address}
          </div>
        </div>
        <aside className="hero-spotlight" aria-label="School highlights">
          <div className="hero-spotlight-mark"><GraduationCap size={26} /></div>
          <span className="hero-spotlight-label">Learning with purpose</span>
          <h2>A confident start for every child.</h2>
          <p>A caring school environment for focused learning, friendships and growth.</p>
          <div className="hero-spotlight-list">
            <span><BookOpen size={16} /> English-medium learning</span>
            <span><Users size={16} /> Co-educational school</span>
            <span><MapPin size={16} /> Rooted in Muzaffarpur</span>
          </div>
        </aside>
      </div>
      <div className="container-wide quick-contact">
        <a href={phoneHref(content.phone)}>
          <Phone size={16} /> Call School
        </a>
        <a href={whatsappHref(content.phone)} target="_blank" rel="noreferrer">
          <MessageCircle size={16} /> WhatsApp
        </a>
        <a href={mapHref(content.address)} target="_blank" rel="noreferrer">
          <Compass size={16} /> Get Directions
        </a>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    ["Established", "2013"],
    ["English Medium", "A focused learning environment"],
    ["Co-Educational", "A school for every learner"],
    ["Secondary Level", "Education through the secondary level"],
    ["Supportive", "Space to learn and grow"],
    ["Muzaffarpur", "Locally rooted in Bihar"],
  ];
  return (
    <section className="trust-strip">
      <div className="container-wide trust-grid">
        {items.map(([label, detail], i) => (
          <div className="trust-item" key={label}>
            <Icon
              name={["calendar", "book", "users", "layers", "heart", "map"][i]}
              size={19}
            />
            <span>
              <span className="trust-label">{label}</span>
              <span className="trust-detail">{detail}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  const { content } = useContent();
  return (
    <section className="section-pad" id="about">
      <div className="container-wide about-grid">
        <div className="about-copy">
          <div className="eyebrow">01 / The school</div>
          <h2 className="section-heading">A steady place to begin well.</h2>
          <div className="gold-rule" style={{ marginTop: 26 }} />
          <p>{content.aboutCopy}</p>
          <ul className="about-list">
            <li>
              <MapPin size={17} /> Located in Muzaffarpur, Bihar
            </li>
            <li>
              <BookOpen size={17} /> English-medium education
            </li>
            <li>
              <Users size={17} /> Co-educational environment
            </li>
            <li>
              <ShieldCheck size={17} /> Supportive learning culture
            </li>
          </ul>
          <a className="text-link" style={{ marginTop: 28 }} href="/about">
            Learn more about our school <ChevronRight size={16} />
          </a>
        </div>
        <div className="about-visual">
          <div className="editorial-frame">
            <div className="frame-pattern" />
            <div className="frame-copy">
              <div className="frame-number">13</div>
              <div className="frame-label">
                A local school identity
                <br />
                rooted in Muzaffarpur
              </div>
            </div>
          </div>
          <div className="about-tag">
            <strong>2013</strong>
            <span>
              Established
              <br />
              school
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Beliefs() {
  return (
    <section className="beliefs section-pad">
      <div className="container-wide">
        <div className="eyebrow eyebrow-light">02 / What guides us</div>
        <h2 className="section-heading">
          Learning that reaches beyond the lesson.
        </h2>
        <div className="belief-grid" style={{ marginTop: 48 }}>
          <article className="belief-card">
            <div className="belief-index">01</div>
            <h3>Our Vision</h3>
            <p>
              To nurture confident, knowledgeable and responsible young
              individuals who are prepared to contribute positively to society.
            </p>
          </article>
          <article className="belief-card">
            <div className="belief-index">02</div>
            <h3>Our Mission</h3>
            <p>
              To provide a supportive and engaging environment that encourages
              academic curiosity, discipline, creativity, character and holistic
              development.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function AcademicsSection() {
  return (
    <section className="section-pad">
      <div className="container-wide academics-grid">
        <div className="academic-intro">
          <div className="eyebrow">03 / Academics & classes</div>
          <h2 className="section-heading">Foundations for a curious mind.</h2>
          <p className="section-copy" style={{ marginTop: 25 }}>
            A thoughtful school journey gives children room to understand,
            practise, ask better questions and grow in confidence.
          </p>
          <a
            className="button-primary"
            style={{ marginTop: 26 }}
            href="/contact"
          >
            Ask about academics <ChevronRight size={16} />
          </a>
        </div>
        <div>
          <div className="academic-board">
            <article className="academic-row">
              <h3>Primary classes</h3>
              <p>
                Strong foundations in language, numeracy, environmental
                awareness, communication and joyful learning.
              </p>
            </article>
            <article className="academic-row">
              <h3>Middle classes</h3>
              <p>
                Building understanding, study habits, teamwork, critical
                thinking and confidence across subjects.
              </p>
            </article>
            <article className="academic-row">
              <h3>Secondary classes</h3>
              <p>
                Focused subject learning, mentoring and preparation for the next
                stage of a student’s education.
              </p>
            </article>
          </div>
          <div className="academic-note">
            <strong>Need current class details?</strong> Please contact the
            school for the latest board, affiliation, class availability and
            academic programme information.
          </div>
        </div>
      </div>
    </section>
  );
}

function FacultySection() {
  const { content } = useContent();
  return (
    <section className="section-pad section-band">
      <div className="container-wide">
        <div className="eyebrow">04 / Faculty & staff</div>
        <h2 className="section-heading">
          People who make school feel personal.
        </h2>
        <p className="section-copy" style={{ marginTop: 22 }}>
          Our teachers and support staff help students feel seen, supported and
          ready to participate.
        </p>
        <div className="people-grid">
          {content.faculty.map((person) => (
            <article className="person-card" key={person.id}>
              <div className="person-avatar">{person.initials}</div>
              <div>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
                <span>{person.subject}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NoticesSection({ preview = false }: { preview?: boolean }) {
  const { content } = useContent();
  const notices = preview ? content.notices.slice(0, 3) : content.notices;
  return (
    <section className="section-pad" id="notices">
      <div className="container-wide">
        <div className="section-topline">
          <div>
            <div className="eyebrow">05 / Notices & announcements</div>
            <h2 className="section-heading">What’s happening at school.</h2>
          </div>
          {preview && (
            <a className="text-link" href="/notices">
              View all notices <ArrowRight size={16} />
            </a>
          )}
        </div>
        <div className="notice-list">
          {notices.map((notice) => {
            const cardContent = (
              <>
                <div className="notice-date">
                  <strong>{notice.date.split(" ")[0]}</strong>
                  <span>{notice.date.split(" ").slice(1).join(" ")}</span>
                </div>
                <div className="notice-copy">
                  <span className="notice-category">{notice.category}</span>
                  <h3>{notice.title}</h3>
                  <p>{notice.excerpt}</p>
                </div>
                {preview && <ArrowRight className="notice-arrow" size={18} aria-hidden="true" />}
              </>
            );
            return preview ? (
              <a
                className={`notice-card${notice.featured ? " featured" : ""}`}
                href={`/notices#${notice.id}`}
                key={notice.id}
                aria-label={`Read notice: ${notice.title}`}
              >
                {cardContent}
              </a>
            ) : (
              <article
                className={`notice-card${notice.featured ? " featured" : ""}`}
                id={notice.id}
                key={notice.id}
              >
                {cardContent}
              </article>
            );
          })}
          {notices.length === 0 && (
            <div className="empty-state">No notices published yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ preview = false }: { preview?: boolean }) {
  const { content } = useContent();
  const gallery = preview ? content.gallery.slice(0, 5) : content.gallery;
  return (
    <section className="section-pad" id="gallery">
      <div className="container-wide">
        <div className="section-topline">
          <div>
            <div className="eyebrow">06 / Photo gallery</div>
            <h2 className="section-heading">A visual story of school life.</h2>
          </div>
          {preview && (
            <a className="text-link" href="/gallery">
              Open gallery <ArrowRight size={16} />
            </a>
          )}
        </div>
        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <div
              className="gallery-placeholder"
              key={item.id}
              style={
                item.image
                  ? {
                      backgroundImage: `linear-gradient(rgba(19,56,95,.08),rgba(19,56,95,.38)), url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <div className="gallery-label">
                <ImageIcon size={18} />
                {item.title}
                <small>{item.caption}</small>
              </div>
            </div>
          ))}
        </div>
        {!preview && (
          <div className="gallery-foot">
            <CircleAlert size={14} /> Upload approved images from the Admin
            Dashboard to replace these content-ready panels.
          </div>
        )}
      </div>
    </section>
  );
}

function AchievementsSection() {
  const { content } = useContent();
  return (
    <section className="section-pad section-band">
      <div className="container-wide">
        <div className="eyebrow">07 / Achievements</div>
        <h2 className="section-heading">
          Every milestone is worth celebrating.
        </h2>
        <div className="achievement-grid">
          {content.achievements.map((item) => (
            <article className="achievement-card" key={item.id}>
              <div className="achievement-year">{item.year}</div>
              <Award size={22} />
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FacilitiesSection() {
  const { content } = useContent();
  return (
    <section className="section-pad">
      <div className="container-wide">
        <div className="eyebrow">08 / Facilities</div>
        <h2 className="section-heading">
          The everyday spaces that support learning.
        </h2>
        <div className="facility-grid">
          {content.facilities.map((item) => (
            <article className="facility-card" key={item.id}>
              <div className="facility-icon">
                <Icon name={item.icon} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdmissionForm() {
  const { content, update } = useContent();
  const [values, setValues] = useState({
    guardian: "",
    student: "",
    currentClass: "",
    seekingClass: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (
      !values.guardian ||
      !values.student ||
      !values.seekingClass ||
      !/^[0-9+\s()-]{8,}$/.test(values.phone)
    ) {
      setError(
        "Please complete the required fields with a valid phone number.",
      );
      setStatus("error");
      return;
    }
    const enquiry: Admission = {
      ...values,
      id: `enq-${Date.now()}`,
      submittedAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "New",
    };
    update("admissions", [enquiry, ...content.admissions]);
    setValues({
      guardian: "",
      student: "",
      currentClass: "",
      seekingClass: "",
      phone: "",
      email: "",
      message: "",
    });
    setError("");
    setStatus("success");
  };
  const field = (
    id: keyof typeof values,
    label: string,
    required = false,
    type = "text",
  ) => (
    <div className="field">
      <label htmlFor={id}>
        {label} {required && "*"}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={values[id]}
        onChange={(e) => {
          setValues({ ...values, [id]: e.target.value });
          setStatus("idle");
        }}
      />
    </div>
  );
  return (
    <form className="form-card" onSubmit={submit} noValidate>
      {status === "success" && (
        <div className="form-status success">
          <Check size={15} /> Enquiry received. The school office can now follow
          up from the Admin Dashboard.
        </div>
      )}
      {status === "error" && (
        <div className="form-status error">
          <CircleAlert size={15} /> {error}
        </div>
      )}
      <div className="form-grid">
        {field("guardian", "Parent / Guardian Name", true)}
        {field("student", "Student Name", true)}
        {field("currentClass", "Current Class")}
        {field("seekingClass", "Class Seeking Admission", true)}
        {field("phone", "Phone Number", true, "tel")}
        {field("email", "Email", false, "email")}
        <div className="field full">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
            placeholder="Tell us what you would like to know."
          />
        </div>
      </div>
      <button
        className="button-primary"
        style={{ border: 0, cursor: "pointer", marginTop: 22 }}
        type="submit"
      >
        Send Admission Enquiry <Send size={15} />
      </button>
      <p className="preview-note">
        Your enquiry is saved securely in this browser for the school
        administrator. Connect a backend or email service before production
        launch.
      </p>
    </form>
  );
}

function AdmissionsSection() {
  const { content } = useContent();
  return (
    <section className="admission-wrap section-pad">
      <div className="container-wide admission-grid">
        <div className="admission-aside">
          <div className="eyebrow eyebrow-light">
            09 / Online admission enquiry
          </div>
          <h2 className="section-heading">Give your child a strong start.</h2>
          <p>
            Tell us a little about your child and the class you are considering.
            The school office can review enquiries and update their status from
            the dashboard.
          </p>
          <a
            className="button-quiet"
            href={whatsappHref(content.phone)}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} /> Ask on WhatsApp
          </a>
        </div>
        <AdmissionForm />
      </div>
    </section>
  );
}

function ContactSection() {
  const { content } = useContent();
  return (
    <section className="contact-section section-pad" id="contact">
      <div className="container-wide contact-grid">
        <div>
          <div className="eyebrow eyebrow-light">10 / Contact & location</div>
          <h2 className="section-heading">A conversation is the next step.</h2>
          <p className="section-copy" style={{ marginTop: 24 }}>
            Reach the school directly for the latest information about
            admissions, classes, curriculum, requirements and office timings.
          </p>
          <div className="contact-list">
            <div className="contact-item">
              <MapPin size={19} />
              <div>
                <strong>Address</strong>
                <span>{content.address}</span>
              </div>
            </div>
            <div className="contact-item">
              <Phone size={19} />
              <div>
                <strong>Phone</strong>
                <a href={phoneHref(content.phone)}>{content.phone}</a>
              </div>
            </div>
            <div className="contact-item">
              <Mail size={19} />
              <div>
                <strong>Email</strong>
                <a href={`mailto:${content.email}`}>{content.email}</a>
              </div>
            </div>
          </div>
          <div className="contact-actions">
            <a className="button-primary" href={phoneHref(content.phone)}>
              <Phone size={15} /> Call Now
            </a>
            <a
              className="button-quiet"
              href={whatsappHref(content.phone)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
            <a
              className="button-quiet"
              href={mapHref(content.address)}
              target="_blank"
              rel="noreferrer"
            >
              <Compass size={15} /> Get Directions
            </a>
          </div>
        </div>
        <aside className="contact-card">
          <h3>Plan your visit</h3>
          <p>{content.officeHours}</p>
          <div className="map-placeholder">
            <MapPin size={24} />
            <p>
              Open the school location in Google Maps for directions from your
              current location.
            </p>
            <a
              className="button-quiet"
              href={mapHref(content.address)}
              target="_blank"
              rel="noreferrer"
            >
              Open directions <ChevronRight size={15} />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Footer() {
  const { content } = useContent();
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div>
            <Brand />
            <p>
              {content.schoolName} is an English-medium co-educational school in
              Muzaffarpur, Bihar. Helping every learner begin well.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <div className="footer-links">
              {publicNav.slice(0, 6).map(([label, href]) => (
                <a href={href} key={href}>
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-contact">
            <h3>Contact</h3>
            <a href={phoneHref(content.phone)}>{content.phone}</a>
            <a href={`mailto:${content.email}`}>{content.email}</a>
            <span>{content.address}</span>
            <a className="admin-footer-link" href="/admin">
              <LayoutDashboard size={14} /> Admin Dashboard
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {content.schoolName}. All Rights Reserved.</span>
          <span>Content can be updated by the school administrator.</span>
        </div>
      </div>
    </footer>
  );
}
function MobileCta() {
  const { content } = useContent();
  return (
    <div className="mobile-cta">
      <a href={phoneHref(content.phone)}>
        <Phone />
        Call
      </a>
      <a href={whatsappHref(content.phone)} target="_blank" rel="noreferrer">
        <MessageCircle />
        WhatsApp
      </a>
      <a href={mapHref(content.address)} target="_blank" rel="noreferrer">
        <Compass />
        Directions
      </a>
    </div>
  );
}
function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="site-shell">
      <SeoMetadata path={location} />
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileCta />
    </div>
  );
}

function Home() {
  return (
    <Shell>
      <Hero />
      <TrustStrip />
      <AboutSection />
      <NoticesSection preview />
      <AcademicsSection />
      <FacultySection />
      <GallerySection preview />
      <AchievementsSection />
      <FacilitiesSection />
      <AdmissionsSection />
      <ContactSection />
    </Shell>
  );
}
function AboutPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="01 / About us"
        title="A school journey built on steady foundations."
        copy="Get to know Maa Gayatri Public School, its setting in Muzaffarpur and the values that shape school life."
      />
      <AboutSection />
      <Beliefs />
    </Shell>
  );
}
function AcademicsPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="02 / Academics & classes"
        title="Foundations for a curious mind."
        copy="Explore the learning focus and class journey for students at Maa Gayatri Public School."
      />
      <AcademicsSection />
    </Shell>
  );
}
function FacultyPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="03 / Faculty & staff"
        title="People who make school feel personal."
        copy="Meet the teams who guide, teach and care for students each day."
      />
      <FacultySection />
    </Shell>
  );
}
function AdmissionsPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="04 / Admissions"
        title="Give your child a strong start."
        copy="Submit an online admission enquiry and the school office will follow up with the latest information."
      />
      <AdmissionsSection />
    </Shell>
  );
}
function NoticesPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="05 / Notices"
        title="The latest from school."
        copy="Keep up with admissions, events, circulars and important announcements."
      />
      <NoticesSection />
    </Shell>
  );
}
function GalleryPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="06 / Photo gallery"
        title="A visual story of school life."
        copy="Browse the school’s campus, classroom, activity and celebration moments."
      />
      <GallerySection />
    </Shell>
  );
}
function AchievementsPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="07 / Achievements"
        title="Every milestone is worth celebrating."
        copy="A collection of the moments and values the school community is proud of."
      />
      <AchievementsSection />
    </Shell>
  );
}
function FacilitiesPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="08 / Facilities"
        title="The everyday spaces that support learning."
        copy="Explore the spaces and resources that help students learn, participate and grow."
      />
      <FacilitiesSection />
    </Shell>
  );
}
function ContactPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="10 / Contact & location"
        title="A conversation is the next step."
        copy="Reach the school directly for the latest information and directions."
      />
      <ContactSection />
    </Shell>
  );
}

type Tab =
  "overview" | "content" | "notices" | "gallery" | "admissions" | "people";
function AdminSidebar({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
}) {
  const items: [Tab, string, typeof LayoutDashboard][] = [
    ["overview", "Overview", LayoutDashboard],
    ["content", "Website content", Settings],
    ["notices", "Notices", FileText],
    ["gallery", "Photo gallery", ImageIcon],
    ["admissions", "Admissions", GraduationCap],
    ["people", "Faculty & school", Users],
  ];
  return (
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/">
        <span className="brand-seal" aria-hidden="true"><img src={schoolLogo} alt="" /></span>
        <span>
          <strong>School CMS</strong>
          <small>{"Maa Gayatri Public School"}</small>
        </span>
      </a>
      <div className="admin-side-label">Manage website</div>
      <nav>
        {items.map(([id, label, IconComponent]) => (
          <button
            className={tab === id ? "active" : ""}
            onClick={() => setTab(id)}
            key={id}
          >
            <IconComponent size={17} />
            {label}
          </button>
        ))}
      </nav>
      <a className="admin-view-site" href="/">
        <ArrowRight size={15} /> View live website
      </a>
    </aside>
  );
}
function AdminField({
  label,
  value,
  onChange,
  area = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {area ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
function AdminOverview({ setTab }: { setTab: (tab: Tab) => void }) {
  const { content } = useContent();
  const cards: [string, string, Tab, typeof FileText][] = [
    ["Published notices", String(content.notices.length), "notices", FileText],
    ["Gallery panels", String(content.gallery.length), "gallery", ImageIcon],
    [
      "New enquiries",
      String(content.admissions.filter((item) => item.status === "New").length),
      "admissions",
      GraduationCap,
    ],
    ["Faculty & staff", String(content.faculty.length), "people", Users],
  ];
  return (
    <>
      <div className="admin-heading">
        <div>
          <div className="eyebrow">Admin workspace</div>
          <h1>Good morning, school team.</h1>
          <p>Keep your public website fresh from one simple place.</p>
        </div>
        <a className="button-primary" href="/">
          <ArrowRight size={16} /> View website
        </a>
      </div>
      <div className="admin-stat-grid">
        {cards.map(([label, value, tab, IconComponent]) => (
          <button
            className="admin-stat"
            key={label}
            onClick={() => setTab(tab)}
          >
            <IconComponent size={19} />
            <strong>{value}</strong>
            <span>{label}</span>
            <ArrowRight size={15} />
          </button>
        ))}
      </div>
      <div className="admin-two-col">
        <div className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <span>Quick actions</span>
              <h2>What would you like to update?</h2>
            </div>
            <Pencil size={19} />
          </div>
          <div className="quick-admin-actions">
            <button onClick={() => setTab("notices")}>
              <Plus size={16} /> Publish notice
            </button>
            <button onClick={() => setTab("gallery")}>
              <ImageIcon size={16} /> Add gallery image
            </button>
            <button onClick={() => setTab("admissions")}>
              <GraduationCap size={16} /> Review enquiries
            </button>
            <button onClick={() => setTab("content")}>
              <Settings size={16} /> Edit school details
            </button>
          </div>
        </div>
        <div className="admin-panel admin-tip">
          <Sparkles size={21} />
          <div>
            <span>Simple editing</span>
            <h2>Changes save automatically</h2>
            <p>
              Updates are stored in this browser and appear immediately on the
              public pages. Connect a database before publishing to multiple
              devices.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function AdminContent() {
  const { content, update } = useContent();
  const set = (key: keyof SiteContent) => (value: string) =>
    update(key, value as never);
  return (
    <>
      <div className="admin-panel">
        <div className="admin-panel-title">
          <div>
            <span>Website content</span>
            <h2>School identity & contact details</h2>
          </div>
          <Save size={19} />
        </div>
        <p className="admin-help">
          Update the text parents see across the home page, header and contact
          page.
        </p>
        <div className="admin-form-grid">
          <AdminField
            label="School name"
            value={content.schoolName}
            onChange={set("schoolName")}
          />
          <AdminField
            label="Short name"
            value={content.shortName}
            onChange={set("shortName")}
          />
          <AdminField
            label="Top announcement"
            value={content.tagline}
            onChange={set("tagline")}
          />
          <AdminField
            label="Hero headline"
            value={content.heroTitle}
            onChange={set("heroTitle")}
          />
          <AdminField
            label="Phone number"
            value={content.phone}
            onChange={set("phone")}
          />
          <AdminField
            label="Email address"
            value={content.email}
            onChange={set("email")}
          />
          <AdminField
            label="Office hours"
            value={content.officeHours}
            onChange={set("officeHours")}
          />
          <AdminField
            label="Hero introduction"
            value={content.heroCopy}
            onChange={set("heroCopy")}
            area
          />
          <AdminField
            label="About the school"
            value={content.aboutCopy}
            onChange={set("aboutCopy")}
            area
          />
          <AdminField
            label="Full address"
            value={content.address}
            onChange={set("address")}
            area
          />
        </div>
      </div>
      <AdminPageCollections />
    </>
  );
}

function AdminPageCollections() {
  const { content, update } = useContent();
  const addAchievement = () =>
    update("achievements", [
      ...content.achievements,
      {
        id: `a-${Date.now()}`,
        title: "New achievement",
        detail: "Add the achievement details.",
        year: "2026",
      },
    ]);
  const addFacility = () =>
    update("facilities", [
      ...content.facilities,
      {
        id: `fac-${Date.now()}`,
        title: "New facility",
        description: "Add a short description.",
        icon: "sparkles",
      },
    ]);
  return (
    <div className="admin-collections">
      <div className="admin-panel">
        <AdminPanelHead
          eyebrow="Achievements"
          title="Celebrate school milestones."
          action={addAchievement}
          actionLabel="Add achievement"
        />
        <div className="admin-edit-list">
          {content.achievements.map((item) => (
            <div className="admin-edit-card" key={item.id}>
              <div className="admin-form-grid compact">
                <AdminField
                  label="Year"
                  value={item.year}
                  onChange={(value) =>
                    update(
                      "achievements",
                      content.achievements.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, year: value }
                          : entry,
                      ),
                    )
                  }
                />
                <AdminField
                  label="Title"
                  value={item.title}
                  onChange={(value) =>
                    update(
                      "achievements",
                      content.achievements.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, title: value }
                          : entry,
                      ),
                    )
                  }
                />
              </div>
              <AdminField
                label="Details"
                value={item.detail}
                onChange={(value) =>
                  update(
                    "achievements",
                    content.achievements.map((entry) =>
                      entry.id === item.id
                        ? { ...entry, detail: value }
                        : entry,
                    ),
                  )
                }
                area
              />
              <button
                className="icon-button danger standalone"
                aria-label="Delete achievement"
                onClick={() =>
                  update(
                    "achievements",
                    content.achievements.filter(
                      (entry) => entry.id !== item.id,
                    ),
                  )
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-panel">
        <AdminPanelHead
          eyebrow="Facilities"
          title="Describe the learning spaces."
          action={addFacility}
          actionLabel="Add facility"
        />
        <div className="admin-edit-list">
          {content.facilities.map((item) => (
            <div className="admin-edit-card" key={item.id}>
              <div className="admin-form-grid compact">
                <AdminField
                  label="Title"
                  value={item.title}
                  onChange={(value) =>
                    update(
                      "facilities",
                      content.facilities.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, title: value }
                          : entry,
                      ),
                    )
                  }
                />
                <AdminField
                  label="Icon (book, map, shield…)"
                  value={item.icon}
                  onChange={(value) =>
                    update(
                      "facilities",
                      content.facilities.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, icon: value }
                          : entry,
                      ),
                    )
                  }
                />
              </div>
              <AdminField
                label="Description"
                value={item.description}
                onChange={(value) =>
                  update(
                    "facilities",
                    content.facilities.map((entry) =>
                      entry.id === item.id
                        ? { ...entry, description: value }
                        : entry,
                    ),
                  )
                }
                area
              />
              <button
                className="icon-button danger standalone"
                aria-label="Delete facility"
                onClick={() =>
                  update(
                    "facilities",
                    content.facilities.filter((entry) => entry.id !== item.id),
                  )
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminNotices() {
  const { content, update } = useContent();
  const add = () =>
    update("notices", [
      {
        id: `n-${Date.now()}`,
        title: "New school notice",
        date: "29 Aug 2026",
        category: "General",
        excerpt: "Add the details for this announcement.",
        featured: false,
      },
      ...content.notices,
    ]);
  const edit = (id: string, key: keyof Notice, value: string | boolean) =>
    update(
      "notices",
      content.notices.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  return (
    <div className="admin-panel">
      <AdminPanelHead
        eyebrow="Notices & announcements"
        title="Publish clear updates for families."
        action={add}
        actionLabel="Add notice"
      />
      <div className="admin-edit-list">
        {content.notices.map((item) => (
          <div className="admin-edit-card" key={item.id}>
            <div className="admin-edit-card-top">
              <span className="notice-category">{item.category}</span>
              <button
                className="icon-button danger"
                aria-label="Delete notice"
                onClick={() =>
                  update(
                    "notices",
                    content.notices.filter((notice) => notice.id !== item.id),
                  )
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
            <AdminField
              label="Title"
              value={item.title}
              onChange={(value) => edit(item.id, "title", value)}
            />
            <div className="admin-form-grid compact">
              <AdminField
                label="Date"
                value={item.date}
                onChange={(value) => edit(item.id, "date", value)}
              />
              <AdminField
                label="Category"
                value={item.category}
                onChange={(value) => edit(item.id, "category", value)}
              />
            </div>
            <AdminField
              label="Short description"
              value={item.excerpt}
              onChange={(value) => edit(item.id, "excerpt", value)}
              area
            />
            <label className="check-field">
              <input
                type="checkbox"
                checked={Boolean(item.featured)}
                onChange={(e) => edit(item.id, "featured", e.target.checked)}
              />{" "}
              Feature this notice on the homepage
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminGallery() {
  const { content, update, saving, connected } = useContent();
  const [uploadState, setUploadState] = useState<
    Record<
      string,
      {
        progress: number;
        status: "reading" | "saving" | "saved" | "error";
        message?: string;
      }
    >
  >({});
  const add = () =>
    update("gallery", [
      ...content.gallery,
      {
        id: `g-${Date.now()}`,
        title: "New gallery item",
        caption: "Add a caption",
        image: "",
      },
    ]);
  const edit = (id: string, key: keyof GalleryItem, value: string) =>
    update(
      "gallery",
      content.gallery.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  useEffect(() => {
    if (saving) return;
    setUploadState((current) =>
      Object.fromEntries(
        Object.entries(current).map(([id, state]) =>
          state.status === "saving"
            ? [
                id,
                {
                  progress: connected ? 100 : 0,
                  status: connected ? "saved" : "error",
                  message: connected
                    ? "Saved to database"
                    : "Could not save — check the API",
                },
              ]
            : [id, state],
        ),
      ),
    );
  }, [saving, connected]);
  const uploadImage = async (id: string, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadState((current) => ({
        ...current,
        [id]: {
          progress: 0,
          status: "error",
          message: "Please choose an image file.",
        },
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadState((current) => ({
        ...current,
        [id]: {
          progress: 0,
          status: "error",
          message: "Please choose an image smaller than 5 MB.",
        },
      }));
      return;
    }
    setUploadState((current) => ({
      ...current,
      [id]: {
        progress: 4,
        status: "reading",
        message: "Reading image from device…",
      },
    }));
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable)
        setUploadState((current) => ({
          ...current,
          [id]: {
            progress: Math.max(
              5,
              Math.round((event.loaded / event.total) * 90),
            ),
            status: "reading",
            message: "Reading image from device…",
          },
        }));
    };
    reader.onerror = () =>
      setUploadState((current) => ({
        ...current,
        [id]: {
          progress: 0,
          status: "error",
          message: "The image could not be read.",
        },
      }));
    reader.onload = async () => {
      const result = String(reader.result);
      const [, data = ""] = result.split(",", 2);
      setUploadState((current) => ({
        ...current,
        [id]: {
          progress: 45,
          status: "saving",
          message: "Uploading image to server…",
        },
      }));
      try {
        const response = await fetch("/api/uploads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, fileName: file.name, mimeType: file.type }),
        });
        if (!response.ok) throw new Error("Upload failed");
        const { url } = (await response.json()) as { url: string };
        edit(id, "image", url);
        setUploadState((current) => ({
          ...current,
          [id]: { progress: 100, status: "saved", message: "Uploaded — URL saved to gallery" },
        }));
      } catch {
        setUploadState((current) => ({
          ...current,
          [id]: { progress: 0, status: "error", message: "Upload failed. Please try again." },
        }));
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="admin-panel">
      <AdminPanelHead
        eyebrow="Photo gallery"
        title="Add approved school photographs."
        action={add}
        actionLabel="Add image"
      />
      <p className="admin-help">
        Choose an image from the device. It is stored on the server and the
        generated image URL is saved here. Images are limited to 5 MB.
      </p>
      <div className="admin-edit-list gallery-admin-list">
        {content.gallery.map((item) => (
          <div className="admin-edit-card gallery-admin-card" key={item.id}>
            {item.image ? (
              <img src={item.image} alt="" />
            ) : (
              <div className="gallery-admin-preview">
                <ImageIcon size={24} />
                <span>Image preview</span>
              </div>
            )}
            <div className="gallery-admin-fields">
              <div className="admin-edit-card-top">
                <span className="notice-category">Gallery item</span>
                <button
                  className="icon-button danger"
                  aria-label="Delete gallery item"
                  onClick={() =>
                    update(
                      "gallery",
                      content.gallery.filter(
                        (gallery) => gallery.id !== item.id,
                      ),
                    )
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <AdminField
                label="Image URL"
                value={item.image || ""}
                onChange={(value) => edit(item.id, "image", value)}
              />
              <label className="upload-control">
                <span>Upload from device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    uploadImage(item.id, event.target.files?.[0])
                  }
                />
                <span className="upload-button">
                  <Upload size={15} /> Choose image
                </span>
              </label>
              {uploadState[item.id] && (
                <div className={`upload-status ${uploadState[item.id].status}`}>
                  <div className="upload-status-line">
                    <span>{uploadState[item.id].message}</span>
                    <strong>{uploadState[item.id].progress}%</strong>
                  </div>
                  <div className="upload-progress">
                    <span
                      style={{ width: `${uploadState[item.id].progress}%` }}
                    />
                  </div>
                </div>
              )}
              <AdminField
                label="Title"
                value={item.title}
                onChange={(value) => edit(item.id, "title", value)}
              />
              <AdminField
                label="Caption"
                value={item.caption}
                onChange={(value) => edit(item.id, "caption", value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAdmissions() {
  const { content, update } = useContent();
  const setStatus = (id: string, status: Admission["status"]) =>
    update(
      "admissions",
      content.admissions.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    );
  return (
    <div className="admin-panel">
      <AdminPanelHead
        eyebrow="Online admission enquiry"
        title="Review parent enquiries."
      />
      <div className="admin-table-wrap">
        {content.admissions.length === 0 ? (
          <div className="empty-state">
            No admission enquiries yet. New submissions from the public form
            will appear here.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student / guardian</th>
                <th>Class</th>
                <th>Contact</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {content.admissions.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.student}</strong>
                    <span>{item.guardian}</span>
                    {item.message && <small>{item.message}</small>}
                  </td>
                  <td>
                    {item.seekingClass}
                    <span>From {item.currentClass || "—"}</span>
                  </td>
                  <td>
                    <a href={phoneHref(item.phone)}>{item.phone}</a>
                    <span>{item.email || "No email"}</span>
                  </td>
                  <td>{item.submittedAt}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        setStatus(
                          item.id,
                          e.target.value as Admission["status"],
                        )
                      }
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AdminPeople() {
  const { content, update } = useContent();
  const add = () =>
    update("faculty", [
      ...content.faculty,
      {
        id: `f-${Date.now()}`,
        name: "New team member",
        role: "Role or responsibility",
        subject: "Area of work",
        initials: "NM",
      },
    ]);
  const edit = (
    id: string,
    key: "name" | "role" | "subject" | "initials",
    value: string,
  ) =>
    update(
      "faculty",
      content.faculty.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  return (
    <div className="admin-panel">
      <AdminPanelHead
        eyebrow="Faculty & school content"
        title="Keep people and trust content current."
        action={add}
        actionLabel="Add team member"
      />
      <div className="admin-edit-list">
        {content.faculty.map((item) => (
          <div className="admin-edit-card" key={item.id}>
            <div className="person-avatar small">{item.initials}</div>
            <div className="admin-form-grid compact">
              <AdminField
                label="Name"
                value={item.name}
                onChange={(value) => edit(item.id, "name", value)}
              />
              <AdminField
                label="Initials"
                value={item.initials}
                onChange={(value) => edit(item.id, "initials", value)}
              />
              <AdminField
                label="Role"
                value={item.role}
                onChange={(value) => edit(item.id, "role", value)}
              />
              <AdminField
                label="Subject / area"
                value={item.subject}
                onChange={(value) => edit(item.id, "subject", value)}
              />
            </div>
            <button
              className="icon-button danger standalone"
              aria-label="Delete team member"
              onClick={() =>
                update(
                  "faculty",
                  content.faculty.filter((person) => person.id !== item.id),
                )
              }
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
function AdminPanelHead({
  eyebrow,
  title,
  action,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="admin-panel-title">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="button-primary small-button" onClick={action}>
          <Plus size={15} /> {actionLabel}
        </button>
      )}
    </div>
  );
}
const adminTabValues: Tab[] = [
  "overview",
  "content",
  "notices",
  "gallery",
  "admissions",
  "people",
];
function getAdminTab() {
  if (typeof window === "undefined") return "overview" as Tab;
  const requested = new URLSearchParams(window.location.search).get(
    "tab",
  ) as Tab | null;
  return requested && adminTabValues.includes(requested)
    ? requested
    : "overview";
}

function AdminLogin() {
  const { login } = useContent();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);
    if (!result.ok) setError(result.message || "Unable to sign in.");
  };
  return (
    <main className="admin-login-shell">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <a className="admin-login-brand" href="/" aria-label="Return to school website">
          <span className="brand-seal" aria-hidden="true"><img src={schoolLogo} alt="" /></span>
          <span>Maa Gayatri Public School</span>
        </a>
        <div className="admin-login-copy">
          <span className="eyebrow">Secure school CMS</span>
          <h1 id="admin-login-title">Welcome back.</h1>
          <p>Sign in to update school information, admissions, notices and photographs.</p>
        </div>
        <form className="admin-login-form" onSubmit={submit}>
          <label>
            <span>Email address</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button className="button-primary admin-login-submit" type="submit" disabled={submitting}>
            <ShieldCheck size={17} /> {submitting ? "Signing in…" : "Sign in securely"}
          </button>
        </form>
        <p className="admin-login-note"><ShieldCheck size={14} /> Your session is protected and expires automatically.</p>
      </section>
    </main>
  );
}

function AdminDashboard() {
  const [tab, setTabState] = useState<Tab>(getAdminTab);
  const { reset, connected, saving, authenticated, authReady, logout } = useContent();
  const setTab = (next: Tab) => {
    if (next === tab) return;
    const url = new URL(window.location.href);
    if (next === "overview") url.searchParams.delete("tab");
    else url.searchParams.set("tab", next);
    window.history.pushState({ adminTab: next }, "", url);
    setTabState(next);
  };
  useEffect(() => {
    const handleBack = () => setTabState(getAdminTab());
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);
  const titles: Record<Tab, string> = {
    overview: "Overview",
    content: "Website content",
    notices: "Notices",
    gallery: "Photo gallery",
    admissions: "Admissions",
    people: "Faculty & school",
  };
  if (!authReady) {
    return <main className="admin-login-shell"><div className="admin-login-loading">Checking secure access…</div></main>;
  }
  if (!authenticated) return <AdminLogin />;
  return (
    <div className="admin-shell">
      <AdminSidebar tab={tab} setTab={setTab} />
      <main className="admin-main">
        <div className="admin-mobile-top">
          <a href="/">
            <span className="brand-seal" aria-hidden="true"><img src={schoolLogo} alt="" /></span>
          </a>
          <span>School CMS</span>
          <a href="/">
            <X size={18} />
          </a>
        </div>
        <div className="admin-breadcrumb">
          {tab !== "overview" && (
            <button
              className="admin-back-button"
              onClick={() => setTab("overview")}
            >
              <ArrowLeft size={14} /> Dashboard
            </button>
          )}
          {tab === "overview" && <span>Dashboard</span>}
          <ChevronRight size={14} />
          <strong>{titles[tab]}</strong>
          <button className="admin-logout" onClick={() => void logout()}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
        {tab === "overview" && <AdminOverview setTab={setTab} />}
        {tab === "content" && <AdminContent />}
        {tab === "notices" && <AdminNotices />}
        {tab === "gallery" && <AdminGallery />}
        {tab === "admissions" && <AdminAdmissions />}
        {tab === "people" && <AdminPeople />}
        <div className="admin-footer-actions">
          <button
            className="reset-link"
            onClick={() => {
              if (window.confirm("Restore all original sample content?"))
                reset();
            }}
          >
            Restore sample content
          </button>
          <span>
            {saving
              ? "Saving changes to database…"
              : connected
                ? "Database connected · changes saved automatically"
                : "API unavailable · reconnect the database to save changes"}
          </span>
        </div>
      </main>
    </div>
  );
}

function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="not-found">
      <SeoMetadata path="/404" noIndex />
      <div>
        <div className="eyebrow">Page not found</div>
        <h1 className="section-heading">Let’s return to the school.</h1>
        <button
          className="button-primary"
          style={{ border: 0, cursor: "pointer", marginTop: 28 }}
          onClick={() => {
            setLocation("/");
            setTimeout(scrollToTop, 20);
          }}
        >
          Back to home <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
function Router() {
  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={AboutPage} />
        <Route path="/academics" component={AcademicsPage} />
        <Route path="/faculty" component={FacultyPage} />
        <Route path="/admissions" component={AdmissionsPage} />
        <Route path="/notices" component={NoticesPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/achievements" component={AchievementsPage} />
        <Route path="/facilities" component={FacilitiesPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ContentProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </ContentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;
