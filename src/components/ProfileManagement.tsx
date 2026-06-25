import React, { useState, useRef } from 'react';
import { User } from '../types';
import { Camera, Mail, Phone, MapPin, UserCheck, ShieldAlert, Award, AlertCircle } from 'lucide-react';

interface ProfileManagementProps {
  user: User;
  onUpdateProfile: (updatedFields: Partial<User>) => void;
  onAddAuditLog: (action: string, details: string) => void;
}

export const ProfileManagement: React.FC<ProfileManagementProps> = ({ user, onUpdateProfile, onAddAuditLog }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || 'ahmed.khan@gov.pk');
  const [phone, setPhone] = useState(user.phone || '+92 300 1234567');
  const [address, setAddress] = useState(user.address || 'House 24B, Sector F-7, Islamabad, Pakistan');
  const [avatar, setAvatar] = useState(user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Image format check
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrorMsg('Invalid image format. Only JPG and PNG are accepted.');
        return;
      }

      // Max size check (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 2MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result as string;
          setAvatar(base64Url);
          onUpdateProfile({ avatarUrl: base64Url });
          onAddAuditLog('Profile Picture Update', 'Uploaded new certified profile picture to servers');
          setSuccessMsg('Profile picture successfully updated & validated.');
          setTimeout(() => setSuccessMsg(''), 4000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid official email address.');
      return;
    }

    onUpdateProfile({ name, email, phone, address });
    onAddAuditLog('Profile Contact Update', `Updated email to: ${email}, phone to: ${phone}`);
    setSuccessMsg('Your security and contact details have been safely updated.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div id="profile-management" className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {/* Photo / Security Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-md">
            <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 bg-[#002147] text-white p-2 rounded-full hover:scale-110 shadow-lg transition-transform"
            title="Change Avatar"
          >
            <Camera size={14} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept=".jpg,.jpeg,.png"
            className="hidden"
          />
        </div>

        <h3 className="text-lg font-bold text-[#002147] mt-4">{user.name}</h3>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">CNIC: {user.cnic}</p>
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mt-3 flex items-center gap-1">
          <UserCheck size={12} /> Biometrically Verified
        </span>

        <div className="w-full border-t border-slate-100 my-6 pt-4 text-left space-y-4">
          <div className="flex items-start gap-2.5 text-xs text-slate-600">
            <Award className="text-[#002147] shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-bold text-slate-700">Digital ID Signature</p>
              <p className="text-slate-400 font-mono text-[9px] mt-0.5 truncate max-w-[200px]">SHA256: 4a9f82d1b...290e38a</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-bold text-slate-700">Multi-Factor Status</p>
              <p className="text-slate-500 text-[10px] mt-0.5">SMS Verification Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form Details */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-[#002147] tracking-tight">Profile Details & Contacts</h2>
          <p className="text-xs text-slate-500 mt-1">Update your primary electronic email, mobile phone, and physical address records below.</p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <UserCheck size={16} />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSaveContactInfo} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">National Registry CNIC (Read-only)</label>
              <input
                type="text"
                value={user.cnic}
                disabled
                className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-100 text-slate-400 font-mono text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5"><Mail size={12} /> Contact Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5"><Phone size={12} /> Contact Mobile Phone</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5"><MapPin size={12} /> Physical Residential Address</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-24 p-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147] resize-none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-[#002147] text-white hover:bg-opacity-95 px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all shadow-md shadow-[#002147]/10"
            >
              Save Profile Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
