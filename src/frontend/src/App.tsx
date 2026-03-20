import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Network,
  Phone,
  Quote,
  Search,
  Shield,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useActor } from "./hooks/useActor";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );
    const elements = document.querySelectorAll(".reveal");
    for (const el of elements) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}

function ProspectusModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { actor } = useActor();
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (actor) await actor.submitLead({ name: form.name, email: form.email });
      setSubmitted(true);
      // Auto-download prospectus
      const link = document.createElement("a");
      link.href = "/assets/uploads/CurvEd-Academic-Prospectus-1.pdf";
      link.download = "CurvEd Academic Prospectus.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full border-0"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl z-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={22} />
        </button>
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle
              size={56}
              className="mx-auto mb-4"
              style={{ color: "#C9A84C" }}
            />
            <h3 className="font-serif text-2xl text-[#0A1628] mb-2">
              Thank You
            </h3>
            <p className="text-gray-600 font-sans">
              Your prospectus request has been received. Your download should
              start automatically.
            </p>
            <a
              href="/assets/uploads/CurvEd-Academic-Prospectus-1.pdf"
              download="CurvEd Academic Prospectus.pdf"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-lg font-sans font-semibold text-[#0A1628] transition-all hover:opacity-90"
              style={{ backgroundColor: "#C9A84C" }}
            >
              Click here if download didn't start
            </a>
          </div>
        ) : (
          <>
            <h3 className="font-serif text-2xl text-[#0A1628] mb-1">
              Download Prospectus
            </h3>
            <p className="text-gray-500 font-sans text-sm mb-6">
              Enter your details to receive the CurvEd Curriculum prospectus.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="pm-name"
                  className="block text-sm font-medium text-[#0A1628] mb-1 font-sans"
                >
                  Full Name *
                </label>
                <input
                  id="pm-name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition"
                />
              </div>
              <div>
                <label
                  htmlFor="pm-email"
                  className="block text-sm font-medium text-[#0A1628] mb-1 font-sans"
                >
                  Email Address *
                </label>
                <input
                  id="pm-email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-sans font-semibold text-[#0A1628] transition-all hover:opacity-90"
                style={{ backgroundColor: "#C9A84C" }}
              >
                {loading ? "Sending..." : "Download Now"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const delayClass = (n: number) => {
  const classes = [
    "reveal-delay-1",
    "reveal-delay-2",
    "reveal-delay-3",
    "reveal-delay-4",
    "reveal-delay-5",
    "reveal-delay-6",
  ];
  return classes[n % classes.length];
};

export default function App() {
  useScrollReveal();
  const { actor } = useActor();
  const [navScrolled, setNavScrolled] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prospectusOpen, setProspectusOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    designation: "",
    schoolName: "",
    city: "",
    phone: "",
    email: "",
    message: "",
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
      setShowFloating(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      if (actor)
        await actor.submitInquiry({
          name: inquiryForm.name,
          designation: inquiryForm.designation,
          schoolName: inquiryForm.schoolName,
          city: inquiryForm.city,
          phone: inquiryForm.phone,
          email: inquiryForm.email,
          message: inquiryForm.message,
        });
      setInquirySubmitted(true);
    } catch (err) {
      console.error(err);
      setInquirySubmitted(true);
    } finally {
      setInquiryLoading(false);
    }
  };

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Framework", id: "framework" },
    { label: "Impact", id: "impact" },
    { label: "Mentorship", id: "mentorship" },
    { label: "Contact", id: "contact" },
  ];

  const painPoints = [
    {
      icon: <Layers size={28} />,
      title: "Curriculum Implementation Inconsistency",
      desc: "Unaligned delivery across classrooms leads to fragmented student learning experiences.",
    },
    {
      icon: <ClipboardList size={28} />,
      title: "Teacher Overload in Planning & Documentation",
      desc: "Excessive administrative burden reduces time for meaningful pedagogy and student engagement.",
    },
    {
      icon: <TrendingUp size={28} />,
      title: "Lack of Clear Skill Progression Across Grades",
      desc: "Without a structured progression framework, learning gaps accumulate year over year.",
    },
    {
      icon: <Target size={28} />,
      title: "Weak Assessment Alignment",
      desc: "Assessments disconnected from learning outcomes fail to measure real academic progress.",
    },
    {
      icon: <BookOpen size={28} />,
      title: "Difficulty Adapting to NEP & Modern Expectations",
      desc: "Schools struggle to interpret and implement NEP 2020 frameworks effectively at scale.",
    },
    {
      icon: <Users size={28} />,
      title: "No Integrated Mentorship System",
      desc: "Student development remains reactive rather than structured, systematic, and measurable.",
    },
  ];

  const services = [
    {
      icon: <BookOpen size={24} />,
      title: "Curriculum Design & Mapping (K-12)",
      desc: "End-to-end curriculum architecture aligned with NEP 2020 and global academic standards.",
    },
    {
      icon: <Layers size={24} />,
      title: "Competency & Skill-Based Learning",
      desc: "Frameworks built around measurable competencies and 21st-century skill development.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Assessment & Evaluation Architecture",
      desc: "Diagnostic and formative assessment systems aligned with learning outcomes.",
    },
    {
      icon: <GraduationCap size={24} />,
      title: "Teacher Enablement & Academic Training",
      desc: "Structured professional development programs for faculty growth and alignment.",
    },
    {
      icon: <Users size={24} />,
      title: "Student Mentorship Architecture",
      desc: "Systematic mentor-mentee frameworks with goal tracking and parent integration.",
    },
    {
      icon: <Search size={24} />,
      title: "Academic Audit & Governance Review",
      desc: "Comprehensive audits covering curriculum delivery, assessment, and institutional compliance.",
    },
    {
      icon: <Network size={24} />,
      title: "Institutional Implementation Support",
      desc: "On-ground support to embed new academic frameworks across all school levels.",
    },
    {
      icon: <Shield size={24} />,
      title: "Leadership Advisory for School Growth",
      desc: "Strategic guidance for school leadership on academic vision and long-term transformation.",
    },
  ];

  const frameworkSteps = [
    {
      num: "01",
      title: "Curriculum Architecture",
      desc: "Structured design of scope, sequence, and learning frameworks.",
    },
    {
      num: "02",
      title: "Pedagogical Design",
      desc: "Evidence-based teaching strategies for classroom delivery.",
    },
    {
      num: "03",
      title: "Learning Outcome Mapping",
      desc: "Clear alignment of lessons to measurable outcomes.",
    },
    {
      num: "04",
      title: "Assessment Alignment",
      desc: "Diagnostic and summative assessments tied to outcomes.",
    },
    {
      num: "05",
      title: "Mentorship Integration",
      desc: "Structured mentorship woven into the academic framework.",
    },
    {
      num: "06",
      title: "Academic Review & Optimization",
      desc: "Continuous improvement cycles led by data.",
    },
  ];

  const impactItems = [
    {
      icon: <CheckCircle size={32} />,
      label: "Structured Classroom Delivery",
      metric: "98%",
    },
    {
      icon: <ClipboardList size={32} />,
      label: "Reduced Teacher Planning Burden",
      metric: "60%",
    },
    {
      icon: <BarChart3 size={32} />,
      label: "Improved Academic Consistency",
      metric: "3x",
    },
    {
      icon: <Star size={32} />,
      label: "Better Student Engagement",
      metric: "85%",
    },
    {
      icon: <TrendingUp size={32} />,
      label: "Clear Learning Progression",
      metric: "100%",
    },
    {
      icon: <Award size={32} />,
      label: "Enhanced Institutional Credibility",
      metric: "High",
    },
    {
      icon: <Users size={32} />,
      label: "Stronger Parent Trust",
      metric: "92%",
    },
    {
      icon: <Building2 size={32} />,
      label: "Better Board Readiness",
      metric: "Full",
    },
  ];

  const mentorshipFeatures = [
    {
      icon: <UserCheck size={20} />,
      title: "Mentor-Mentee Systems",
      desc: "Structured matching with defined responsibilities, meeting cadence, and documentation.",
    },
    {
      icon: <Target size={20} />,
      title: "Goal Setting & Reflection",
      desc: "Term-wise academic and personal goals co-created by mentor and student.",
    },
    {
      icon: <TrendingUp size={20} />,
      title: "Growth Indicators",
      desc: "Academic and personal development tracked against measurable benchmarks.",
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Parent-Mentor Communication",
      desc: "Structured communication loops keeping parents informed and engaged.",
    },
  ];

  const mentorshipFlow = [
    { icon: <UserCheck size={24} />, label: "Mentor" },
    { icon: <GraduationCap size={24} />, label: "Student" },
    { icon: <Users size={24} />, label: "Parent" },
    { icon: <Shield size={24} />, label: "Leadership Review" },
  ];

  const implementationSteps = [
    {
      step: "01",
      title: "Institutional Academic Diagnostic",
      desc: "A thorough audit of existing curriculum, faculty, assessment, and institutional frameworks.",
    },
    {
      step: "02",
      title: "Curriculum Mapping & Design",
      desc: "Custom curriculum architecture built to your school vision, NEP alignment, and learner needs.",
    },
    {
      step: "03",
      title: "Faculty Orientation & Enablement",
      desc: "Hands-on training sessions to orient faculty to new frameworks and pedagogical methods.",
    },
    {
      step: "04",
      title: "Ongoing Review, Support & Optimization",
      desc: "Continuous monitoring, quarterly reviews, and iterative improvements for lasting impact.",
    },
  ];

  const testimonials = [
    {
      quote:
        "CurvEd Curriculum transformed how our school approaches academic planning. Their structured framework gave us clarity, consistency, and a measurable path forward.",
      name: "Dr. Anita Sharma",
      title: "Principal",
      school: "Delhi Public School, Bengaluru",
    },
    {
      quote:
        "Working with CurvEd was a turning point for our institution. Their team brought deep expertise and a clear implementation roadmap that our faculty embraced wholeheartedly.",
      name: "Mr. Rajesh Nair",
      title: "Academic Director",
      school: "Presidency International School, Pune",
    },
  ];

  const advisors = [
    {
      name: "Prof. Meera Krishnamurthy",
      title: "Curriculum Expert & NEP Specialist",
      cred: "Ex-NCERT | 25+ Years in Academic Reform",
    },
    {
      name: "Dr. Suresh Balakrishnan",
      title: "Assessment Design Specialist",
      cred: "Former IB Examiner | Board Examinations Expert",
    },
  ];

  const caseStudies = [
    {
      title: "Full K-12 Curriculum Redesign for a 2,000-Student Institution",
      desc: "A leading CBSE school in Karnataka partnered with CurvEd to completely redesign its K-12 academic framework, resulting in 40% improvement in assessment alignment and measurable reduction in faculty planning hours.",
      tag: "Curriculum Transformation",
    },
    {
      title: "Mentorship Architecture for a Group of 5 Schools",
      desc: "Designed and implemented a unified student mentorship system across 5 institutions in Maharashtra, creating structured mentor-mentee relationships for 3,500+ students with clear growth dashboards.",
      tag: "Student Mentorship",
    },
  ];

  const focusTags = [
    "Curriculum Design & Mapping",
    "Academic Systems Architecture",
    "Student Mentorship Frameworks",
    "Assessment & Evaluation Design",
    "Teacher Enablement",
    "Institutional Academic Audits",
  ];

  const footerServices = [
    "Curriculum Design & Mapping",
    "Assessment Architecture",
    "Teacher Enablement",
    "Student Mentorship",
    "Academic Audit",
    "Leadership Advisory",
  ];

  const footerLinks = [
    { l: "About Us", id: "about" },
    { l: "Framework", id: "framework" },
    { l: "Impact", id: "impact" },
    { l: "Mentorship", id: "mentorship" },
    { l: "Contact", id: "contact" },
  ];

  return (
    <div className="bg-white text-[#0A1628] overflow-x-hidden">
      <ProspectusModal
        isOpen={prospectusOpen}
        onClose={() => setProspectusOpen(false)}
      />

      {/* STICKY NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              type="button"
              className="flex flex-col text-left bg-transparent border-0 p-0 cursor-pointer"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src="/assets/uploads/curved-logo--2.png"
                alt="CurvEd Curriculum"
                className="h-10 w-auto object-contain"
                style={{
                  filter: navScrolled ? "none" : "brightness(0) invert(1)",
                }}
              />
            </button>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`font-sans text-sm font-medium tracking-wide transition-colors hover:text-[#C9A84C] ${
                    navScrolled ? "text-[#0A1628]" : "text-white/90"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="font-sans text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:opacity-90 text-[#0A1628]"
                style={{ backgroundColor: "#C9A84C" }}
              >
                Book Consultation
              </button>
            </div>

            <button
              type="button"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X
                  size={24}
                  className={navScrolled ? "text-[#0A1628]" : "text-white"}
                />
              ) : (
                <Menu
                  size={24}
                  className={navScrolled ? "text-[#0A1628]" : "text-white"}
                />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-xl border-t border-gray-100">
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="block w-full text-left font-sans text-sm font-medium text-[#0A1628] py-3 border-b border-gray-100 hover:text-[#C9A84C] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="mt-3 w-full font-sans text-sm font-semibold px-5 py-3 rounded-lg text-[#0A1628]"
                style={{ backgroundColor: "#C9A84C" }}
              >
                Book Consultation
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0A1628 0%, #0D2144 55%, #112952 100%)",
        }}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M -100,300 Q 200,100 500,350 T 1100,200 T 1600,400"
            stroke="#C9A84C"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M -100,500 Q 300,200 700,500 T 1400,300 T 1700,600"
            stroke="#C9A84C"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 200,0 Q 400,200 300,500 T 500,900"
            stroke="white"
            strokeWidth="0.8"
            fill="none"
          />
          <path
            d="M 900,0 Q 1100,200 1000,500 T 1200,900"
            stroke="white"
            strokeWidth="0.8"
            fill="none"
          />
          <path
            d="M 0,700 Q 400,500 800,700 T 1600,600"
            stroke="#C9A84C"
            strokeWidth="1.2"
            fill="none"
          />
          <circle
            cx="240"
            cy="200"
            r="80"
            stroke="#C9A84C"
            strokeWidth="0.8"
            fill="none"
          />
          <circle
            cx="1200"
            cy="700"
            r="120"
            stroke="#C9A84C"
            strokeWidth="0.8"
            fill="none"
          />
          <circle
            cx="1300"
            cy="150"
            r="60"
            stroke="white"
            strokeWidth="0.6"
            fill="none"
          />
        </svg>
        <div
          className="absolute top-20 right-20 w-32 h-32 opacity-10 rounded-full border-2"
          style={{ borderColor: "#C9A84C" }}
        />
        <div
          className="absolute bottom-40 left-16 w-48 h-48 opacity-5 rounded-full border"
          style={{ borderColor: "#C9A84C" }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-32">
          <p
            className="font-sans text-xs font-semibold tracking-[0.25em] uppercase mb-6"
            style={{ color: "#C9A84C" }}
          >
            Curriculum Systems | Student Mentorship Architecture
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Redefining Academic Excellence for Forward-Thinking Schools
          </h1>
          <p className="font-sans text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10">
            CurvEd Curriculum partners with schools to design structured,
            future-ready academic systems aligned with NEP 2020, institutional
            growth, and measurable student outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="font-sans font-semibold px-8 py-4 rounded-lg text-[#0A1628] bg-white transition-all hover:bg-gray-100 shadow-lg"
            >
              Book Institutional Consultation
            </button>
            <button
              type="button"
              onClick={() => setProspectusOpen(true)}
              className="font-sans font-semibold px-8 py-4 rounded-lg text-[#C9A84C] transition-all hover:bg-white/10 border-2"
              style={{ borderColor: "#C9A84C" }}
            >
              Download Prospectus
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-white/50" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: "#C9A84C" }}
              >
                About CurvEd Curriculum
              </p>
              <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-[#0A1628] mb-6 leading-tight">
                Your Strategic Academic Partner
              </h2>
              <p className="reveal font-sans text-gray-600 text-lg leading-relaxed mb-6">
                CurvEd Curriculum is a premium academic consulting and
                curriculum solutions company that helps schools build
                structured, scalable, and future-ready academic frameworks. We
                work exclusively with institutions committed to long-term
                academic transformation.
              </p>
              <p className="reveal font-sans text-gray-600 leading-relaxed mb-8">
                Our approach integrates curriculum design, pedagogical
                innovation, institutional governance, and student mentorship
                into a unified academic ecosystem - built specifically for each
                school's context, culture, and ambitions.
              </p>
              <div className="reveal flex flex-wrap gap-3">
                {focusTags.map((tag) => (
                  <span
                    key={tag}
                    className="font-sans text-sm font-medium px-4 py-2 rounded-full border cursor-default transition-all hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-[#0A1628]"
                    style={{ borderColor: "#0A1628", color: "#0A1628" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="reveal flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 400 400"
                  className="w-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="40"
                    y="40"
                    width="320"
                    height="320"
                    rx="24"
                    fill="#F7F9FC"
                    stroke="#E8ECF2"
                    strokeWidth="1"
                  />
                  <path
                    d="M 80,200 Q 200,80 320,200 T 560,200"
                    stroke="#C9A84C"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 80,240 Q 200,120 320,240"
                    stroke="#0A1628"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.3"
                  />
                  <circle cx="200" cy="160" r="48" fill="#0A1628" />
                  <text
                    x="200"
                    y="152"
                    textAnchor="middle"
                    fill="white"
                    fontFamily="serif"
                    fontSize="14"
                    fontWeight="600"
                  >
                    CurvEd
                  </text>
                  <text
                    x="200"
                    y="172"
                    textAnchor="middle"
                    fill="#C9A84C"
                    fontFamily="serif"
                    fontSize="10"
                  >
                    Curriculum
                  </text>
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const angle = ((idx * 60 - 30) * Math.PI) / 180;
                    const cx = 200 + 130 * Math.cos(angle);
                    const cy = 230 + 100 * Math.sin(angle);
                    return (
                      <g key={idx}>
                        <line
                          x1="200"
                          y1="200"
                          x2={cx}
                          y2={cy}
                          stroke="#C9A84C"
                          strokeWidth="1"
                          opacity="0.4"
                          strokeDasharray="4,4"
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r="22"
                          fill="white"
                          stroke="#C9A84C"
                          strokeWidth="1.5"
                        />
                        <circle cx={cx} cy={cy} r="4" fill="#C9A84C" />
                      </g>
                    );
                  })}
                  <circle cx="200" cy="200" r="8" fill="#C9A84C" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section
        className="py-24 lg:py-32"
        style={{ backgroundColor: "#0A1628" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#C9A84C" }}
            >
              The Challenge
            </p>
            <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-white">
              Why Schools Need Structured Academic Systems
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {painPoints.map((item, idx) => (
              <div
                key={item.title}
                className={`reveal ${delayClass(idx)} group p-7 rounded-xl border transition-all duration-300 cursor-default hover:-translate-y-1 gold-glow-hover`}
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(201,168,76,0.2)",
                }}
              >
                <div className="mb-5" style={{ color: "#C9A84C" }}>
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#C9A84C" }}
            >
              What We Offer
            </p>
            <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-[#0A1628]">
              Our Products & Services
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, idx) => (
              <div
                key={svc.title}
                className={`reveal ${delayClass(idx % 4)} group p-7 rounded-xl border border-gray-100 bg-white transition-all duration-300 cursor-pointer hover:-translate-y-1 gold-glow-hover`}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                  style={{ backgroundColor: "rgba(201,168,76,0.12)" }}
                >
                  <span style={{ color: "#C9A84C" }}>{svc.icon}</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-[#0A1628] mb-3 leading-snug">
                  {svc.title}
                </h3>
                <p className="font-sans text-sm text-gray-500 leading-relaxed mb-4">
                  {svc.desc}
                </p>
                <span
                  className="font-sans text-xs font-semibold tracking-wide flex items-center gap-1"
                  style={{ color: "#C9A84C" }}
                >
                  Learn More <ChevronRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRAMEWORK */}
      <section
        id="framework"
        className="py-24 lg:py-32"
        style={{ backgroundColor: "#0D2144" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#C9A84C" }}
            >
              Our Methodology
            </p>
            <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-white">
              The CurvEd Integrated Academic Framework
            </h2>
          </div>
          {/* Desktop */}
          <div className="hidden lg:flex items-start justify-between relative">
            <div
              className="absolute top-8 left-[8%] right-[8%] h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, #C9A84C, #C9A84C, #C9A84C, transparent)",
                opacity: 0.4,
              }}
            />
            {frameworkSteps.map((step, idx) => (
              <div
                key={step.num}
                className={`reveal ${delayClass(idx)} flex flex-col items-center text-center w-[15%] relative z-10`}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 font-sans font-bold text-[#0D2144] text-sm flex-shrink-0"
                  style={{
                    backgroundColor: "#C9A84C",
                    border: "2px solid #B8972E",
                  }}
                >
                  {step.num}
                </div>
                <h3 className="font-serif text-sm font-semibold text-white mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          {/* Mobile */}
          <div className="lg:hidden space-y-0">
            {frameworkSteps.map((step, idx) => (
              <div
                key={step.num}
                className="flex items-start gap-4 pb-8 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-sans font-bold text-[#0D2144] text-sm flex-shrink-0"
                    style={{ backgroundColor: "#C9A84C" }}
                  >
                    {step.num}
                  </div>
                  {idx < frameworkSteps.length - 1 && (
                    <div
                      className="w-px mt-2"
                      style={{
                        backgroundColor: "rgba(201,168,76,0.4)",
                        minHeight: "40px",
                      }}
                    />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="font-serif text-base font-semibold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-slate-400">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#C9A84C" }}
            >
              Outcomes
            </p>
            <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-[#0A1628]">
              Measured Academic Impact
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactItems.map((item, idx) => (
              <div
                key={item.label}
                className={`reveal ${delayClass(idx % 4)} bg-white rounded-xl p-7 border border-gray-100 text-center transition-all duration-300 cursor-default hover:-translate-y-1 gold-glow-hover`}
              >
                <div
                  className="flex justify-center mb-3"
                  style={{ color: "#C9A84C" }}
                >
                  {item.icon}
                </div>
                <div className="font-serif text-3xl font-bold text-[#0A1628] mb-2">
                  {item.metric}
                </div>
                <p className="font-sans text-sm text-gray-600 leading-snug">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENTORSHIP */}
      <section id="mentorship" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-6">
            <p
              className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#C9A84C" }}
            >
              Student Development
            </p>
            <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-[#0A1628]">
              Beyond Curriculum: Structured Student Mentorship
            </h2>
          </div>
          <p className="reveal font-sans text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16 leading-relaxed">
            CurvEd's mentorship architecture creates a structured ecosystem
            where every student is supported through a dedicated mentor
            relationship with clear goals, indicators, and leadership oversight.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {mentorshipFeatures.map((item, idx) => (
              <div
                key={item.title}
                className={`reveal ${delayClass(idx)} p-6 rounded-xl border border-gray-100 bg-gray-50 transition-all duration-300 hover:-translate-y-1 gold-glow-hover`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
                >
                  <span style={{ color: "#C9A84C" }}>{item.icon}</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-[#0A1628] mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          {/* Flow diagram desktop */}
          <div className="reveal hidden md:flex items-center justify-center">
            {mentorshipFlow.map((node, idx) => (
              <div key={node.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-lg"
                    style={{
                      backgroundColor: "#0A1628",
                      borderColor: "#C9A84C",
                    }}
                  >
                    <span style={{ color: "#C9A84C" }}>{node.icon}</span>
                  </div>
                  <span className="font-sans text-sm font-semibold text-[#0A1628] mt-3">
                    {node.label}
                  </span>
                </div>
                {idx < mentorshipFlow.length - 1 && (
                  <div
                    className="flex items-center mx-2"
                    style={{ minWidth: "80px" }}
                  >
                    <svg
                      aria-hidden="true"
                      width="80"
                      height="20"
                      viewBox="0 0 80 20"
                    >
                      <path
                        d="M 0,10 Q 40,0 80,10"
                        stroke="#C9A84C"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <polygon points="74,7 80,10 74,13" fill="#C9A84C" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Mobile */}
          <div className="reveal md:hidden space-y-4">
            {mentorshipFlow.map((node, idx) => (
              <div
                key={node.label}
                className="flex items-center gap-4 p-4 rounded-xl border"
                style={{ borderColor: "rgba(201,168,76,0.3)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#0A1628" }}
                >
                  <span
                    className="font-sans font-bold text-sm"
                    style={{ color: "#C9A84C" }}
                  >
                    {idx + 1}
                  </span>
                </div>
                <span className="font-sans font-semibold text-[#0A1628]">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPLEMENTATION MODEL */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#C9A84C" }}
            >
              Our Process
            </p>
            <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-[#0A1628]">
              How We Work With Schools
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div
              className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0"
              style={{ borderTop: "2px dashed rgba(201,168,76,0.4)" }}
            />
            {implementationSteps.map((item, idx) => (
              <div
                key={item.step}
                className={`reveal ${delayClass(idx)} flex flex-col items-center text-center px-4`}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6 font-serif font-bold text-3xl relative z-10 bg-gray-50 border-2"
                  style={{ color: "#C9A84C", borderColor: "#C9A84C" }}
                >
                  {item.step}
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#0A1628] mb-3">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / CREDIBILITY */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#C9A84C" }}
            >
              Trust & Credibility
            </p>
            <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-[#0A1628]">
              Built for Institutions That Value Academic Excellence
            </h2>
            <p className="reveal font-sans text-gray-500 mt-4 text-lg italic">
              Selective. Strategic. Trusted.
            </p>
          </div>

          <div className="mb-16">
            <h3 className="reveal font-serif text-2xl font-semibold text-[#0A1628] text-center mb-8">
              Partner Schools
            </h3>
            <div className="reveal grid grid-cols-3 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="aspect-video border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                >
                  <span className="font-sans text-xs text-gray-400">
                    School Logo
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h3 className="reveal font-serif text-2xl font-semibold text-[#0A1628] text-center mb-8">
              What Principals Say
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t, idx) => (
                <div
                  key={t.name}
                  className={`reveal ${delayClass(idx)} p-8 rounded-xl bg-gray-50 border border-gray-100`}
                >
                  <Quote
                    size={32}
                    className="mb-4 opacity-30"
                    style={{ color: "#C9A84C" }}
                  />
                  <p className="font-sans text-gray-700 leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#0A1628] flex items-center justify-center">
                      <span
                        className="font-serif font-bold text-lg"
                        style={{ color: "#C9A84C" }}
                      >
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-sm text-[#0A1628]">
                        {t.name}
                      </p>
                      <p className="font-sans text-xs text-gray-500">
                        {t.title} — {t.school}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h3 className="reveal font-serif text-2xl font-semibold text-[#0A1628] text-center mb-8">
              Our Academic Advisors
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {advisors.map((a, idx) => (
                <div
                  key={a.name}
                  className={`reveal ${delayClass(idx)} flex items-center gap-5 p-6 rounded-xl border border-gray-100 bg-gray-50`}
                >
                  <div className="w-16 h-16 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <span
                      className="font-serif font-bold text-xl"
                      style={{ color: "#C9A84C" }}
                    >
                      {a.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-[#0A1628]">
                      {a.name}
                    </p>
                    <p
                      className="font-sans text-sm"
                      style={{ color: "#C9A84C" }}
                    >
                      {a.title}
                    </p>
                    <p className="font-sans text-xs text-gray-500 mt-1">
                      {a.cred}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="reveal font-serif text-2xl font-semibold text-[#0A1628] text-center mb-8">
              Case Study Highlights
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudies.map((cs, idx) => (
                <div
                  key={cs.title}
                  className={`reveal ${delayClass(idx)} p-8 rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 gold-glow-hover`}
                >
                  <span
                    className="inline-block font-sans text-xs font-semibold tracking-wide px-3 py-1 rounded-full mb-4"
                    style={{
                      backgroundColor: "rgba(201,168,76,0.15)",
                      color: "#B8972E",
                    }}
                  >
                    {cs.tag}
                  </span>
                  <h4 className="font-serif text-lg font-semibold text-[#0A1628] mb-3">
                    {cs.title}
                  </h4>
                  <p className="font-sans text-sm text-gray-500 leading-relaxed mb-5">
                    {cs.desc}
                  </p>
                  <button
                    type="button"
                    className="font-sans text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                    style={{ color: "#C9A84C" }}
                  >
                    View Case Study <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#C9A84C" }}
            >
              Get In Touch
            </p>
            <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-[#0A1628]">
              Begin Your Institutional Partnership
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="reveal bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {inquirySubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle
                    size={56}
                    className="mx-auto mb-4"
                    style={{ color: "#C9A84C" }}
                  />
                  <h3 className="font-serif text-2xl text-[#0A1628] mb-2">
                    Inquiry Received
                  </h3>
                  <p className="font-sans text-gray-600">
                    Thank you for reaching out. Our team will contact you within
                    24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inq-name"
                        className="block font-sans text-sm font-medium text-[#0A1628] mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        id="inq-name"
                        required
                        value={inquiryForm.name}
                        onChange={(e) =>
                          setInquiryForm((f) => ({
                            ...f,
                            name: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="inq-desig"
                        className="block font-sans text-sm font-medium text-[#0A1628] mb-1"
                      >
                        Designation *
                      </label>
                      <input
                        id="inq-desig"
                        required
                        value={inquiryForm.designation}
                        onChange={(e) =>
                          setInquiryForm((f) => ({
                            ...f,
                            designation: e.target.value,
                          }))
                        }
                        placeholder="Principal / Academic Director"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inq-school"
                        className="block font-sans text-sm font-medium text-[#0A1628] mb-1"
                      >
                        School Name *
                      </label>
                      <input
                        id="inq-school"
                        required
                        value={inquiryForm.schoolName}
                        onChange={(e) =>
                          setInquiryForm((f) => ({
                            ...f,
                            schoolName: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="inq-city"
                        className="block font-sans text-sm font-medium text-[#0A1628] mb-1"
                      >
                        City *
                      </label>
                      <input
                        id="inq-city"
                        required
                        value={inquiryForm.city}
                        onChange={(e) =>
                          setInquiryForm((f) => ({
                            ...f,
                            city: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inq-phone"
                        className="block font-sans text-sm font-medium text-[#0A1628] mb-1"
                      >
                        Phone *
                      </label>
                      <input
                        id="inq-phone"
                        required
                        type="tel"
                        value={inquiryForm.phone}
                        onChange={(e) =>
                          setInquiryForm((f) => ({
                            ...f,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="inq-email"
                        className="block font-sans text-sm font-medium text-[#0A1628] mb-1"
                      >
                        Email *
                      </label>
                      <input
                        id="inq-email"
                        required
                        type="email"
                        value={inquiryForm.email}
                        onChange={(e) =>
                          setInquiryForm((f) => ({
                            ...f,
                            email: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="inq-msg"
                      className="block font-sans text-sm font-medium text-[#0A1628] mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="inq-msg"
                      rows={4}
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm((f) => ({
                          ...f,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Tell us about your school's academic needs..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className="w-full py-4 rounded-lg font-sans font-semibold text-[#0A1628] transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: "#C9A84C" }}
                  >
                    {inquiryLoading
                      ? "Submitting..."
                      : "Submit Institutional Inquiry"}
                  </button>
                </form>
              )}
            </div>

            <div className="reveal space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#0A1628] mb-6">
                  Connect With Our Team
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail
                      size={18}
                      className="mt-1 flex-shrink-0"
                      style={{ color: "#C9A84C" }}
                    />
                    <div>
                      <p className="font-sans text-sm font-medium text-[#0A1628]">
                        Email
                      </p>
                      <p className="font-sans text-sm text-gray-600">
                        curvedcurriculum@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone
                      size={18}
                      className="mt-1 flex-shrink-0"
                      style={{ color: "#C9A84C" }}
                    />
                    <div>
                      <p className="font-sans text-sm font-medium text-[#0A1628]">
                        Phone
                      </p>
                      <p className="font-sans text-sm text-gray-600">
                        +91 9608632238
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="mt-1 flex-shrink-0"
                      style={{ color: "#C9A84C" }}
                    />
                    <div>
                      <p className="font-sans text-sm font-medium text-[#0A1628]">
                        Head Office
                      </p>
                      <p className="font-sans text-sm text-gray-600">
                        Bengaluru, Karnataka, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="p-7 rounded-xl border-2"
                style={{
                  borderColor: "rgba(201,168,76,0.4)",
                  backgroundColor: "rgba(201,168,76,0.05)",
                }}
              >
                <h4 className="font-serif text-lg font-semibold text-[#0A1628] mb-2">
                  Download Our Prospectus
                </h4>
                <p className="font-sans text-sm text-gray-600 mb-4">
                  Get a detailed overview of our services, methodology, and
                  engagement models.
                </p>
                <button
                  type="button"
                  onClick={() => setProspectusOpen(true)}
                  className="flex items-center gap-2 font-sans text-sm font-semibold px-5 py-3 rounded-lg transition-all hover:opacity-90 text-[#0A1628]"
                  style={{ backgroundColor: "#C9A84C" }}
                >
                  <Download size={16} /> Download Prospectus
                </button>
              </div>
              <div
                className="p-7 rounded-xl"
                style={{ backgroundColor: "#0A1628" }}
              >
                <h4 className="font-serif text-lg font-semibold text-white mb-2">
                  Prefer a Call?
                </h4>
                <p className="font-sans text-sm text-slate-300 mb-4">
                  Our academic consultants are available Monday-Friday, 9 AM - 6
                  PM IST.
                </p>
                <a
                  href="tel:+919608632238"
                  className="flex items-center gap-2 font-sans text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ color: "#C9A84C" }}
                >
                  <Phone size={16} /> +91 9608632238
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="py-24 lg:py-32 relative overflow-hidden"
        style={{ backgroundColor: "#0A1628" }}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M 0,200 Q 360,80 720,200 T 1440,200"
            stroke="#C9A84C"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 0,280 Q 360,160 720,280 T 1440,280"
            stroke="#C9A84C"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <p
            className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-6"
            style={{ color: "#C9A84C" }}
          >
            Partner With CurvEd
          </p>
          <h2 className="reveal font-serif text-4xl lg:text-5xl font-bold text-white mb-6">
            Partner With CurvEd to Build a Future-Ready Academic Ecosystem
          </h2>
          <p className="reveal font-sans text-lg text-slate-300 mb-10">
            Designed for schools committed to long-term academic transformation.
          </p>
          <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="font-sans font-semibold px-8 py-4 rounded-lg text-[#0A1628] transition-all hover:opacity-90"
              style={{ backgroundColor: "#C9A84C" }}
            >
              Schedule a Strategic Discussion
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="font-sans font-semibold px-8 py-4 rounded-lg text-white border-2 transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.4)" }}
            >
              Request Institutional Proposal
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#060e1c" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/uploads/curved-amblem-1.png"
                  alt="CurvEd emblem"
                  className="h-10 w-auto object-contain"
                  style={{
                    filter:
                      "brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(155deg)",
                  }}
                />
                <img
                  src="/assets/uploads/curved-logo--2.png"
                  alt="CurvEd Curriculum"
                  className="h-8 w-auto object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <p className="font-sans text-sm text-slate-400 leading-relaxed mb-4">
                Premium academic consulting and curriculum solutions for schools
                committed to structured, future-ready education.
              </p>
              <p className="font-sans text-xs text-slate-500">
                Global Academic & Curriculum Partner
              </p>
            </div>
            <div>
              <h4 className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-slate-500 mb-4">
                Services
              </h4>
              <ul className="space-y-2">
                {footerServices.map((s) => (
                  <li key={s}>
                    <span className="font-sans text-sm text-slate-400 hover:text-[#C9A84C] cursor-pointer transition-colors">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-slate-500 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(link.id)}
                      className="font-sans text-sm text-slate-400 hover:text-[#C9A84C] transition-colors"
                    >
                      {link.l}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => setProspectusOpen(true)}
                    className="font-sans text-sm flex items-center gap-1 transition-colors"
                    style={{ color: "#C9A84C" }}
                  >
                    <Download size={12} /> Download Prospectus
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-slate-500 mb-4">
                Contact
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Mail
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-slate-500"
                  />
                  <span className="font-sans text-sm text-slate-400">
                    curvedcurriculum@gmail.com
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-slate-500"
                  />
                  <span className="font-sans text-sm text-slate-400">
                    +91 9608632238
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-slate-500"
                  />
                  <span className="font-sans text-sm text-slate-400">
                    Bengaluru, Karnataka, India
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="border-t pt-8"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="font-sans text-xs text-slate-600 text-center">
              &copy; 2026 CurvEd Curriculum. All rights reserved. | Bengaluru,
              Karnataka, India
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING BUTTON */}
      {showFloating && (
        <button
          type="button"
          onClick={() => scrollTo("contact")}
          className="fixed bottom-6 right-6 z-40 font-sans text-sm font-semibold px-5 py-3 rounded-full shadow-2xl transition-all hover:opacity-90 hover:-translate-y-1 flex items-center gap-2 text-[#0A1628]"
          style={{ backgroundColor: "#C9A84C" }}
        >
          <Calendar size={16} /> Book Consultation
        </button>
      )}
    </div>
  );
}
