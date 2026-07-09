import { useState,useEffect } from "react";

/* ─── Design Tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:          "#000000",
  surface:     "#070710",
  card:        "#0a0a14",
  cardBorder:  "#16163a",

  inputBg:     "#06060f",
  inputBorder: "#22224a",

  accent:      "#6d47f5",
  accentLight: "#9b7dff",
  accentDim:   "rgba(109,71,245,0.13)",
  accentGlow:  "rgba(109,71,245,0.45)",

  gradText:    "linear-gradient(130deg, #b39dff 0%, #6ea6ff 100%)",
  gradBtn:     "linear-gradient(130deg, #6d47f5 0%, #3a7de8 100%)",
  gradAvatar:  "linear-gradient(135deg, #7c5cfc 0%, #2250d4 100%)",
  gradBadge:   "linear-gradient(130deg, rgba(109,71,245,0.22) 0%, rgba(50,120,240,0.22) 100%)",
  gradCard:    "linear-gradient(160deg, rgba(109,71,245,0.07) 0%, rgba(0,0,0,0) 60%)",

  textPrimary:   "#ece8ff",
  textSecondary: "#7a78a8",
  textMuted:     "#3d3d68",

  danger:        "#f87171",
  dangerDim:     "rgba(248,113,113,0.09)",
  dangerBorder:  "rgba(248,113,113,0.25)",

  radius:   "16px",
  radiusSm: "10px",
  radiusXl: "22px",
};

/* ─── Global Styles ───────────────────────────────────────────────────────── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  .ap-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ap-root { font-family: 'DM Sans', sans-serif; }
  .ap-root h1, .ap-root .syne { font-family: 'Syne', sans-serif; }
  .ap-root input:focus { outline: none; border-color: #6d47f5 !important; box-shadow: 0 0 0 3px rgba(109,71,245,0.2) !important; }
  .ap-root button { font-family: 'DM Sans', sans-serif; }

  .ap-edit-btn { transition: all 0.2s ease !important; }
  .ap-edit-btn:hover { background: rgba(109,71,245,0.14) !important; border-color: rgba(109,71,245,0.5) !important; color: #9b7dff !important; }

  .ap-icon-btn { transition: color 0.15s ease !important; }
  .ap-icon-btn:hover { color: #9b7dff !important; }

  .ap-save-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .ap-save-btn { transition: opacity 0.15s, transform 0.15s !important; }

  .ap-cancel-btn:hover { background: rgba(255,255,255,0.05) !important; }
  .ap-danger-btn:hover { background: rgba(248,113,113,0.15) !important; border-color: rgba(248,113,113,0.5) !important; }

  .ap-row { transition: background 0.15s ease; }
  .ap-row:hover { background: rgba(109,71,245,0.04) !important; }
  .ap-row:last-child { border-bottom: none !important; }

  .ap-avatar { transition: box-shadow 0.25s ease; }
  .ap-avatar:hover { box-shadow: 0 0 40px rgba(109,71,245,0.65) !important; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.12s; }
  .d3 { animation-delay: 0.19s; }
  .d4 { animation-delay: 0.26s; }
  .d5 { animation-delay: 0.33s; }
  .d6 { animation-delay: 0.40s; }
`;

/* ─── Gradient Text ───────────────────────────────────────────────────────── */
function GradText({ children, style }) {
  return (
    <span style={{
      background: T.gradText,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      ...style,
    }}>
      {children}
    </span>
  );
}

/* ─── Edit Modal ──────────────────────────────────────────────────────────── */
function EditModal({ field, value, onSave, onClose }) {
  const [val, setVal] = useState(value);
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const isPass = field === "Password";

  const handleSave = () => {
    if (isPass && val !== confirm) return alert("Passwords don't match.");
    onSave(val);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.card,
          border: `1px solid ${T.cardBorder}`,
          borderRadius: T.radiusXl,
          padding: "2.25rem",
          width: "100%", maxWidth: 430,
          boxShadow: `0 0 80px rgba(109,71,245,0.18), 0 30px 60px rgba(0,0,0,0.7)`,
          position: "relative", overflow: "hidden",
          animation: "fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* Corner glow */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,71,245,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ marginBottom: "1.6rem", position: "relative" }}>
          <p className="syne" style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary, marginBottom: 5 }}>
            Edit <GradText>{field}</GradText>
          </p>
          <p style={{ fontSize: 14, color: T.textSecondary, fontWeight: 300 }}>
            Update your {field.toLowerCase()} below.
          </p>
        </div>

        {/* Input */}
        <label style={{
          display: "block", fontSize: 11, fontWeight: 600,
          color: T.textMuted, marginBottom: 7,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {isPass ? "New password" : field}
        </label>
        <div style={{ position: "relative" }}>
          <input
            autoFocus
            type={isPass ? (showPw ? "text" : "password") : "text"}
            value={val}
            onChange={e => setVal(e.target.value)}
            style={{
              width: "100%",
              background: T.inputBg,
              border: `1px solid ${T.inputBorder}`,
              borderRadius: T.radiusSm,
              padding: `11px ${isPass ? 44 : 14}px 11px 14px`,
              fontSize: 14, color: T.textPrimary,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          />
          {isPass && (
            <button
              className="ap-icon-btn"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", cursor: "pointer",
                color: T.textSecondary, fontSize: 16, display: "flex", alignItems: "center",
              }}
            >
              <i className={showPw ? "ti ti-eye-off" : "ti ti-eye"} />
            </button>
          )}
        </div>

        {isPass && (
          <div style={{ marginTop: 14 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 600,
              color: T.textMuted, marginBottom: 7,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              style={{
                width: "100%", background: T.inputBg,
                border: `1px solid ${T.inputBorder}`,
                borderRadius: T.radiusSm, padding: "11px 14px",
                fontSize: 14, color: T.textPrimary,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: "1.75rem" }}>
          <button
            className="ap-cancel-btn"
            onClick={onClose}
            style={{
              padding: "10px 20px", borderRadius: T.radiusSm, fontSize: 14,
              border: `1px solid ${T.cardBorder}`, background: "transparent",
              color: T.textSecondary, cursor: "pointer", transition: "background 0.15s",
            }}
          >
            Cancel
          </button>
          <button
            className="ap-save-btn"
            onClick={handleSave}
            style={{
              padding: "10px 24px", borderRadius: T.radiusSm, fontSize: 14, fontWeight: 600,
              background: T.gradBtn, color: "#fff", border: "none", cursor: "pointer",
              boxShadow: `0 4px 24px ${T.accentGlow}`,
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Field Row ───────────────────────────────────────────────────────────── */
function FieldRow({ icon, label, value, isLast, onEdit, isPassword }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <div
      className="ap-row"
      style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.25rem",
        borderBottom: isLast ? "none" : `1px solid ${T.cardBorder}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: T.accentDim,
          border: `1px solid rgba(109,71,245,0.18)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, color: T.accentLight,
        }}>
          <i className={`ti ti-${icon}`} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 10.5, color: T.textMuted, textTransform: "uppercase",
            letterSpacing: "0.07em", fontWeight: 600, marginBottom: 3,
          }}>
            {label}
          </div>
          <div style={{
            fontSize: 14.5, fontWeight: 400, overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
            color: isPassword && !showPw ? T.textSecondary : T.textPrimary,
          }}>
            {isPassword
              ? (showPw ? value : <span style={{ letterSpacing: 3, fontSize: 11, color: T.textSecondary }}>●●●●●●●●●●</span>)
              : value}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {isPassword && (
          <button
            className="ap-icon-btn"
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? "Hide" : "Show"}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: T.textMuted, fontSize: 18, display: "flex",
              alignItems: "center", padding: 4, borderRadius: 8,
            }}
          >
            <i className={showPw ? "ti ti-eye-off" : "ti ti-eye"} />
          </button>
        )}
        <button
          className="ap-edit-btn"
          onClick={onEdit}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 12.5, color: T.textSecondary, cursor: "pointer",
            padding: "6px 13px", borderRadius: 8,
            border: `1px solid ${T.cardBorder}`, background: "transparent",
          }}
        >
          <i className="ti ti-pencil" style={{ fontSize: 13 }} />
          {isPassword ? "Change" : "Edit"}
        </button>
      </div>
    </div>
  );
}

/* ─── Section Label ───────────────────────────────────────────────────────── */
function SectionLabel({ children, first }) {
  return (
    <p style={{
      fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: T.textMuted,
      marginBottom: 8, paddingLeft: 2,
      marginTop: first ? 0 : "1.75rem",
      fontFamily: "'Syne', sans-serif",
    }}>
      {children}
    </p>
  );
}

/* ─── Card ────────────────────────────────────────────────────────────────── */
function FieldCard({ children }) {
  return (
    <div style={{
      background: T.card,
      backgroundImage: T.gradCard,
      borderRadius: T.radius,
      border: `1px solid ${T.cardBorder}`,
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function AccountPage() {
  const [data, setData] = useState({
    name:"",
    email:"",
    phone:"",
    password:"********"
  });
  const [modal, setModal] = useState(null);
  const [avatarHover, setAvatarHover] = useState(false);


useEffect(()=>{

    const fetchUser = async()=>{

        try{

            const email = localStorage.getItem("email");

            console.log("Email:", email);


            const response = await fetch(
                `http://localhost:5000/api/auth/profile/${email}`
            );


            if(!response.ok)
            {
                throw new Error("User not found");
            }


            const user = await response.json();


            console.log("User data:", user);



      setData({
    name: user.fullname || user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    password: "********"
});


        }
        catch(error){

            console.log(error);

        }

    };


    fetchUser();


},[]);
const initials = data.name?.trim()
    ? data.name.trim().split(" ")
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";
  const open  = (field, key) => setModal({ field, key });
  const close = () => setModal(null);
const save = async(key,val)=>{

    const email = localStorage.getItem("email");

    let updatedData = {
        ...data,
        [key]:val
    };


    if(key !== "password"){
        delete updatedData.password;
    }


    const response = await fetch(
        `http://localhost:5000/api/auth/profile/${email}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(updatedData)
        }
    );


    const result = await response.json();

    console.log(result);


    if(response.ok){

        setData(prev=>({
            ...prev,
            [key]:val
        }));

    }

};

  return (
    <div className="ap-root" style={{ background: T.bg, minHeight: "100vh", padding: "2.75rem 1.25rem" }}>
      <style>{globalStyle}</style>

      {/* Ambient background glow */}
      <div style={{
        position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(109,71,245,0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: 580, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Page title */}
        <div className="fade-up d1" style={{ marginBottom: "2.25rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: T.accentLight,
            background: T.accentDim, border: `1px solid rgba(109,71,245,0.25)`,
            padding: "5px 14px", borderRadius: 999, marginBottom: 14,
            fontFamily: "'Syne', sans-serif",
          }}>
            <i className="ti ti-settings" style={{ fontSize: 12 }} />
            Account
          </div>
          <h1 className="syne" style={{ fontSize: 30, fontWeight: 800, color: T.textPrimary, marginBottom: 6, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            <GradText>Profile</GradText> &amp; Security
          </h1>
          <p style={{ fontSize: 14, color: T.textSecondary, fontWeight: 300 }}>Manage your personal info, contact details, and password.</p>
        </div>

        {/* Avatar header */}
        <div
          className="fade-up d2"
          style={{
            display: "flex", alignItems: "center", gap: 20,
            background: T.card,
            backgroundImage: "linear-gradient(140deg, rgba(109,71,245,0.1) 0%, rgba(58,125,232,0.04) 100%)",
            border: `1px solid ${T.cardBorder}`,
            borderRadius: T.radiusXl,
            padding: "1.6rem 1.75rem",
            marginBottom: "2rem",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Diagonal line accent */}
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0,
            width: "40%",
            background: "linear-gradient(270deg, rgba(109,71,245,0.05) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />
          {/* Top-right glint */}
          <div style={{
            position: "absolute", top: -30, right: -30,
            width: 140, height: 140, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(109,71,245,0.22) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          <div
            className="ap-avatar"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
            title="Change photo"
            style={{
              width: 70, height: 70, borderRadius: "50%",
              background: T.gradAvatar,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 25, fontWeight: 800, color: "#fff",
              cursor: "pointer", flexShrink: 0, position: "relative",
              boxShadow: `0 0 28px ${T.accentGlow}`,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {initials}
            {avatarHover && (
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <i className="ti ti-camera" style={{ color: "#fff", fontSize: 22 }} />
              </div>
            )}
          </div>

          <div>
            <p className="syne" style={{ fontSize: 21, fontWeight: 700, color: T.textPrimary, marginBottom: 7, letterSpacing: "-0.01em" }}>
              {data.name}
            </p>
          </div>
        </div>

        {/* Profile */}
        <div className="fade-up d3">
          <SectionLabel first>Profile</SectionLabel>
          <FieldCard>
            <FieldRow icon="user" label="Full name" value={data.name} isLast onEdit={() => open("Name", "name")} />
          </FieldCard>
        </div>

        {/* Contact */}
        <div className="fade-up d4">
          <SectionLabel>Contact</SectionLabel>
          <FieldCard>
            <FieldRow icon="mail"  label="Email address" value={data.email} onEdit={() => open("Email", "email")} />
            <FieldRow icon="phone" label="Phone number"  value={data.phone} isLast onEdit={() => open("Phone", "phone")} />
          </FieldCard>
        </div>

        {/* Security */}
        <div className="fade-up d5">
          <SectionLabel>Security</SectionLabel>
          <FieldCard>
            <FieldRow icon="lock" label="Password" value={data.password} isLast isPassword onEdit={() => open("Password", "password")} />
          </FieldCard>
        </div>

      </div>

      {modal && (
        <EditModal
          field={modal.field}
          value={data[modal.key]}
          onSave={val => save(modal.key, val)}
          onClose={close}
        />
      )}
    </div>
  );
}
