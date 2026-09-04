export type Notice = {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  featured?: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  caption: string;
  image?: string;
};

export type FacultyMember = {
  id: string;
  name: string;
  role: string;
  subject: string;
  initials: string;
};

export type Admission = {
  id: string;
  guardian: string;
  student: string;
  currentClass: string;
  seekingClass: string;
  phone: string;
  email: string;
  message: string;
  submittedAt: string;
  status: "New" | "Contacted" | "Closed";
};

export type SiteContent = {
  schoolName: string;
  shortName: string;
  tagline: string;
  heroTitle: string;
  heroCopy: string;
  aboutCopy: string;
  phone: string;
  email: string;
  address: string;
  officeHours: string;
  notices: Notice[];
  gallery: GalleryItem[];
  faculty: FacultyMember[];
  achievements: { id: string; title: string; detail: string; year: string }[];
  facilities: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  admissions: Admission[];
};

export const defaultContent: SiteContent = {
  schoolName: "Maa Gayatri Public School",
  shortName: "M.G.P.S.",
  tagline: "A considered beginning for every child",
  heroTitle: "Building bright futures through education.",
  heroCopy:
    "An English-medium co-educational school in Muzaffarpur committed to academic growth, character development and lifelong learning.",
  aboutCopy:
    "Maa Gayatri Public School is an English-medium co-educational school located on Purani Darbhanga Road in Sahwajpur, Muzaffarpur. We create a supportive learning environment where students develop academically while growing in confidence, discipline and character.",
  phone: "+91 75199 90367",
  email: "MGPSMUZ93@gmail.com",
  address:
    "Purani Darbhanga Road, Sahwajpur/Shahbazpur, Muzaffarpur, Bihar – 842004, India",
  officeHours: "Monday – Saturday · 8:00 AM – 3:00 PM",
  notices: [
    {
      id: "n1",
      title: "Admissions open for the 2026–27 session",
      date: "18 Aug 2026",
      category: "Admissions",
      excerpt:
        "Enquire with the school office about available classes, requirements and important dates.",
      featured: true,
    },
    {
      id: "n2",
      title: "Independence Day celebration",
      date: "12 Aug 2026",
      category: "Events",
      excerpt:
        "Students and families are invited to join the school community celebration.",
    },
    {
      id: "n3",
      title: "Parent–teacher meeting schedule",
      date: "05 Aug 2026",
      category: "Circular",
      excerpt:
        "Please contact the class teacher for the latest meeting time and details.",
    },
  ],
  gallery: [
    {
      id: "g1",
      title: "Campus life",
      caption: "Add an approved campus photograph",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: "g2",
      title: "Classroom learning",
      caption: "Add an approved classroom photograph",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: "g3",
      title: "School activities",
      caption: "Add an approved activity photograph",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: "g4",
      title: "Learning environment",
      caption: "Add an approved school photograph",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: "g5",
      title: "Celebrations",
      caption: "Add an approved event photograph",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=85",
    },
  ],
  faculty: [
    {
      id: "f1",
      name: "School Leadership",
      role: "Academic guidance & administration",
      subject: "School leadership",
      initials: "SL",
    },
    {
      id: "f2",
      name: "Primary Faculty",
      role: "Foundational learning",
      subject: "Primary years",
      initials: "PF",
    },
    {
      id: "f3",
      name: "Secondary Faculty",
      role: "Subject learning & mentoring",
      subject: "Secondary years",
      initials: "SF",
    },
    {
      id: "f4",
      name: "Student Support Team",
      role: "Care, coordination & activities",
      subject: "Student wellbeing",
      initials: "SS",
    },
  ],
  achievements: [
    {
      id: "a1",
      title: "A growing learning community",
      detail:
        "Building a steady, supportive school experience for families in Muzaffarpur.",
      year: "2026",
    },
    {
      id: "a2",
      title: "Learning beyond the classroom",
      detail:
        "Encouraging participation, creativity, teamwork and confidence through school life.",
      year: "2025",
    },
    {
      id: "a3",
      title: "Rooted in the local community",
      detail:
        "Serving students and families around Sahwajpur with care and purpose.",
      year: "2013",
    },
  ],
  facilities: [
    {
      id: "fac1",
      title: "Purposeful classrooms",
      description:
        "Spaces designed for focused lessons, questions and collaborative learning.",
      icon: "book",
    },
    {
      id: "fac2",
      title: "Activity spaces",
      description:
        "Room for students to participate, practise skills and discover interests.",
      icon: "sparkles",
    },
    {
      id: "fac3",
      title: "Safe school environment",
      description:
        "A caring, disciplined atmosphere where every learner can feel supported.",
      icon: "shield",
    },
    {
      id: "fac4",
      title: "Accessible location",
      description:
        "Conveniently located on Purani Darbhanga Road in Muzaffarpur.",
      icon: "map",
    },
  ],
  admissions: [],
};
