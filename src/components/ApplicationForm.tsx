import React, { useState, useRef } from 'react';
import { GovService, OnlineApplication } from '../types';
import { FileText, ArrowRight, ArrowLeft, Check, Upload, AlertTriangle, ShieldCheck, Download } from 'lucide-react';

interface ApplicationFormProps {
  service: GovService;
  citizenCnic: string;
  citizenName: string;
  onSubmit: (application: Omit<OnlineApplication, 'id' | 'dateCreated' | 'dateUpdated'>, isSubmit: boolean) => void;
  onCancel: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  service,
  citizenCnic,
  citizenName,
  onSubmit,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(citizenName);
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  
  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; size: string; type: string; previewUrl?: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!fatherName.trim()) errs.fatherName = "Father/Guardian's Name is required.";
    if (!dob) errs.dob = 'Date of birth is required.';
    if (!phone.trim()) errs.phone = 'Phone number is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required.';
    if (!address.trim()) errs.address = 'Current residential address is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (uploadedDocs.length === 0) {
        setUploadError('Please upload at least one required documentation file.');
      } else {
        setStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError('');
    const file = files[0];

    // File type validation: JPG, PNG, PDF
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid format. Only PDF, JPG, and PNG are allowed.');
      return;
    }

    // Size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB maximum limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newDoc = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type.split('/')[1].toUpperCase(),
        previewUrl: base64String
      };
      setUploadedDocs([...uploadedDocs, newDoc]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleSaveDraft = () => {
    const rawApp: Omit<OnlineApplication, 'id' | 'dateCreated' | 'dateUpdated'> = {
      serviceId: service.id,
      serviceTitle: service.title,
      applicantName: fullName,
      cnic: citizenCnic,
      status: 'Draft',
      currentStep: step,
      formData: { fullName, fatherName, dob, phone, email, address, additionalDetails },
      uploadedDocuments: uploadedDocs
    };
    onSubmit(rawApp, false);
  };

  const handleFinalSubmit = () => {
    const rawApp: Omit<OnlineApplication, 'id' | 'dateCreated' | 'dateUpdated'> = {
      serviceId: service.id,
      serviceTitle: service.title,
      applicantName: fullName,
      cnic: citizenCnic,
      status: 'Submitted',
      currentStep: 3,
      formData: { fullName, fatherName, dob, phone, email, address, additionalDetails },
      uploadedDocuments: uploadedDocs
    };
    onSubmit(rawApp, true);
  };

  return (
    <div id="application-form-wizard" className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-[#002147] text-white px-8 py-6">
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-300">National Secure Forms Engine v4.2</span>
        <h2 className="text-xl font-bold tracking-tight mt-1">{service.title}</h2>
        <p className="text-xs text-slate-300 mt-1">Fee: {service.fee} • System-validated securely via CNIC {citizenCnic}</p>

        {/* Steps Visualizer */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-amber-400 text-[#002147]' : 'bg-slate-700 text-slate-300'}`}>1</span>
            <span className="text-xs font-bold">Personal Info</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-amber-400 text-[#002147]' : 'bg-slate-700 text-slate-300'}`}>2</span>
            <span className="text-xs font-bold">Upload Documents</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-amber-400 text-[#002147]' : 'bg-slate-700 text-slate-300'}`}>3</span>
            <span className="text-xs font-bold">Submit Application</span>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#002147]">Personal & Verification Profile</h3>
              <p className="text-xs text-slate-500 mt-1">All fields must correspond to your official biometric records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none text-sm font-semibold"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Father / Husband Name</label>
                <input
                  type="text"
                  placeholder="Official guardian name"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none text-sm"
                />
                {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none text-sm"
                />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">National Security CNIC</label>
                <input
                  type="text"
                  value={citizenCnic}
                  disabled
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Contact No.</label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none text-sm"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none text-sm"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Residential Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Complete street, sector, city address"
                className="w-full h-20 p-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none text-sm resize-none"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Additional Case Details (Optional)</label>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Provide details that may assist speed-tracking this application..."
                className="w-full h-20 p-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#002147] focus:outline-none text-sm resize-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#002147]">Required Verification Documents</h3>
              <p className="text-xs text-slate-500 mt-1">Upload verified digital files. Secure virus scanning with automatic digital signing applies.</p>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive ? 'border-[#002147] bg-slate-50' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <Upload size={32} className="mx-auto text-slate-400 mb-3" />
              <p className="text-sm font-bold text-[#002147]">Drag & Drop your document here, or <span className="text-blue-600 underline">Browse files</span></p>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">Accepted formats: PDF, JPG, PNG (Max 5MB size)</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs">
                <AlertTriangle size={16} />
                {uploadError}
              </div>
            )}

            {/* List of uploaded documents */}
            {uploadedDocs.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Document Queued ({uploadedDocs.length})</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uploadedDocs.map((doc, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-3 bg-white flex items-center gap-3">
                      {doc.previewUrl ? (
                        <img src={doc.previewUrl} alt="preview" className="w-10 h-10 object-cover rounded border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center rounded">
                          <FileText size={18} className="text-[#002147]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#002147] truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{doc.type} • {doc.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedDocs(uploadedDocs.filter((_, i) => i !== idx));
                        }}
                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist Box */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start gap-3">
              <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold text-[#002147]">Encrypted Secure Transport</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                  Documents uploaded are securely stored and encrypted with AES-256 GCM. Only verified administrative officers inside the citizen services portal can audit these uploads.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#002147]">Review & Submit Verification</h3>
              <p className="text-xs text-slate-500 mt-1">Review the details of your service request before committing to the public records portal.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Service Category</span>
                  <span className="font-bold text-[#002147]">{service.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Processing Time</span>
                  <span className="font-bold text-[#002147]">{service.processingTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Applicant CNIC</span>
                  <span className="font-mono font-bold text-[#002147]">{citizenCnic}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Full Legal Name</span>
                  <span className="font-bold text-[#002147]">{fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Father Name</span>
                  <span className="font-bold text-[#002147]">{fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Phone Contact</span>
                  <span className="font-bold text-[#002147]">{phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Residential Address</span>
                  <span className="text-slate-700 leading-relaxed font-medium">{address}</span>
                </div>
                {additionalDetails && (
                  <div className="col-span-2">
                    <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block">Additional Details</span>
                    <span className="text-slate-700 leading-relaxed font-medium">{additionalDetails}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block mb-2">Attached Documents ({uploadedDocs.length})</span>
                <div className="flex flex-wrap gap-2">
                  {uploadedDocs.map((doc, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-xs text-slate-700 px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1.5">
                      <FileText size={12} className="text-[#002147]" />
                      {doc.name} ({doc.type})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-blue-50/50 p-4 border border-blue-200 rounded-lg text-xs text-[#002147]">
              <ShieldCheck className="text-[#002147] shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-bold">Affidavit & Digital Confirmation</p>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  I hereby solemnly affirm that the information supplied above is authentic to the best of my knowledge. Under penalty of official sanctions, false documentation may result in cancellation of service and legal proceedings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-100 bg-slate-50 p-6 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold rounded-lg text-xs tracking-wider uppercase transition-all"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-lg text-xs tracking-wider uppercase transition-all flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}

          {step < 3 ? (
            <>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold rounded-lg text-xs tracking-wider uppercase transition-all"
              >
                Save Draft
              </button>
              <button
                onClick={handleNextStep}
                className="px-5 py-2.5 bg-[#002147] text-white hover:bg-opacity-95 font-bold rounded-lg text-xs tracking-wider uppercase transition-all flex items-center gap-2"
              >
                Continue <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold rounded-lg text-xs tracking-wider uppercase transition-all"
              >
                Save Draft
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 bg-[#002147] text-white hover:bg-opacity-95 font-bold rounded-lg text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg shadow-[#002147]/20"
              >
                Submit & Request Service <Check size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
