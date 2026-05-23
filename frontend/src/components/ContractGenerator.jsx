import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { FilePdf, X, Printer, DownloadSimple, WarningCircle } from "@phosphor-icons/react";

// ─── Full IBES Contract Template ───────────────────────────────────────────
const generateContractText = ({ leaderName, programmeName, moduleName, intake }) => `
IBES ACADEMIC APPOINTMENT

MODULE LEADER:    ${leaderName}
PROGRAMME:        ${programmeName}
MODULE:           ${moduleName}
INTAKE:           ${intake}

──────────────────────────────────────────────────────────────────────────────
OFFICIAL SIGNATURES
──────────────────────────────────────────────────────────────────────────────

For and on behalf of Institut Brittany d'Enseignement Supérieur (IBES):

Authorised Signatory: ___________________________________

Name:  Ms Indah
Title: Academic Director / Authorised Representative

Signature: ___________________________________


Module Leader Acceptance:

Full Name: ${leaderName}

Signature: ___________________________________

Date:      ___________________________________
`;

// ─── Contract Generator Modal ───────────────────────────────────────────────
const ContractGenerator = ({ app, intakes = [], availableModules = [], onClose }) => {
  const [intake, setIntake] = useState(intakes[0] || "");
  const [customIntake, setCustomIntake] = useState("");
  const [moduleTitle, setModuleTitle] = useState(app?.ibesModules || "");
  const [useCustomIntake, setUseCustomIntake] = useState(false);
  const [customModule, setCustomModule] = useState("");
  const [showContract, setShowContract] = useState(false);
  const contractRef = useRef(null);

  const programmeName = app?.ibesprogrammes || app?.ibesProgrammes || "";
  const filteredModules = availableModules.filter(m => 
    !programmeName || (m.programmes && m.programmes.includes(programmeName))
  );

  const missingFields = [];
  if (!app?.fullName) missingFields.push("Module Leader Full Name");
  if (!app?.ibesprogrammes && !app?.ibesProgrammes) missingFields.push("Programme Title");
  if (!moduleTitle) missingFields.push("Module Title");
  const selectedIntake = useCustomIntake ? customIntake : intake;
  if (!selectedIntake) missingFields.push("Intake");

  const contractData = {
    leaderName: app?.fullName || "",
    programmeName: app?.ibesprogrammes || app?.ibesProgrammes || "",
    moduleName: moduleTitle === "CUSTOM" ? customModule : moduleTitle,
    intake: selectedIntake,
  };

  const contractText = generateContractText(contractData);

  const handlePrint = () => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html><head><title>IBES Contract – ${contractData.leaderName}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.8; margin: 40px 60px; color: #000; }
        pre { font-family: 'Times New Roman', serif; font-size: 11pt; white-space: pre-wrap; word-wrap: break-word; }
        @media print { body { margin: 20mm; } }
      </style></head>
      <body><pre>${contractText}</pre></body></html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); printWin.close(); }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contractText).then(() => alert("Contract copied to clipboard!"));
  };

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9000 }} />

      {/* Modal */}
      <div className="modal-enter" style={{
        position: 'fixed', top: '50%', left: '50%',
        zIndex: 9001,
        width: '92vw', maxWidth: '860px', maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        backgroundColor: 'white', borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{ backgroundColor: 'var(--ibes-navy)', padding: '22px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FilePdf size={22} weight="fill" /> Generate Module Leader Contract
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              IBES – Institut Brittany d'Enseignement Supérieur
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <X size={17} weight="bold" />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1 }}>

          {!showContract ? (
            /* ── Form ── */
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

                {/* Module Leader Name (read-only) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Module Leader Full Name</label>
                  <input className="ibes-input" value={app?.fullName || ""} readOnly style={{ backgroundColor: '#f8fafc', color: '#64748b', cursor: 'default' }} />
                </div>

                {/* Programme (read-only) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Programme Title</label>
                  <input className="ibes-input" value={app?.ibesprogrammes || app?.ibesProgrammes || ""} readOnly style={{ backgroundColor: '#f8fafc', color: '#64748b', cursor: 'default' }} />
                </div>

                {/* Module Title (editable/dropdown) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Module Title <span style={{ color: 'var(--ibes-red)' }}>*</span></label>
                  
                  {filteredModules.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <select 
                        className="ibes-input" 
                        value={moduleTitle} 
                        onChange={(e) => setModuleTitle(e.target.value)}
                        style={{ padding: '12px 14px' }}
                      >
                        <option value="">-- Select Module --</option>
                        {/* Ensure the submitted module is always an option even if not in the global list */}
                        {app?.ibesModules && !filteredModules.some(m => m.name === app.ibesModules) && (
                          <option value={app.ibesModules}>{app.ibesModules} (From Application)</option>
                        )}
                        {filteredModules.map((m, i) => (
                          <option key={i} value={m.name}>{m.name} ({m.code})</option>
                        ))}
                        <option value="CUSTOM">-- Type Custom Module --</option>
                      </select>
                      
                      {moduleTitle === "CUSTOM" && (
                        <input
                          className="ibes-input"
                          value={customModule}
                          onChange={(e) => setCustomModule(e.target.value)}
                          placeholder="Type module name manually..."
                          autoFocus
                          style={{ padding: '12px 14px' }}
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      className="ibes-input"
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      placeholder="e.g. Strategic Management"
                      style={{ padding: '12px 14px' }}
                    />
                  )}
                </div>

                {/* Intake */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Intake <span style={{ color: 'var(--ibes-red)' }}>*</span></label>
                  {!useCustomIntake ? (
                    <select
                      className="ibes-input"
                      value={intake}
                      onChange={(e) => setIntake(e.target.value)}
                      style={{ padding: '12px 14px' }}
                    >
                      {intakes.length === 0 && <option value="">No intakes defined</option>}
                      {intakes.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  ) : (
                    <input
                      className="ibes-input"
                      value={customIntake}
                      onChange={(e) => setCustomIntake(e.target.value)}
                      placeholder="e.g. July 2025"
                      style={{ padding: '12px 14px' }}
                    />
                  )}
                  <button type="button" onClick={() => { setUseCustomIntake(!useCustomIntake); setCustomIntake(""); setIntake(intakes[0] || ""); }}
                    style={{ background: 'none', border: 'none', color: 'var(--ibes-navy)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', padding: 0, textDecoration: 'underline' }}>
                    {useCustomIntake ? '← Select existing intake' : '+ Type custom intake'}
                  </button>
                </div>
              </div>

              {/* Missing fields warning */}
              {missingFields.length > 0 && (
                <div style={{ marginTop: '20px', padding: '14px 18px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <WarningCircle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div style={{ fontSize: '13px', color: '#92400e' }}>
                    <strong>Missing:</strong> {missingFields.join(", ")}. All four fields are required to generate the contract.
                  </div>
                </div>
              )}

              <button
                onClick={() => { if (missingFields.length === 0) setShowContract(true); }}
                disabled={missingFields.length > 0}
                style={{
                  marginTop: '28px', width: '100%',
                  backgroundColor: missingFields.length > 0 ? '#e2e8f0' : 'var(--ibes-navy)',
                  color: missingFields.length > 0 ? '#94a3b8' : 'white',
                  border: 'none', padding: '15px', borderRadius: '10px',
                  fontWeight: '700', fontSize: '16px',
                  cursor: missingFields.length > 0 ? 'not-allowed' : 'pointer',
                  boxShadow: missingFields.length > 0 ? 'none' : '0 4px 12px rgba(0,31,154,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <FilePdf size={20} /> Generate Contract
              </button>
            </div>
          ) : (
            /* ── Contract Preview ── */
            <div ref={contractRef}>
              {/* Preview Actions Bar */}
              <div style={{ padding: '16px 32px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 }}>
                <button onClick={() => setShowContract(false)} style={{ background: 'none', border: 'none', color: 'var(--ibes-navy)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                  ← Back to Form
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '9px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                    Copy Text
                  </button>
                  <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--ibes-navy)', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                    <Printer size={16} weight="fill" /> Print / Save PDF
                  </button>
                </div>
              </div>

              {/* Contract Text */}
              <div style={{ padding: '40px 48px', fontFamily: '"Times New Roman", Times, serif', fontSize: '12px', lineHeight: '1.9', color: '#1a1a1a', backgroundColor: 'white' }}>
                <pre style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12px', whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0 }}>
                  {contractText}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default ContractGenerator;
