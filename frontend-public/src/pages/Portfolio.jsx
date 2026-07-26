import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  ExternalLink,
  Github,
  Star,
  User,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Filter,
} from "lucide-react";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";
import client from "../api/client.js";

const PAGE_SIZE = 9;

/* ---------- Format date helper ---------- */
function formatDate(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

/* ---------- Project Card ---------- */
function ProjectCard({ project, onOpen }) {
  return (
    <article
      className="pf-card"
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
    >
      <div className="pf-card-media">
        {project.coverImage?.url ? (
          <img
            src={project.coverImage.url}
            alt={project.title}
            loading="lazy"
          />
        ) : (
          <div className="pf-card-media-fallback">
            <ImageIcon size={40} />
          </div>
        )}

        <div className="pf-card-badges">
          {project.isFeatured && (
            <span className="pf-card-featured">
              <Star size={11} fill="currentColor" />
              Featured
            </span>
          )}
          {project.category && (
            <span className="pf-card-category">{project.category}</span>
          )}
        </div>

        <div className="pf-card-overlay">
          <div className="pf-card-overlay-btn">View project</div>
        </div>
      </div>

      <div className="pf-card-body">
        <h3 className="pf-card-title">{project.title}</h3>
        <p className="pf-card-desc">{project.shortDescription}</p>

        {project.techStack?.length > 0 && (
          <div className="pf-card-tech">
            {project.techStack.slice(0, 4).map((t, i) => (
              <span key={i} className="pf-card-tech-chip">
                {t}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="pf-card-tech-chip pf-card-tech-more">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------- Detail Modal (Lightbox) ---------- */
function DetailModal({ project, onClose }) {
  const [galleryIdx, setGalleryIdx] = useState(0);

  // Build gallery list: coverImage + gallery
  const allImages = useMemo(() => {
    if (!project) return [];
    const images = [];
    if (project.coverImage?.url) images.push(project.coverImage);
    if (project.gallery?.length) images.push(...project.gallery);
    return images;
  }, [project]);

  // Reset gallery index when project changes
  useEffect(() => {
    setGalleryIdx(0);
  }, [project]);

  // Lock body scroll while open + ESC to close + arrow keys
  useEffect(() => {
    if (!project) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) return null;

  function nextImage() {
    if (allImages.length === 0) return;
    setGalleryIdx((i) => (i + 1) % allImages.length);
  }

  function prevImage() {
    if (allImages.length === 0) return;
    setGalleryIdx((i) => (i - 1 + allImages.length) % allImages.length);
  }

  const currentImage = allImages[galleryIdx];
  const completedDate = formatDate(project.completedAt);

  return (
    <div
      className="pf-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="pf-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="pf-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Image gallery */}
        <div className="pf-modal-gallery">
          {currentImage ? (
            <img src={currentImage.url} alt={project.title} />
          ) : (
            <div className="pf-modal-gallery-empty">
              <ImageIcon size={60} />
              <span>No image available</span>
            </div>
          )}

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                className="pf-gallery-nav pf-gallery-nav-prev"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="pf-gallery-nav pf-gallery-nav-next"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>

              <div className="pf-gallery-counter">
                {galleryIdx + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails strip */}
        {allImages.length > 1 && (
          <div className="pf-modal-thumbs">
            {allImages.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`pf-thumb ${i === galleryIdx ? "pf-thumb-active" : ""}`}
                onClick={() => setGalleryIdx(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img.url} alt="" />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="pf-modal-body">
          <div className="pf-modal-head">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="pf-modal-badges">
                {project.isFeatured && (
                  <span className="pf-card-featured">
                    <Star size={11} fill="currentColor" />
                    Featured
                  </span>
                )}
                {project.category && (
                  <span className="pf-card-category">{project.category}</span>
                )}
              </div>
              <h2 className="pf-modal-title">{project.title}</h2>
            </div>
          </div>

          {/* Meta row */}
          <div className="pf-modal-meta">
            {project.client && (
              <div className="pf-meta-item">
                <User size={14} />
                <div>
                  <div className="pf-meta-label">Client</div>
                  <div className="pf-meta-value">{project.client}</div>
                </div>
              </div>
            )}
            {completedDate && (
              <div className="pf-meta-item">
                <Calendar size={14} />
                <div>
                  <div className="pf-meta-label">Completed</div>
                  <div className="pf-meta-value">{completedDate}</div>
                </div>
              </div>
            )}
            {project.category && (
              <div className="pf-meta-item">
                <Briefcase size={14} />
                <div>
                  <div className="pf-meta-label">Category</div>
                  <div className="pf-meta-value">{project.category}</div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="pf-modal-section">
            <h4 className="pf-modal-section-title">About the project</h4>
            <div className="pf-modal-description">
              {(project.description || project.shortDescription || "")
                .split("\n\n")
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          </div>

          {/* Tech stack */}
          {project.techStack?.length > 0 && (
            <div className="pf-modal-section">
              <h4 className="pf-modal-section-title">Tech stack</h4>
              <div className="pf-modal-tech">
                {project.techStack.map((t, i) => (
                  <span key={i} className="pf-modal-tech-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pf-modal-actions">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={16} />
                Visit Live Site
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Github size={16} />
                View Code
              </a>
            )}
            <Link
              to="/start-project"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Build something similar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   MAIN PORTFOLIO PAGE
   ============================================ */
export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/portfolio");
        if (!cancelled) {
          const list = data?.data?.portfolios || [];
          // Sort: featured first, then by order, then by date
          const sorted = [...list].sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return (a.order || 0) - (b.order || 0);
          });
          setProjects(sorted);
        }
      } catch (err) {
        console.warn("[Portfolio] Fetch failed:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Build dynamic category list from actual project categories
  const availableCategories = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  // Filter + search
  const filtered = useMemo(() => {
    let result = projects;

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((p) => {
        const inTitle = p.title?.toLowerCase().includes(q);
        const inDesc = p.shortDescription?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
        const inTech = p.techStack?.some((t) => t.toLowerCase().includes(q));
        const inClient = p.client?.toLowerCase().includes(q);
        return inTitle || inDesc || inTech || inClient;
      });
    }

    return result;
  }, [projects, category, search]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, search]);

  const visibleProjects = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <PageHero
        pageKey="portfolio"
        title="Our Work"
        subtitle="Selected projects across design, web development, AI, automation, and branding."
        image="/assets/work-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="Services"
        secondaryCtaTo="/services"
      />

      <section className="section">
        <div className="container">
          {/* Filter bar */}
          <div className="pf-toolbar">
            {/* Search */}
            <div className="pf-search">
              <Search size={16} className="pf-search-icon" />
              <input
                type="text"
                className="pf-search-input"
                placeholder="Search projects, tech stack, clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="pf-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category filters */}
            {availableCategories.length > 1 && (
              <div className="pf-filters">
                <div className="pf-filters-label">
                  <Filter size={13} />
                  <span>Filter:</span>
                </div>
                <div className="pf-filters-chips">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`pf-chip ${category === cat ? "pf-chip-active" : ""}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Result count */}
            {!loading && (
              <div className="pf-result-count">
                {filtered.length === 0
                  ? "No projects found"
                  : filtered.length === 1
                  ? "1 project"
                  : `${filtered.length} projects`}
                {(category !== "All" || search) && projects.length > 0 && (
                  <>
                    {" "}of {projects.length}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="pf-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="pf-card">
                  <div className="skeleton pf-card-media" style={{ borderRadius: 0 }} />
                  <div className="pf-card-body">
                    <div className="skeleton skeleton-line" style={{ width: "80%" }} />
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line" style={{ width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="services-empty">
              <div className="services-empty-icon">
                <Briefcase size={40} />
              </div>
              <div className="services-empty-title">
                {search || category !== "All"
                  ? "No matches found"
                  : "Portfolio coming soon"}
              </div>
              <div className="services-empty-text">
                {search || category !== "All"
                  ? "Try a different search term or category filter."
                  : "We're preparing case studies of our work. In the meantime, contact us to discuss your project."}
              </div>
              {(search || category !== "All") ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button as={Link} to="/contact" variant="primary">
                  Get in touch
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="pf-grid">
                {visibleProjects.map((p) => (
                  <ProjectCard
                    key={p._id}
                    project={p}
                    onOpen={setSelectedProject}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="pf-load-more">
                  <Button
                    variant="secondary"
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                  >
                    Load more projects
                  </Button>
                  <div className="pf-load-more-hint">
                    Showing {visibleProjects.length} of {filtered.length}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="svc-cta-banner">
            <div className="svc-cta-content">
              <div className="svc-cta-title">Ready to be our next case study?</div>
              <div className="svc-cta-text">
                Whether you have a fully-scoped project or just an idea, we'd love
                to hear from you. Let's build something amazing together.
              </div>
            </div>
            <div className="svc-cta-actions">
              <Button as={Link} to="/start-project" variant="primary">
                Start a Project
              </Button>
              <Button as={Link} to="/contact" variant="secondary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal (lightbox) */}
      <DetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}