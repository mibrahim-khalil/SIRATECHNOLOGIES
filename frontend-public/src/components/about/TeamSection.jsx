import { useEffect, useState } from "react";
import client from "../../api/client.js";
import {
  Linkedin,
  Github,
  Twitter,
  Globe,
  Mail,
} from "lucide-react";

/* ---------- Avatar with fallback to initials ---------- */
function Avatar({ name, image }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  return (
    <div className="person-avatar" aria-label={name}>
      {image ? (
        <img
          src={image}
          alt={name}
          className="person-img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <div className="person-initials">{initials}</div>
    </div>
  );
}

/* ---------- Social icon link ---------- */
function SocialIcon({ href, icon: Icon, label }) {
  if (!href) return null;
  return (
    <a
      className="person-social"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
    >
      <Icon size={15} />
    </a>
  );
}

/* ---------- Member links row ---------- */
function MemberSocials({ member }) {
  const s = member.social || {};
  const hasAny =
    s.linkedin || s.github || s.twitter || s.website || member.email;

  if (!hasAny) return null;

  return (
    <div className="person-socials">
      {member.email && (
        <SocialIcon
          href={`mailto:${member.email}`}
          icon={Mail}
          label="Email"
        />
      )}
      {s.linkedin && (
        <SocialIcon href={s.linkedin} icon={Linkedin} label="LinkedIn" />
      )}
      {s.github && <SocialIcon href={s.github} icon={Github} label="GitHub" />}
      {s.twitter && (
        <SocialIcon href={s.twitter} icon={Twitter} label="Twitter" />
      )}
      {s.website && (
        <SocialIcon href={s.website} icon={Globe} label="Website" />
      )}
    </div>
  );
}

/* ---------- Main component ---------- */
export default function TeamSection({
  title = "Meet Our Team",
  subtitle = "The brilliant minds behind our work.",
}) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/team");
        if (!cancelled) {
          const list = data?.data?.members || [];
          setMembers(list);
        }
      } catch (err) {
        console.warn("[TeamSection] Fetch failed:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Hide entire section if loading is done and no members
  if (!loading && members.length === 0) return null;

  const [founder, ...team] = members;

  return (
    <section className="section team-section-public">
      <div className="container">
        <div className="about-head-center">
          <h2 className="about-h2">{title}</h2>
          {subtitle && (
            <p className="about-p about-p-center">{subtitle}</p>
          )}
        </div>

        {loading ? (
          <>
            {/* Founder skeleton */}
            <div className="founder-card" style={{ marginTop: 24 }}>
              <div className="skeleton" style={{ width: 92, height: 92, borderRadius: 18 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-line" style={{ width: 200 }} />
                <div className="skeleton skeleton-line" style={{ width: 150, marginTop: 6 }} />
                <div className="skeleton skeleton-line" style={{ marginTop: 12 }} />
                <div className="skeleton skeleton-line" style={{ width: "80%" }} />
              </div>
            </div>
            {/* Team skeleton */}
            <div className="team-grid" style={{ marginTop: 16 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="person-card">
                  <div className="skeleton" style={{ width: 72, height: 72, borderRadius: 18 }} />
                  <div className="skeleton skeleton-line" style={{ marginTop: 12 }} />
                  <div className="skeleton skeleton-line" style={{ width: "70%" }} />
                  <div className="skeleton skeleton-line" style={{ marginTop: 8 }} />
                  <div className="skeleton skeleton-line" style={{ width: "90%" }} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Founder — large featured card */}
            {founder && (
              <div className="founder-card">
                <div>
                  <Avatar name={founder.name} image={founder.photo?.url} />
                </div>
                <div>
                  <div className="person-name">{founder.name}</div>
                  <div className="person-role">{founder.role}</div>
                  {founder.bio && (
                    <div className="person-bio">{founder.bio}</div>
                  )}
                  <MemberSocials member={founder} />
                </div>
              </div>
            )}

            {/* Rest of team */}
            {team.length > 0 && (
              <div className="team-grid">
                {team.map((m) => (
                  <div key={m._id} className="person-card">
                    <Avatar name={m.name} image={m.photo?.url} />
                    <div className="person-name">{m.name}</div>
                    <div className="person-role">{m.role}</div>
                    {m.bio && <div className="person-bio">{m.bio}</div>}
                    <MemberSocials member={m} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}